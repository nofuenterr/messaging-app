import fs from 'fs';

import pool from '../config/database.js';

const migrations = ['001-create-tables', '002-create-views'];

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT NOW()
      );
    `);

    for (const name of migrations) {
      const exists = await pool.query('SELECT name FROM migrations WHERE name = $1', [name]);

      if (exists.rows.length) {
        console.log(`✔ ${name} already applied`);
        continue;
      }

      const sql = fs.readFileSync(`src/database/migrations/${name}.sql`, 'utf8');
      await pool.query(sql);

      await pool.query('INSERT INTO migrations (name) VALUES ($1)', [name]);

      console.log(`✔ applied ${name}`);
    }

    console.log('Migration complete ✅');
  } catch (err) {
    console.error('Migration error ❌', err);
  } finally {
    await pool.end();
  }
}

migrate();
