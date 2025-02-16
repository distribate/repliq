import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  UPDATE_FIELD_MUTATION_KEY,
} from "@repo/lib/hooks/use-update-current-user.ts";
import { UserSettingOption } from "#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import Barrier from "@repo/assets/images/minecraft/barrier.webp";
import { DynamicModal } from "#modals/dynamic-modal.tsx";
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { useUpdateUserSettings } from '@repo/lib/hooks/use-update-user-settings.ts';
import { ProfileVisibilityEnum } from '@repo/types/entities/entities-type.ts';
import { LockKeyhole, LockOpen } from "lucide-react";

export const ProfileVisibilityChange = () => {
  const { preferences: { profile_visibility } } = currentUserQuery().data;
  const { updateUserSettingsMutation } = useUpdateUserSettings()

  const handleProfileVisibility = (value: ProfileVisibilityEnum) => updateUserSettingsMutation.mutate({
    setting: "profile_visibility", value
  })

  return (
    <DynamicModal
      mutationKey={UPDATE_FIELD_MUTATION_KEY}
      trigger={
        <UserSettingOption title="Тип аккаунта:" imageSrc={Barrier}>
          <Typography className="text-base">
            {profile_visibility === "all" ? "открытый" : "закрытый"}
          </Typography>
        </UserSettingOption>
      }
      content={
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
      }
    />
  );
};
