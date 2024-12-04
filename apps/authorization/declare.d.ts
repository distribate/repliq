declare module "bun" {
  interface Env {
    LUCKPERMS_POSTGRES_PORT: number;
    LUCKPERMS_POSTGRES_PASSWORD: string;
    LUCKPERMS_POSTGRES_DB: string;
    LUCKPERMS_POSTGRES_USER: string;
    AUTHORIZATION_POSTGRES_PASSWORD: string;
    AUTHORIZATION_POSTGRES_PORT: number;
    AUTHORIZATION_POSTGRES_DB: string;
    AUTHORIZATION_POSTGRES_USER: string;
    SERVICE_PORT: number;
    SECRET_TOKEN: string;
    POSTGRES_USER: string;
    POSTGRES_PORT: number;
    POOLER_TENANT_ID: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
  }
}
