import { QuestStatus } from "./QuestSystemState"

type Quest = {
  readonly playerIDs: Set<string>
  readonly limits: [min: number, max?: number]
  /** entry cost */
  readonly cost: number
  joinMessage(name: string): string
  step(): Promise<QuestStatus>
}

export const Heist: Quest = {
  playerIDs: new Set(),
  limits: [3],
  cost: 100,
  joinMessage: (name: string): string => `${name} joins the heist!`,
  async step() {
    return QuestStatus.ANNOUNCED
  },
}

export const randomQuest = () => Heist

export default Quest
