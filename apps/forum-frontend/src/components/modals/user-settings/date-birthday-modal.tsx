import { Typography } from "@repo/ui/src/components/typography.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { UserSettingOption } from "#components/cards/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import Firework from "@repo/assets/images/minecraft/firework.webp";
import { DateBirthdayPicker } from "#components/cards/user-personal-card/components/profile-settings/components/birthday-picker/components/date-birthday-picker.tsx";
import { UPDATE_FIELD_MUTATION_KEY } from "@repo/lib/hooks/use-update-current-user.ts";
import { parseDateOrTimestamp } from "#components/cards/user-personal-card/components/profile-settings/components/birthday-picker/helpers/birthday-picker.ts";
import dayjs from "@repo/lib/constants/dayjs-instance";
import { DynamicModal } from "../dynamic-modal";

export const DateBirthdayModal = () => {
  const { birthday } = getUser();
  const initDate = parseDateOrTimestamp(birthday ?? null);

  return (
    <DynamicModal
      mutationKey={UPDATE_FIELD_MUTATION_KEY}
      trigger={
        <UserSettingOption title="День рождения" imageSrc={Firework}>
          <div className="flex items-center gap-1">
            <Typography className="text-base">
              {birthday ? dayjs(birthday).format("DD MMM YYYY") : `не указано`}
            </Typography>
          </div>
        </UserSettingOption>
      }
      content={<DateBirthdayPicker init={initDate as Date} />}
    />
  );
};