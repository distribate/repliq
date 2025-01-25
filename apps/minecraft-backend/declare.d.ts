declare module "bun" {
  interface Env {
    SKIN_BACKEND_PORT: number,

    MINIO_ROOT_USER: string,
    MINIO_ROOT_PASSWORD: string
    MINIO_PORT: number
    MINIO_CLIENT_PORT: number
    
    MYSQL_USER: string,
    MYSQL_ROOT_PASSWORD: string,
    SKINS_PROXY_MYSQL_PORT: number
    CMI_MYSQL_PORT: number

    LANDS_MYSQL_DB: string
    LANDS_MYSQL_PORT: number

    POSTGRES_DB: string,
    VOTIFIEF_SECRET_KEY: string,
    POSTGRES_USER: string,
    POSTGRES_PASSWORD: string,
    POSTGRES_PORT: number
    POSTGRES_TENANT_ID: string
  }
}

declare module "*.png";
declare module "*.jpg";
declare module "*.webp";
declare module "*.jpeg";
declare module "*.gif";