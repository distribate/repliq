import { Rec } from "@reatom/core"
import { PersistRecord } from "@reatom/persist"

declare module "*.jpg";
declare module "*.png";
declare module "*.webp";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";

declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_APP_HOST: string;
    readonly VITE_APP_PORT: string;
    readonly PUBLIC_ENV__TURNSTILE_KEY: string;
    readonly PUBLIC_ENV__API_PREFIX_URL: string
    readonly PUBLIC_ENV__AUTH_API_PREFIX_URL: string;
    readonly PUBLIC_ENV__STORAGE_PREFIX_URL: string;
  }
}

declare global {
  namespace Vike {
    interface PageContext {
      snapshot: Rec<PersistRecord<unknown>>,
      Page: () => React.JSX.Element
    }
  }

  type WrappedResponse<T> = { data: T } | { error: string }
}

export { }