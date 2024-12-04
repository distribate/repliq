import { useQuery } from "@tanstack/react-query";
import { DonateType, getUserDonate } from "./get-user-donate.ts";
import {
  FavoriteItem,
  getFavoriteItem,
} from "@repo/lib/queries/get-favorite-item.ts";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const DONATE_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["donate"], nickname);

export type DonateQueryType = {
  nickname: Pick<UserEntity, "nickname">["nickname"];
  existingDonate?: DonateType["primary_group"];
};

export type DonateQuery = {
  donate: DonateType["primary_group"];
  favoriteItemImage: FavoriteItem | null;
};

async function getDonate({
  nickname,
  existingDonate,
}: DonateQueryType): Promise<DonateQuery> {
  let donate: DonateType["primary_group"];

  if (!existingDonate) {
    donate = await getUserDonate(nickname);
  } else {
    donate = existingDonate;
  }

  const image = await getFavoriteItem({ type: "nickname", nickname });

  return { donate, favoriteItemImage: image };
}

export const donateQuery = ({ nickname, existingDonate }: DonateQueryType) =>
  useQuery({
    queryKey: DONATE_QUERY_KEY(nickname),
    queryFn: () => getDonate({ nickname, existingDonate }),
    refetchOnWindowFocus: false,
  });
