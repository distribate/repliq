export const MAIN_DOMAIN = "fasberry.su"

export const MINECRAFT_SITE_DOMAIN = `https://mc.${MAIN_DOMAIN}`
export const FORUM_SITE_DOMAIN = `https://repliq.${MAIN_DOMAIN}`
export const STATUS_SITE_DOMAIN = `https://status.${MAIN_DOMAIN}`

export const originList = [
  FORUM_SITE_DOMAIN, 
  MINECRAFT_SITE_DOMAIN,
  "https://app.fasberry.su",
  "http://localhost:3000", // prod of forum-frontend
  "http://localhost:3008", // development of forum-frontend
]