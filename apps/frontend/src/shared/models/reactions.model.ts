import * as z from "zod";
import { createReactionSchema } from "@repo/types/schemas/reaction/create-reaction";

export type UserReactions = {
  reactions: string[]
}

export type TargetReactions = {
  reactions: Record<string, number>
}

export type UpdateReaction = Omit<z.infer<typeof createReactionSchema>, "type">;

export type TargetReactionsState = {
  byUser: UserReactions
  byTarget: TargetReactions
};

export type ReactionsDiff = {
  add?: string | string[];
  remove?: string | string[];
};

function toArray(x?: string | string[]): string[] {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}

export function applyDiff(
  state: TargetReactionsState | null,
  { add, remove }: ReactionsDiff
): TargetReactionsState {
  const prevUserReactions = state?.byUser.reactions ?? [];
  const prevReactions = state?.byTarget.reactions ?? {};

  const userSet = new Set<string>(prevUserReactions);

  const removes = toArray(remove);
  const adds = toArray(add);

  for (const r of removes) {
    userSet.delete(r);
  }

  for (const a of adds) {
    userSet.add(a);
  }

  const newUserReactions = Array.from(userSet);

  let newReactions: Record<string, number> = prevReactions;

  const keysToChange = Array.from(new Set([...removes, ...adds]));

  if (keysToChange.length > 0) {
    newReactions = { ...prevReactions };

    for (const emoji of removes) {
      const current = Number(newReactions[emoji] ?? 0);

      if (current <= 1) {
        delete newReactions[emoji];
      } else {
        newReactions[emoji] = current - 1;
      }
    }

    for (const emoji of adds) {
      const prev = Number(newReactions[emoji] ?? 0);
      newReactions[emoji] = prev + 1;
    }
  }

  return {
    byUser: { reactions: newUserReactions },
    byTarget: { reactions: newReactions }
  };
}
