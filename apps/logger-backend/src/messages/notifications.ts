import { NotifyIssueReceived, NotifyLoginReceived, NotifyPaymentReceived, NotifyRegisterReceived } from "@repo/types/entities/notify-types";

const loginMessage = (payload: NotifyLoginReceived) => `Кто-то вошел в ваш аккаунт. ${payload.browser ? payload.browser.slice(0, 64) : "Unknown"} 
  / ${payload.ip ? payload.ip.slice(0, 64) : "Unknown"}`

const registerMessage = (payload: NotifyRegisterReceived) => `Добро пожаловать, ${payload.nickname}! Надеюсь тебе понравится на проекте 😏`

const issueMessage = (payload: NotifyIssueReceived) => {
  const slicedTitle = payload.title.length > 16
    ? payload.title.slice(0, 16) + "..."
    : payload.title;

  return `Ваша заявка ${slicedTitle} была создана`
}

const voteMessage = `Спасибо за голос! Награда отправлена 🤖`

const paymentMessage = (payload: NotifyPaymentReceived) => {
  let msg: string | null = null;

  if (payload.paymentType === 'donate') {
    msg = `привилегии ${payload.paymentValue}!`
  } else if (payload.paymentType === 'belkoin') {
    msg = `${payload.paymentValue} белкоинов!`
  } else if (payload.paymentType === 'charism') {
    msg = `${payload.paymentValue} харизмы!`
  }

  if (!msg) {
    return `Спасибо за покупку`
  };

  return `Спасибо за покупку ${msg}`;
}

export { loginMessage, registerMessage, issueMessage, voteMessage, paymentMessage }