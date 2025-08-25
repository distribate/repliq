import { Typography } from "@repo/ui/src/components/typography.tsx";
import { LockKeyhole, LockOpen } from "lucide-react";
import { reatomComponent } from "@reatom/npm-react";
import { spawn } from "@reatom/framework";
import { updateCurrentUserSettingsAction } from "../models/update-current-user.model";
import { getUser } from "#components/user/models/current-user.model";
import { cva } from "class-variance-authority";

const sectionVariant = cva(`flex relative w-1/2 group rounded-r-lg border overflow-hidden  duration-300 ease-in-out`, {
  variants: {
    variant: {
      inactive: "border-transparent hover:bg-shark-800",
      active: "border-green-500 hover:bg-green-600" 
    }
  },
  defaultVariants: {
    variant: "inactive"
  }
})

const PROFILE_VISIBILITY_VARIANTS = [
  {
    title: "Приватный 😑",
    value: "friends",
    icon: LockKeyhole
  },
  {
    title: "Публичный 😝",
    value: "all",
    icon: LockOpen
  }
] as const;

export const ProfileVisibilityChange = reatomComponent(({ ctx }) => {
  const profile_visibility = getUser(ctx).preferences.profile_visibility

  const handleProfileVisibility = (value: "all" | "friends") => {
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
        {PROFILE_VISIBILITY_VARIANTS.map((variant) => (
          <div
            className={sectionVariant({ variant: profile_visibility === variant.value ? "active" : "inactive" })}
            onClick={() => handleProfileVisibility(variant.value)}
          >
            <variant.icon
              size={116}
              className="group-hover:opacity-100 duration-300 ease-in-out 
                text-shark-50 opacity-10 absolute -rotate-[15deg] -bottom-4 -right-4"
            />
            <div
              className="flex items-end justify-start relative 
                group-hover:opacity-100 p-2 duration-300 ease-in-out opacity-10"
            >
              <span className="text-xl group-hover:animate-pulse">
                {variant.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}, "ProfileVisibilityChange")