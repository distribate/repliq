declare module "bun" {
  interface Env {
    FORUM_BACKEND_PORT: number;
    SECRET_TOKEN: string;
    FORUM_DATABASE_URL: string;
    POSTGRES_USER: string;
    POSTGRES_DB: string;
    POSTGRES_PORT: number;
    POSTGRES_PASSWORD: string;
    POOLER_TENANT_ID: string;
    LUCKPERMS_POSTGRES_DB: string;
    LUCKPERMS_POSTGRES_PASSWORD: string;
    LUCKPERMS_POSTGRES_USER: string;
    LUCKPERMS_POSTGRES_PORT: string;
  }
}
