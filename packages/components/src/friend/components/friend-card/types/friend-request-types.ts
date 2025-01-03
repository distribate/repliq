export type FriendRequestProperties = {
  recipient: string;
  initiator: string;
};

export type ControlFriendProperties = {
  requestedUserNickname: string;
  friend_id?: string;
};
