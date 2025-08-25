import { atom } from "@reatom/core"
import { reatomComponent, useUpdate } from "@reatom/npm-react"
import { usePageContext } from "vike-react/usePageContext"

export default function Page() {
  return (
    <>
      <SyncQuery />
      <div className="flex flex-col gap-12 min-h-[80vh] items-center justify-center w-full">
        <StoreContent />
      </div>
    </>
  )
}

const storeTargetQueryAtom = atom<string | null>(null, "storeTargetQuery")

const SyncQuery = () => {
  const search = usePageContext().urlParsed.search;

  useUpdate((ctx) => {
    storeTargetQueryAtom(ctx, search.target ?? null)
  }, [search])

  return null;
}

const StoreContent = reatomComponent(({ctx}) => {
  const target = ctx.spy(storeTargetQueryAtom)
  if (!target) return null;

  return (
    <div>
      
    </div>
  )
}, "StoreContent")