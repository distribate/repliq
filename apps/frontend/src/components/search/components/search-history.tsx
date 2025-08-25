import { Fragment } from "react/jsx-runtime";
import { Typography } from "@repo/ui/src/components/typography";
import { SearchPageThread, SearchPageUser } from "./search-page-childs";
import { deleteEntryFromHistoryAction, searchPageHistoryAtom } from "../models/search-page.model";
import { reatomComponent } from "@reatom/npm-react";
import { IconX } from "@tabler/icons-react";

export const SearchPageHistory = reatomComponent(({ ctx }) => {
  const history = ctx.spy(searchPageHistoryAtom)

  if (!history || !history.length) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <Typography className="font-semibold" textSize="very_big">
        Недавно искали
      </Typography>
      <div className="flex flex-col items-start gap-2 w-full h-full">
        {history.toReversed().map((item, idx) => (
          <Fragment key={idx}>
            {"nickname" in item && (
              <div className="flex group w-full h-full relative">
                <IconX
                  onClick={() => deleteEntryFromHistoryAction(ctx, item.nickname)}
                  className="absolute group-hover:opacity-100 opacity-0 duration-150 -translate-y-1/2 top-1/2 right-8 z-[3] cursor-pointer"
                  size={24}
                />
                <SearchPageUser
                  description={item.description}
                  avatar={item.avatar}
                  nickname={item.nickname}
                  name_color={item.name_color}
                />
              </div>
            )}
            {"title" in item && (
              <div className="flex group w-full h-full relative">
                <IconX
                  onClick={() => deleteEntryFromHistoryAction(ctx, item.id)}
                  className="absolute group-hover:opacity-100 opacity-0 duration-150 -translate-y-1/2 top-1/2 right-8 z-[3] cursor-pointer"
                  size={24}
                />
                <SearchPageThread
                  id={item.id}
                  title={item.title}
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}, "SearchPageHistory")
