import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/ru';

dayjs.extend(relativeTime);
dayjs.extend(localeData);
dayjs.locale('ru');

export default dayjs;