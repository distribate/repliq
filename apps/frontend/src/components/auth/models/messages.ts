export const LOGIN_MESSAGES = {
  "Invalid password": "Неверный пароль",
  "Not found": "Пользователь не найден",
  "Success": "Входим в аккаунт..."
} as const;

export const REGISTER_MESSAGES = {
  "IP already exists": "Превышен лимит регистраций",
  "Nickname invalid": "Неверное имя пользователя.",
  "Unsafe password": "Ненадежный пароль",
  "User already exists": "Такой пользователь уже зарегистрирован",
  "Success": "Пользователь зарегистрирован",
  "Not found": "Пользователь не найден",
  "Error in creating user": "Ошибка при регистрации"
} as const;

export type StatusKeys = keyof typeof REGISTER_MESSAGES | keyof typeof LOGIN_MESSAGES

export const STATUS_TYPES: Record<StatusKeys, "positive" | "negative"> = {
  "User already exists": "negative",
  "Invalid password": "negative",
  "Success": "positive",
  "Not found": "negative",
  "Error in creating user": "negative",
  "Unsafe password": "negative",
  "Nickname invalid": "negative",
  "IP already exists": "negative"
}

export const NOT_ACCEPT_RULES_MESSAGE = "Вы должны согласиться с правилами, прежде чем авторизовываться"

export const NOT_TOKEN_MESSAGES = {
  title: "Проверка",
  description: "Пройдите проверку, чтобы продолжить"
}

export const SUCCESS_REGISTER_MESSAGES = {
  title: "Спасибо за регистрацию!",
  description: "Теперь вы можете войти в аккаунт."
}