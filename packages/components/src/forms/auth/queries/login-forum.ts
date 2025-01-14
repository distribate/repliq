import { authClient } from "@repo/shared/api/auth-client";
import { UAParser } from 'ua-parser-js';

type LoginToForum = {
  nickname: string;
  password: string;
}

export async function loginForum({ nickname, password }: LoginToForum) {
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
      details: { nickname, password, },
      info
    }
  });

  const data = await res.json();

  if (!data) {
    return null;
  }

  return data;
}