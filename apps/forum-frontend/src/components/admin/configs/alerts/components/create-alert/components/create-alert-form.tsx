import { useState } from "react";
import { Input } from "@repo/ui/src/components/input.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { AlertEntity } from "@repo/types/entities/entities-type.ts";

export type AlertValues = Pick<AlertEntity, "title" | "description" | "link">;

export const AlertCreateForm = () => {
  const [alertValues, setAlertValues] = useState<AlertValues>({
    title: "",
    description: "",
    link: null,
  });

  const handleInputChange =
    (field: keyof typeof alertValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAlertValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleAddAlert = () => {
    if (!alertValues.title) return;
  };

  const handleClose = () => {
    setAlertValues({ description: "", link: null, title: "" });
  };

  const isDisabled =
    !alertValues.title ||
    alertValues.title.length <= 6;

  return (
    <>
      <div className="flex flex-col w-full gap-2">
        <Input
          maxLength={100}
          placeholder="Заголовок"
          roundedType="default"
          value={alertValues.title}
          onChange={handleInputChange("title")}
        />
        <Input
          maxLength={256}
          placeholder="Описание"
          roundedType="default"
          value={alertValues.description || ""}
          onChange={handleInputChange("description")}
        />
        <Input
          maxLength={256}
          placeholder="Ссылка"
          roundedType="default"
          value={alertValues.link || ""}
          onChange={handleInputChange("link")}
        />
      </div>
      <div className="flex items-center pb-2 gap-2 *:w-full w-full">
        <Button
          onClick={handleAddAlert}
          variant="positive"
          className="w-full"
          disabled={isDisabled}
        >
          <Typography>Создать</Typography>
        </Button>
        <DialogClose onClick={handleClose}>
          <Button variant="negative" className="w-full">
            <Typography>Отмена</Typography>
          </Button>
        </DialogClose>
      </div>
    </>
  );
};
