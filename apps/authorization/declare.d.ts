declare module "bun" {
  interface Env {
    LUCKPERMS_POSTGRES_PORT: number;
    LUCKPERMS_POSTGRES_PASSWORD: string;
    LUCKPERMS_POSTGRES_DB: string;
    LUCKPERMS_POSTGRES_USER: string;
    SERVICE_PORT: number
  }
}