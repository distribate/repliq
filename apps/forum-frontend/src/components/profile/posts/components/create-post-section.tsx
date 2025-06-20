import { PostTextForm } from "#components/post/create-post/components/post-text-form";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#components/user/avatar/components/avatar";
import { reatomComponent } from "@reatom/npm-react";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { PostAdditionalForm } from "#components/post/create-post/components/post-additional-form";
import { PostPublishButton } from "#components/post/create-post/components/post-publish-button";
import { postFormIsActiveAtom, postFormResetAction } from "#components/post/create-post/models/post-form.model";
import { getUser } from "#components/user/models/current-user.model";
import { IconX } from "@tabler/icons-react";

const PostCancelButton = reatomComponent(({ ctx }) => {
  return (
    <Button className="px-2 sm:px-4" state="default" onClick={() => postFormResetAction(ctx)}>
      <Typography className="hidden sm:inline text-shark-50 text-base">
        Отмена
      </Typography>
      <IconX size={22} className="text-red-500 sm:hidden" />
    </Button>
  );
}, "PostCancelButton")

const CreatePostActiveSection = () => {
  return (
    <div className="flex flex-col py-2 w-full">
      <div className="flex flex-col">
        <Separator orientation="horizontal" />
        <div className="flex items-center pt-2 gap-2 justify-between w-full">
          <div className="flex items-center gap-2">
            <PostAdditionalForm />
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <PostCancelButton />
            <PostPublishButton />
          </div>
        </div>
      </div>
    </div>
  );
};

const PostSectionAvatar = reatomComponent(({ ctx }) => {
  const { nickname, avatar } = getUser(ctx);

  return (
    <Avatar
      url={avatar}
      propWidth={48}
      propHeight={48}
      className="min-w-[34px] min-h-[34px] size-[34px] lg:size-[48px] lg:min-h-[48px] lg:min-w-[48px]"
      nickname={nickname}
    />
  )
})

const PostInactiveForm = () => {
  return (
    <div
      className="flex flex-col px-2 sm:px-4 py-2 bg-shark-950 border border-shark-800 w-full rounded-lg overflow-hidden h-full"
    >
      <div className="flex items-start h-full w-full gap-2 justify-between">
        <div className="flex gap-2 lg:gap-4 items-start w-full h-full">
          <PostSectionAvatar />
          <div className="flex w-full overflow-hidden *:w-full relative h-full">
            <PostTextForm />
          </div>
        </div>
      </div>
      <CreatePostActiveSection />
    </div>
  )
}

const PostActiveForm = reatomComponent(({ ctx }) => {
  return (
    <div
      className="flex items-center justify-between w-full gap-y-4 lg:gap-y-0 px-2 lg:px-4 py-2 rounded-lg bg-shark-950 border border-shark-800"
    >
      <div className="flex gap-2 lg:gap-4 items-center w-full">
        <PostSectionAvatar />
        <Typography className="select-none text-shark-300 text-base lg:text-lg">
          Что нового? 😇
        </Typography>
      </div>
      <Button
        onClick={() => postFormIsActiveAtom(ctx, true)}
        className="bg-shark-50 py-1 lg:py-2 rounded-lg px-4 lg:px-6"
      >
        <Typography className="text-shark-900 text-base lg:text-xl">
          Создать пост
        </Typography>
      </Button>
    </div>
  )
}, "PostActiveForm")

export const CreatePostSection = reatomComponent(({ ctx }) => {
  const isActive = ctx.spy(postFormIsActiveAtom)

  return isActive ? <PostInactiveForm /> : <PostActiveForm />
}, "CreatePostSection")