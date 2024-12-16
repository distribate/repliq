import { DropdownWrapper } from "#wrappers/dropdown-wrapper.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useUpdateUserSettings } from '@repo/lib/hooks/use-update-user-settings.ts';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { DropdownMenuItem } from '@repo/ui/src/components/dropdown-menu.tsx';

export const FriendRequest = () => {
  const { preferences: { accept_friend_request } } = currentUserQuery().data;
  const { updateUserSettingsMutation } = useUpdateUserSettings()

  const handleToggleFriendRequest = (value: boolean) => {
    if (value === accept_friend_request) return;
    
    return updateUserSettingsMutation.mutate({
      setting: "accept_friend_request", value
    })
  }
  
  return (
    <DropdownWrapper
      properties={{ contentAlign: "end", sideAlign: "right" }}
      trigger={
        <Typography className="text-base">
          {accept_friend_request ? "вкл" : "выкл"}
        </Typography>
      }
      content={
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-start w-full flex-col pt-2 px-2">
            <Typography className="text-shark-300 text-sm">
              Заявки в друзья
            </Typography>
          </div>
          <div className="flex flex-col gap-y-2">
            <DropdownMenuItem onClick={() => handleToggleFriendRequest(true)}>
              <Typography
                state={accept_friend_request ? "active" : "default"}
              >
                включить
              </Typography>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleFriendRequest(false)}>
              <Typography
                state={!accept_friend_request ? "active" : "default"}
              >
                выключить
              </Typography>
            </DropdownMenuItem>
          </div>
        </div>
      }
    />
  );
};
