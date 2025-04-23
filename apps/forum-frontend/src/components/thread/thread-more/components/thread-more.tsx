import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/src/components/accordion.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { Suspense, useState } from "react";
import { Link } from "@tanstack/react-router";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/components/nickname";
import { Button } from "@repo/ui/src/components/button.tsx";
import { ThreadDetailed } from "@repo/types/entities/thread-type";
import { useQueryClient } from "@tanstack/react-query";
import { THREAD_QUERY_KEY } from "#components/thread/thread-main/queries/thread-query";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Separator } from "@repo/ui/src/components/separator";
import { FriendButton } from "#components/friend/components/friend-button/components/friend-button";

type ThreadMoreProps = {
  threadId: string
};

const ThreadTag = ({ tag }: { tag: string; }) => {
  return (
    <div className="flex px-2 py-0.5 bg-secondary-color rounded-sm items-center justify-center">
      <Typography className="leading-5" textColor="gray">
        #{tag}
      </Typography>
    </div>
  );
};

export const ThreadMore = ({
  threadId
}: ThreadMoreProps) => {
  const qc = useQueryClient();
  const [expand, setExpand] = useState<boolean>(true);
  const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId));

  if (!thread) return null;

  const { tags, created_at, description, owner, views_count } = thread;

  return (
    <Accordion
      value={expand ? "more" : "."}
      type="single"
      collapsible
      className="w-full p-0 m-0"
    >
      <AccordionItem value="more" className="w-full px-4">
        <AccordionTrigger
          withChevron={false}
          className="flex items-center justify-between w-full"
          onClick={() => setExpand((prev) => !prev)}
        >
          <div className="flex items-center gap-3 justify-start">
            <div className="flex items-center w-fit gap-1">
              <Typography textSize="medium">
                {views_count} просмотров
              </Typography>
            </div>
            <Typography textSize="medium">
              {dayjs(created_at).fromNow()}
            </Typography>
            {tags && (
              <div className="flex items-center gap-2 ml-2">
                {tags.map((tag, idx) => <ThreadTag key={idx} tag={tag} />)}
              </div>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex mb-6 w-fit">
            {description ? (
              <Typography textSize="large" textColor="shark_white">
                {description}
              </Typography>
            ) : (
              <Typography textColor="gray" textSize="medium" className="italic">
                У треда нет описания
              </Typography>
            )}
          </div>
          <div className="flex flex-col mt-2 mb-6 gap-y-4 w-full">
            <div className="flex items-end gap-2 w-fit">
              <Suspense fallback={<Skeleton className="h-[36px] w-[36px]" />}>
                <Link to={USER_URL + owner.nickname}>
                  <Avatar nickname={owner.nickname} propWidth={36} propHeight={36} />
                </Link>
              </Suspense>
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
          <div className="cursor-pointer" onClick={() => setExpand(false)}>
            <Typography textSize="medium">Скрыть</Typography>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
