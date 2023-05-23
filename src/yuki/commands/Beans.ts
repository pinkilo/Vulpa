import { YukiBuilder } from "@pinkilo/yukibot"
import command from "./supercommand"
import { randFromRange } from "../../util"

export default (y: YukiBuilder) =>
  y.command(async (c) => {
    c.name = "beans"
    c.alias = ["🫘", "bean"]
    c.rateLimit.individual = 120
    command(c, 0, async (_, { command }) => {
      let msg: string
      switch (command as "bean" | "🫘" | "beans") {
        case "bean":
          msg = "🫘"
          break
        case "beans":
          msg = "🫘".repeat(randFromRange(2, 10))
          break
        case "🫘":
          msg = "bean!"
          break
      }
      await y.sendMessage(msg)
    })
  })
