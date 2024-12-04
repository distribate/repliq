import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { UserPersonalCard } from "#cards/components/user-personal-card/user-personal-card.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";

export const UserSettingsModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <HoverCardItem>Настройки</HoverCardItem>
      </DialogTrigger>
      <DialogContent>
        <UserPersonalCard />
      </DialogContent>
    </Dialog>
  );
};
