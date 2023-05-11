import logger, { format, transports } from "winston"
import { enqueueNewAlert, MoneySystem, setSocket } from "./yuki"
import ENV from "./env"
import "./testing"
import { yuki, YukiBuilder } from "@pinkilo/yukibot"
import { BeatAss, ListCommands } from "./commands"
import { WebSocketServer } from "ws"
import { file } from "./util"
import { Credentials } from "google-auth-library"

logger.configure({
  level: ENV.NODE_ENV === "test" ? "debug" : "info",
  transports: [new transports.Console()],
  format: format.combine(
    format.errors({ stack: true }),
    format.colorize({ all: true }),
    format.timestamp(),
    format.printf(
      (info) =>
        `[${info.timestamp}] YUKI ${info.level}: ${info.message} ${
          info.err || ""
        }`
    )
  ),
})

const TokenHandlers = (y: YukiBuilder) => {
  y.tokenLoader = async () => {
    logger.info("checking for saved tokens")
    if (file.exists(ENV.FILE.TOKENS)) {
      logger.debug("attempting to parse saved tokens")
      const raw = await file.read(ENV.FILE.TOKENS)
      let tokens: Credentials = JSON.parse(raw.toString())
      return tokens
    }
    logger.info("No saved tokens")
    return undefined
  }
  y.onAuthUpdate(async (tokens) => {
    await file.write(ENV.FILE.TOKENS, JSON.stringify(tokens))
  })
}

async function main() {
  logger.info(`Running in ${ENV.NODE_ENV}`)
  // load caches
  // await yt.users.userCache.load(ENV.FILE.CACHE.USER)
  await MoneySystem.walletCache.load(ENV.FILE.CACHE.BANK)

  const bot = await yuki((y) => {
    y.logLevel = "http"
    y.yukiConfig.name = "Yuki"
    y.yukiConfig.prefix = /^[>!].*$/
    y.googleConfig = {
      clientId: ENV.GOOGLE.G_CLIENT_ID,
      clientSecret: ENV.GOOGLE.G_CLIENT_SECRET,
      redirectUri: ENV.GOOGLE.G_REDIRECT_URI,
    }
    TokenHandlers(y)

    BeatAss(y)
    ListCommands(y)

    y.onSubscription(async (sub) => {
      await enqueueNewAlert(
        "New Subscriber!",
        sub.subscriberSnippet.title,
        sub.subscriberSnippet.channelId
      )
    })
  })
  bot.onAuthUpdate(() => bot.start())
  await bot.start()

  const svr = bot.express.listen(ENV.PORT, () =>
    logger.info(`http://localhost:${ENV.PORT}`)
  )
  setSocket(new WebSocketServer({ server: svr, path: "/fox" }))
}

main()
  .then()
  .catch((e) => logger.error("crashed", { e }))
