import type { Rec } from "@reatom/core"
import type { Devtools } from "@reatom/devtools";
import type { PersistRecord } from "@reatom/persist"

declare module "*.jpg";
declare module "*.png";
declare module "*.webp";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";

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