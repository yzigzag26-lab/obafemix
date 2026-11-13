import pg from "pg";

/** Single Postgres pool (Supabase) shared by all routes. Created lazily so
 *  the service still boots (reporting db:false on /health) without a DB. */
let pool: pg.Pool | null = null;

export function getPool(): pg.Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!pool) {
    pool = new pg.Pool({ connectionString: url, max: 5, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

export async function dbOk(): Promise<boolean> {
  const p = getPool();
  if (!p) return false;
  try {
    await p.query("select 1");
    return true;
  } catch {
    return false;
  }
}
