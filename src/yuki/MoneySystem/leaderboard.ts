import { Yuki, YukiBuilder } from "@pinkilo/yukibot"
import ENV from "../../env"
import { walletCache } from "./config"

export default async (
  y: YukiBuilder | Yuki,
  hydrate: boolean = false
): Promise<[string, number][]> => {
  const lb = walletCache
    .entries()
    .sort(([_, a], [__, b]) => b - a)
    .filter(([key]) => key !== ENV.SELF.ID)
  if (hydrate) {
    const users = await Promise.all(lb.map(([uid]) => y.getUser(uid)))
    return lb.map(([lbId, val]) => {
      return [users.find((u) => u?.id === lbId)?.name || "unknown", val]
    })
  }
  return lb
}
