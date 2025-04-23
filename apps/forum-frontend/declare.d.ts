declare module "*.jpg";
declare module "*.png";
declare module "*.webp";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly DEV_PORT: string;
    readonly PROD_PORT: string;
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    readonly SUPABASE_SERVICE_ROLE_KEY: string;
    readonly SECRET_TOKEN: string;
    readonly NEXT_PUBLIC_SUPABASE_URL: string;
    readonly CONNECTION_STRING: string;
    readonly NEXT_PUBLIC_SKIN_BACKEND_PORT: string;
  }
}