import { useSuspenseQuery } from "@tanstack/react-query";
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

export const SKIN_STATE_QUERY_KEY = (uuid: string) =>
  createQueryKey("ui", ["skin-state"], uuid);

const initial: Omit<SkinStateQuery, "skinUrl"> = {
  animation: "idle",
  rotate: false,
};

export const skinStateQuery = (uuid: string) => useSuspenseQuery({
  queryKey: SKIN_STATE_QUERY_KEY(uuid),
  queryFn: () => getSkinDetails(uuid),
  refetchOnWindowFocus: false
});

export const skinAnimationQuery = () => useSuspenseQuery<Omit<SkinStateQuery, "skinUrl">, Error>({
  queryKey: SKIN_ANIMATION_QUERY_KEY,
  initialData: initial,
  refetchOnWindowFocus: false
});