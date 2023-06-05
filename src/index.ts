import {
  Beans,
  BeatAss,
  enqueueNewAlert,
  FitCheck,
  Fox,
  Hydrate,
  ListCommands,
  MoneySystem,
  PassiveMoney,
  Pushups,
  QuestCommand,
  QuestPassive,
  Socials,
  TimedMessages,
  Wallet,
} from "./yuki"
import ENV from "./env"
import { yuki, YukiBuilder } from "@pinkilo/yukibot"
import { file } from "./util"
import { Credentials } from "google-auth-library"
import logger from "./logger"
import serverSetup from "./server/serverSetup"
import { FoxPassive } from "./yuki/passives"

main()
  .then()
  .catch((e) => logger.error("crashed", { e }))

async function main() {
  logger.info(`Running in ${ENV.NODE_ENV}`)
  // load caches
  await MoneySystem.walletCache.load(ENV.FILE.CACHE.BANK)

  const bot = await yuki(async (y) => {
    y.yukiConfig.name = "Vulpa"
    y.yukiConfig.prefix = /^[>!]/
    y.yukiConfig.test = ENV.DEV
    y.yukiConfig.subscriptionPollRate = 60 * 5
    y.yukiConfig.broadcastPollRate = 60 * 5
    y.loggerOverride = logger
    y.googleConfig = {
      clientId: ENV.GOOGLE.G_CLIENT_ID,
      clientSecret: ENV.GOOGLE.G_CLIENT_SECRET,
      redirectUri: ENV.GOOGLE.G_REDIRECT_URI,
    }
    y.userCacheLoader = async () => {
      if (!file.exists(ENV.FILE.CACHE.USER)) return
      const buffer = await file.read(ENV.FILE.CACHE.USER)
      return JSON.parse(buffer + "")
    }
    y.routes = { app: "/app", api: "/api" }

    TokenHandlers(y)
    Commands(y)
    Passives(y)

    y.onSubscription(async (sub) => {
      await enqueueNewAlert(
        "New Subscriber!",
        sub.subscriberSnippet.title,
        sub.subscriberSnippet.channelId
      )
    })
  })

  await serverSetup(bot.express, bot)
  bot.onAuthUpdate(() => bot.restart())
  await bot.start()
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

const Commands = (y: YukiBuilder) => {
  BeatAss(y)
  ListCommands(y)
  Beans(y)
  Socials(y)
  Fox.Attack(y)
  Fox.Feed(y)
  Fox.Dance(y)
  FitCheck(y)
  Pushups(y)
  Hydrate(y)
  Wallet.Ranking(y)
  Wallet.View(y)
  Wallet.Leaderboard(y)
  QuestCommand(y)
}

const Passives = (y: YukiBuilder) => {
  PassiveMoney(y)
  TimedMessages(y)
  FoxPassive.ImGood(y)
  FoxPassive.Greeting(y)
  QuestPassive(y)
}
