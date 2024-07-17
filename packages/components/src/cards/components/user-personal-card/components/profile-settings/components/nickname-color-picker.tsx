import { useState } from 'react';
import { UserNickname } from '../../../../../../user/components/name/components/nickname.tsx';
import {
  ColorArea,
  SliderTrack,
  ColorSlider,
  parseColor,
  ColorThumb,
} from 'react-aria-components';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { useUpdateCurrentUser } from '@repo/lib/hooks/use-update-current-user.ts';
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import { USER } from '@repo/types/entities/entities-type.ts';

type NicknameColorPickerProps = Pick<USER, 'nickname' | 'name_color'>

export const NicknameColorPicker = ({
  nickname, name_color,
}: NicknameColorPickerProps) => {
  const [ color, setColor ] = useState(parseColor('hsl(50, 100%, 50%)'));
  const [ finalColor, setFinalColor ] = useState(color);
  
  const { removeDialogMutation } = useDialog();
  
  const { updateFieldMutation } = useUpdateCurrentUser();
  
  const handleUpdateColor = () => {
    updateFieldMutation.mutate({
      value: finalColor.toString('hex'), field: 'name_color',
    });
    
    removeDialogMutation.mutate({
      dialogName: 'nickname-color-picker',
    });
  };
  
  const currentColor = name_color.toString();
  const currentSelectedColor = finalColor.toString('hex');
  
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <Typography>
        Изменение цвета никнейма
      </Typography>
      <div className="flex justify-between items-start w-full gap-4 px-3">
        <div className="flex flex-col gap-y-2 w-1/2">
          <div className="flex flex-col p-2 gap-y-4">
            <Typography className="text-shark-300" textSize="small">
              Предварительный просмотр
            </Typography>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-1">
                <Typography>Текущий цвет: {currentColor}</Typography>
                <div className="w-[8px] h-[8px]" style={{
                  backgroundColor: currentColor,
                }} />
              </div>
              <div className="flex items-center gap-1">
                <Typography>Новый цвет: {currentSelectedColor}</Typography>
                <div className="w-[8px] h-[8px]" style={{
                  backgroundColor: currentSelectedColor,
                }} />
              </div>
              <div className="flex items-center gap-1">
                <Typography>Ник:</Typography>
                <UserNickname nickname={nickname} nicknameColor={currentSelectedColor} />
              </div>
            </div>
          </div>
          <Separator />
          <Button
            onClick={handleUpdateColor}
            type="button"
            disabled={updateFieldMutation.isPending || updateFieldMutation.isError || currentColor === currentSelectedColor}
            state="default"
          >
            Сохранить
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 pb-3">
          <ColorArea
            className="w-[224px] h-[224px] rounded-md"
            defaultValue={name_color}
            xChannel="saturation"
            value={color}
            yChannel="lightness"
            onChange={setColor}
            onChangeEnd={setFinalColor}
          >
            <ColorThumb className="border-[1px] border-white rounded-md w-[24px] h-[24px]" />
          </ColorArea>
          <ColorSlider
            channel="hue"
            value={color}
            onChange={setColor}
            onChangeEnd={setFinalColor}
            className="w-full"
          >
            <SliderTrack className="flex items-center w-full rounded-md h-[20px] ">
              <ColorThumb className="w-[16px] h-[16px] rounded-md border-[1px] border-white" />
            </SliderTrack>
          </ColorSlider>
        </div>
      </div>
    </div>
  );
};