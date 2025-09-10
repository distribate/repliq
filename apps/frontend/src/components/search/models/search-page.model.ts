import { SEARCH_PAGE_LIMIT } from "@repo/shared/constants/limits.ts";
import { action, atom } from "@reatom/core";
import { handleSearchAction, SearchThread, SearchUser } from "./search.model";
import { withLocalStorage } from "@reatom/persist-web-storage";
import { reatomArray, reatomAsync, sleep, withReset } from "@reatom/framework";
import { threadRelatedAction, usersRelatedAction } from "./search-related.model";
import { withHistory } from "#shared/helpers/with-history";
import { log } from "#shared/utils/log";

export type SearchResultsAll = Array<SearchUser | SearchThread>;
export type SearchResult = SearchUser | SearchThread;

export type SearchPageType = "users" | "threads" | "all"

export type SearchPageQuery = {
  limit: number;
  isLimited: boolean;
  type: "user" | "title";
};

const initial: SearchPageQuery = {
  isLimited: false,
  limit: SEARCH_PAGE_LIMIT,
  type: "title",
};

const SEARCH_HISTORY_LIMIT = 3

export const deleteEntryFromHistoryAction = action((ctx, target: string) => {
  searchPageHistoryAtom(ctx, (state) =>
    state.filter((item) => {
      if ("nickname" in item) {
        return item.nickname !== target;
      }
      if ("id" in item) {
        return item.id !== target;
      }
      return true;
    })
  );
});

export const processSelectEntryAction = action(async (ctx, target: SearchUser | SearchThread) => {
  updateSearchHistoryAction(ctx, target)

  await ctx.schedule(() => sleep(200))

  searchPageQueryAtom.reset(ctx)
}, "processSelectEntryAction")

export const updateSearchHistoryAction = action((ctx, target: SearchUser | SearchThread) => {
  const newEntry =
    "nickname" in target
      ? { nickname: target.nickname, name_color: target.name_color }
      : "title" in target
        ? { id: target.id, title: target.title }
        : null;

  if (!newEntry) return;

  searchPageHistoryAtom(ctx, (state) => {
    const isDuplicate = state.some((item) =>
      "nickname" in newEntry && "nickname" in item
        ? item.nickname === newEntry.nickname
        : "id" in newEntry && "id" in item
          ? item.id === newEntry.id
          : false
    );

    if (isDuplicate) return state;

    const nextState = [...state, newEntry as SearchUser | SearchThread];

    return nextState.length > SEARCH_HISTORY_LIMIT
      ? nextState.slice(1)
      : nextState;
  });
}, "updateSearchHistoryAction")

export const searchPageAtom = atom<SearchPageQuery>(initial, "searchPage")
export const searchPageResultsAtom = atom<Array<SearchThread | SearchUser> | null>(null, "searchPageResults").pipe(withReset())
export const searchPageQueryAtom = atom<string>("", "searchPageQuery").pipe(withReset())
export const searchPageTypeAtom = atom<SearchPageType>("all", "searchPage").pipe(withHistory())

export const searchPageHistoryAtom = reatomArray<SearchUser | SearchThread>([], "searchPageHistory").pipe(
  withLocalStorage("search-history"), 
  withReset()
)

export const defineSearchRelatedAction = reatomAsync(async (ctx) => {
  const type = ctx.get(searchPageTypeAtom)

  switch (type) {
    case "all":
      usersRelatedAction(ctx)
      threadRelatedAction(ctx)
      return;
    case "users":
      return usersRelatedAction(ctx)
    case "threads":
      return threadRelatedAction(ctx)
  }
}, "defineSearchSectionAction")

const defineNewResultsAction = action((ctx) => {
  const query = ctx.get(searchPageQueryAtom);

  searchPageResultsAtom.reset(ctx)
  handleSearchAction(ctx, query)
}, "defineNewResultsAction")

searchPageTypeAtom.onChange((ctx, state) => {
  defineNewResultsAction(ctx)
  log(`${ctx.get(searchPageTypeAtom.history)[1]} -> ${state}`)
})

searchPageQueryAtom.onChange((async (ctx, state) => {
  if (state.length >= 1) {
    defineNewResultsAction(ctx)
  } else {
    defineSearchRelatedAction(ctx)
  }
}))