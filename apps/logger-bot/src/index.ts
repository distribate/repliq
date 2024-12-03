import { Bot, CallbackData, InlineKeyboard } from 'gramio';

const bot = new Bot(process.env.FASBERRY_SOCIAL_TOKEN as string)

bot
.hears("aboba", async (c) => {
  await c.send("сам абоба")
})
.hears(/привет (.*)/i, async (c) => {
  if (c.args) {
    await c.send(`привет ${c.args[1]}`)
  }
})

const buttonData = new CallbackData("action").number("action_id");

bot
.command("start", (context) =>
  context.send("Choose an action:", {
    reply_markup: new InlineKeyboard().text(
      "Do Action 1",
      buttonData.pack({ action_id: 1 })
    ),
  })
)
.callbackQuery(buttonData, (context) => {
  context.send(`You selected action with ID: ${context.queryData.action_id}`);
});

bot.onStart(({ info }) => {
  console.log(`✨ Bot ${info.username} was started!`);
});

bot.start();