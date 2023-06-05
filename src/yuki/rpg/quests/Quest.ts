import { QuestStatus } from "./QuestSystemState"
import { transact } from "../../MoneySystem/TransactionBuilder"
import MS from "../../MoneySystem"

type Quest = {
  readonly playerIDs: Set<string>
  readonly limits: [min: number, max?: number]
  /** entry cost */
  readonly cost: number
  readonly start: Date
  readonly lifespan: number
  joinMessage(name: string): string
  announceMessage(): string
  step(curStatus: QuestStatus): Promise<[QuestStatus, string | undefined]>
}

/** return type formatter */
const _ = (qs: QuestStatus, msg?: string): [QuestStatus, string | undefined] => [qs, msg]

export const Heist = (): Quest & { [k: symbol]: any } => ({
  playerIDs: new Set(),
  limits: [1, 10],
  cost: 100,
  start: new Date(),
  lifespan: 1000 * 60 * 5,
  announceMessage: () => "A heist is starting! >join for the chance of a payout!",
  joinMessage: (name: string): string => `${name} joins the heist!`,
  async step(curStatus: QuestStatus) {
    switch (curStatus) {
      case QuestStatus.ANNOUNCED:
        return this.playerIDs.size >= this.limits[0]
          ? _(QuestStatus.RUNNING)
          : _(curStatus)
      case QuestStatus.RUNNING:
        if (Date.now() > this.start.getTime() + this.lifespan)
          return _(QuestStatus.ENDING, "Times Up. The heist beings.")
        else if (this.playerIDs.size === this.limits[1])
          return _(QuestStatus.ENDING, "That's it, any more and the heist will go loud.")
        else return _(curStatus)
      case QuestStatus.ENDING:
        const transaction = transact()
        this.playerIDs.forEach((uid: string) => transaction.deposit(uid, this.cost * 2))
        await transaction.execute()
        return _(
          QuestStatus.DORMANT,
          `That's it folks -- what a score! You'll get your paydays, 
          how's ${this.cost * 2} ${MS.name} sound?`
        )
      case QuestStatus.DORMANT:
      default:
        return _(curStatus)
    }
  },
})

export const randomQuest = () => Heist()

export default Quest
