import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { OctagonAlert, Plus } from "lucide-react";
import { HoverCardWrapper } from "#components/wrappers/components/hover-card-wrapper.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { onConnect } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react";
import { ChangeEvent } from "react";
import { GearLoader } from "@repo/ui/src/components/gear-loader.tsx";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { authImagesAction, authImagesAtom, createAuthImageAction } from "../models/auth-images.model.ts";

onConnect(authImagesAtom, authImagesAction)

const AuthBackgroundImagesDeleteButton = reatomComponent<{ imageName: string }>(({ 
  imageName
}) => {

  console.log(imageName)

  const handleDeleteAuthImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // deleteAuthImageFileMutation.mutate(imageName);
  };

  return (
    <DeleteButton
      variant="invisible"
      title="Удалить изображение"
      // disabled={deleteAuthImageFileMutation.isPending}
      onClick={handleDeleteAuthImage}
    />
  );
}, "AuthBackgroundImagesDeleteButton")

const AuthBackgroundImagesAddButton = reatomComponent(({ ctx }) => {
  const handleAuthImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    createAuthImageAction(ctx, e.target.files)
  };

  return (
    <div
      className="flex items-center justify-center bg-transparent border hover:bg-secondary-color
      duration-300 border-shark-700 w-[116px] relative h-[116px] rounded-md"
    >
      {ctx.spy(createAuthImageAction.statusesAtom).isPending ? (
        <GearLoader />
      ) : (
        <Plus size={24} className="text-white" />
      )}
      <input
        title="Добавить изображение"
        type="file"
        accept="image/webp,image/png,image/jpeg,image/jpg"
        className="absolute opacity-0 cursor-pointer w-full h-full"
        multiple
        onChange={handleAuthImage}
      />
    </div>
  );
}, "AuthBackgroundImagesAddButton")

export const AuthBackgroundImages = reatomComponent(({ ctx }) => {
  const authImages = ctx.spy(authImagesAtom)

  if (!authImages) return null;

  return (
    <>
      <div className="flex absolute top-6 right-4 w-fit">
        <HoverCardWrapper
          trigger={<OctagonAlert size={20} className="text-shark-300" />}
          content={
            <div className="flex flex-col gap-2 p-2 w-full h-fit">
              <Typography textSize="medium">Ограничения</Typography>
              <Separator />
              <Typography textSize="small" className="text-shark-300">
                размер до 10 МБ, всего 50 файлов доступно к загрузке (еще{" "}
                {50 - authImages.length})
              </Typography>
            </div>
          }
        />
      </div>
      <div className="grid grid-cols-5 auto-rows-auto gap-2 w-fit">
        {authImages.slice(0, 50).map((image, i) => (
          <Dialog key={i}>
            <DialogTrigger className="group hover:brightness-75 duration-300 relative">
              <img
                src={image.url}
                alt=""
                height={500}
                width={500}
                className="w-[116px] h-[116px] object-cover rounded-md"
              />
              <AuthBackgroundImagesDeleteButton imageName={image.name} />
            </DialogTrigger>
            <DialogContent className="max-w-6xl p-0">
              <img
                key={i}
                src={image.url}
                alt=""
                height={1920}
                width={1080}
                className="w-full h-full rounded-md"
              />
            </DialogContent>
          </Dialog>
        ))}
        <AuthBackgroundImagesAddButton />
      </div>
    </>
  );
}, "AuthBackgroundImages")
