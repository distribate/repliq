import { AlertEntity } from '@repo/types/entities/entities-type.ts';
import { useState } from 'react';
import { AlertValues } from '../types/alert-values-types.ts';
import { useAlerts } from '../hooks/use-alerts.ts';
import { Input } from '@repo/ui/src/components/input.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { DialogClose } from '@repo/ui/src/components/dialog.tsx';

export const AlertUpdateForm = ({
  id, description, link, title
}: Omit<AlertEntity, "created_at" | "creator">) => {
  const [ alertValues, setAlertValues ] = useState<AlertValues>({
    title: title, description: description, link: link
  });
  
  const { updateAlertMutation } = useAlerts();
  
  const handleInputChange = (
    field: keyof typeof alertValues,
  ) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAlertValues(prev => ({ ...prev, [field]: e.target.value }));
  };
  
  const handleUpdateAlert = () => {
    updateAlertMutation.mutate({
      ...alertValues, id
    })
  }
  
  const isDisabled = updateAlertMutation.isPending
  
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
          value={alertValues.description || ''}
          onChange={handleInputChange("description")}
        />
        <Input
          maxLength={256}
          placeholder="Ссылка"
          roundedType="default"
          value={alertValues.link || ''}
          onChange={handleInputChange("link")}
        />
      </div>
      <div className="flex items-center pb-2 gap-2 *:w-full w-full">
        <Button
          onClick={handleUpdateAlert}
          variant="positive"
          className="w-full"
          disabled={isDisabled}
        >
          <Typography>Создать</Typography>
        </Button>
        <DialogClose>
          <Button variant="negative" className="w-full">
            <Typography>Отмена</Typography>
          </Button>
        </DialogClose>
      </div>
    </>
  )
}