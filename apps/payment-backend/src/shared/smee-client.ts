import SmeeClient from "smee-client"

const smee = new SmeeClient({
  source: 'https://smee.io/S4R9o1fGbFibRnP',
  target: 'http://localhost:3700/api/hooks/check-order',
  logger: console
})

const events = smee.start()

events.close()