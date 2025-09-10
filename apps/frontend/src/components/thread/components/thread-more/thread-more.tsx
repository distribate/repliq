import dayjs from "@repo/shared/constants/dayjs-instance.ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/src/components/accordion.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#components/user/components/avatar/components/avatar";
import { UserNickname } from "#components/user/components/name/nickname";
import { Button } from "@repo/ui/src/components/button.tsx";
import { threadAtom, threadOwnerAtom } from "#components/thread/models/thread.model";
import { reatomComponent } from "@reatom/npm-react";
import { atom } from "@reatom/core";
import { CustomLink } from "#shared/components/link";
import { ThreadControl } from "#components/thread/components/thread-control/components/thread-control";
import { createIdLink } from "#shared/helpers/create-link";
import { IconEye } from "@tabler/icons-react";

const ThreadTag = ({ tag }: { tag: string; }) => {
  return (
    <div className="flex px-2 py-0.5 rounded-md bg-secondary-color items-center justify-center">
      <Typography className="leading-5" textColor="gray">
        #{tag}
      </Typography>
    </div>
  );
};

const threadMoreIsExpandedAtom = atom(true, "threadMoreIsExpanded")

const ThreadMoreActions = reatomComponent(({ ctx }) => {
  const threadOwner = ctx.get(threadOwnerAtom)
  if (!threadOwner) return null;

  const linkToOwner = createIdLink("user", threadOwner.nickname)

  return (
    <div className="flex flex-col mt-2 mb-6 gap-y-4 w-full">
      <div className="flex items-end gap-2 w-fit">
        <CustomLink to={linkToOwner}>
          <Avatar
            className="min-w-[36px] min-h-[36px]"
            url={threadOwner.avatar}
            nickname={threadOwner.nickname}
            propWidth={36}
            propHeight={36}
          />
        </CustomLink>
        <CustomLink to={linkToOwner}>
          <UserNickname nickname={threadOwner.nickname} />
        </CustomLink>
      </div>
      <div className="overflow-x-auto oveflow-y-hidden pb-2">
        <div className="flex items-center gap-2 w-full">
          <ThreadControl />
          <CustomLink to={linkToOwner}>
            <Button className="px-6" state="default">
              <Typography textSize="medium">Профиль</Typography>
            </Button>
          </CustomLink>
        </div>
      </div>
    </div>
  )
}, "ThreadMoreActions")

const ThreadMoreInfo = reatomComponent(({ ctx }) => {
  const thread = ctx.get(threadAtom)
  if (!thread) return null;

  return (
    <div className="flex mb-6 w-fit">
      {thread.description ? (
        <Typography textSize="large" textColor="shark_white">
          {thread.description}
        </Typography>
      ) : (
        <Typography textColor="gray" textSize="medium" className="italic">
          У треда нет описания
        </Typography>
      )}
    </div>
  )
}, "ThreadMoreInfo")

export const ThreadMore = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)
  const threadOwner = ctx.spy(threadOwnerAtom)
  if (!thread || !threadOwner) return null;

  const isExpanded = ctx.spy(threadMoreIsExpandedAtom)

  return (
    <div className="flex w-full bg-shark-900/40 rounded-xl">
      <Accordion value={isExpanded ? "more" : "."} type="single" collapsible className="w-full p-0 m-0">
        <AccordionItem value="more" className="w-full px-4">
          <AccordionTrigger
            withChevron={false}
            className="flex items-center justify-between w-full"
            onClick={() => threadMoreIsExpandedAtom(ctx, (state) => !state)}
          >
            <div className="flex items-center gap-3 justify-start">
              <div className="flex items-center w-fit gap-1">
                <Typography textSize="medium" className="text-nowrap">
                  {thread.views_count} <span className="hidden sm:inline">просмотров</span>
                </Typography>
                <IconEye size={18} className="text-shark-300 sm:hidden block" />
              </div>
              <Typography textSize="medium" className="text-nowrap">
                {dayjs(thread.created_at).fromNow()}
              </Typography>
              {thread.tags && (
                <div className="flex items-center gap-2">
                  {thread.tags.map((tag, idx) => <ThreadTag key={idx} tag={tag} />)}
                </div>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ThreadMoreInfo />
            <ThreadMoreActions />
            <div
              className="cursor-pointer"
              onClick={() => threadMoreIsExpandedAtom(ctx, false)}
            >
              <Typography textSize="medium" className="text-shark-300">Скрыть</Typography>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}, "ThreadMore")