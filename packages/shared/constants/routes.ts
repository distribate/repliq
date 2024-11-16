if (!process.env.NEXT_PUBLIC_SKIN_PROXY_PORT) {
  throw new Error('NEXT_PUBLIC_SKIN_PROXY_PORT is not defined in .env');
}

export const SKIN_GET_SKIN = `http://localhost:${process.env.NEXT_PUBLIC_SKIN_PROXY_PORT}/get-skin/`
export const SKIN_GET_HEAD = `http://localhost:${process.env.NEXT_PUBLIC_SKIN_PROXY_PORT}/get-head/`
export const SKIN_DOWNLOAD_SKIN = `http://localhost:${process.env.NEXT_PUBLIC_SKIN_PROXY_PORT}/download-skin/`
export const REDIRECT_USER_NOT_EXIST = "/user-not-exist?redirect_nickname="
export const THREAD_URL = "/thread/"
export const USER_URL = "/user/"
export const CATEGORY_URL = "/category/"
export const AUTH_REDIRECT = "/auth?type=login"
export const BANNED_REDIRECT = "/banned"