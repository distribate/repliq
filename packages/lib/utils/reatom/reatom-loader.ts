import { action, Ctx, isAction } from '@reatom/core';
import { abortCauseContext } from '@reatom/framework';
import { LoaderFnContext, ParsedLocation } from '@tanstack/react-router';

export interface RouterContext {
  reatomCtx: Ctx;
}

export const reatomLoader = <T extends {
  abortController: AbortController;
  context: RouterContext,
  params: LoaderFnContext['params'];
  location: ParsedLocation;
}>(
  cb: (ctx: Ctx, routerCtx: T) => any,
  name: undefined | string = isAction(cb) ? `${cb.__reatom.name}.loader` : undefined
): ((routerCtx: T) => any) => {

  const target = action((ctx, routerCtx: T) => {
    abortCauseContext.set(ctx.cause, routerCtx.abortController);

    const result = cb(ctx, routerCtx);

    if (result instanceof Promise) {
      return result;
    }
  }, name);

  return (routerCtx: T): any => target(routerCtx.context.reatomCtx, routerCtx)
};