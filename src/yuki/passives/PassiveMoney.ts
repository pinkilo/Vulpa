import { YukiBuilder } from "@pinkilo/yukibot"
import logger from "../../logger"
import MoneySystem from "../MoneySystem"

const moneyCooldown = 2
/** amount of money earned per cooldown */
const moneyEarnRate = 2

export default (y: YukiBuilder) =>
  y.memoryPassive<Map<string, number>>(
    new Map(),
    async (_, { isCommand }) => !isCommand,
    async ({ authorDetails: { channelId } }, _, { memory: cooldowns }) => {
      for (let uid of cooldowns.keys()) {
        if (uid !== channelId) cooldowns.set(uid, cooldowns.get(uid) - 1)
        if (cooldowns.get(uid) < 1) cooldowns.delete(uid)
      }
      if (!cooldowns.has(channelId)) {
        logger.debug(`adding passive money to ${channelId}`)
        await MoneySystem.transactionBatch([[channelId, moneyEarnRate]])
        cooldowns.set(channelId, moneyCooldown)
      }
    }
  )
