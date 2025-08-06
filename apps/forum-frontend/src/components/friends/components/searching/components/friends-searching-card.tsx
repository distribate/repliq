import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserNickname } from "#components/user/name/nickname";
import { Button } from "@repo/ui/src/components/button.tsx";
import { UserEntity } from "@repo/types/entities/entities-type";
import { CustomLink } from "#components/shared/link";
import { createIdLink } from "@repo/lib/utils/create-link";
import { navigate } from "vike/client/router";

export type FriendsSearchingCardProps = Pick<UserEntity, "nickname"> & (
  { type: "byLands"; land: string, friend?: never } |
  { type: "byFriends"; friend: string, land?: never } |
  { type: "default"; friend?: never, land?: never }
);

export const FriendsSearchingCard = ({
  nickname, type, land, friend
}: FriendsSearchingCardProps) => {
  const linkToUser = createIdLink("user", nickname)

  return (
    <div className="flex flex-col group gap-2 justify-between items-center lg:h-[280px] friend-card">
      <CustomLink to={linkToUser}>
        <Avatar url={null} nickname={nickname} propWidth={128} propHeight={128} />
      </CustomLink>
      <div className="flex flex-col items-start gap-1 w-full justify-start">
        <CustomLink to={linkToUser}>
          <UserNickname nickname={nickname} />
        </CustomLink>
      </div>
      <div className="flex flex-col items-center gap-2 *:w-full w-full">
        <Button
          variant="positive"
          onClick={() => navigate(linkToUser)}
        >
          <Typography textSize="medium">
            К профилю
          </Typography>
        </Button>
        {(type === 'byLands' || type === 'byFriends') && (
          <div className="flex items-center rounded-md justify-start p-2 bg-shark-800">
            {type === 'byLands' ? (
              `Из региона ${land}`
            ) : (
              <div className="flex items-center gap-2 ">
                <Typography textSize="medium">
                  Общий друг с
                </Typography>
                <div className="flex items-center gap-1">
                  <CustomLink to={createIdLink("user", friend)}>
                      <Avatar url={null} nickname={friend} propWidth={20} propHeight={20} />
                  </CustomLink>
                  <CustomLink to={createIdLink("user", friend)}>
                    <Typography textSize="medium">
                      {friend}
                    </Typography>
                  </CustomLink>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};