declare module "bun" {
  interface Env {
    SKIN_PROXY_PORT: number,
    MINIO_ROOT_USER: string,
    MINIO_ROOT_PASSWORD: string
    MINIO_PORT: number
    SKINS_PROXY_MYSQL_USER: string,
    SKINS_PROXY_MYSQL_PASSWORD: string,
    SKINS_PROXY_MYSQL_PORT: number
  }
}
