import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { DialogLoader } from "#components/templates/components/dialog-loader";
import { createMinecraftItemAction } from "#components/admin/configs/minecraft-items/components/create-minecraft-item/models/create-minecraft-item.model";
import { MinecraftItemCreateForm } from "#components/admin/configs/minecraft-items/components/create-minecraft-item/components/minecraft-item-create-form";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { reatomComponent } from "@reatom/npm-react";

export const MinecraftItemsAddButton = reatomComponent(({ ctx }) => {
  const [isShow, setIsShow] = useState<boolean>(false);

  const minecraftItemMutationStatus = ctx.spy(createMinecraftItemAction.statusesAtom)

  useEffect(() => {
    if (minecraftItemMutationStatus.isFulfilled) setIsShow(false);
  }, [minecraftItemMutationStatus]);

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger>
        <div className="flex items-center justify-center hover-select-effect w-full h-full rounded-md">
          <Plus size={24} className="text-white" />
        </div>
      </DialogTrigger>
      <DialogContent>
        {minecraftItemMutationStatus.isPending ? (
          <DialogLoader />
        ) : (
          <div className="flex flex-col gap-y-6 px-2 items-center w-full">
            <Typography variant="dialogTitle">Создание предмета</Typography>
            <MinecraftItemCreateForm />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}, "MinecraftItemsAddButton")