/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_HOST: string;
  readonly VITE_APP_PORT: string;
  readonly VITE_SERVER_TOKEN: string;
  readonly PUBLIC_ENV__TURNSTILE_KEY: string;
  readonly PUBLIC_ENV__API_PREFIX_URL: string
  readonly PUBLIC_ENV__AUTH_API_PREFIX_URL: string;
  readonly PUBLIC_ENV__STORAGE_PREFIX_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}