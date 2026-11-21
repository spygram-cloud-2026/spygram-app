import pg from 'pg';

const { Pool } = pg;

let pool = null;
let dbReady = false;

export function isDbReady() {
  return dbReady && pool !== null;
}

export async function initDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('[DB] DATABASE_URL not set — running without PostgreSQL persistence.');
    return false;
  }

  try {
    const useSsl = !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1');
    pool = new Pool({
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
      max: 5,
      idleTimeoutMillis: 30000
    });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL DEFAULT 'Visitante Não Identificado',
        email TEXT DEFAULT 'pendente@checkout.com',
        phone TEXT DEFAULT '(Pendente)',
        cpf TEXT DEFAULT 'Pendente',
        target TEXT NOT NULL,
        target_pic TEXT,
        city TEXT DEFAULT 'Brasil',
        state TEXT DEFAULT 'BR',
        amount NUMERIC(10, 2) DEFAULT 27.90,
        status TEXT NOT NULL DEFAULT 'pesquisou',
        bumps JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_config (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      INSERT INTO app_config (key, value)
      VALUES ('page_views', '{"count": 142}'::jsonb)
      ON CONFLICT (key) DO NOTHING;
    `);

    dbReady = true;
    console.log('[DB] PostgreSQL connected and tables verified.');
    return true;
  } catch (err) {
    console.error('[DB] Failed to initialize PostgreSQL:', err.message);
    dbReady = false;
    return false;
  }
}

function formatLeadRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    cpf: row.cpf,
    target: row.target,
    targetPic: row.target_pic,
    city: row.city,
    state: row.state,
    amount: parseFloat(row.amount || 27.9),
    status: row.status,
    bumps: Array.isArray(row.bumps) ? row.bumps : [],
    createdAt: row.created_at
      ? new Date(row.created_at).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Agora mesmo'
  };
}

export async function getAllLeads() {
  if (!isDbReady()) return null;
  const res = await pool.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 200');
  return res.rows.map(formatLeadRow);
}

export async function upsertLead(lead) {
  if (!isDbReady()) return null;
  const res = await pool.query(
    `INSERT INTO leads (id, name, email, phone, cpf, target, target_pic, city, state, amount, status, bumps)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb)
     ON CONFLICT (id) DO UPDATE SET
       name = COALESCE(NULLIF(EXCLUDED.name, ''), leads.name),
       email = COALESCE(NULLIF(EXCLUDED.email, ''), leads.email),
       phone = COALESCE(NULLIF(EXCLUDED.phone, ''), leads.phone),
       cpf = COALESCE(NULLIF(EXCLUDED.cpf, ''), leads.cpf),
       target = COALESCE(NULLIF(EXCLUDED.target, ''), leads.target),
       target_pic = COALESCE(NULLIF(EXCLUDED.target_pic, ''), leads.target_pic),
       city = COALESCE(NULLIF(EXCLUDED.city, ''), leads.city),
       state = COALESCE(NULLIF(EXCLUDED.state, ''), leads.state),
       amount = COALESCE(EXCLUDED.amount, leads.amount),
       status = COALESCE(NULLIF(EXCLUDED.status, ''), leads.status),
       bumps = COALESCE(EXCLUDED.bumps, leads.bumps),
       updated_at = NOW()
     RETURNING *`,
    [
      lead.id,
      lead.name || 'Visitante Não Identificado',
      lead.email || 'pendente@checkout.com',
      lead.phone || '(Pendente)',
      lead.cpf || 'Pendente',
      lead.target || 'desconhecido',
      lead.targetPic || null,
      lead.city || 'Brasil',
      lead.state || 'BR',
      Number(lead.amount ?? 27.9),
      lead.status || 'pesquisou',
      JSON.stringify(Array.isArray(lead.bumps) ? lead.bumps : [])
    ]
  );
  return formatLeadRow(res.rows[0]);
}

export async function updateLeadStatusDb(id, status) {
  if (!isDbReady()) return null;
  const res = await pool.query(
    'UPDATE leads SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
    [id, status]
  );
  return res.rows[0] ? formatLeadRow(res.rows[0]) : null;
}

export async function deleteLeadDb(id) {
  if (!isDbReady()) return false;
  await pool.query('DELETE FROM leads WHERE id = $1', [id]);
  return true;
}

export async function getConfigDb(key) {
  if (!isDbReady()) return null;
  const res = await pool.query('SELECT value FROM app_config WHERE key = $1', [key]);
  return res.rows[0] ? res.rows[0].value : null;
}

export async function setConfigDb(key, value) {
  if (!isDbReady()) return null;
  const res = await pool.query(
    `INSERT INTO app_config (key, value, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
     RETURNING value`,
    [key, JSON.stringify(value)]
  );
  return res.rows[0]?.value || null;
}

export async function incrementPageViewDb() {
  if (!isDbReady()) return null;
  const res = await pool.query(
    `INSERT INTO app_config (key, value, updated_at)
     VALUES ('page_views', '{"count": 143}'::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE
       SET value = jsonb_set(app_config.value, '{count}', to_jsonb(COALESCE((app_config.value->>'count')::int, 142) + 1)),
           updated_at = NOW()
     RETURNING (value->>'count')::int AS count`
  );
  return res.rows[0]?.count ?? null;
}
