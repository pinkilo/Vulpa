import { YukiBuilder } from "@pinkilo/yukibot"
import { setAnimation } from "../../server"
import { randFromRange } from "../../util"

// TODO add more greetings
const placeholder = "_NAME_"
const greetings: string[] = [
  `Hello ${placeholder}!`,
  `Welcome ${placeholder}!`,
  `How are you doing, ${placeholder}?`,
]

const randomGreeting = (name: string) =>
  greetings[randFromRange(0, greetings.length)].replace(placeholder, name)

export const Greeting = (y: YukiBuilder) =>
  y.memoryPassive<Set<string>>(
    new Set(),
    async ({ authorDetails: { channelId } }, { isCommand }, { memory }) => {
      return !isCommand && !memory.has(channelId)
    },
    async ({ authorDetails: { channelId, displayName } }, _, self) => {
      setAnimation("greet", randomGreeting(displayName))
      self.memory.add(channelId)
    }
  )

/* -------- -------- -------- -------- -------- -------- -------- -------- */

// TODO add more Im Good responses
const goodCooldown = 5
const imGoodResponses = ["HI YES I IS GOOD!"]

export const ImGood = (y: YukiBuilder) =>
  y.memoryPassive<number>(
    0,
    async (_, { isCommand, msg }) => !isCommand && msg.toLowerCase().includes("good"),
    async (_, __, self) => {
      if (self.memory > 0) {
        self.memory--
        return
      }
      setAnimation("greet", imGoodResponses[randFromRange(0, imGoodResponses.length)])
      self.memory = goodCooldown
    }
  )
