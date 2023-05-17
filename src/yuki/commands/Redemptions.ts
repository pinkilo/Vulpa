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
    const defaultCount = 10
    supercommand(
      c,
      async (_, tokens) => {
        const unitCost = 50
        const count = parseInt(tokens.params[0]) || defaultCount
        return count * unitCost
      },
      async ({ authorDetails: { channelId, displayName } }, tokens, cost) => {
        const count = parseInt(tokens.params[0]) || defaultCount
        await enqueueNewAlert(`Pushups: ${count}`, displayName, channelId)
        await y.sendMessage(
          `${displayName} redeemed ${count} pushups for ${cost} ${MoneySystem.name}s`
        )
      }
    )
  })
