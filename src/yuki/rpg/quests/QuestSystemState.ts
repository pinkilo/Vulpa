import Quest, { randomQuest } from "./Quest"
import { YukiBuilder } from "@pinkilo/yukibot"
import Env from "../../../env"
import { supercommand } from "../../commands"
import { transact } from "../../MoneySystem/TransactionBuilder"
import { randFromRange } from "../../../util"
import logger from "../../../logger"

export enum QuestStatus {
  DORMANT,
  ANNOUNCED,
  RUNNING,
  ENDING,
}

let _startProbability = 0
let _status: QuestStatus = QuestStatus.DORMANT
let _quest: Quest | undefined

export const questActive = () => _quest !== undefined

export const QuestCommand = (y: YukiBuilder) =>
  y.command((c) => {
    c.name = "quest"
    c.alias = ["join"]
    supercommand(
      c,
      async () => _quest?.cost ?? 0,
      async ({ authorDetails: { channelId, displayName } }, _, cost) => {
        if (_quest === undefined) return
        if (_quest.playerIDs.has(channelId)) return
        _quest.playerIDs.add(channelId)
        _status = await _quest.step(_status)
        await transact().withdraw(channelId, cost).execute()
        await y.sendMessage(_quest.joinMessage(displayName))
      }
    )
  })

export const QuestPassive = (y: YukiBuilder) =>
  y.passive(
    async (msg, { isCommand }) =>
      msg.authorDetails.channelId !== Env.SELF.ID && !isCommand,
    async () => {
      if (_status !== QuestStatus.DORMANT) {
        _status = await _quest.step(_status)
        // reset
        if (_status === QuestStatus.DORMANT) {
          logger.info("resetting quest state")
          _quest = undefined
          _startProbability = 0
        }
        return
      }
      _startProbability += randFromRange(0, 2, false) / 100
      if (Math.random() > _startProbability) return
      logger.info("starting quest")
      _quest = randomQuest()
      const { success } = await y.sendMessage(_quest.announceMessage())
      if (success) _status = QuestStatus.ANNOUNCED
      else _quest = undefined
    }
  )
