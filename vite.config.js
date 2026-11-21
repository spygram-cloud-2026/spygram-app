import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fetchInstagramProfile } from './server/instagramService.js'

function apiMiddlewarePlugin() {
  const handler = async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const username = url.searchParams.get('username') || url.pathname.replace(/^\//, '');
      const apiKey = url.searchParams.get('key');

      if (!username) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'Username is required' }));
      }

      const profile = await fetchInstagramProfile(username, apiKey);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.end(JSON.stringify(profile));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: err.message }));
    }
  };

  return {
    name: 'api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/profile', handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/profile', handler);
    }
  };
}

export default defineConfig({
  plugins: [react(), apiMiddlewarePlugin()],
  server: {
    allowedHosts: true,
    host: '0.0.0.0',
    port: 3000
  },
  preview: {
    allowedHosts: true,
    host: '0.0.0.0',
    port: 3000
  }
})
