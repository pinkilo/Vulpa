import { QuestStatus } from "./QuestSystemState"

type Quest = {
  readonly playerIDs: Set<string>
  readonly limits: [min: number, max?: number]
  /** entry cost */
  readonly cost: number
  joinMessage(name: string): string
  announceMessage(): string
  step(curStatus: QuestStatus): Promise<QuestStatus>
}

export const Heist: Quest = {
  playerIDs: new Set(),
  limits: [3],
  cost: 100,
  announceMessage: () => "A heist is starting! Join for the chance of a payout!",
  joinMessage: (name: string): string => `${name} joins the heist!`,
  async step() {
    return QuestStatus.ANNOUNCED
  },
}

export const randomQuest = () => Heist

export default Quest
