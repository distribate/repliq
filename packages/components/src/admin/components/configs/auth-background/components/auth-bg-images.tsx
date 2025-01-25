import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { AuthBackgroundImagesAddButton } from "./auth-bg-images-add-button.tsx";
import { OctagonAlert, X } from "lucide-react";
import { AuthBackgroundImagesDeleteButton } from "./auth-bg-images-delete-button.tsx";
import { HoverCardWrapper } from "../../../../../wrappers/hover-card-wrapper.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { getAuthImages } from "../queries/get-auth-images.ts";
import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

const authImagesQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["auth-background-images"]),
  queryFn: getAuthImages,
  refetchOnWindowFocus: false,
  refetchOnMount: false
})

export const AuthBackgroundImages = () => {
  const { data: authImages } = authImagesQuery()

  return (
    authImages && (
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
    )
  );
};
