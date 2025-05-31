import { getUser } from "@repo/lib/helpers/get-user.ts";
import { parseDateOrTimestamp } from "#components/cards/user-personal-card/components/profile-settings/components/birthday-picker/helpers/birthday-picker.ts";
import { reatomComponent } from "@reatom/npm-react";
import { lazy, Suspense } from "react";

const DateBirthdayPicker = lazy(() => 
  import("#components/cards/user-personal-card/components/profile-settings/components/birthday-picker/components/date-birthday-picker.tsx")
.then(m => ({ default: m.DateBirthdayPicker })))

export const DateBirthdayModal = reatomComponent(({ ctx }) => {
  const birthday = getUser(ctx).birthday;
  const initDate = parseDateOrTimestamp(birthday ?? null) as string | null;

  return (
    <Suspense>
      <DateBirthdayPicker init={initDate ?? null} />
    </Suspense>
  );
}, "DateBirthdayModal")