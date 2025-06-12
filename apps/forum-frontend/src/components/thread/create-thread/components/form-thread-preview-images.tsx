import { threadFormImagesAtom } from "../models/thread-form.model.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { DeleteButton } from "@repo/ui/src/components/detele-button";
import { Plus } from "lucide-react";
import { BuyDonateModal } from "#components/modals/custom/components/buy-donate-modal";
import { reatomComponent } from "@reatom/npm-react";
import { handleAddImagesAction, handleDeleteImageAction } from "../models/edit-thread.model.ts";
import { getUser } from "#components/user/models/current-user.model.ts";

export const FormThreadPreviewImages = reatomComponent(({ ctx }) => {
  const donate = getUser(ctx).donate
  const threadFormImages = ctx.spy(threadFormImagesAtom)

  if (!threadFormImages) return null;

  return (
    <>
      <div className="flex flex-col items-start gap-2 w-full">
        <Typography textColor="shark_white" textSize="large">
          Прикрепленные изображения
        </Typography>
        <div className="grid grid-cols-3 auto-rows-auto gap-2">
          {threadFormImages.length >= 1 && threadFormImages.reverse().map((image, i) => (
            <Dialog>
              <DialogTrigger>
                <div className="relative w-fit group overflow-hidden">
                  <DeleteButton onClick={e => handleDeleteImageAction(ctx, e, i)} variant="invisible" />
                  <img
                    src={image}
                    alt=""
                    width={1200}
                    height={1200}
                    className="max-w-[240px] max-h-[140px] object-cover h-fit rounded-md"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="p-0 max-w-5xl !max-h-[80vh]">
                <img src={image} alt="" width={1920} height={1080} className="rounded-lg w-full h-full" />
              </DialogContent>
            </Dialog>
          ))}
          {(threadFormImages.length === 1) && (
            <div
              className="flex items-center relative justify-center rounded-lg bg-shark-900 hover:bg-shark-800 cursor-pointer w-full h-full"
            >
              <input
                type="file"
                name="images"
                title="Загрузить изображения"
                accept="image/*"
                multiple
                className="absolute cursor-pointer right-0 top-0 left-0 bottom-0 opacity-0 w-full"
                onChange={e => handleAddImagesAction(ctx, e)}
              />
              <Plus size={40} className="text-shark-50" />
            </div>
          )}
          {(threadFormImages.length === 2 && threadFormImages.length < 3) && (
            donate === "default" ? (
              <BuyDonateModal
                trigger={
                  <div className="flex items-center justify-center rounded-lg bg-shark-900 hover:bg-shark-800 cursor-pointer w-full h-full">
                    <Plus size={40} className="text-shark-50" />
                  </div>
                }
              />
            ) : (
              <div
                className="flex items-center relative justify-center rounded-lg bg-shark-900 hover:bg-shark-800 cursor-pointer w-full h-full"
              >
                <input
                  type="file"
                  name="images"
                  title="Загрузить изображения"
                  accept="image/*"
                  multiple
                  className="absolute cursor-pointer right-0 top-0 left-0 bottom-0 opacity-0 w-full"
                  onChange={e => handleAddImagesAction(ctx, e)}
                />
                <Plus size={40} className="text-shark-50" />
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}, "FormThreadPreviewImages")