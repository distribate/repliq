import createSubscriber from "pg-listen"

const connectionString = process.env.AUTHORIZATION_POSTGRES_DB_URL
export const subscriber = createSubscriber({ connectionString })

subscriber.events.on("error", (error) => {
  console.error("Fatal database connection error:", error)
  process.exit(1)
})

process.on("exit", () => {
  subscriber.close()
})

export async function connect () {
  await subscriber.connect().then(res => console.log("Listener started"))
  await subscriber.listenTo("logindate_channel")
}