import { Typography } from "@repo/ui/src/components/typography.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import Firework from "@repo/assets/images/minecraft/firework.webp";
import { DateBirthdayPicker } from "#components/cards/user-personal-card/components/profile-settings/components/birthday-picker/components/date-birthday-picker.tsx";
import { parseDateOrTimestamp } from "#components/cards/user-personal-card/components/profile-settings/components/birthday-picker/helpers/birthday-picker.ts";
import dayjs from "@repo/lib/constants/dayjs-instance";
import { DynamicModal } from "../../dynamic-modal/components/dynamic-modal";
import { UserSettingOption } from "#components/cards/user-setting-option-card/components/user-setting-option";
import { reatomComponent } from "@reatom/npm-react";
import { updateCurrentUserAction } from "#components/cards/user-personal-card/components/profile-settings/models/update-current-user.model";

export const DateBirthdayModal = reatomComponent(({ ctx }) => {
  const birthday = getUser(ctx).birthday;
  const initDate = parseDateOrTimestamp(birthday ?? null) as string | null;

  return (
    <DynamicModal
      withLoader
      autoClose
      isPending={ctx.spy(updateCurrentUserAction.statusesAtom).isPending}
      trigger={
        <UserSettingOption title="День рождения" imageSrc={Firework}>
          <div className="flex items-center gap-1">
            <Typography className="text-base">
              {birthday ? dayjs(birthday).format("DD MMM YYYY") : `не указано`}
            </Typography>
          </div>
        </UserSettingOption>
      }
      content={<DateBirthdayPicker init={initDate ?? null} />}
    />
  );
}, "DateBirthdayModal")