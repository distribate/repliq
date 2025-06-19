import { router } from "#main"
import { action, atom } from "@reatom/core"
import { sleep, withConcurrency } from "@reatom/framework"
import { reatomComponent } from "@reatom/npm-react"
import { Input } from "@repo/ui/src/components/input"
import { IconSearch } from "@tabler/icons-react"
import { useEffect } from "react"

const searchValueAtom = atom<string>("", "searchValue")

const onChange = action(async (ctx, e) => {
  const { value } = e.target
  await ctx.schedule(() => sleep(100))
  searchValueAtom(ctx, value)
}).pipe(withConcurrency())

const redirectToSearch = action((ctx) => {
  const query = ctx.get(searchValueAtom)
  if (query.length <= 1) return

  ctx.schedule(() => router.navigate({ to: "/search", search: { query } }))
})

export const NavbarSearch = reatomComponent(({ ctx }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") redirectToSearch(ctx)
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className="focus-within:outline duration-150 focus-within:outline-2 focus-within:outline-green-500
        flex justify-start gap-3 items-center bg-shark-950 h-10 rounded-lg px-4"
    >
      <IconSearch size={20} className="text-shark-300" />
      <Input
        onChange={e => onChange(ctx, e)}
        placeholder="Поиск..."
        backgroundType="transparent"
        className="!p-0 !text-[17px]"
        maxLength={128}
      />
    </div>
  )
}, "NavbarSearch")