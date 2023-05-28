import { YukiBuilder } from "@pinkilo/yukibot"
import { randomUser } from "../../util/yukiExt"
import supercommand from "./supercommand"
import logger from "../../logger"
import MS from "../MoneySystem"

export default (y: YukiBuilder) =>
  y.command(async (c) => {
    c.name = "beatass"
    c.alias = ["pickfight"]
    c.rateLimit.individual = 60
    supercommand(
      c,
      10,
      async ({ authorDetails: { displayName, channelId } }, _, cost) => {
        const randomTarget = randomUser(y, channelId)
        const { id: targetID, name: targetName } = randomTarget
        logger.debug("running beatass", { target: targetName, displayName })
        const initiatorWins = Math.random() > 0.55
        const successPayout = cost * 2
        const defensePayout = cost
        const { success } = await y.sendMessage(
          initiatorWins
            ? `${displayName} beat ${targetName} 's ass (+${successPayout})`
            : `${displayName} tried to beat ${targetName} 's ass but failed and got 
          the shit smacked outta them (+${defensePayout} to the defender)`
        )
        if (!success) {
          logger.error("failed to send message")
          return
        }
        await MS.transact()
          .withdraw(channelId, cost)
          .deposit(
            initiatorWins ? channelId : targetID,
            initiatorWins ? successPayout : defensePayout
          )
          .execute()
      }
    )
  })
