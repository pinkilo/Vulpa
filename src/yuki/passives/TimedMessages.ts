import { YukiBuilder } from "@pinkilo/yukibot"
import { MoneySystem } from "../index"
import Env from "../../env"

type TimedMessage = {
  readonly delay: number
  readonly message: string
  /** counts DOWN */
  counter: number
}

const tms: TimedMessage[] = [
  {
    delay: 45,
    counter: 45,
    message:
      "Join the NL Discord to chat and get updates about the stream " +
      "https://discord.gg/3dYzJXJStR",
  },
  {
    delay: 35,
    counter: 35,
    message: `Remember to use ">bank" to check your ${MoneySystem.name} wallet!`,
  },
  {
    delay: 55,
    counter: 55,
    message:
      "Like fish and aquariums? Like looking at my face? Well if you do, " +
      "make sure to check out my personal YouTube channel, Aquatic Mastery! " +
      "https://www.youtube.com/aquaticmaster",
  },
  {
    delay: 25,
    counter: 25,
    message: 'Use ">cmds" or ">commands" to get a list of all commands!',
  },
]

export default (y: YukiBuilder) =>
  y.memoryPassive<TimedMessage[]>(
    tms,
    async (_, __, self) => self.memory.some((tm) => tm.counter <= 0),
    async ({ authorDetails: { channelId } }, __, self) => {
      // add to delay after the bot has spoken
      // otherwise reduce counter
      const modifier = channelId === Env.SELF.ID ? 1 : -1
      for (let i = 0; i < self.memory.length; i++) self.memory[i].counter += modifier

      for (const tm of self.memory.filter((tm) => tm.counter <= 0)) {
        await y.sendMessage(tm.message)
        tm.counter = tm.delay
      }
    }
  )
