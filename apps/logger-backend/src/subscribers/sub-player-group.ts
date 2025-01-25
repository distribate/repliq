import { getNatsConnection } from '@repo/config-nats/nats-client';
import { DonateVariants } from '@repo/types/db/forum-database-types';
import { lpDB } from '../shared/database/lp-db';
import { updateUserDonateForum } from '../lib/queries/update-user-donate-forum';
import { permissionCheck } from '../utils/permission-check';
import { createUserAction } from '../lib/queries/create-user-action';

type LuckpermsUpdateContent = {
  userUuid: string
}

export type LuckpermsLogContent = {
  timestamp: number,
  source: {
    uniqueId: string,
    name: string
  },
  target: {
    type: "USER" | "GROUP",
    uniqueId: string,
    name: string
  },
  description: string
}

type LuckpermsUpdatePayload = {
  id: string,
} & (
    | { type: "userupdate", content: LuckpermsUpdateContent }
    | { type: "log", content: LuckpermsLogContent }
  )

export const LUCKPERMS_UPDATE_SUBJECT = "luckperms:update"

export const subscribePlayerGroup = () => {
  const nc = getNatsConnection()

  return nc.subscribe(LUCKPERMS_UPDATE_SUBJECT, {
    callback: async (e, msg) => {
      if (e) {
        console.error(e)
        return;
      }

      setImmediate(async () => {
        try {
          const raw = new TextDecoder().decode(msg.data);

          const data = raw
            .replace(/^[\x00-\x1F\x7F]+/, "")
            .trim()
            .replace(/^[^\{]+/, "");

          if (!data.startsWith("{")) {
            throw new Error("Некорректный JSON: отсутствует '{' в начале строки");
          }

          const { type, content } = JSON.parse(data) as LuckpermsUpdatePayload;

          if (type === "log" && content.description.includes("group.")) {
            const args = content.description.split(" ");
            // set permission -> permission set group.arkhont true -> ["permission", "set", "group.arkhont", "true"]
            // unset permission -> permission unset group.arkhont -> ["permission", "unset", "group.arkhont"]

            const actionType = args[1] as "set" | "unset"

            console.log(args, actionType)

            switch (actionType) {
              case "set":
                const group = args[2]?.split(" ")[0];
                const { result } = await permissionCheck(content.target.uniqueId, group);

                if (result.includes("true")) {
                  await updateUserDonateForum({
                    nickname: content.target.name,
                    donate: group.split(".")[1] as DonateVariants,
                  });
                }
                break;
              case "unset":
                let currentPermission: DonateVariants = "default"; // default -> player

                const query = await lpDB
                  .selectFrom("luckperms_user_permissions")
                  .select(["permission"])
                  .where("uuid", "=", content.target.uniqueId)
                  .where("permission", "like", "group.%")
                  .execute()

                if (query) {
                  query.forEach(({ permission }) => {
                    const group = permission.split(" ")[0];

                    currentPermission = group.split(".")[1] as DonateVariants;
                  })
                }

                await updateUserDonateForum({
                  nickname: content.target.name,
                  donate: currentPermission,
                });
            }

            await createUserAction(content);
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  })
}