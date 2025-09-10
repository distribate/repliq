import { Input } from '@repo/ui/src/components/input.tsx';
import { reatomComponent } from '@reatom/npm-react';
import { action, atom, reatomAsync, sleep, withConcurrency, withInit } from '@reatom/framework';
import { updateCurrentUserAction } from '../models/update-current-user.model';
import { getUser } from '#components/user/models/current-user.model';
import { toast } from 'sonner';

const descriptionValueAtom = atom<string | null>(null, "descriptionValue").pipe(
  withInit((ctx) => getUser(ctx)?.description ?? null)
)

const onChange = action(async (ctx, e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

  await ctx.schedule(() => sleep(600))

  if (value.length >= 46) return

  descriptionValueAtom(ctx, value.length < 1 ? null : value)

  await ctx.schedule(() => sleep(40))

  autoSaveAction(ctx)
}, "descriptionOnChange").pipe(withConcurrency())

const autoSaveAction = reatomAsync(async (ctx) => {
  const value = ctx.get(descriptionValueAtom)

  return await ctx.schedule(() => updateCurrentUserAction(ctx, { criteria: 'description', value }))
}, {
  name: "autoSaveAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if ("description" in res) {
      toast.success("Изменения сохранены")
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
      maxLength={46}
      onChange={e => onChange(ctx, e)}
    />
  );
}, "DescriptionInput")