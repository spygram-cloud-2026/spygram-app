import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchInstagramProfile } from './instagramService.js';
import {
  initDb,
  isDbReady,
  getAllLeads,
  upsertLead,
  updateLeadStatusDb,
  deleteLeadDb,
  getConfigDb,
  setConfigDb,
  incrementPageViewDb
} from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const PORT = parseInt(process.env.PORT || '3000', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) reject(new Error('Body too large'));
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

async function handleApiProfile(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const username = url.searchParams.get('username') || url.pathname.replace(/^\/api\/profile\/?/, '');
    const apiKey = url.searchParams.get('key');

    if (!username) {
      return sendJson(res, 400, { error: 'Username is required' });
    }

    const profile = await fetchInstagramProfile(username, apiKey);
    return sendJson(res, 200, profile);
  } catch (err) {
    return sendJson(res, 500, { error: err.message });
  }
}

async function handleApi(req, res, reqUrl) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  try {
    if (reqUrl === '/api/health') {
      return sendJson(res, 200, { ok: true, db: isDbReady() });
    }

    if (reqUrl.startsWith('/api/profile')) {
      return await handleApiProfile(req, res);
    }

    if (reqUrl === '/api/leads' && req.method === 'GET') {
      const leads = await getAllLeads();
      return sendJson(res, 200, { db: isDbReady(), leads: leads ?? [] });
    }

    if (reqUrl === '/api/leads' && req.method === 'POST') {
      const body = await readJsonBody(req);
      if (!body.id) return sendJson(res, 400, { error: 'Lead id required' });
      const saved = await upsertLead(body);
      return sendJson(res, 200, { db: isDbReady(), lead: saved || body });
    }

    if (reqUrl.startsWith('/api/leads/') && req.method === 'PATCH') {
      const id = decodeURIComponent(reqUrl.replace('/api/leads/', ''));
      const body = await readJsonBody(req);
      const updated = await updateLeadStatusDb(id, body.status);
      return sendJson(res, 200, { db: isDbReady(), lead: updated });
    }

    if (reqUrl.startsWith('/api/leads/') && req.method === 'DELETE') {
      const id = decodeURIComponent(reqUrl.replace('/api/leads/', ''));
      await deleteLeadDb(id);
      return sendJson(res, 200, { db: isDbReady(), deleted: true });
    }

    if (reqUrl === '/api/stats' && req.method === 'GET') {
      const views = await getConfigDb('page_views');
      return sendJson(res, 200, { db: isDbReady(), pageViews: views?.count ?? null });
    }

    if (reqUrl === '/api/stats/view' && req.method === 'POST') {
      const count = await incrementPageViewDb();
      return sendJson(res, 200, { db: isDbReady(), pageViews: count });
    }

    if (reqUrl.startsWith('/api/config/')) {
      const key = decodeURIComponent(reqUrl.replace('/api/config/', ''));
      if (req.method === 'GET') {
        let value = await getConfigDb(key);
        if (key === 'telegram_config' && (!value || !value.token)) {
          const envToken = process.env.VITE_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '';
          const envChatId = process.env.VITE_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '';
          if (envToken && envChatId) {
            value = { token: envToken, chatId: envChatId };
          }
        }
        return sendJson(res, 200, { db: isDbReady(), value });
      }
      if (req.method === 'PUT' || req.method === 'POST') {
        const body = await readJsonBody(req);
        const saved = await setConfigDb(key, body);
        return sendJson(res, 200, { db: isDbReady(), value: saved });
      }
    }

    return sendJson(res, 404, { error: 'API route not found' });
  } catch (err) {
    return sendJson(res, 500, { error: err.message });
  }
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Internal Server Error');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const reqUrl = (req.url || '/').split('?')[0];

  if (reqUrl.startsWith('/api/')) {
    return handleApi(req, res, reqUrl);
  }

  const safePath = path.normalize(reqUrl).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(DIST_DIR, safePath === '/' ? 'index.html' : safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveFile(filePath, res);
  }

  const indexFile = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexFile)) {
    return serveFile(indexFile, res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found - Run npm run build first');
});

initDb().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[SpyGram Server] Listening on http://0.0.0.0:${PORT} (DB: ${isDbReady() ? 'PostgreSQL' : 'Local fallback'})`);
  });
});
