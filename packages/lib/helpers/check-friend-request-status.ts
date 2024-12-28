import { requestsQuery } from "@repo/components/src/friends/queries/requests-query.ts";
import { friendsQuery } from "@repo/components/src/friends/queries/friends-query.ts";
import { getUser } from "#helpers/get-user.ts";

export type RequestStatus =
  | "reject"
  | "accept"
  | "deny"
  | "default"
  | "friend"
  | null;

export function checkFriendRequestStatus(
  reqUserNickname?: string,
): RequestStatus | null {
  const currentUser = getUser();
  if (!reqUserNickname) return null;

  const currentUserNickname = currentUser.nickname;

  const { data: requests } = requestsQuery(currentUserNickname);
  const { data: friends } = friendsQuery({ 
    nickname: currentUserNickname, 
    with_details: false
  });

  if (!requests) return "default";

  if (friends?.some((friend) => friend.nickname === reqUserNickname)) {
    return "friend";
  }

  const hasOutgoingRequest = requests.some(
    (req) =>
      req.initiator === currentUserNickname &&
      req.recipient === reqUserNickname,
  );

  if (hasOutgoingRequest) {
    return "deny";
  }

  const hasIncomingRequest = requests.some(
    (req) =>
      req.initiator === reqUserNickname &&
      req.recipient === currentUserNickname,
  );

  if (hasIncomingRequest) {
    return "accept";
  }

  return "default";
}
