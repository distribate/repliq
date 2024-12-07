import { fasberryBot, loggerBot } from '#shared/bot';
import { startNATS } from '#shared/nats-client';
import { connect } from '#shared/listener';

// initializing tg bots
await fasberryBot.init().then(_ => console.log("Fasberry bot started"))
await loggerBot.init().then(_ => console.log("Logger bot started"))

// initializing pg listener
await connect().then(_ => console.log("PG listener started"));

// initializing nats client
await startNATS().catch((err) => console.error(err))