import { bisquiteDB } from "#shared/database/bisquite-db.ts";

type LandMember = {
  [key: string]: {
    chunks: number
  }
}

export async function getLandsByNickname(nickname: string) {
  const player = await bisquiteDB
    .selectFrom("lands_players")
    .select("uuid")
    .where("name", "=", nickname)
    .executeTakeFirst()

  if (!player) return null;

  const lands = await bisquiteDB
    .selectFrom("lands_lands")
    .select(["area", "name", "members", "type", "created_at", "title", "ulid", "balance"])
    .where(
      "members",
      "like",
      `%${player.uuid}%`
    )
    .execute();

  if (!lands.length) return null;

  const allMemberUUIDs = new Set<string>();

  const parsedLands = lands.map((land) => {
    const members: LandMember = JSON.parse(land.members);

    Object.keys(members).forEach((uuid) => allMemberUUIDs.add(uuid));

    return { ...land, area: JSON.parse(land.area), members };
  });

  const membersList = await bisquiteDB
    .selectFrom("lands_players")
    .select(["uuid", "name"])
    .where("uuid", "in", Array.from(allMemberUUIDs))
    .execute();

  const nicknameMap = new Map(
    membersList.map(({ uuid, name }) => [uuid, name])
  );

  return parsedLands.map((land) => ({
    ...land,
    members: Object.entries(land.members).map(([uuid, data]) => ({
      uuid,
      nickname: nicknameMap.get(uuid) || "Unknown",
      chunks: data.chunks,
    })),
  }));
}