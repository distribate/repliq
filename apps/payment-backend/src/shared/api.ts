import ky from 'ky';

const ARC_PAY_API_KEY = process.env.ARC_PAY_API_KEY;
const ARC_PAY_API_URL = process.env.ARC_PAY_API_URL;

export const ARC_API = ky.extend({
  prefixUrl: ARC_PAY_API_URL,
  headers: {
    'ArcKey': ARC_PAY_API_KEY,
  },
});