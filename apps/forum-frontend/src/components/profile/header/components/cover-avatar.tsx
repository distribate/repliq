import { requestedUserIsSameAtom, requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { Avatar } from "#components/user/avatar/components/avatar";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, useRef } from "react";
import { Upload } from "lucide-react";
import { reatomAsync } from "@reatom/async";
import { action, atom } from "@reatom/core";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { avatarsUrlsAtom } from "#components/user/avatar/models/avatar.model";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user";
import ky from "ky";
import { toast } from "sonner";
import { withReset } from "@reatom/framework";

const userCoverAvatarVariants = cva(`flex items-center group relative justify-center md:size-[160px] size-[80px]`, {
  variants: {
    variant: {
      full: "size-[160px]",
      compact: "size-[80px]"
    }
  }
})

type UserCoverAvatarProps = HTMLAttributes<HTMLDivElement>
  & VariantProps<typeof userCoverAvatarVariants>

export const UserCoverAvatarWrapper = ({ variant, className, ...props }: UserCoverAvatarProps) => {
  return (
    <div className={userCoverAvatarVariants({ variant, className })} {...props} />
  )
}

const updateAvatarAtom = atom<string | null>(null, "updateAvatar").pipe(withReset())

async function uploadAvatar(t: FormData) {
  const url = forumUserClient.user["upload-avatar"].$url()

  const res = await ky.post<{ data: string, status: string } | { error: string }>(url, { 
    body: t,
    credentials: "include", 
    retry: 1
  })

  const data = await res.json()

  return data;
}

const updateAvatarAction = reatomAsync(async (ctx) => {
  const target = ctx.get(updateAvatarAtom)
  if (!target) return;

  const file = await fetch(target)
  const blob = await file.blob()

  const formData = new FormData()

  formData.append("file", blob)

  return await ctx.schedule(() => uploadAvatar(formData))
}, {
  name: "updateAvatarAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    if ("error" in res) {
      return toast.error(res.error);
    }
    
    toast.success("Аватар обновлен")

    const current = ctx.get(updateAvatarAtom)

    if (current) {
      URL.revokeObjectURL(current)
    }

    updateAvatarAtom.reset(ctx)

    const currentUser = ctx.get(currentUserNicknameAtom)
    if (!currentUser) return;

    avatarsUrlsAtom(ctx, (state) => ({ ...state, [currentUser]: res.data }))
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  }
})

updateAvatarAtom.onChange((ctx, target) => {
  if (!target) return;

  const currentUser = ctx.get(currentUserNicknameAtom)
  if (!currentUser) return;

  avatarsUrlsAtom(ctx, (state) => ({ ...state, [currentUser]: target }))
})

const onChange = action((ctx, e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files ? e.target.files ? e.target.files[0] : null : null

  if (!file) return;

  const url = URL.createObjectURL(file)

  updateAvatarAtom(ctx, url)
})

const UpdateAvatar = reatomComponent(({ ctx }) => {
  const ref = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <div className="absolute inset-0 duration-300 rounded-sm bg-black/50 backdrop-blur-md z-[1] group-hover:opacity-100 opacity-0">
        <div onClick={() => ref?.current?.click()} className="flex justify-center items-center w-full h-full">
          <Upload size={26} />
          <input type="file" multiple={false} ref={ref} className="hidden" onChange={e => onChange(ctx, e)} />
        </div>
      </div>
      {ctx.spy(updateAvatarAtom) && (
        <div className="flex w-full items-center justify-center absolute right-0 z-[1] left-0 -bottom-4">
          <Button onClick={() => updateAvatarAction(ctx)} variant="positive">
            <Typography className="text-shark-50">Сохранить</Typography>
          </Button>
        </div>
      )}
    </>
  )
}, "UpdateAvatar")

export const UserCoverAvatar = reatomComponent<UserCoverAvatarProps>(({ ctx, className, variant }) => {
  const nickname = ctx.spy(requestedUserParamAtom)
  const isOwner = ctx.spy(requestedUserIsSameAtom)
  if (!nickname) return null;

  return (
    <UserCoverAvatarWrapper variant={variant} className={className}>
      {isOwner && <UpdateAvatar />}
      <Avatar propHeight={160} propWidth={160} withStatus={true} nickname={nickname} />
    </UserCoverAvatarWrapper>
  )
})