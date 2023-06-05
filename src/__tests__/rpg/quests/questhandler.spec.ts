import { TestYuki, testYuki } from "@pinkilo/yukibot"
import Quest from "../../../yuki/rpg/quests/Quest"
import MoneySystem from "../../../yuki/MoneySystem"
import { QuestStatus } from "../../../yuki/rpg/quests/QuestSystemState"

jest.mock("../../../util/math", () => ({
  __esModule: true,
  ...jest.requireActual("../../../util/math"),
  randFromRange: jest.fn(() => 100),
}))
jest.mock("../../../yuki/rpg/quests/Quest", () => ({
  __esModule: true,
  ...jest.requireActual("../../../yuki/rpg/quests/Quest"),
  randomQuest: jest.fn(() => quest),
}))
jest.mock("../../../yuki/MoneySystem/TransactionBuilder", () => ({
  __esModule: true,
  transact: jest.fn(() => transaction),
  default: jest.fn(() => transaction),
}))

let transaction
let quest: Quest
let sendSpy: jest.SpyInstance
let yuki: TestYuki
let qm: typeof import("../../../yuki/rpg/quests/QuestSystemState")

beforeEach(async () => {
  quest = {
    playerIDs: new Set(),
    joinMessage: jest.fn(() => "join"),
    cost: 1,
    step: jest.fn(async (s) => [s + 1, "message"] as [QuestStatus, string]),
    limits: [1, 2],
    announceMessage: jest.fn(() => "announce"),
    lifespan: 0,
    start: new Date(),
  }
  qm = await import("../../../yuki/rpg/quests/QuestSystemState")
})

afterEach(() => {
  jest.resetModules()
})

describe("Quest Passive", () => {
  beforeEach(async () => {
    yuki = await testYuki((y) => {
      qm.QuestPassive(y)
      sendSpy = jest.spyOn(y, "sendMessage")
    })
  })

  it("should activate a quest on non-command messages", async () => {
    await yuki.feedMessage("_")
    expect(qm.questActive()).toBe(true)
  })
  it("should not activate quest on command", async () => {
    await yuki.feedMessage(">c")
    expect(qm.questActive()).toBe(false)
  })
  it("should send announce message when quest activates", async () => {
    await yuki.feedMessage("_")
    expect(quest.announceMessage).toHaveBeenCalled()
    expect(sendSpy).toHaveBeenCalledWith("announce")
  })
  it("should step quest on each message after activation", async () => {
    await yuki.feedMessage(`-1`)
    expect(quest.step).toHaveBeenCalledTimes(0)

    for (let i = qm.QuestStatus.ANNOUNCED.valueOf(); i == qm.QuestStatus.ENDING; i++) {
      await yuki.feedMessage(`${i}`)
      expect(quest.step).toHaveBeenCalledWith(i)
    }
  })
  it("should send message returned from step", async () => {
    await yuki.feedMessage("_")
    await yuki.feedMessage("_")
    expect(sendSpy).toHaveBeenCalledWith("message")
  })
})

describe("Quest Command", () => {
  const command = ">quest"

  beforeEach(async () => {
    transaction = {
      withdraw: jest.fn(() => transaction),
      deposit: jest.fn(() => transaction),
      execute: jest.fn(),
    }
    yuki = await testYuki((y) => {
      qm.QuestCommand(y)
      sendSpy = jest.spyOn(y, "sendMessage")
    })
  })

  describe("Quest Inactive", () => {
    it("should not send message", async () => {
      await yuki.feedMessage(command)
      expect(sendSpy).toHaveBeenCalledTimes(0)
    })
    it("should not add user to quest", async () => {
      await yuki.feedMessage(command)
      expect(quest.playerIDs.size).toEqual(0)
    })
    it("should not step quest", async () => {
      await yuki.feedMessage(command)
      expect(quest.step).toHaveBeenCalledTimes(0)
    })
    it("should not withdraw cost", async () => {
      await yuki.feedMessage(command)
      expect(transaction.withdraw).toHaveBeenCalledTimes(0)
      expect(transaction.execute).toHaveBeenCalledTimes(0)
    })
  })

  describe("Quest Active", () => {
    beforeEach(async () => {
      yuki = await testYuki((y) => {
        qm.QuestPassive(y)
        qm.QuestCommand(y)
        sendSpy = jest.spyOn(y, "sendMessage")
      })
      await yuki.feedMessage("_")
      sendSpy.mockClear() // clear announce message
    })
    it("should add user to quest", async () => {
      const { authorDetails } = await yuki.feedMessage(command)
      expect(quest.playerIDs.has(authorDetails.channelId)).toBe(true)
    })
    it("should not add user to quest if max players joined", async () => {
      for (let i = 0; i < quest.limits[1]; i++) {
        quest.playerIDs.add(String(i))
      }
      const { authorDetails } = await yuki.feedMessage(command)
      expect(quest.playerIDs.has(authorDetails.channelId)).toBe(false)
    })
    it("should step quest", async () => {
      await yuki.feedMessage(command)
      expect(quest.step).toHaveBeenCalledTimes(1)
    })
    it("should send join message", async () => {
      const {
        authorDetails: { displayName },
      } = await yuki.feedMessage(command)
      expect(quest.joinMessage).toHaveBeenCalledWith(displayName)
      expect(sendSpy).toHaveBeenCalledTimes(1)
      expect(sendSpy).toHaveBeenCalledWith(quest.joinMessage(displayName))
    })
    it("should withdraw quest entry cost", async () => {
      jest.spyOn(MoneySystem.walletCache, "get").mockImplementation(() => 100000)
      const {
        authorDetails: { channelId },
      } = await yuki.feedMessage(command)
      expect(transaction.withdraw).toHaveBeenCalledWith(channelId, quest.cost)
      expect(transaction.execute).toHaveBeenCalledTimes(1)
    })
  })
})
