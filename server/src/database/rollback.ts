import fs from 'fs';

import pool from '../config/database.js';

async function rollback(steps = Infinity) {
  try {
    const result = await pool.query('SELECT name FROM migrations ORDER BY id DESC');

    const migrations = result.rows.slice(0, steps);

    if (!migrations.length) {
      console.log('⚠ No migrations to rollback');
      return;
    }

    for (const row of migrations) {
      const name = row.name;
      const path = `src/database/migrations/${name}-down.sql`;

      // 1. Check if file exists
      if (!fs.existsSync(path)) {
        console.log(`⚠ No rollback file for ${name}, skipping`);
        continue;
      }

      const sql = fs.readFileSync(path, 'utf8');

      try {
        // 2. Start transaction
        await pool.query('BEGIN');

        // 3. Run rollback SQL
        await pool.query(sql);

        // 4. Remove from migrations table
        await pool.query('DELETE FROM migrations WHERE name = $1', [name]);

        // 5. Commit
        await pool.query('COMMIT');

        console.log(`↩ rolled back ${name}`);
      } catch (err) {
        // rollback DB changes if something fails
        await pool.query('ROLLBACK');

        console.error(`❌ failed to rollback ${name}`);
        console.error(err);

        // stop further rollbacks (safer)
        break;
      }
    }

    console.log('Rollback complete ✅');
  } catch (err) {
    console.error('Rollback error ❌', err);
  } finally {
    await pool.end();
  }
}

// supports: npm run rollback -- 1
const stepsArg = process.argv[2];
const steps = stepsArg ? parseInt(stepsArg, 10) : Infinity;

rollback(steps);
