import { YukiBuilder } from "@pinkilo/yukibot"

export default (y: YukiBuilder) =>
  y.command(async (c) => {
    c.name = "commands"
    c.alias = ["cmds", "cmd"]
    c.rateLimit.global = 360
    c.invoke = async () =>
      await y.sendMessage("Find a list of _commands here https://tinyurl.com/mt8c5v47")
  })
