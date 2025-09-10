import type { StatsPayload } from "#publishers/pub-collect-stats.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { getNatsConnection } from "@repo/config-nats/nats-client"
import { COLLECT_STATS_SUBJECT } from "@repo/shared/constants/nats-subjects";
import { logger } from "@repo/shared/utils/logger.ts";
import { sql } from "kysely";

export const subscribeCollectStats = () => {
  const nc = getNatsConnection()

  return nc.subscribe(COLLECT_STATS_SUBJECT, {
    callback: async (err, msg) => {
      if (err) {
        logger.error(err.message)
        return
      }

      const payload: StatsPayload = JSON.parse(new TextDecoder().decode(msg.data))

      let isStatsUpdated = false;

      try {
        if (payload.initiator) {
          const s = await sql`
          INSERT INTO stats_guests (nickname)
          SELECT nickname FROM (VALUES (${sql.val(payload.initiator)})) AS v(nickname)
          WHERE NOT EXISTS (
            SELECT 1 FROM stats_guests
            WHERE nickname = ${sql.val(payload.initiator)} 
              AND created_at > NOW() - INTERVAL '24 hours'
          )
          RETURNING id;
        `.execute(forumDB);

          if (s.rows.length > 0) isStatsUpdated = true;
        } else if (payload.ip) {
          const s = await sql`
          INSERT INTO stats_visits (ip)
          SELECT ip FROM (VALUES (${sql.val(payload.ip)})) AS v(ip)
          WHERE NOT EXISTS (
            SELECT 1 FROM stats_visits
            WHERE ip = ${sql.val(payload.ip)} 
              AND created_at > NOW() - INTERVAL '24 hours'
          )
          RETURNING id;
        `.execute(forumDB);
          if (s.rows.length > 0) isStatsUpdated = true;
        }
      
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.message)
        }
      }
    }
  })
}