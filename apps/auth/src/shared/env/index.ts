export const isProduction = process.env.NODE_ENV === "production";

export const MAIN_POSTGRES_HOST = process.env.MAIN_POSTGRES_HOST
export const MAIN_POSTGRES_DB = process.env.MAIN_POSTGRES_DB
export const MAIN_POSTGRES_PASSWORD = process.env.MAIN_POSTGRES_PASSWORD
export const MAIN_POSTGRES_PORT = process.env.MAIN_POSTGRES_PORT
export const MAIN_POSTGRES_USER = process.env.MAIN_POSTGRES_USER
export const MAIN_POSTGRES_TENANT_ID = process.env.MAIN_POSTGRES_TENANT_ID

export const LOCATION_TOKEN = process.env.LOCATION_TOKEN

export const PORT = process.env.PORT

export const TURNSTILE_KEY = process.env.CF_TURNSTILE_TOKEN

export const SUPABASE_URL = process.env.SUPABASE_URL
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = process.env.REDIS_PORT
export const REDIS_USER = process.env.REDIS_USER
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD