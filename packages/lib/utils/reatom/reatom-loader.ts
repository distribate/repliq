import { action, Ctx, isAction } from '@reatom/core';
import { abortCauseContext } from '@reatom/framework';
import { LoaderFnContext, ParsedLocation } from '@tanstack/react-router';

export interface RouterContext {
  reatomCtx: Ctx;
}

type Loader = {
  abortController: AbortController;
  context: RouterContext,
  params: LoaderFnContext['params'];
  location: ParsedLocation;
}

type BaseRouterContext = Pick<Loader, 'abortController' | 'context'>;

const createReatomAdapter = <T extends BaseRouterContext>(
  cb: (ctx: Ctx, routerCtx: T) => any,
  name?: string
) => {
  const actionName = name ?? (isAction(cb) ? `${cb.__reatom.name}.loader` : undefined);

  const targetAction = action((ctx, routerCtx: T) => {
    abortCauseContext.set(ctx.cause, routerCtx.abortController);

    const result = cb(ctx, routerCtx);

    if (result instanceof Promise) {
      return result;
    }
  }, actionName);

  return (routerCtx: T): any => targetAction(routerCtx.context.reatomCtx, routerCtx);
};

export const reatomOnVoid = <T extends BaseRouterContext>(
  cb: (ctx: Ctx, routerCtx: T) => any,
  name?: string
): ((routerCtx: T) => any) => {
  return createReatomAdapter(cb, name);
};

export const reatomLoader = <T extends Loader>(
  cb: (ctx: Ctx, routerCtx: T) => any,
  name?: string
): ((routerCtx: T) => any) => {
  return createReatomAdapter(cb, name);
};