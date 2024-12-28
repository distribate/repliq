declare module "bun" {
  interface Env {
    SKIN_BACKEND_PORT: number,

    POSTGRES_USER: string,
    POSTGRES_HOST: string,
    POSTGRES_DB: string,
    POSTGRES_PORT: number,
    POSTGRES_PASSWORD: string,
    POSTGRES_TENANT_ID: string,

    MINIO_ROOT_USER: string,
    MINIO_ROOT_PASSWORD: string
    MINIO_PORT: number
    MINIO_CLIENT_PORT: number
    
    SKINS_PROXY_MYSQL_USER: string,
    SKINS_PROXY_MYSQL_PASSWORD: string,
    SKINS_PROXY_MYSQL_PORT: number
  }
}
