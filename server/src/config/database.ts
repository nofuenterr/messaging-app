import { Pool } from 'pg';

import {
  IS_PRODUCTION,
  DATABASE_URL,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} from './env.js';

const connectionConfig = IS_PRODUCTION
  ? {
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
    };

const pool = new Pool(connectionConfig);

export default pool;
