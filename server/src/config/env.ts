import 'dotenv/config';

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is required but was not provided.`);
  }
  return value;
}

export const NODE_ENV: string = getEnvVar('NODE_ENV', 'development');
export const IS_PRODUCTION: boolean = NODE_ENV === 'production';

export const DATABASE_URL: string = getEnvVar('DATABASE_URL');

export const DB_HOST: string = getEnvVar('DB_HOST', 'localhost');
export const DB_USER: string = getEnvVar('DB_USER', 'postgres');
export const DB_PASSWORD: string = getEnvVar('DB_PASSWORD');
export const DB_NAME: string = getEnvVar('DB_NAME');
export const DB_PORT: number = parseInt(getEnvVar('DB_PORT', '5432'), 10);

export const PORT: number = parseInt(getEnvVar('PORT', '3000'), 10);

export const CLIENT_URL: string = getEnvVar('CLIENT_URL', 'http://localhost:5173');

export const ADMIN_PASSWORD: string = getEnvVar('ADMIN_PASSWORD');
export const SECRET: string = getEnvVar('SECRET');
export const JWT_SECRET: string = getEnvVar('JWT_SECRET');

export const SUPABASE_URL: string = getEnvVar('SUPABASE_URL');
export const SUPABASE_ANON_KEY: string = getEnvVar('SUPABASE_ANON_KEY');
