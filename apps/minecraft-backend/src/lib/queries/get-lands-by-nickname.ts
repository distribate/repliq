import { bisquiteDB } from "#shared/database/bisquite-db.ts";

export async function getLandsByNickname(nickname: string) {
  const query = await bisquiteDB
    .selectFrom("lands_players")
    .innerJoin("lands_lands", "lands_players.edit_land", "lands_lands.ulid")
    .select([
      "lands_lands.area",
      "lands_lands.name",
      "lands_lands.members",
      "lands_lands.type",
      "lands_lands.created_at",
      "lands_lands.title",
      "lands_lands.ulid"
    ])
    .where("lands_players.name", "=", nickname)
    .execute();

  const lands = await Promise.all(query.map(async (land) => {
    let rawMembers: { [key: string]: { chunks: number } } = JSON.parse(land.members);

    const members = await Promise.all(Object.keys(rawMembers).map(async (member) => {
      const { name: nickname } = await bisquiteDB
        .selectFrom("lands_players")
        .select("name")
        .where("uuid", "=", member)
        .executeTakeFirstOrThrow();

      return {
        uuid: member,
        nickname
      }
    }))

    return {
      ...land,
      area: JSON.parse(land.area),
      members
    }
  }))

  return lands;
}