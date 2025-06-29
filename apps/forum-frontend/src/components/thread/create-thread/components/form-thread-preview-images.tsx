import { bgColorAtom, handleAddImagesAction, handleDeleteImageAction, threadFormImagesAtom } from "../models/thread-form.model.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { DeleteButton } from "@repo/ui/src/components/detele-button";
import { BuyDonateModal } from "#components/modals/custom/components/buy-donate-modal";
import { reatomComponent } from "@reatom/npm-react";
import { getUser } from "#components/user/models/current-user.model.ts";
import { IconPlus } from "@tabler/icons-react";
import { useRef } from "react";

const ThreadFormImageItem = reatomComponent<{ image: string, idx: number }>(({ ctx, image, idx }) => {
  return (
    <Dialog>
      <DialogTrigger
        style={{
          backgroundColor: bgColorAtom.get(ctx, idx)
        }}
        className="flex items-center justify-center h-full backdrop-blur-sm rounded-lg relative w-full group overflow-hidden"
      >
        <DeleteButton onClick={e => handleDeleteImageAction(ctx, e, idx)} variant="invisible" />
        <img
          src={image} alt="" width={1200} height={1200} className="w-auto h-[160px] md:max-h-[160px] object-cover md:h-fit rounded-lg"
        />
      </DialogTrigger>
      <DialogContent className="p-0 max-w-5xl !max-h-[80vh]">
        <img src={image} alt="" width={1920} height={1080} className="rounded-lg w-full h-full" />
      </DialogContent>
    </Dialog>
  )
}, "ThreadFormImageItem")

const AddImage = reatomComponent(({ ctx }) => {
  const ref = useRef<HTMLInputElement | null>(null)

  return (
    <div
      onClick={() => ref.current?.click()}
      className="flex items-center relative justify-center h-[160px] rounded-lg bg-shark-900 hover:bg-shark-800 cursor-pointer w-full"
    >
      <input
        ref={ref}
        type="file"
        name="images"
        title="Загрузить изображения"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleAddImagesAction(ctx, e)}
      />
      <IconPlus size={40} className="text-shark-50" />
    </div>
  )
}, "AddImage")

export const FormThreadPreviewImages = reatomComponent(({ ctx }) => {
  const is_donate = getUser(ctx).is_donate
  const data = ctx.spy(threadFormImagesAtom)
  if (!data) return null;

  const threadFormImages = data.reverse()

  const isExist = threadFormImages.length > 0

  return (
    <>
      <div className="flex flex-col items-start gap-2 w-full">
        <Typography textColor="shark_white" textSize="large">
          Прикрепленные изображения
        </Typography>
        <div className="grid grid-cols-2 md:grid-cols-3 h-full w-full gap-2">
          {isExist && threadFormImages.map((image, idx) => (
            <ThreadFormImageItem key={idx} idx={idx} image={image} />
          ))}
          {(threadFormImages.length === 1) && <AddImage />}
          {(threadFormImages.length === 2 && threadFormImages.length < 3) && (
            !is_donate ? (
              <BuyDonateModal
                trigger={
                  <div className="flex items-center justify-center rounded-lg bg-shark-900 hover:bg-shark-800 cursor-pointer w-full h-full">
                    <IconPlus size={40} className="text-shark-50" />
                  </div>
                }
              />
            ) : (
              <AddImage />
            )
          )}
        </div>
      </div>
    </>
  );
}, "FormThreadPreviewImages")