import { SEARCH_PAGE_LIMIT } from "@repo/shared/constants/limits.ts";
import { action, atom } from "@reatom/core";
import { handleSearchAction, SearchThread, SearchUser } from "./search.model";
import { withLocalStorage } from "@reatom/persist-web-storage";
import { reatomArray, sleep, withReset } from "@reatom/framework";

export type SearchResultsAll = Array<SearchUser | SearchThread>;
export type SearchResult = SearchUser | SearchThread;

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
  await sleep(200)
  searchPageQueryAtom(ctx, null)
})

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

    const nextState = [...state, newEntry];

    return nextState.length > SEARCH_HISTORY_LIMIT
      ? nextState.slice(1)
      : nextState;
  });
})

export const searchPageHistoryAtom = reatomArray<SearchUser | SearchThread>([], "searchPageHistory").pipe(
  withLocalStorage("search-history"), withReset()
)

export const searchPageResultsAtom = atom<Array<SearchThread | SearchUser> | null>(null, "searchPageResults")
export const searchPageQueryAtom = atom<string | null>(null, "searchPageQuery")
export const searchPageAtom = atom<SearchPageQuery>(initial, "searchPage")

searchPageQueryAtom.onChange((async (ctx, state) => {
  if (state && state.length >= 1) {
    searchPageResultsAtom(ctx, null)
    handleSearchAction(ctx, state)
  }
}))