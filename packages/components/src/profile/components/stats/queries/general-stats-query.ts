import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getMainUserState } from './get-user-cmi-stats.ts';
import { StatsRequest } from '#profile/components/stats/types/stats-types.ts';

export const GENERAL_STATS_QUERY_KEY = (nickname: string) =>
  [ 'user', 'general-stats', nickname ];

export const generalStatsQuery = ({
  nickname, uuid,
}: StatsRequest) => {
  return useQuery({
    queryKey: GENERAL_STATS_QUERY_KEY(nickname),
    queryFn: () => getMainUserState({ nickname, uuid }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!nickname,
    placeholderData: keepPreviousData,
    retry: 1,
  });
};