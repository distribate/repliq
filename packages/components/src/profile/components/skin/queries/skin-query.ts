import { useQuery } from "@tanstack/react-query";
import { getSkinDetails } from "@repo/lib/helpers/get-skin-details.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export type SkinAnimation = "idle" | "run" | "flying";

export type SkinStateQuery = {
  skinUrl: string | null;
} & Partial<{
  animation: SkinAnimation;
  rotate: boolean;
}>;

export const SKIN_ANIMATION_QUERY_KEY = createQueryKey("ui", [
  "skin-state",
  "animation",
]);
export const SKIN_STATE_QUERY_KEY = (nickname: string) =>
  createQueryKey("ui", ["skin-state"], nickname);

const initial: Omit<SkinStateQuery, "skinUrl"> = {
  animation: "idle",
  rotate: false,
};

const queryParams = {
  refetchOnWindowFocus: false,
  staleTime: Infinity,
  gcTime: Infinity,
};

export const useSkinStateQuery = (nickname: string) =>
  useQuery({
    queryKey: SKIN_STATE_QUERY_KEY(nickname),
    queryFn: () => getSkinDetails({ type: "skin", nickname }),
    enabled: !!nickname,
    ...queryParams,
  });

export const useSkinAnimationQuery = () =>
  useQuery<Omit<SkinStateQuery, "skinUrl">, Error>({
    queryKey: SKIN_ANIMATION_QUERY_KEY,
    initialData: initial,
    ...queryParams,
  });
