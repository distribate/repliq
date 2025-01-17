"use client";

import { PostTextForm } from "#forms/create-post/components/post-text-form.tsx";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { CreatePostFieldType, POST_FORM_FIELD_QUERY_KEY, postFormQuery } from "#forms/create-post/queries/post-form-query.ts";
import { useQueryClient } from "@tanstack/react-query";
import { CreatePostActiveSection } from "./create-post-active-section";

export const CreatePostSection = () => {
  const currentUser = getUser();
  const qc = useQueryClient();
  const { data: { isActive } } = postFormQuery()

  const handleActive = () => {
    qc.setQueryData(POST_FORM_FIELD_QUERY_KEY, (prev: CreatePostFieldType) => ({ ...prev, isActive: true }));
  };

  return (
    isActive ? (
      <div
        className="flex-col flex px-4 py-2 bg-shark-950 w-full rounded-lg overflow-hidden h-full"
      >
        <div className="flex items-start h-full w-full gap-2 justify-between">
          <div className="flex gap-2 items-start w-full h-full">
            <Avatar
              variant="page"
              propWidth={48}
              propHeight={48}
              nickname={currentUser.nickname}
            />
            <div className="flex w-full overflow-hidden *:w-full relative h-full">
              <PostTextForm />
            </div>
          </div>
        </div>
        <CreatePostActiveSection />
      </div>
    ) : (
      <div className="flex items-center justify-between w-full px-4 py-2 rounded-lg bg-shark-950 border border-shark-800">
        <div className="flex gap-4 items-center w-fit">
          <Avatar nickname={currentUser.nickname} propWidth={44} propHeight={44} />
          <Typography className="text-shark-300 text-lg">
            Поделитесь своими мыслями 😇
          </Typography>
        </div>
        <Button onClick={handleActive} className="bg-shark-50 rounded-lg px-6">
          <Typography className="text-shark-900 text-xl">
            Создать пост
          </Typography>
        </Button>
      </div>
    )
  );
};