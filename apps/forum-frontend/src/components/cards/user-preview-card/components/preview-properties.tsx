import { Ellipsis } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DropdownWrapper } from "#components/wrappers/components/dropdown-wrapper.tsx";
import { UserCardProps } from "./user-preview-card.tsx";
import { UserCardModal } from "#components/modals/custom/components/user-card-modal.tsx";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { ReportCreateModal } from "#components/modals/action-confirmation/components/report/components/report-create-modal.tsx";
import { Link } from "@tanstack/react-router";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";

export const UserPreviewCardProperties = ({
  nickname,
}: Pick<UserCardProps, "nickname">) => {
  return (
    <DropdownWrapper
      properties={{ sideAlign: "bottom", contentAlign: "end" }}
      trigger={<Ellipsis size={16} className="text-shark-300" />}
      content={
        <div className="flex flex-col gap-y-1 w-full *:w-full items-center">
          <UserCardModal nickname={nickname} />
          <Link to={USER_URL + nickname}>
            <DropdownMenuItem>
              <Typography>Перейти к профилю</Typography>
            </DropdownMenuItem>
          </Link>
          <Separator />
          <ReportCreateModal reportType="account" targetNickname={nickname} />
        </div>
      }
    />
  );
};
