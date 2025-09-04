declare module "bun" {
  interface Env {
    PORT: number;
    MAIN_DATABASE_URL: string;

    SECRET_TOKEN: string;

    POSTGRES_USER: string;
    POSTGRES_DB: string;
    POSTGRES_PORT: number;
    POSTGRES_PASSWORD: string;
    POSTGRES_TENANT_ID: string;
    POSTGRES_HOST: string;

    LUCKPERMS_POSTGRES_DB: string;
    LUCKPERMS_POSTGRES_PASSWORD: string;
    LUCKPERMS_POSTGRES_USER: string;
    LUCKPERMS_POSTGRES_PORT: string;

    AUTHORIZATION_POSTGRES_HOST: string;
    AUTHORIZATION_POSTGRES_DB: string
    AUTHORIZATION_POSTGRES_PASSWORD: string
    AUTHORIZATION_POSTGRES_USER: string
    AUTHORIZATION_POSTGRES_PORT: string

    NATS_AUTH_TOKEN: string

    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_URL: string

    REDIS_HOST: string;
    REDIS_USER_PASSWORD: string;
    REDIS_USER: string;
    REDIS_PORT: number;

    LOGGER_BOT_TOKEN: string
    FASBERRY_BOT_TOKEN: string
    REPLIQ_BOT_TOKEN: string;
    REPLIQ_BOT_USERNAME: string;

    ADMIN_TELEGRAM_USER_ID: string
  }
}

export { };

declare global {
  type InitiatorRecipientType = {
    initiator: string;
    recipient: string;
  };
}

declare module "*.db"