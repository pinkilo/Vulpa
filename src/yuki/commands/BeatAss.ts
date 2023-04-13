import yt from "../../youtube"
import Command from "./Command"
import logger from "winston"
import { getRandomUser } from "../../youtube/chat"

/**
 * Randomly selects another chat member to "fight"
 * Rolls odds (for now 50:50)
 * Announces winner in chat
 *
 * TODO Additional text version
 */
export default new Command(
  "beatass", ["pickfight"], 10, 180, 0,
  async ({ authorDetails: { displayName, channelId } }, _, _this) => {
    const rUser = getRandomUser([channelId])
    // TODO Temporary bandaid for randUser sometimes returning undefined
    if (!rUser) {
      logger.error("random user was undefined")
      return undefined
    }
    const { id: tid, name } = rUser
    logger.debug("running beatass", { target: name, displayName })
    const succeeds = Math.random() > 0.55
    const successPayout = _this.cost * 2
    const defensePayout = _this.cost
    const failed = await yt.chat.sendMessage(
      succeeds
        ? `${ displayName } beat ${ name } 's ass (+${ successPayout })`
        : `${ displayName } tried to beat ${ name } 's ass but failed and got 
          the shit smacked outta them (+${ defensePayout } to the defender)`,
    )
    if (failed) {
      logger.error("failed to send message")
      return undefined
    }
    return {
      uids: [succeeds ? channelId : tid],
      amount: succeeds ? successPayout : defensePayout,
    }
  },
)
