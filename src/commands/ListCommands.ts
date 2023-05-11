import command from "./command"
import { YukiBuilder } from "@pinkilo/yukibot"

export default async (y: YukiBuilder) =>
  y.command(async (c) => {
    c.name = "commands"
    c.alias = ["cmds", "cmd"]
    c.rateLimit.global = 360
    command(
      c,
      0,
      async () =>
        await y.sendMessage(
          "Find a list of commands here https://tinyurl.com/mt8c5v47"
        )
    )
  })
