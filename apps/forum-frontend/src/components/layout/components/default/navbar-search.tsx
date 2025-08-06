import { action, atom } from "@reatom/core"
import { reatomComponent } from "@reatom/npm-react"
import { Input } from "@repo/ui/src/components/input"
import { IconSearch } from "@tabler/icons-react"
import { useEffect } from "react"
import { navigate } from "vike/client/router"

const searchValueAtom = atom<string>("", "searchValue")

const redirectToSearch = action((ctx) => {
  const query = ctx.get(searchValueAtom);
  
  if (query.length < 1) return;

  ctx.schedule(() => navigate(`/search?query=${query}`))
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
      className="focus-within:outline focus-within:outline-2 focus-within:outline-green-500
        flex justify-start gap-3 items-center bg-shark-950 h-10 rounded-lg px-4"
    >
      <IconSearch size={20} className="text-shark-300" />
      <Input
        onChange={e => searchValueAtom(ctx, e.target.value)}
        placeholder="Поиск..."
        backgroundType="transparent"
        className="!p-0 !text-[17px]"
        maxLength={128}
      />
    </div>
  )
}, "NavbarSearch")