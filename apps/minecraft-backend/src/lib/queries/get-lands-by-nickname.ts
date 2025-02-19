import { bisquiteDB } from "#shared/database/bisquite-db.ts";
import { sql, type RawBuilder } from "kysely";

function json<T>(value: T): RawBuilder<T> {
  return sql`CAST(${JSON.stringify(value)} AS JSONB)`
}

export async function getLandsByNickname(nickname: string) {
  const player = await bisquiteDB
    .selectFrom('lands_players')
    .select('uuid')
    .where('name', '=', nickname)
    .executeTakeFirst();

  if (!player) {
    return null;
  }

  const query = await bisquiteDB
    .selectFrom("lands_lands")
    .select([
      "area",
      "name",
      "members",
      "type",
      "created_at",
      "title",
      "ulid"
    ])
    .where("members", "like", `%${player.uuid}%`)
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