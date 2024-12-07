import dayjs from 'dayjs';

export const convertDate = (timestamp: number | string)  => dayjs(timestamp).format('HH:mm:ss YYYY-MM-DD');
