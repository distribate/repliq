export const MAIN_DOMAIN = "fasberry.su"

export const LANDING_SITE_DOMAIN = MAIN_DOMAIN
export const MINECRAFT_SITE_DOMAIN = `https://mc.${MAIN_DOMAIN}`
export const FORUM_SITE_DOMAIN = `https://${MAIN_DOMAIN}`
export const MINECRAFT_MAP_SITE_DOMAIN = `https://map.${MAIN_DOMAIN}`
export const STATUS_SITE_DOMAIN = `https://status.${MAIN_DOMAIN}`

export const originList = [
  LANDING_SITE_DOMAIN,
  FORUM_SITE_DOMAIN, 
  MINECRAFT_SITE_DOMAIN,

  // local
  "http://localhost:3009", // development of landing-frontend
  "http://localhost:3001", // production of landing-frontend
  "http://localhost:3008", // development of forum-frontend
  "http://localhost:3000", // production of forum-frontend
]