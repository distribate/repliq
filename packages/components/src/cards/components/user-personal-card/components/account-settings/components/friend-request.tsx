import { useUpdateUserSettings } from '@repo/lib/hooks/use-update-user-settings.ts';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { Switch } from '@repo/ui/src/components/switch.tsx';

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
    <Switch
      checked={accept_friend_request}
      defaultChecked={accept_friend_request}
      onCheckedChange={v => handleToggleFriendRequest(v)}
    />
  );
};