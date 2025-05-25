import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/src/components/accordion.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { Link } from "@tanstack/react-router";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname";
import { Button } from "@repo/ui/src/components/button.tsx";
import { threadAtom } from "#components/thread/thread-main/models/thread.model";
import { Separator } from "@repo/ui/src/components/separator";
import { FriendButton } from "#components/friend/components/friend-button/components/friend-button";
import { reatomComponent } from "@reatom/npm-react";
import { atom } from "@reatom/core";

const ThreadTag = ({ tag }: { tag: string; }) => {
  return (
    <div className="flex px-2 py-0.5 bg-secondary-color rounded-sm items-center justify-center">
      <Typography className="leading-5" textColor="gray">
        #{tag}
      </Typography>
    </div>
  );
};

const threadMoreIsExpandedAtom = atom(true, "threadMoreIsExpanded")

export const ThreadMore = reatomComponent(({ ctx }) => {
  const isExpanded = ctx.spy(threadMoreIsExpandedAtom)
  const thread = ctx.spy(threadAtom)

  if (!thread) return null;

  const owner = thread.owner;

  return (
    <Accordion value={isExpanded ? "more" : "."} type="single" collapsible className="w-full p-0 m-0">
      <AccordionItem value="more" className="w-full px-4">
        <AccordionTrigger
          withChevron={false}
          className="flex items-center justify-between w-full"
          onClick={() => threadMoreIsExpandedAtom(ctx, (state) => !state)}
        >
          <div className="flex items-center gap-3 justify-start">
            <div className="flex items-center w-fit gap-1">
              <Typography textSize="medium">
                {thread.views_count} просмотров
              </Typography>
            </div>
            <Typography textSize="medium">
              {dayjs(thread.created_at).fromNow()}
            </Typography>
            {thread.tags && (
              <div className="flex items-center gap-2 ml-2">
                {thread.tags.map((tag, idx) => <ThreadTag key={idx} tag={tag} />)}
              </div>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
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
          <div className="flex flex-col mt-2 mb-6 gap-y-4 w-full">
            <div className="flex items-end gap-2 w-fit">
              <Link to={USER_URL + owner.nickname}>
                <Avatar nickname={owner.nickname} propWidth={36} propHeight={36} />
              </Link>
              <Link to={USER_URL + owner.nickname}>
                <UserNickname nickname={owner.nickname} />
              </Link>
            </div>
            <div className="flex items-center gap-2 w-full">
              <FriendButton recipient={owner.nickname} />
              <Separator orientation="vertical" />
              <Link to={USER_URL + owner.nickname}>
                <Button className="px-6" state="default">
                  <Typography className="text-[16px]">Профиль</Typography>
                </Button>
              </Link>
              <Link
                to="/search"
                search={{
                  type: "threads",
                  // @ts-ignore
                  user: owner.nickname,
                }}
              >
                <Button state="default" className="px-6">
                  <Typography className="text-[16px]">Треды</Typography>
                </Button>
              </Link>
            </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => threadMoreIsExpandedAtom(ctx, false)}
          >
            <Typography textSize="medium">Скрыть</Typography>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}, "ThreadMore")