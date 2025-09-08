declare module "bun" {
  interface Env {
    MAIN_POSTGRES_HOST: string;
    MAIN_POSTGRES_USER: string;
    MAIN_POSTGRES_PORT: number;
    MAIN_POSTGRES_PASSWORD: string;
    MAIN_POSTGRES_DB: string;
    MAIN_POSTGRES_TENANT_ID: string;

    NATS_AUTH_TOKEN: string;

    LOCATION_TOKEN: string;
    CF_TURNSTILE_TOKEN: string;

    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_URL: string    

    REDIS_HOST: string;
    REDIS_USER_PASSWORD: string;
    REDIS_USER: string;
    REDIS_PORT: number;

    PORT: number;
  }
}