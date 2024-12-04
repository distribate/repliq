import {
  SearchResult,
  SearchResultsAll,
} from "#search/queries/search-page-query.ts";

export function filterSearchResults<T extends SearchResult>(
  results: SearchResultsAll,
  type: "threads" | "users",
): T[] {
  return results.filter((item): item is T => {
    if (type === "threads") return "id" in item && "title" in item;
    if (type === "users") return "nickname" in item;
    return false;
  });
}
