import { YukiBuilder } from "@pinkilo/yukibot"
import MS from "../MoneySystem"
import { enqueueNewAlert } from "../alerts"

export const View = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "wallet"
    c.alias = ["bank"]
    c.rateLimit.individual = 60 * 2
    c.invoke = async ({ authorDetails }) => {
      const wallet = MS.walletCache.get(authorDetails.channelId)
      let msg = `${authorDetails.displayName} has ${wallet} ${MS.name}s`
      await y.sendMessage(msg)
    }
  })

export const Ranking = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "rank"
    c.alias = ["wealthgap"]
    c.rateLimit.individual = 60 * 2
    c.invoke = async ({ authorDetails: { channelId, displayName } }, { command }) => {
      const wallet = MS.walletCache.get(channelId)
      const lb = await MS.getLeaderboard(y)
      const rank = lb.findIndex(([uid]) => uid === channelId)
      let msg =
        command == "rank"
          ? `#${rank + 1}: ${displayName} | ${wallet} ${MS.name}`
          : `${lb.length - rank - 1} citizen(s) are poorer than ${displayName}`
      await y.sendMessage(msg)
    }
  })

let leaderboardDisplayDuration: number = 60

export const popLeaderboardDisplayTimer = (): number => {
  const out = leaderboardDisplayDuration
  leaderboardDisplayDuration = 0
  return out
}

export const Leaderboard = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "leaderboard"
    c.alias = ["forbes"]
    c.rateLimit.global = 60 * 3
    c.invoke = async ({ authorDetails: { channelId, displayName } }) => {
      leaderboardDisplayDuration = 30
      await enqueueNewAlert("Leaderboard Display", displayName, channelId)
    }
  })
