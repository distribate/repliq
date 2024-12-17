import { fasberryBot, loggerBot } from '#shared/bot';
import { startNATS } from '#shared/nats-client';
import { pgListenConnect } from '#shared/listener';

await fasberryBot.init().then(_ => console.log("\x1b[35mFasberry bot started\x1b[0m"))
await loggerBot.init().then(_ => console.log("\x1b[35mLogger bot started\x1b[0m"))

await pgListenConnect()

await startNATS()