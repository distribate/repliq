export const REPLIQ_BOT_TOKEN = process.env.REPLIQ_BOT_TOKEN;
export const LOGGER_BOT_TOKEN = process.env.LOGGER_BOT_TOKEN;

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

export const PORT = process.env.PORT
export const BOTS_IS_ENABLED = process.env.BOTS_IS_ENABLED

export const REPLIQ_BOT_USERNAME = process.env.REPLIQ_BOT_USERNAME

export const SUPABASE_URL = process.env.SUPABASE_URL
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export const MAIN_POSTGRES_DB = process.env.MAIN_POSTGRES_DB
export const MAIN_POSTGRES_PORT = process.env.MAIN_POSTGRES_PORT
export const MAIN_POSTGRES_USER = process.env.MAIN_POSTGRES_USER
export const MAIN_POSTGRES_TENANT_ID = process.env.MAIN_POSTGRES_TENANT_ID
export const MAIN_POSTGRES_HOST = process.env.MAIN_POSTGRES_HOST
export const MAIN_POSTGRES_PASSWORD = process.env.MAIN_POSTGRES_PASSWORD

export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = process.env.REDIS_PORT
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD
export const REDIS_USER = process.env.REDIS_USER

export const SQLITE_PATH = process.env.SQLITE_PATH

export const NODEMAILER_HOST = process.env.NODEMAILER_HOST
export const NODEMAILER_PORT = process.env.NODEMAILER_PORT
export const NODEMAILER_USER = process.env.NODEMAILER_USER
export const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD

export const AXIOM_DOMAIN = process.env.AXIOM_DOMAIN
export const AXIOM_TOKEN = process.env.AXIOM_TOKEN
export const AXIOM_DATASET = process.env.AXIOM_DATASET

export const SERVER_TOKEN = process.env.SERVER_TOKEN

export const SERVICE_CHAT_ID = process.env.SERVICE_CHAT_ID