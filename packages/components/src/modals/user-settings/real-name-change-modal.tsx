import { Typography } from "@repo/ui/src/components/typography.tsx";
import { RealNameChange } from "#cards/components/user-personal-card/components/profile-settings/components/real-name-change/components/real-name-change.tsx";
import { DynamicModal } from "../dynamic-modal.tsx";
import { UPDATE_FIELD_MUTATION_KEY } from "@repo/lib/hooks/use-update-current-user.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { UserSettingOption } from "#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import Nametag from "@repo/assets/images/minecraft/nametag.webp";

export const RealNameChangeModal = () => {
  const currentUser = getUser();
  if (!currentUser) return null;

  const realName = currentUser.real_name;

  return (
    <DynamicModal
      mutationKey={UPDATE_FIELD_MUTATION_KEY}
      trigger={
        <UserSettingOption title="Реальное имя" imageSrc={Nametag.src}>
          <div className="flex items-center gap-1">
            <Typography className="text-base">
              {realName ? realName : "не указано"}
            </Typography>
          </div>
        </UserSettingOption>
      }
      content={<RealNameChange />}
    />
  );
};
