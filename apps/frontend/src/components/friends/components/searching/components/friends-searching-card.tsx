import { Avatar } from "#components/user/components/avatar/components/avatar";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserNickname } from "#components/user/components/name/nickname";
import { Button } from "@repo/ui/src/components/button.tsx";
import { CustomLink } from "#shared/components/link";
import { createIdLink } from "#lib/create-link";
import { navigate } from "vike/client/router";
import { AtomState } from "@reatom/core";
import { recommendedFriendsAction } from "#components/friends/models/recommended-friends.model";

export type FriendsSearchingCardProps = NonNullable<AtomState<typeof recommendedFriendsAction.dataAtom>>[number]

export const FriendsSearchingCard = ({
  nickname, avatar, name_color, details
}: FriendsSearchingCardProps) => {
  const linkToUser = createIdLink("user", nickname)

  const from = details && details.fromFriend

  return (
    <div className="flex flex-col group gap-2 justify-between items-center p-3 bg-shark-900/40 rounded-lg">
      <CustomLink
        to={linkToUser}
        className="flex aspect-square 
          h-16 min-h-16 max-h-16
          md:h-24 md:min-h-24 md:max-h-24"
      >
        <Avatar
          url={avatar}
          nickname={nickname}
          propWidth={128}
          propHeight={128}
          className="aspect-square 
            h-16 min-h-16 max-h-16
            md:h-24 md:min-h-24 md:max-h-24"
        />
      </CustomLink>
      <div className="flex flex-col items-center gap-1 w-full justify-start">
        <CustomLink to={linkToUser}>
          <UserNickname nickname={nickname} nicknameColor={name_color} />
        </CustomLink>
      </div>
      <div className="flex flex-col items-center gap-2 *:w-full w-full">
        <Button
          className="h-10"
          variant="positive"
          onClick={() => navigate(linkToUser)}
        >
          <Typography textSize="medium">
            К профилю
          </Typography>
        </Button>
        {from && (
          <div className="flex items-center gap-2 ">
            <Typography textSize="medium">
              Общий друг с
            </Typography>
            <div className="flex items-center gap-1">
              <CustomLink to={createIdLink("user", from.nickname)}>
                <Avatar
                  url={from.avatar}
                  nickname={from.nickname}
                  propWidth={20}
                  propHeight={20}
                />
              </CustomLink>
              <CustomLink to={createIdLink("user", from.nickname)}>
                <Typography textSize="medium">
                  {from.nickname}
                </Typography>
              </CustomLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};