import { atom } from "@reatom/core"
import { categoriesClient } from "#shared/api/forum-client"
import { validateResponse } from "#shared/api/validation"

export const categoryIdAtom = atom<string>("", "categoryIdAtom")

export async function getCategory(id: string, init?: RequestInit) {
  const res = await categoriesClient.category["main"][":id"].$get(
    { param: { id } }, { init }
  )

  return validateResponse<typeof res>(res)
}

export type Category = Awaited<ReturnType<typeof getCategory>>

export const categoryAtom = atom<Category | null>(null, "category")