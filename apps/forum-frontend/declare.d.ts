declare module "*.jpg";
declare module "*.png";
declare module "*.webp";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";

declare namespace NodeJS {
  interface ProcessEnv {
    readonly DEV_PORT: string;
    readonly PROD_PORT: string;
  }
}