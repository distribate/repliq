import { PostTextForm } from "#components/forms/create-post/components/post-text-form.tsx";
import { getUser, userGlobalOptionsAtom } from "@repo/lib/helpers/get-user.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { postFormFieldAtom } from "#components/forms/create-post/models/post-form.model";
import { Avatar } from "#components/user/avatar/components/avatar";
import { reatomComponent } from "@reatom/npm-react";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { PostAdditionalForm } from "#components/forms/create-post/components/post-additional-form.tsx";
import { PostPublishButton } from "#components/forms/create-post/components/post-publish-button.tsx";

const PostCreateCancelButton = reatomComponent(({ ctx }) => {
  return (
    <Button onClick={() => postFormFieldAtom.reset(ctx)} variant="negative">
      <Typography className="text-shark-50 text-base">
        Отмена
      </Typography>
    </Button>
  );
}, "PostCreateCancelButton")

const CreatePostActiveSection = () => {
  return (
    <div className="flex flex-col py-2 w-full">
      <div className="flex flex-col">
        <Separator orientation="horizontal" />
        <div className="flex items-center pt-2 justify-between w-full">
          <div className="flex items-center gap-2">
            <PostAdditionalForm />
            {/*<div className="flex gap-4 items-start">*/}
            {/*  <Camera size={18} className="text-shark-300"/>*/}
            {/*  <Video size={18} className="text-shark-300"/>*/}
            {/*</div>*/}
          </div>
          <div className="flex items-center gap-2">
            <PostPublishButton />
            <PostCreateCancelButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CreatePostSection = reatomComponent(({ ctx }) => {
  const can_create_posts = ctx.spy(userGlobalOptionsAtom).can_create_posts
  const { isActive } = ctx.spy(postFormFieldAtom)
  const nickname = getUser(ctx).nickname;

  if (!can_create_posts) return null;

  return (
    isActive ? (
      <div
        className="flex flex-col px-4 py-2 bg-shark-950 border border-shark-800 w-full rounded-lg overflow-hidden h-full"
      >
        <div className="flex items-start h-full w-full gap-2 justify-between">
          <div className="flex gap-2 items-start w-full h-full">
            <Avatar
              variant="page"
              propWidth={48}
              propHeight={48}
              className="w-[34px] h-[34px] lg:w-[48px] lg:h-[48px]"
              nickname={nickname}
            />
            <div className="flex w-full overflow-hidden *:w-full relative h-full">
              <PostTextForm />
            </div>
          </div>
        </div>
        <CreatePostActiveSection />
      </div>
    ) : (
      <div
        className="flex items-center justify-between w-full gap-y-4 lg:gap-y-0 px-2 lg:px-4 py-2 rounded-lg bg-shark-950 border border-shark-800"
      >
        <div className="flex gap-2 lg:gap-4 items-center w-full">
          <Avatar
            nickname={nickname}
            propWidth={48}
            propHeight={48}
            className="w-[34px] h-[34px] lg:w-[48px] lg:h-[48px]"
          />
          <Typography className="select-none text-shark-300 text-base lg:text-lg">
            Что нового? 😇
          </Typography>
        </div>
        <Button
          onClick={() => postFormFieldAtom(ctx, (state) => ({ ...state, isActive: true }))}
          className="bg-shark-50 py-1 lg:py-2 rounded-lg px-4 lg:px-6"
        >
          <Typography className="text-shark-900 text-base lg:text-xl">
            Создать пост
          </Typography>
        </Button>
      </div>
    )
  );
}, "CreatePostSection")