import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../../.env') });

const DB_PORT = process.env.LUCKPERMS_POSTGRES_PORT
const DB_PASS = process.env.LUCKPERMS_POSTGRES_PASSWORD
const DB_NAME = process.env.LUCKPERMS_POSTGRES_DB
const DB_USER = process.env.LUCKPERMS_POSTGRES_USER

export {
  DB_USER, DB_NAME, DB_PASS, DB_PORT
}