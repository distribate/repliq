import { Issues } from "@repo/types/db/forum-database-types"
import { loggerBot } from "../shared/bot/bot"
import { Selectable } from "kysely"
import { getAdmins } from "../lib/queries/get-admins"
import { format } from "gramio"

export const notifyIssueReceived = async (issue: Selectable<Issues>) => {
  const admins = await getAdmins()

  const message = format`
  ${issue.title}
  Описание: ${issue.description}
  Создана: ${issue.created_at}
  Создал: ${issue.user_nickname}
  Тип: ${issue.type}
`

  for (const { telegram_id } of admins) {
    if (!telegram_id) continue

    await loggerBot.api.sendMessage({
      chat_id: telegram_id,
      text: message
    })
  }
}