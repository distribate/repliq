import { reatomComponent } from "@reatom/npm-react";

export const MainNavigation = reatomComponent(({ ctx }) => {
  // if (!ctx.spy(isAuthenticatedAtom)) return null;

  return null;
  
  // return (
  //   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 *:h-[160px] gap-2 w-full">
  //     <SearchWidget title="Найти игрока" link="/search?type=users" />
  //     <SearchWidget title="Найти тред" link="/search?type=threads" />
  //   </div>
  // )
}, "MainNavigation")