import Command from "./Command"
import { addAlert } from "../Alerts"
import youtube from "../../youtube"
import MoneySystem from "../MoneySystem"

export const FitCheck = new Command(
  "fitcheck",
  [],
  100,
  60 * 10,
  60 * 5,
  async (msg, _, _this) => {
    addAlert({
      description: `Fit Check Redemption`,
      redeemer: {
        name: msg.authorDetails.displayName,
        id: msg.authorDetails.channelId,
      },
      durationSec: 10,
    })
  }
)

export const Hydrate = new Command(
  "hydrate",
  ["drink", "water", "drinkwater"],
  10,
  60 * 5,
  60 * 5,
  async (msg, _, _this) => {
    addAlert({
      description: `Hydrate!`,
      redeemer: {
        name: msg.authorDetails.displayName,
        id: msg.authorDetails.channelId,
      },
      durationSec: 10,
    })
  }
)

/**
 * @command pushups [int = 10]
 * @description redeem N number of pushups for baseCost + N * baseCost * 0.5
 */
export const Pushups = new Command(
  "pushups",
  ["pushup"],
  async (_, tokens) => {
    const base = 10
    const baseCost = 100
    const count = parseInt(tokens.params[0]) || base
    const addedCost = Math.max(0, count - base) * baseCost * 0.5
    return baseCost + addedCost
  },
  60 * 60,
  60 * 20,
  async ({ authorDetails: { channelId, displayName } }, tokens, cost) => {
    const base = 10
    const count = parseInt(tokens.params[0]) || base
    addAlert({
      description: `Pushups: ${count}`,
      redeemer: { name: displayName, id: channelId },
      durationSec: 10,
    })
    await youtube.chat.sendMessage(
      `${displayName} redeemed ${count} pushups for ${cost} ${MoneySystem.name}s`
    )
  }
)
