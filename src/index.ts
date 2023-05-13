import {
  Beans,
  BeatAss,
  enqueueNewAlert,
  FitCheck,
  Fox,
  Hydrate,
  ListCommands,
  MoneySystem,
  Pushups,
  setSocket,
  Socials,
  Wallet,
} from "./yuki"
import ENV from "./env"
import { yuki, YukiBuilder } from "@pinkilo/yukibot"
import { WebSocketServer } from "ws"
import { file } from "./util"
import { Credentials } from "google-auth-library"
import server from "./server"
import logger from "./logger"

main()
  .then()
  .catch((e) => logger.error("crashed", { e }))

async function main() {
  logger.info(`Running in ${ENV.NODE_ENV}`)
  // load caches
  // await yt.users.userCache.load(ENV.FILE.CACHE.USER)
  await MoneySystem.walletCache.load(ENV.FILE.CACHE.BANK)

  const bot = await yuki(async (y) => {
    y.yukiConfig.name = "Yuki"
    y.yukiConfig.prefix = /^[>!].*$/
    y.loggerOverride = logger
    y.googleConfig = {
      clientId: ENV.GOOGLE.G_CLIENT_ID,
      clientSecret: ENV.GOOGLE.G_CLIENT_SECRET,
      redirectUri: ENV.GOOGLE.G_REDIRECT_URI,
    }
    TokenHandlers(y)

    await Commands(y)

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

  const svr = server(bot.express).listen(ENV.PORT, () =>
    logger.info(`http://localhost:${ENV.PORT}`)
  )
  setSocket(new WebSocketServer({ server: svr, path: "/fox" }))
}

const TokenHandlers = (y: YukiBuilder) => {
  y.tokenLoader = async () => {
    logger.info("checking for saved tokens")
    if (file.exists(ENV.FILE.TOKENS)) {
      logger.info("attempting to parse saved tokens")
      const raw = await file.read(ENV.FILE.TOKENS)
      let tokens: Credentials = JSON.parse(raw.toString())
      return tokens
    }
    logger.info("no saved tokens")
    return undefined
  }
  y.onAuthUpdate(async (tokens) => {
    logger.info("writing tokens to file")
    await file.write(ENV.FILE.TOKENS, JSON.stringify(tokens))
  })
}

const Commands = async (y: YukiBuilder) =>
  Promise.all([
    BeatAss(y),
    ListCommands(y),
    Beans(y),
    Socials(y),
    Fox.Attack(y),
    Fox.Feed(y),
    Fox.Dance(y),
    FitCheck(y),
    Pushups(y),
    Hydrate(y),
    Wallet.Ranking(y),
    Wallet.View(y),
    Wallet.Leaderboard(y),
  ])
