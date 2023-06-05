import { Heist } from "../../../yuki/rpg/quests/Quest"
import TransactionBuilder from "../../../yuki/MoneySystem/TransactionBuilder"
import { QuestStatus } from "../../../yuki/rpg/quests/QuestSystemState"

jest.useFakeTimers()
let qm: typeof import("../../../yuki/rpg/quests/QuestSystemState")
let heist = Heist()
let stepSpy
let depositSpy: jest.SpyInstance
let withdrawSpy: jest.SpyInstance
let executeSpy: jest.SpyInstance

beforeEach(async () => {
  qm = await import("../../../yuki/rpg/quests/QuestSystemState")
  jest.resetModules()
  depositSpy = jest
    .spyOn(TransactionBuilder.prototype, "deposit")
    .mockImplementation(() => new TransactionBuilder())
  withdrawSpy = jest
    .spyOn(TransactionBuilder.prototype, "withdraw")
    .mockImplementation(() => new TransactionBuilder())
  executeSpy = jest.spyOn(TransactionBuilder.prototype, "execute").mockImplementation()
  heist = Heist()
  stepSpy = jest.spyOn(heist, "step")
})

it("should not start without minimum players", async () => {
  const [newStatus] = await heist.step(QuestStatus.ANNOUNCED)
  expect(newStatus).toBe(QuestStatus.ANNOUNCED)
})

describe("with players", () => {
  beforeEach(() => {
    for (let i = 0; i < heist.limits[0]; i++) {
      heist.playerIDs.add(String(i))
    }
  })
  it("should start when minimum player count reached", async () => {
    const [newStatus] = await heist.step(QuestStatus.ANNOUNCED)
    expect(newStatus).toBe(QuestStatus.RUNNING)
  })
  it("should end after lifespan", async () => {
    const [runStatus] = await heist.step(QuestStatus.ANNOUNCED)
    jest.setSystemTime(heist.start.getTime() + heist.lifespan + 100000)
    const [newStatus] = await heist.step(runStatus)
    expect(newStatus).toBe(QuestStatus.ENDING)
  })
  it("should end after maximum players", async () => {
    const [runStatus] = await heist.step(QuestStatus.ANNOUNCED)
    for (let i = 20; heist.playerIDs.size < heist.limits[1]; i++)
      heist.playerIDs.add(String(i))
    const [newStatus] = await heist.step(runStatus)
    expect(newStatus).toBe(QuestStatus.ENDING)
  })
  it("should payout to each player", async () => {
    await heist.step(QuestStatus.ENDING)
    heist.playerIDs.forEach((uid) => {
      expect(depositSpy).toHaveBeenCalledWith(uid, expect.any(Number))
    })
    expect(executeSpy).toHaveBeenCalled()
  })
  it("should return dormant after ending", async () => {
    const [newStatus] = await heist.step(QuestStatus.ENDING)
    expect(newStatus).toBe(QuestStatus.DORMANT)
  })
})
