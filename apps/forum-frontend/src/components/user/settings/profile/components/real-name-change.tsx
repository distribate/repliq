import { Input } from "@repo/ui/src/components/input.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { action, atom, sleep, spawn, withConcurrency, withInit } from "@reatom/framework";
import { updateCurrentUserAction } from "../models/update-current-user.model";
import { getUser } from "#components/user/models/current-user.model";

const realNameAtom = atom<string | null>(null, "descriptionValue").pipe(withInit((ctx) => {
  const currentRealname = getUser(ctx)?.real_name
  return currentRealname ?? null
}))

const onChange = action(async (ctx, e) => {
  const { value } = e.target;

  await ctx.schedule(() => sleep(800))

  if (value.length >= 46) {
    return
  }

  if (value === getUser(ctx).real_name) return;

  realNameAtom(ctx, value.length < 1 ? null : value)
  autoSaveAction(ctx)
}).pipe(withConcurrency())

const autoSaveAction = action(async (ctx) => {
  await sleep(50)

  const value = ctx.get(realNameAtom)

  void spawn(ctx, async (spawnCtx) =>
    updateCurrentUserAction(spawnCtx, { criteria: "real_name", value })
  );
})

export const RealNameChange = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col items-center gap-y-4 w-full">
      <Typography variant="dialogTitle">Смена имени</Typography>
      {ctx.spy(realNameAtom) && (
        <>
          <div className="flex items-center justify-start w-full gap-1 px-2">
            <Typography textColor="shark_white" textSize="large" >
              Текущее имя:
            </Typography>
            <Typography className="font-semibold" textSize="large" textColor="shark_white">
              {ctx.spy(realNameAtom)}
            </Typography>
          </div>
          <Separator />
        </>
      )}
      <div className="flex flex-col gap-y-2 w-full px-2 pb-2">
        <Input
          placeholder="Введите новое имя, например: Абоба"
          className="!text-base"
          maxLength={32}
          onChange={e => onChange(ctx, e)}
          defaultValue={ctx.spy(realNameAtom) ?? ""}
        />
      </div>
    </div>
  );
}, "RealNameChange")