import { format, spoiler } from "gramio"
import { SendLogsAccountData } from "../utils/send-logs"
import dayjs from 'dayjs';

export const loginLogsMessage = ({
  logindate, nickname, uuid
}: SendLogsAccountData) => {
  const date = dayjs(logindate).format('HH:mm:ss YYYY-MM-DD')

  return format`[Вход] ${nickname} зашел в игру в ${date}
    
  ${spoiler(uuid)}
`
}