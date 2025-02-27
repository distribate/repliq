import ky from "ky";

export const TESTNET_URL = "https://testnet-pay.crypt.bot/api/"
export const MAINNET_URL = "https://pay.crypt.bot/api/"

export const CRYPTO_PAY_API = ky.extend({
  prefixUrl: TESTNET_URL,
  headers: {
    "Crypto-Pay-API-Token": Bun.env.CRYPTO_PAY_TESTNET_TOKEN,
  }
})