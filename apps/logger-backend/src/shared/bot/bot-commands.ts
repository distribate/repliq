import { TelegramBotCommand } from "gramio";

export const botCommands: TelegramBotCommand[] = [
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
  }
]