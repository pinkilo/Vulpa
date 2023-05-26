import { YukiBuilder } from "@pinkilo/yukibot"
import { randFromRange } from "./math"

export const randomUser = (y: YukiBuilder, ...exclude: string[]) => {
  const users = y.cachedUsers.filter((u) => !exclude.includes(u.id))
  return users[randFromRange(0, users.length)]
}
