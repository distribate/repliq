export type DB = {
  users: {
    nickname: string,
    real_name: string | null,
    uuid: string
  },
  info_findout: {
    user_nickname: string,
    findout: string
  }
}