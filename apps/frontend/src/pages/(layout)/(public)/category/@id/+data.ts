import { Category, getCategory } from "#components/category/threads/models/category.model";
import { logRouting } from "#lib/utils";
import { wrapTitle } from "#lib/utils";
import { useConfig } from "vike-react/useConfig";
import { PageContextServer } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>

function metadata(
  { title, description }: Category
) {
  return {
    title: wrapTitle(title),
    description: description
  }
}

export const data = async (pageContext: PageContextServer) => {
  logRouting("(public) (category)", "data");

  const config = useConfig()

  const id = pageContext.routeParams.id
  const headers = pageContext.headers ?? undefined;

  const data = await getCategory(id, { headers })

  config(metadata(data));

  return {
    id,
    data
  }
}