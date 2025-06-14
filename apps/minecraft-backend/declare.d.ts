declare module "bun" {
  interface Env {
    MINIO_ROOT_USER: string,
    MINIO_ROOT_PASSWORD: string
    MINIO_PORT: number
    MINIO_CLIENT_PORT: number

    MINECRAFT_BACKEND_PORT: number

    MYSQL_USER: string,
    MYSQL_ROOT_PASSWORD: string,

    LUCKPERMS_POSTGRES_DB: string
    LUCKPERMS_POSTGRES_PASSWORD: string
    LUCKPERMS_POSTGRES_USER: string
    LUCKPERMS_POSTGRES_PORT: string

    BISQUITE_MYSQL_PORT: number;
    LOBBY_MYSQL_PORT: number;
    PLAYERPOINTS_MYSQL_PORT: number,
    REPUTATION_MYSQL_PORT: number,
    SKINS_MYSQL_PORT: number;
    
    POSTGRES_DB: string,
    POSTGRES_USER: string,
    POSTGRES_PASSWORD: string,
    POSTGRES_PORT: number;
    POSTGRES_TENANT_ID: string;

    VOTIFIEF_SECRET_KEY: string;

    NATS_AUTH_TOKEN: string;
  }
}

declare module "*.png";
declare module "*.jpg";
declare module "*.webp";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.db"