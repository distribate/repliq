import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserInformation } from './get-user-information.ts';
import { DonateVariantsEnum, UserEntity } from '@repo/types/entities/entities-type.ts';
import { createQueryKey } from '#helpers/query-key-builder.ts';

export const CURRENT_USER_QUERY_KEY = createQueryKey("user", ["current"])

export type CurrentUser = Omit<
  UserEntity,
  'acceptrules'
> & {
  donate: DonateVariantsEnum;
  preferences: {
    cover_outline_visible: boolean,
    accept_friend_request: boolean,
    real_name_visible: boolean,
    game_stats_visible: boolean,
    profile_visibility: "all" | "friends" | "only"
  },
  cover_image: Pick<UserEntity, 'cover_image'>['cover_image'];
};

export const currentUserQuery = () => useSuspenseQuery<CurrentUser>({
  queryKey: CURRENT_USER_QUERY_KEY,
  queryFn: () => getUserInformation(),
  refetchOnMount: false
});