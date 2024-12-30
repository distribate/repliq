import ky from "ky";

export const coinAPI = ky.extend({
  prefixUrl: "https://api.coingecko.com/api/v3/simple/"
})