export type NotifyBase = {
  nickname: string
}

export type NotifyLoginReceived = NotifyBase & {
  ip: string | null,
  browser: string | null,
}

export type NotifyRegisterReceived = NotifyBase & {
  session_id: string
}

export type NotifyIssueReceived = NotifyBase & {
  title: string,
}

export type NotifyVoteReceived = NotifyBase

export type NotifyPaymentReceived = NotifyBase & {
  paymentType: string,
  paymentValue: string
}