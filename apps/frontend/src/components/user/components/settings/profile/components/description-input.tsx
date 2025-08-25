import { Input } from '@repo/ui/src/components/input.tsx';
import { reatomComponent } from '@reatom/npm-react';
import { action, atom, reatomAsync, sleep, spawn, withConcurrency, withInit } from '@reatom/framework';
import { updateCurrentUserAction } from '../models/update-current-user.model';
import { getUser } from '#components/user/models/current-user.model';

const descriptionValueAtom = atom<string | null>(null, "descriptionValue").pipe(withInit((ctx) => {
  const currentDescription = getUser(ctx)?.description
  return currentDescription ?? null
}))

const onChange = action(async (ctx, e) => {
  const { value } = e.target;

  await ctx.schedule(() => sleep(800))

  if (value.length >= 46) {
    return
  }

  descriptionValueAtom(ctx, value.length < 1 ? null : value)
  autoSaveAction(ctx)
}, "onChange").pipe(withConcurrency())

const autoSaveAction = reatomAsync(async (ctx) => {
  await sleep(50)

  const value = ctx.get(descriptionValueAtom)

  void spawn(ctx, async (spawnCtx) => 
    updateCurrentUserAction(spawnCtx, { criteria: 'description', value })
  )
}, {
  name: "autoSaveAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
})

export const DescriptionInput = reatomComponent(({ ctx }) => {
  return (
    <Input
      placeholder="Описание..."
      defaultValue={ctx.spy(descriptionValueAtom) ?? ""}
      className="!text-base"
      backgroundType="transparent"
      onChange={e => onChange(ctx, e)}
      maxLength={46}
    />
  );
}, "DescriptionInput")