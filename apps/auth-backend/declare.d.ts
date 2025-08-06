declare module "bun" {
  interface Env {
    AUTH_BACKEND_PORT: number;

    SECRET_TOKEN: string;

    AUTHORIZATION_POSTGRES_PASSWORD: string;
    AUTHORIZATION_POSTGRES_PORT: number;
    AUTHORIZATION_POSTGRES_DB: string;
    AUTHORIZATION_POSTGRES_USER: string;

    LUCKPERMS_POSTGRES_PORT: number;
    LUCKPERMS_POSTGRES_PASSWORD: string;
    LUCKPERMS_POSTGRES_DB: string;
    LUCKPERMS_POSTGRES_USER: string;

    POSTGRES_USER: string;
    POSTGRES_PORT: number;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTGRES_TENANT_ID: string;

    LOCATION_TOKEN: string;
    CF_TURNSTILE_TOKEN: string;
  }
}

declare module "*.txt"