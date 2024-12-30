import { format, spoiler } from "gramio"
import { convertDate } from "../utils/convert-date"
import { SendLogsAccountData } from "../utils/send-logs"

export const loginLogsMessage = ({
  logindate, nickname, uuid
}: SendLogsAccountData) => {
  return format`[Вход] ${nickname} зашел в игру в ${convertDate(logindate)}
    
  ${spoiler(uuid)}
`
}