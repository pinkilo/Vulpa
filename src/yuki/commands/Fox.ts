import { YukiBuilder } from "@pinkilo/yukibot"
import supercommand from "./supercommand"
import { setAnimation } from "../../server"
import { randFromRange } from "../../util"
import MoneySystem from "../MoneySystem"

export const Attack = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "attack"
    c.alias = ["fox.attack"]
    supercommand(c, 10, async ({ authorDetails }) => {
      setAnimation("attack", authorDetails.displayName)
    })
  })

export const Feed = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "feed"
    c.alias = ["fox.feed"]
    c.rateLimit.individual = 60 * 5
    supercommand(c, 5, async ({ authorDetails: { channelId } }, _, cost) => {
      setAnimation("eat")
      await MoneySystem.transactionBatch([
        [channelId, randFromRange(cost * 1.1, cost * 2)],
      ])
    })
  })

export const Dance = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "dance"
    c.alias = ["fox.dance"]
    c.rateLimit.individual = 60 * 5
    supercommand(c, 5, async ({ authorDetails: { channelId } }, _, cost) => {
      setAnimation("dance")
      await MoneySystem.transactionBatch([[channelId, randFromRange(cost, cost * 1.5)]])
    })
  })
