import { YukiBuilder } from "@pinkilo/yukibot"
import { QuestState } from "./Quest"
import Env from "../../../env"

type QuestStatus = {}

export default (y: YukiBuilder) =>
  y.memoryPassive<QuestStatus>(
    {},
    async (msg, { isCommand }) =>
      msg.authorDetails.channelId !== Env.SELF.ID && !isCommand,
    async () => {}
  )
