import { User } from "@pinkilo/yukibot"
import { AsyncCache } from "../Cache"
import { randFromRange } from "../util"

const userCache = new AsyncCache<User>(async (k) => (await fetchUsers([k]))[0])

const getRandomUser = (exclude: string[] = []): User => {
  const users = userCache.values().filter((u) => !exclude.includes(u.id))
  return users[randFromRange(0, users.length)]
}

const fetchUsers = async (_: string[]): Promise<User[]> => {
  // const result = await ytApi.channels.list({
  //   id: uid,
  //   part: ["snippet"],
  //   auth,
  // })
  return undefined
}

export { userCache, getRandomUser, fetchUsers }
