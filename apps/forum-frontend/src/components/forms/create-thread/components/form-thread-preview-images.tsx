import { threadFormQuery } from "../queries/thread-form-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { useCreateThread } from "#components/forms/create-thread/hooks/use-create-thread.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { Plus } from "lucide-react";
import { BuyDonateModal } from "#components/modals/custom/buy-donate-modal.tsx";

export const FormThreadPreviewImages = () => {
  const { donate } = getUser()
  const { handleDeleteImage, handleAddImages } = useCreateThread();
  const { data: threadFormState } = threadFormQuery();

  if (!threadFormState || !threadFormState.images) return null;

  const previewFormImages = threadFormState.images;

  return (
    <>
      <div className="flex flex-col items-start gap-2 w-full">
        <Typography textColor="shark_white" textSize="large">
          Прикрепленные изображения
        </Typography>
        <div className="grid grid-cols-3 auto-rows-auto gap-2">
          {previewFormImages.reverse().map((image, i) => (
            <Dialog>
              <DialogTrigger>
                <div className="relative w-fit group overflow-hidden">
                  <DeleteButton onClick={e => handleDeleteImage(e, i)} variant="invisible" />
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
          {(previewFormImages.length === 1) && (
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
                onChange={e => handleAddImages(e)}
              />
              <Plus size={40} className="text-shark-50" />
            </div>
          )}
          {(previewFormImages.length === 2 && previewFormImages.length < 3) && (
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
                  onChange={e => handleAddImages(e)}
                />
                <Plus size={40} className="text-shark-50" />
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};