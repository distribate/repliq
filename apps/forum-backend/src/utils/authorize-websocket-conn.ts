import { getWebsocketToken } from "#lib/queries/ws/get-websocket-token.ts";

export async function authorizeWebsocketConn(token: string, nickname: string) {
  const storedToken = await getWebsocketToken(nickname)

  if (storedToken.token !== token) {
    return false;
  }

  return true
}