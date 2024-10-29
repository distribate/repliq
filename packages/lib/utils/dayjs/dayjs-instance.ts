import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localeData from 'dayjs/plugin/localeData';
import duration from "dayjs/plugin/duration"
import 'dayjs/locale/ru';

dayjs.extend(relativeTime);
dayjs.extend(localeData);
dayjs.extend(duration)
dayjs.locale('ru');

export default dayjs;