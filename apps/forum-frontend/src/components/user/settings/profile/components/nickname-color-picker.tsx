import { useState } from "react";
import { UserNickname } from '#components/user/name/nickname';
import {
  ColorArea,
  SliderTrack,
  ColorSlider,
  parseColor,
  ColorThumb,
} from "react-aria-components";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { reatomComponent } from "@reatom/npm-react";
import { spawn } from "@reatom/framework";
import { updateCurrentUserAction } from "../models/update-current-user.model";

type NicknameColorPickerProps = Pick<UserEntity, "nickname" | "name_color">;

const parseHexToHSL = (H: string): string => {
  let r: number, g: number, b: number;

  if (H.length === 4) {
    r = parseInt(H[1] + H[1], 16);
    g = parseInt(H[2] + H[2], 16);
    b = parseInt(H[3] + H[3], 16);
  } else if (H.length === 7) {
    r = parseInt(H[1] + H[2], 16);
    g = parseInt(H[3] + H[4], 16);
    b = parseInt(H[5] + H[6], 16);
  } else throw new Error("Invalid HEX color format");

  r /= 255;
  g /= 255;
  b /= 255;

  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;

  let h = 0;
  let s = 0;
  let l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) {
    h += 360;
  }

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `hsl(${h},${s}%,${l}%)`;
};

export const NicknameColorPicker = reatomComponent<NicknameColorPickerProps>(({
  ctx, nickname, name_color,
}) => {
  const [color, setColor] = useState(parseColor(`hsl(${parseHexToHSL(name_color)})`));
  const [finalColor, setFinalColor] = useState(color);

  const currentColor = name_color.toString();
  const currentSelectedColor = finalColor.toString("hex");
  const isIdentity = currentColor === currentSelectedColor;

  const handleUpdateColor = () => {
    if (isIdentity) return;

    void spawn(ctx, async (spawnCtx) => updateCurrentUserAction(spawnCtx, { value: finalColor.toString("hex"), criteria: "name_color" }));
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <Typography variant="dialogTitle">Изменение цвета никнейма</Typography>
      <div className="flex justify-between items-start w-full gap-4 px-3">
        <div className="flex flex-col gap-y-2 w-1/2">
          <div className="flex flex-col p-2 gap-y-4">
            <Typography className="text-shark-300" textSize="small">
              Предварительный просмотр
            </Typography>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-1">
                <Typography>Текущий цвет: {currentColor}</Typography>
                <div
                  className="w-[8px] h-[8px]"
                  style={{ backgroundColor: currentColor }}
                />
              </div>
              <div className="flex items-center gap-1">
                <Typography>Новый цвет: {currentSelectedColor}</Typography>
                <div
                  className="w-[8px] h-[8px]"
                  style={{ backgroundColor: currentSelectedColor }}
                />
              </div>
              <div className="flex items-center gap-1">
                <Typography>Ник:</Typography>
                <UserNickname
                  nickname={nickname}
                  nicknameColor={currentSelectedColor}
                />
              </div>
            </div>
          </div>
          <Separator />
          <Button
            onClick={handleUpdateColor}
            type="button"
            pending={ctx.spy(updateCurrentUserAction.statusesAtom).isPending}
            disabled={ctx.spy(updateCurrentUserAction.statusesAtom).isPending || isIdentity}
            state="default"
          >
            Сохранить
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 pb-3">
          <ColorArea
            className="w-[224px] h-[224px] rounded-md"
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
}, "NicknameColorPicker")