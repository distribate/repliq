declare module "bun" {
  interface Env {
    LOGGER_BOT_TOKEN: string
    FASBERRY_BOT_TOKEN: string

    AUTHORIZATION_POSTGRES_DB_URL: string

    ADMIN_TELEGRAM_USER_ID: string

    AUTHORIZATION_POSTGRES_DB: string
    AUTHORIZATION_POSTGRES_PASSWORD: string
    AUTHORIZATION_POSTGRES_USER: string
    AUTHORIZATION_POSTGRES_PORT: string

    POSTGRES_USER: string
    POSTGRES_DB: string
    POSTGRES_PORT: number
    POSTGRES_PASSWORD: string
    POSTGRES_TENANT_ID: string
    
    NATS_AUTH_TOKEN: string
    SECRET_TOKEN: string
  }
}