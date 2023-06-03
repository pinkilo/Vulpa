import { randFromRange } from "../../../util"

export enum QuestState {
  DORMANT,
  ANNOUNCED,
  RUNNING,
  ENDING,
}

export default abstract class Quest {
  protected static readonly cooldown: number = 50
  protected static cooldownAt: number = Quest.cooldown

  protected playerIDs: Set<string> = new Set<string>()
  protected _questState: QuestState = QuestState.DORMANT

  abstract readonly names: string[]
  abstract readonly limits: { max: number; min: number }
  abstract readonly announcements: string[]
  abstract readonly startProbability: number

  async announce(sender: (msg: string) => Promise<unknown>): Promise<void> {
    await sender(
      this.announcements[randFromRange(0, this.announcements.length)] + ` (">join")`
    )
    this._questState = QuestState.ANNOUNCED
  }

  join(playerID: string) {
    this.playerIDs.add(playerID)
  }
}
