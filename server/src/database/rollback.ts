import fs from 'fs';

import pool from '../config/database.js';

async function rollback() {
  try {
    const sql = fs.readFileSync(
      'server/src/database/migrations/001-create-tables-down.sql',
      'utf8'
    );

    await pool.query(sql);
    await pool.query('DELETE FROM migrations WHERE name = $1', ['001_create_tables']);

    console.log('Rollback complete ✅');
  } catch (err) {
    console.error('Rollback error ❌', err);
  } finally {
    await pool.end();
  }
}

rollback();
