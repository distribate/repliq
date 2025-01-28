import createSubscriber from "pg-listen"
import { notifyByAuthLoginDateChannel } from "../../lib/listeners/login-listener.ts"

const authPostgresConnectionString = process.env.AUTHORIZATION_POSTGRES_DB_URL as string;

export const authSubscriber = createSubscriber({
  connectionString: authPostgresConnectionString
})

authSubscriber.events.on("connected", () => {
  console.log(`\x1b[32m[Listener]\x1b[0m "auth_logindate_channel" started`)
})

authSubscriber.events.on("error", (e) => {
  console.error("\x1b[32m[Listener]\x1b[0m Fatal database (Auth) connection error: ", e)
  process.exit(1)
})

process.on("exit", () => {
  authSubscriber.close()
})

export async function pgListenConnect() {
  authSubscriber.connect()
  authSubscriber.listenTo("auth_logindate_channel")

  await notifyByAuthLoginDateChannel()

  console.log("\x1b[32m[Listener]\x1b[0m PG Listener connected")
}