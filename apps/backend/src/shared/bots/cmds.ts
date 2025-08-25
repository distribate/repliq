import type { TelegramBotCommand } from "gramio";

export const repliqBotCmds: TelegramBotCommand[] = [
  { command: "/connect", description: "Привязать аккаунт" },
]

export const loggerBotCmds: TelegramBotCommand[] = [
  { command: "/keyboard", description: "Open the keyboard" },
  { command: "/broadcast", description: "Push a broadcast" },
  { command: "/notify", description: "Alert for all online users on forum" }
]