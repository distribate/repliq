import { QueryKey, useQuery } from '@tanstack/react-query';
import { getSkinDetails } from '@repo/lib/helpers/get-skin-details.ts';

export type SkinAnimation = 'idle' | 'run' | 'flying'

export type SkinStateQuery = {
  skinUrl: string | null
} & Partial<{
  animation: SkinAnimation,
  rotate: boolean
}>

export const SKIN_ANIMATION_QUERY_KEY: QueryKey = [ 'ui', 'skin-state' ];
export const SKIN_STATE_QUERY_KEY = (nickname?: string): QueryKey =>
  [ 'ui', 'skin-state', nickname ];

const initial: Omit<SkinStateQuery, 'skinUrl'> = {
  animation: 'idle',
  rotate: false,
};

const queryParams = {
  refetchOnWindowFocus: false,
  staleTime: Infinity,
  gcTime: Infinity,
};

export const useSkinStateQuery = (nickname: string) => {
  return useQuery({
    queryKey: SKIN_STATE_QUERY_KEY(nickname),
    queryFn: async() => {
      const skinUrl = await getSkinDetails({ type: 'skin', nickname });
      return skinUrl ?? null;
    },
    enabled: !!nickname,
    ...queryParams,
  });
};

export const useSkinAnimationQuery = () => {
  return useQuery<Omit<SkinStateQuery, 'skinUrl'>, Error>({
    queryKey: SKIN_ANIMATION_QUERY_KEY,
    initialData: initial,
    ...queryParams,
  });
};