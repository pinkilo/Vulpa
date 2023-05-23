import { YukiBuilder } from "@pinkilo/yukibot"
import supercommand from "./supercommand"
import { enqueueNewAlert } from "../alerts"
import MoneySystem from "../MoneySystem"
import MS from "../MoneySystem"

export const FitCheck = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "fitcheck"
    c.alias = ["fit", "outfit"]
    c.rateLimit.global = 60 * 10
    supercommand(c, 100, ({ authorDetails: { channelId, displayName } }) =>
      enqueueNewAlert("Fit Check!", displayName, channelId)
    )
  })

export const Hydrate = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "hydrate"
    c.alias = ["drink", "water"]
    c.rateLimit.global = 60 * 5
    supercommand(c, 10, ({ authorDetails: { channelId, displayName } }) =>
      enqueueNewAlert("Hydrate!", displayName, channelId)
    )
  })

export const Pushups = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "pushups"
    c.alias = ["pushup"]
    c.rateLimit.global = 60 * 10
    c.rateLimit.individual = 60 * 60
    const defaultCount = 10
    supercommand(
      c,
      async (_, { params: [p1] }) => {
        const unitCost = 50
        const count = parseInt(p1) || defaultCount
        return count * unitCost
      },
      async ({ authorDetails: { channelId, displayName } }, tokens, cost) => {
        const count = parseInt(tokens.params[0]) || defaultCount
        await MS.transactionBatch([[channelId, cost]])
        await enqueueNewAlert(`Pushups: ${count}`, displayName, channelId)
        await y.sendMessage(
          `${displayName} redeemed ${count} pushups for ${cost} ${MoneySystem.name}s`
        )
      }
    )
  })
