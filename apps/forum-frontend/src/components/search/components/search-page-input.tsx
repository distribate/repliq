import { Input } from "@repo/ui/src/components/input.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { searchPageQueryAtom } from "../models/search-page.model";
import { searchTypeParamAtom } from "../models/search-related.model";
import { action } from "@reatom/core";
import { sleep, withConcurrency } from "@reatom/framework";

const onChange = action(async (ctx, event) => {
  const { value } = event.target
  await ctx.schedule(() => sleep(500))
  searchPageQueryAtom(ctx, value)
}).pipe(withConcurrency())

export const SearchPageInput = reatomComponent(({ ctx }) => {
  const placeholder = `Введите ${ctx.spy(searchTypeParamAtom) === "users" ? "никнейм" : "название треда"}`

  return (
    <Input
      placeholder={placeholder}
      className="w-full h-[80px] !p-0 !rounded-md text-xl"
      backgroundType="transparent"
      onChange={e => onChange(ctx, e)}
    />
  );
}, "SearchPageInput")