import sql from 'mssql';

let poolPromise;

function getConfig() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not configured');
  const parts = {};
  connectionString.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (key && value) parts[key] = value;
  });
  const serverRaw = (parts.Server || '').replace(/^tcp:/i, '').trim();
  const server = serverRaw.split(',')[0].trim();
  const port = parseInt(serverRaw.split(',')[1], 10) || 1433;
  const encrypt = (parts.Encrypt || 'true').toLowerCase() === 'true';
  const trustServerCertificate = (parts.TrustServerCertificate || 'false').toLowerCase() === 'true';
  // Connection string uses seconds (ADO.NET); tedious expects milliseconds
  const timeoutSeconds = parseInt(parts['Connection Timeout'], 10) || 30;
  const connectTimeout = timeoutSeconds * 1000;

  // mssql/tedious expect encrypt and trustServerCertificate at top level for Azure SQL
  return {
    server,
    port,
    database: parts['Initial Catalog'] || parts.Database,
    user: parts['User ID'],
    password: parts.Password,
    encrypt,
    trustServerCertificate,
    connectionTimeout: connectTimeout,
    options: {
      encrypt,
      trustServerCertificate,
      connectTimeout,
    },
  };
}

export function getPool() {
  if (!poolPromise) {
    const config = getConfig();
    poolPromise = sql.connect(config);
  }
  return poolPromise;
}

export async function testDbConnection() {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT 1 AS ok');
    return result.recordset[0];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('DB connection error:', err.message);
    throw err;
  }
}

