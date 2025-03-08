import dayjs from "@repo/lib/constants/dayjs-instance";

export const formatIssuedTime = (issuedDate: string | null) => {
  if (!issuedDate) return "Никогда не заходил";

  const issued = dayjs(issuedDate);

  const diffInDays = dayjs().diff(issued, 'day');

  if (diffInDays === 0) {
    // today
    return issued.format("Оффлайн. Был в HH:mm");
  }

  if (diffInDays === 1) {
    // yesterday
    return issued.format("Оффлайн. Был вчера в HH:mm");
  }

  if (diffInDays < 120) {
    // less than 30 days
    return issued.format("Оффлайн. Был D MMM в HH:mm");
  }

  // more than 120 days
  return `Оффлайн. Был давно`;
};