import { Typography } from "@repo/ui/src/components/typography.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { UserSettingOption } from "#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import Firework from "@repo/assets/images/minecraft/firework.webp";
import { DateBirthdayPicker } from "#cards/components/user-personal-card/components/profile-settings/components/birthday-picker/components/date-birthday-picker.tsx";
import { DynamicModal } from "#modals/dynamic-modal.tsx";
import { UPDATE_FIELD_MUTATION_KEY } from "@repo/lib/hooks/use-update-current-user.ts";
import { parseDateOrTimestamp } from "#cards/components/user-personal-card/components/profile-settings/components/birthday-picker/helpers/birthday-picker.ts";

export const DateBirthdayModal = () => {
  const currentUser = getUser();
  const birthday = currentUser?.birthday;
  const initDate = parseDateOrTimestamp(birthday ?? null);

  return (
    <DynamicModal
      mutationKey={UPDATE_FIELD_MUTATION_KEY}
      trigger={
        <UserSettingOption title="День рождения" imageSrc={Firework.src}>
          <div className="flex items-center gap-1">
            <Typography className="text-base">
              {birthday ? birthday.toString() : `не указано`}
            </Typography>
          </div>
        </UserSettingOption>
      }
      content={<DateBirthdayPicker init={initDate as Date} />}
    />
  );
};
