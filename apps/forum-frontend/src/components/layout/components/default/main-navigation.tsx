import { reatomComponent } from "@reatom/npm-react";
import { isAuthenticatedAtom } from "@repo/lib/queries/global-option-query";
import GhZwggQbMAA from '@repo/assets/images/GhZwggQbMAA-cun.webp'
import statue from '@repo/assets/images/8332de192322939.webp'
import { SearchWidget } from "../widgets/search-widget";

export const MainNavigation = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom)) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 *:h-[160px] gap-2 w-full">
      <SearchWidget title="Найти игрока" imageSrc={statue} link="/search?type=users" />
      <SearchWidget title="Найти тред" imageSrc={GhZwggQbMAA} link="/search?type=threads" />
    </div>
  )
}, "MainNavigation")