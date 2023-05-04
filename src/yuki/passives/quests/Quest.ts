import Passive from "../Passive"
import Env from "../../../env"
import { ChatMessage } from "../../../types/google"
import { TokenBin } from "../../processing"

export enum QuestState {
  DORMANT,
  ANNOUNCED,
  RUNNING,
  ENDING,
}

export default abstract class Quest extends Passive {
  private counter: number = 0
  readonly messageLimit: number
  readonly names: string[]
  readonly startProbability: number
  readonly playerLimit: number
  private playerIDs: Set<string> = new Set<string>()

  questState: QuestState = QuestState.DORMANT

  protected constructor(
    messageLimit: number,
    names: string[],
    startProbability: number,
    playerLimit: number,
    logic: (msg: ChatMessage, tokens: TokenBin, _this: Passive) => Promise<void>
  ) {
    super(async ({ authorDetails: { channelId } }) => {
      if (channelId !== Env.SELF.ID) this.counter++
      if (this.counter > this.messageLimit) {
        this.counter = 0
        return Math.random() < this.startProbability
      }
      return false
    }, logic)
    if (startProbability > 1 || startProbability <= 0)
      throw Error("invalid quest start probability")
    this.startProbability = startProbability
    this.names = names
    this.messageLimit = messageLimit
    this.playerLimit = playerLimit
  }

  /**
   * @returns {number} number of messages until
   */
  get limitRemaining() {
    return this.messageLimit - this.counter
  }

  join(playerID: string) {
    this.playerIDs.add(playerID)
  }
}
