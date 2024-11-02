import { FriendsRequestsType } from '#friends/queries/get-requests-by-type.ts';

export type FriendsRequestsProperties = {
  nickname: string | undefined;
  type: FriendsRequestsType
}