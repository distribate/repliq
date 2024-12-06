import ky from 'ky';

const ARC_PAY_API_KEY = process.env.ARC_PAY_API_KEY;
const ARC_PAY_API_URL = process.env.ARC_PAY_API_URL;
const MINECRAFT_API_URL = process.env.MINECRAFT_SERVER_API_URL;
const MINECRAFT_API_USER = process.env.MINECRAFT_SERVER_API_USERNAME;
const MINECRAFT_API_PASSWORD = process.env.MINECRAFT_SERVER_API_PASSWORD;

const credentials = btoa(`${MINECRAFT_API_USER}:${MINECRAFT_API_PASSWORD}`);

export const ARC_API = ky.extend({
  prefixUrl: ARC_PAY_API_URL,
  headers: {
    'ArcKey': ARC_PAY_API_KEY,
  },
});

export const SERVER_API = ky.extend({
  prefixUrl: MINECRAFT_API_URL,
  headers: {
    'Authorization': `Basic ${credentials}`,
    'X-Anti-CSRF': '1',
  },
});