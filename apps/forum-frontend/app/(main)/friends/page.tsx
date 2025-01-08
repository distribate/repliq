import { Separator } from "@repo/ui/src/components/separator.tsx";
import { FriendsTab } from "@repo/components/src/friends/components/control/components/friends-tab.tsx";
import { BlockWrapper } from "@repo/components/src/wrappers/block-wrapper.tsx";
import {
  FriendsAllCountIndicator,
  FriendsIncomingRequestsIndicator,
  FriendsOutgoingRequstsIndicator,
} from "@repo/components/src/friends/components/control/components/friends-indicators.tsx";
import { FriendsList } from "@repo/components/src/friends/components/lists/friends-list.tsx";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Друзья",
};

export default async function FriendsPage() {
  return (
    <div className="flex flex-col gap-2 items-start lg:flex-row w-full h-full relative">
      <BlockWrapper className="flex w-4/6 *:w-full !p-4 h-full">
        <FriendsList />
      </BlockWrapper>
      <div className="flex flex-col gap-4 w-2/6 sticky top-0 h-fit">
        <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
          <FriendsTab type="all" title="Мои друзья">
            <FriendsAllCountIndicator />
          </FriendsTab>
          <FriendsTab type="incoming" title="Входящие заявки">
            <FriendsIncomingRequestsIndicator />
          </FriendsTab>
          <FriendsTab type="outgoing" title="Исходящие заявки">
            <FriendsOutgoingRequstsIndicator />
          </FriendsTab>
          <Separator />
          <FriendsTab type="search" title="Поиск друзей" />
        </BlockWrapper>
        {/*<FriendsStatistics />*/}
      </div>
    </div >
  );
}