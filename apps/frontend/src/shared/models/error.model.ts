import { log } from "#shared/utils/log";
import { action, atom } from "@reatom/core";
import { withReset } from "@reatom/framework";

export const appIsErrorAtom = atom(false, "appIsError").pipe(withReset())
export const appErrorAtom = atom<Error | null>(null, "appError").pipe(withReset())

export const throwAppError = action((ctx, message: string) => {
  appIsErrorAtom(ctx, true)
  
  const error = new Error(message);
  appErrorAtom(ctx, error)
}, "throwAppError")

appIsErrorAtom.onChange((ctx, state) => {
  if (state) {
    const error = ctx.get(appErrorAtom);
    if (!error) return;

    setTimeout(() => {
      throw new Error(error.message)
    }, 0);
  }
})

appIsErrorAtom.onChange((_, v) => log("appIsErrorAtom", v))
appErrorAtom.onChange((_, v) => log("appErrorAtom", v))