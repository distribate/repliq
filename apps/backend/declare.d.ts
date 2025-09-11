declare module "bun" {
  interface Env {
    MAIN_DATABASE_URL: string;
    MAIN_POSTGRES_USER: string;
    MAIN_POSTGRES_DB: string;
    MAIN_POSTGRES_PORT: string;
    MAIN_POSTGRES_PASSWORD: string;
    MAIN_POSTGRES_TENANT_ID: string;
    MAIN_POSTGRES_HOST: string;
    AUTHORIZATION_POSTGRES_HOST: string;
    AUTHORIZATION_POSTGRES_DB: string
    AUTHORIZATION_POSTGRES_PASSWORD: string
    AUTHORIZATION_POSTGRES_USER: string
    AUTHORIZATION_POSTGRES_PORT: string

    NATS_AUTH_TOKEN: string

    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_URL: string

    REDIS_HOST: string;
    REDIS_PASSWORD: string;
    REDIS_USER: string;
    REDIS_PORT: string;

    REPLIQ_BOT_USERNAME: string;
    LOGGER_BOT_TOKEN: string
    REPLIQ_BOT_TOKEN: string;

    PORT: string;
    BOTS_IS_ENABLED: string

    SQLITE_PATH: string;

    NODEMAILER_HOST: string;
    NODEMAILER_PORT: string;
    NODEMAILER_USER: string;
    NODEMAILER_PASSWORD: string;

    AXIOM_DOMAIN: string;
    AXIOM_TOKEN: string;
    AXIOM_DATASET: string;

    SERVER_TOKEN: string;

    SERVICE_CHAT_ID: string
  }
}

export { };

declare global {
  interface InitiatorRecipientType {
    initiator: string;
    recipient: string;
  };
}