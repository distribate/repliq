"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { DialogLoader } from "../../../../../templates/dialog-loader.tsx";
import { useMutationState } from "@tanstack/react-query";
import { MINECRAFT_CREATE_ITEM_MUTATION_KEY } from "../../../../../forms/create-minecraft-items/hooks/use-minecraft-items.tsx";
import { MinecraftItemCreateForm } from "../../../../../forms/create-minecraft-items/components/minecraft-item-create-form.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";

export const MinecraftItemsAddButton = () => {
  const [isShow, setIsShow] = useState<boolean>(false);

  const data = useMutationState({
    filters: { mutationKey: MINECRAFT_CREATE_ITEM_MUTATION_KEY },
    select: (mutation) => mutation.state.status,
  });

  const minecraftItemMutationStatus = data[data.length - 1];

  useEffect(() => {
    if (minecraftItemMutationStatus === "success") setIsShow(false);
  }, [minecraftItemMutationStatus]);

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger>
        <div className="flex items-center justify-center hover-select-effect w-full h-full rounded-md">
          <Plus size={24} className="text-white" />
        </div>
      </DialogTrigger>
      <DialogContent>
        {minecraftItemMutationStatus === "pending" ? (
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
};
