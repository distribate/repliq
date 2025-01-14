import dayjs from "@repo/lib/constants/dayjs-instance";

export const formatIssuedTime = (issuedDate: string | null) => {
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