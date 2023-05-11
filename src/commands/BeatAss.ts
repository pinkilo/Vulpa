import { YukiBuilder } from "@pinkilo/yukibot"
import { randomUser } from "../util/yukiExt"
import command from "./command"
import logger from "winston"
import MS from "../yuki/MoneySystem"

export default (y: YukiBuilder) =>
  y.command(async (c) => {
    c.name = "beatass"
    c.alias = ["pickfight"]
    c.rateLimit.individual = 60
    command(
      c,
      10,
      async ({ authorDetails: { displayName, channelId } }, _, cost) => {
        const rUser = randomUser(y, channelId)
        const { id: tid, name } = rUser
        logger.debug("running beatass", { target: name, displayName })
        const winsFight = Math.random() > 0.55
        const successPayout = cost * 2
        const defensePayout = cost
        const { success } = await y.sendMessage(
          winsFight
            ? `${displayName} beat ${name} 's ass (+${successPayout})`
            : `${displayName} tried to beat ${name} 's ass but failed and got 
          the shit smacked outta them (+${defensePayout} to the defender)`
        )
        if (!success) {
          logger.error("failed to send message")
          return
        }
        await MS.transactionBatch([
          [
            winsFight ? channelId : tid,
            winsFight ? successPayout : defensePayout,
          ],
        ])
      }
    )
  })
