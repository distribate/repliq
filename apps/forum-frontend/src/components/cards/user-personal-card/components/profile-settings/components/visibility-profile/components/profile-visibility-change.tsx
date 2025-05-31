import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ProfileVisibilityEnum } from '@repo/types/entities/entities-type.ts';
import { LockKeyhole, LockOpen } from "lucide-react";
import { reatomComponent } from "@reatom/npm-react";
import { getUser } from "@repo/lib/helpers/get-user";
import { updateCurrentUserSettingsAction } from "../../../models/update-current-user.model";
import { spawn } from "@reatom/framework";

export const ProfileVisibilityChange = reatomComponent(({ ctx }) => {
  const profile_visibility = getUser(ctx).preferences.profile_visibility

  const handleProfileVisibility = (value: ProfileVisibilityEnum) => {
    if (profile_visibility === value) return;

    void spawn(ctx, async (spawnCtx) => updateCurrentUserSettingsAction(spawnCtx, {
      setting: "profile_visibility", value
    }))
  }

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">
        Выберите тип видимости аккаунта
      </Typography>
      <div className="flex items-center justify-center *:h-[146px] *:cursor-pointer w-full">
        <div
          className={`flex relative w-1/2 group rounded-l-lg border overflow-hidden  duration-300 ease-in-out
                 ${profile_visibility === "friends" ? "border-green-500 hover:bg-green-600" : "border-transparent hover:bg-shark-800"}`}
          onClick={() => handleProfileVisibility("friends")}
        >
          <LockKeyhole
            size={116}
            className="group-hover:opacity-100 transition-all 
                  duration-300 ease-in-out text-shark-50 opacity-10 absolute -rotate-[15deg] -bottom-4 -right-4"
          />
          <div
            className="relative flex items-end justify-start 
                  group-hover:opacity-100 p-2 transition-all duration-300 ease-in-out opacity-10"
          >
            <span className="text-[21px] group-hover:animate-pulse">
              Приватный 😑
            </span>
          </div>
        </div>
        <div
          className={`flex relative w-1/2 group rounded-r-lg border overflow-hidden  duration-300 ease-in-out
                ${profile_visibility === "all" ? "border-green-500 hover:bg-green-600" : "border-transparent hover:bg-shark-800"}`}
          onClick={() => handleProfileVisibility("all")}
        >
          <LockOpen
            size={116}
            className="group-hover:opacity-100 transition-all 
                  duration-300 ease-in-out text-shark-50 opacity-10 absolute -rotate-[15deg] -bottom-4 -right-4"
          />
          <div
            className="relative flex items-end justify-start 
                  group-hover:opacity-100 p-2 transition-all duration-300 ease-in-out opacity-10"
          >
            <span className="text-[21px] group-hover:animate-pulse">
              Публичный 😝
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}, "ProfileVisibilityChange")