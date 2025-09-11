/// <reference types="vite/client" />

import type { Rec } from "@reatom/core"
import type { Devtools } from "@reatom/devtools";
import type { PersistRecord } from "@reatom/persist"

declare module "*.jpg";
declare module "*.png";
declare module "*.webp";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";

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

declare global {
  namespace Vike {
    interface PageContext {
      snapshot: Rec<PersistRecord<unknown>>,
      Page: () => React.JSX.Element
    }
  }

  type WrappedResponse<T> = { data: T } | { error: string };
  
  var DEVTOOLS: null | Devtools
}

export { }