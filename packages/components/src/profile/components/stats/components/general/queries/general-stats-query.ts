import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { StatsRequest } from '../../../types/stats-types.ts';
import { getMainUserState } from './get-user-cmi-stats.ts';

export const GENERAL_STATS_QUERY_KEY = (nickname: string) => {
  return [ 'user', 'general-stats', nickname ];
};

export const generalStatsQuery = ({
  nickname, uuid,
}: StatsRequest) => {
  return useQuery({
    queryKey: GENERAL_STATS_QUERY_KEY(nickname),
    queryFn: async() => getMainUserState({ nickname, uuid }),
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    retry: 1,
  });
};