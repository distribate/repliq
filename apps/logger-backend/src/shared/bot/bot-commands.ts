import { TelegramBotCommand } from "gramio";

export const repliqBotCmds: TelegramBotCommand[] = [
  {
    command: "/connect",
    description: "Привязать аккаунт"
  },
]

export const loggerBotCmds: TelegramBotCommand[] = [
  {
    command: "/keyboard",
    description: "Open the keyboard"
  },
  { 
    command: "/broadcast",
    description: "Push a broadcast"
  },
  { 
    command: "/weather",
    description: "Set weather"
  },
  {
    command: "/give",
    description: "Give entity or permission for player"
  },
  {
    command: "/stats",
    description: "Get minecraft server stats"
  },
  {
    command: "/check",
    description: "Check player online status"
  },
  {
    command: "/notify",
    description: "Alert for all online users on forum"
  }
]