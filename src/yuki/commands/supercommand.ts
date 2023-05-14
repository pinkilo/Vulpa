import { Command, CommandBuilder, TokenBin } from "@pinkilo/yukibot"
import { ChatMessage } from "../../types/google"
import { youtube_v3 } from "googleapis"
import MS from "../MoneySystem"
import logger from "winston"
import Schema$LiveChatMessage = youtube_v3.Schema$LiveChatMessage

export default (
  builder: CommandBuilder,
  cost: number | ((msg: ChatMessage, tokens: TokenBin, self: Command) => Promise<number>),
  invoke: (
    msg: Schema$LiveChatMessage,
    tokens: TokenBin,
    cost: number,
    _this: Command
  ) => Promise<unknown>
) => {
  builder.invoke = async (msg, tokens, self) => {
    // generate cost
    const computedCost = typeof cost === "function" ? await cost(msg, tokens, self) : cost
    // check affordability
    if (
      computedCost > 0 &&
      MS.walletCache.get(msg.authorDetails.channelId) < computedCost
    ) {
      logger.debug(
        `${builder.name} failed cost check for ${msg.authorDetails.displayName}`
      )
      return
    }
    await invoke(msg, tokens, computedCost, self)
  }
}
