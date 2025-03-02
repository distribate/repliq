import { authClient } from "@repo/shared/api/auth-client";
import { UAParser } from 'ua-parser-js';

type LoginToForum = {
  nickname: string;
  password: string;
  token: string;
}

export async function loginForum({
  nickname, password, token
}: LoginToForum) {
  const userAgent = navigator.userAgent;
  const { browser, cpu, device, os } = UAParser(userAgent);

  const info = {
    browser: browser.name ?? "Unknown",
    ua: userAgent,
    ip: null,
    cpu: cpu.architecture ?? "Unknown",
    os: os.name ?? "Unknown",
    device: device ? JSON.stringify(device) : "Unknown",
    isBot: false,
  }

  const res = await authClient.login.$post({
    json: {
      nickname, password, ...info, token
    }
  });

  const data = await res.json();

  if (!data) {
    return null;
  }

  return data;
}