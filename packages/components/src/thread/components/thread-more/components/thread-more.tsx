import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/src/components/accordion.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { useState } from "react";
import Link from "next/link";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { ThreadDetailed } from "@repo/types/entities/thread-type";

type ThreadMoreProps = Pick<ThreadDetailed, "description"> & {
  threadTags: string[];
  owner: ThreadDetailed["owner"];
  createdAt: string
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
  threadTags, description, createdAt, owner,
}: ThreadMoreProps) => {
  const [expand, setExpand] = useState<boolean>(true);

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
          <div className="flex items-center gap-4 justify-start">
            <Typography>{dayjs(createdAt).fromNow()}</Typography>
            {threadTags && (
              <div className="flex items-center gap-2">
                {threadTags.map((tag, idx) => <ThreadTag key={idx} tag={tag} />)}
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
              <Link href={USER_URL + owner.nickname}>
                <Avatar
                  nickname={owner.nickname}
                  propWidth={36}
                  propHeight={36}
                />
              </Link>
              <Link href={USER_URL + owner.nickname}>
                <UserNickname nickname={owner.nickname} />
              </Link>
            </div>
            <div className="flex items-center gap-2 w-full">
              <Link href={USER_URL + owner.nickname}>
                <Button className="px-6" state="default">
                  <Typography className="text-[16px]">Профиль</Typography>
                </Button>
              </Link>
              <Link
                href={{
                  pathname: "/search",
                  query: {
                    type: "threads",
                    user: owner.nickname,
                  },
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
