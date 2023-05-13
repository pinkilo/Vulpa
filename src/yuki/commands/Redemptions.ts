import { YukiBuilder } from "@pinkilo/yukibot"
import supercommand from "./supercommand"
import { enqueueNewAlert } from "../alerts"
import MoneySystem from "../MoneySystem"

export const FitCheck = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "fitcheck"
    c.alias = ["fit", "outfit"]
    c.rateLimit.global = 60 * 10
    supercommand(
      c,
      100,
      async ({ authorDetails }) =>
        await enqueueNewAlert(
          "Fit Check Redemption",
          authorDetails.displayName,
          authorDetails.channelId
        )
    )
  })

export const Hydrate = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "hydrate"
    c.alias = ["drink", "water", "drinkwater"]
    c.rateLimit.global = 60 * 5
    supercommand(c, 10, async ({ authorDetails }) => {
      return await enqueueNewAlert(
        "Hydrate!",
        authorDetails.displayName,
        authorDetails.channelId
      )
    })
  })

export const Pushups = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "pushups"
    c.alias = ["pushups"]
    c.rateLimit.global = 60 * 10
    c.rateLimit.individual = 60 * 60
    supercommand(
      c,
      async (_, tokens) => {
        const base = 10
        const baseCost = 100
        const count = parseInt(tokens.params[0]) || base
        const addedCost = Math.max(0, count - base) * baseCost * 0.5
        return baseCost + addedCost
      },
      async ({ authorDetails: { channelId, displayName } }, tokens, cost) => {
        const base = 10
        const count = parseInt(tokens.params[0]) || base
        await enqueueNewAlert(`Pushups: ${count}`, displayName, channelId)
        await y.sendMessage(
          `${displayName} redeemed ${count} pushups for ${cost} ${MoneySystem.name}s`
        )
      }
    )
  })
