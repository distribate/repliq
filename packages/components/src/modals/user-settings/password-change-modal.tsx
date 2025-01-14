import { UserSettingOption } from "#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import GoldIngot from "@repo/assets/images/minecraft/gold_ingot.webp";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { Typography } from "@repo/ui/src/components/typography";

export const PasswordChangeModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <UserSettingOption title="Пароль" imageSrc={GoldIngot.src} />
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-y-4 w-full">
          <Typography>
            Смена пароля
          </Typography>
          <div className="flex flex-col gap-y-2 w-full">
            <Typography textSize="small" textColor="shark_white">
              Для того чтобы сменить пароль, в игре введите команду:
            </Typography>
            <Typography>
              <code>/changepassword [старый пароль] [новый пароль]</code>
            </Typography>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
