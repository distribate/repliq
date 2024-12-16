import { Typography } from "@repo/ui/src/components/typography.tsx";
import React from "react";
import {
  UPDATE_FIELD_MUTATION_KEY,
} from "@repo/lib/hooks/use-update-current-user.ts";
import { VISIBILITY_FORMATS } from "../constants/visibility-formats.ts";
import { UserSettingOption } from "#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import Barrier from "@repo/assets/images/minecraft/barrier.webp";
import { DynamicModal } from "#modals/dynamic-modal.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { useUpdateUserSettings } from '@repo/lib/hooks/use-update-user-settings.ts';
import { ProfileVisibilityEnum } from '@repo/types/entities/entities-type.ts';

export const ProfileVisibilityChange = () => {
  const { preferences: { profile_visibility } } = currentUserQuery().data;
  const { updateUserSettingsMutation } = useUpdateUserSettings()
  
  const handleProfileVisibility = (value: ProfileVisibilityEnum) => {
    return updateUserSettingsMutation.mutate({
      setting: "profile_visibility", value
    })
  }
  
  return (
    <DynamicModal
      mutationKey={UPDATE_FIELD_MUTATION_KEY}
      trigger={
        <UserSettingOption title="Тип аккаунта:" imageSrc={Barrier.src}>
          <Typography className="text-base">
            {profile_visibility === "all" ? "открытый" : "закрытый"}
          </Typography>
        </UserSettingOption>
      }
      content={
        <div className="flex flex-col gap-y-4">
          <Typography className="text-shark-300 text-sm px-2 pt-2">
            Изменить тип профиля
          </Typography>
          <div className="flex flex-col gap-y-2">
            {VISIBILITY_FORMATS.map(({ value, title }) => (
              <HoverCardItem key={value} onClick={() => handleProfileVisibility(value)}>
                <Typography state={profile_visibility === value ? "active" : "default"}>
                  {title}
                </Typography>
              </HoverCardItem>
            ))}
          </div>
        </div>
      }
    />
  );
};
