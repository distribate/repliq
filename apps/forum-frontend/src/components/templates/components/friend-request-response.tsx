import { Avatar } from "#components/user/avatar/components/avatar";
import { Typography } from "@repo/ui/src/components/typography.tsx";

type FriendRequestResponse = {
  payload: any;
};

export const FriendRequestResponseAccept = ({
  payload,
}: FriendRequestResponse) => {
  return (
    <div className="flex gap-1 items-center">
      <Avatar propHeight={20} propWidth={20} nickname={payload.new.user_2} />
      <Typography>принял вашу заявку в друзья</Typography>
    </div>
  );
};

export const FriendRequestResponseDefault = ({ payload }: FriendRequestResponse) => {
  return (
    <div className="flex gap-1 items-center">
      <Avatar nickname={payload.new.initiator} propHeight={20} propWidth={20} />
      <Typography className="text-base text-shark-50 font-medium">
        хочет добавить вас в друзья
      </Typography>
    </div>
  );
};