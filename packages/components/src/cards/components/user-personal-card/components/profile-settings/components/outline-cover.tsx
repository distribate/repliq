import { DropdownWrapper } from "#wrappers/dropdown-wrapper.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useUpdateCurrentUser } from "@repo/lib/hooks/use-update-current-user.ts";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import React from "react";
import { HoverCardWrapper } from "#wrappers/hover-card-wrapper.tsx";
import { getPreferenceValue } from "@repo/lib/helpers/convert-user-preferences-to-map.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";

export const OutlineCover = () => {
  const currentUser = getUser();
  const { updateFieldMutation } = useUpdateCurrentUser();
  const preferences = currentUser.preferences;
  const preferOutline = getPreferenceValue(preferences, "coverOutline");

  const handleOutlinePrefer = (
    e: React.MouseEvent<HTMLDivElement>,
    value: boolean,
  ) => {
    e.preventDefault();

    return updateFieldMutation.mutate({
      value: value.toString(),
      field: "preferences",
      preferences: { value: value, key: "coverOutline" },
    });
  };

  return (
    <DropdownWrapper
      properties={{ contentAlign: "end", sideAlign: "right" }}
      trigger={
        <Typography className="text-base">
          {preferOutline ? "вкл" : "выкл"}
        </Typography>
      }
      content={
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-start w-full flex-col pt-2 px-2">
            <Typography className="text-shark-300 text-sm">
              Обводка профиля
            </Typography>
            <HoverCardWrapper
              properties={{
                delay: 10,
                contentAlign: "center",
                sideAlign: "right",
              }}
              trigger={
                <Typography className="text-shark-400 text-sm hover:text-pink-500 cursor-pointer">
                  (подробнее)
                </Typography>
              }
              content={
                <div className="flex flex-col gap-y-2 w-full p-2">
                  <Typography textSize="small" textColor="shark_white">
                    Обводка вокруг профиля - уникальная фича, чтобы выделиться
                    среди других игроков.
                  </Typography>
                  <Typography textSize="small" textColor="shark_white">
                    Цвет обводки зависит от типа привилегии.
                  </Typography>
                </div>
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <HoverCardItem onClick={(e) => handleOutlinePrefer(e, true)}>
              <Typography
                className={preferOutline ? "text-caribbean-green-500" : ""}
              >
                включить
              </Typography>
            </HoverCardItem>
            <HoverCardItem onClick={(e) => handleOutlinePrefer(e, false)}>
              <Typography
                className={!preferOutline ? "text-caribbean-green-500" : ""}
              >
                выключить
              </Typography>
            </HoverCardItem>
          </div>
        </div>
      }
    />
  );
};
