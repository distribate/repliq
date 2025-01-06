import { useQuery } from "@tanstack/react-query";
import { getUserStatus } from "./get-user-status";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import dayjs from "@repo/lib/constants/dayjs-instance";

export const USER_STATUS_QUERY_KEY = (nickname: string) => createQueryKey("user", ["game-status"], nickname);

const formatIssuedTime = (issuedDate: string | null) => {
  if (!issuedDate) return "Никогда не заходил";

  const now = dayjs();
  const issued = dayjs(issuedDate);

  const diffInDays = now.diff(issued, 'day');

  if (diffInDays === 0) {
    // today
    return `Оффлайн. Был в ${issued.format("HH:mm")}`;
  }

  if (diffInDays === 1) {
    // yesterday
    return `Оффлайн. Был вчера в ${issued.format("HH:mm")}`;
  }

  if (diffInDays < 30) {
    // less than 30 days
    return `Оффлайн. Был ${issued.format("D MMM")}`;
  }

  // more than 30 days
  return `Оффлайн. Был давно`;
};

export const userStatusQuery = (nickname: string, enabled: boolean) => useQuery({
  queryKey: USER_STATUS_QUERY_KEY(nickname),
  queryFn: async () => {
    const res = await getUserStatus(nickname)

    if (!res) return null;

    const issuedTime = formatIssuedTime(res?.issued_date ?? null)

    return { ...res, issued_date: issuedTime }
  },
  refetchOnWindowFocus: true,
  refetchInterval: 50000,
  enabled
});