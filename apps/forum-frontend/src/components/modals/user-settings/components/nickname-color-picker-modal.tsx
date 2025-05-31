import { lazy, Suspense } from "react";
import { reatomComponent } from "@reatom/npm-react";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton";

const NicknameColorPicker = lazy(() =>
  import("#components/cards/user-personal-card/components/profile-settings/components/nickname-color/components/nickname-color-picker/nickname-color-picker.tsx")
    .then(m => ({ default: m.NicknameColorPicker }))
)

export const NicknameColorPickerModal = reatomComponent(({ ctx }) => {
  const { nickname, name_color } = getUser(ctx)

  return (
    <Suspense fallback={<Skeleton className="h-24 w-full" />}>
      <NicknameColorPicker nickname={nickname} name_color={name_color} />
    </Suspense>
  );
}, "NicknameColorPickerModal")