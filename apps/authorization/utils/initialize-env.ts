import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../../.env') });

const env = process.env;

const LP_DB_PORT = env.LUCKPERMS_POSTGRES_PORT
const LP_DB_PASS = env.LUCKPERMS_POSTGRES_PASSWORD
const LP_DB_NAME = env.LUCKPERMS_POSTGRES_DB
const LP_DB_USER = env.LUCKPERMS_POSTGRES_USER
const AUTH_DB_PORT = env.AUTHORIZATION_POSTGRES_PORT
const AUTH_DB_PASS = env.AUTHORIZATION_POSTGRES_PASSWORD
const AUTH_DB_NAME = env.AUTHORIZATION_POSTGRES_DB
const AUTH_DB_USER = env.AUTHORIZATION_POSTGRES_USER
const FORUM_DB_USER = `${env.POSTGRES_USER}.${env.POOLER_TENANT_ID}`;
const FORUM_DB_PORT = env.POSTGRES_PORT
const FORUM_DB_PASS = env.POSTGRES_PASSWORD;
const FORUM_DB_NAME = env.POSTGRES_DB

export {
  AUTH_DB_USER, AUTH_DB_PORT, AUTH_DB_NAME, AUTH_DB_PASS,
  LP_DB_NAME, LP_DB_USER, LP_DB_PORT, LP_DB_PASS,
  FORUM_DB_NAME, FORUM_DB_PASS, FORUM_DB_PORT, FORUM_DB_USER
}