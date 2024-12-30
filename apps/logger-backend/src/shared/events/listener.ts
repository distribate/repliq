import createSubscriber from "pg-listen"
import { notifyByLuckpermsPrimaryGroupChannel } from "../../lib/listeners/luckperms-primary-group-listener.ts"
import { notifyByAuthLoginDateChannel } from "../../lib/listeners/login-listener.ts"

const luckpermsPostgreConnectionString = process.env.LUCKPERMS_POSTGRES_DB_URL as string;
const authPostgresConnectionString = process.env.AUTHORIZATION_POSTGRES_DB_URL as string;

export const authSubscriber = createSubscriber({
  connectionString: authPostgresConnectionString
})

export const luckpermsSubscriber = createSubscriber({
  connectionString: luckpermsPostgreConnectionString
})

luckpermsSubscriber.events.on("connected", () => {
  console.log(`\x1b[32m[Listener]\x1b[0m "luckperms_primary_group_channel" started`)
})

authSubscriber.events.on("connected", () => {
  console.log(`\x1b[32m[Listener]\x1b[0m "auth_logindate_channel" started`)
})

luckpermsSubscriber.events.on("error", (e) => {
  console.error("\x1b[32m[Listener]\x1b[0m Fatal database (Luckperms) connection error: ", e)
  process.exit(1)
})

authSubscriber.events.on("error", (e) => {
  console.error("\x1b[32m[Listener]\x1b[0m Fatal database (Auth) connection error: ", e)
  process.exit(1)
})

process.on("exit", () => {
  authSubscriber.close()
  luckpermsSubscriber.close()
})

export async function pgListenConnect() {
  await Promise.all([
    authSubscriber.connect(),
    luckpermsSubscriber.connect()
  ])

  await Promise.all([
    luckpermsSubscriber.listenTo("luckperms_primary_group_channel"),
    authSubscriber.listenTo("auth_logindate_channel")
  ])
  
  await notifyByLuckpermsPrimaryGroupChannel();
  await notifyByAuthLoginDateChannel()
}