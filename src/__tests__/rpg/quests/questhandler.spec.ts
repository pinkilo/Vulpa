import { TestYuki, testYuki } from "@pinkilo/yukibot"
import Quest from "../../../yuki/rpg/quests/Quest"

jest.mock("../../../util/math", () => ({
  ...jest.requireActual("../../../util/math"),
  randFromRange: jest.fn(() => 100),
}))
jest.mock("../../../yuki/rpg/quests/Quest", () => ({
  ...jest.requireActual("../../../yuki/rpg/quests/Quest"),
  randomQuest: jest.fn(() => quest),
}))
jest.spyOn(global.Math, "random").mockImplementation(() => 0)

let quest: Quest
let sendSpy: jest.SpyInstance
let yuki: TestYuki
let qm: typeof import("../../../yuki/rpg/quests/QuestSystemState")

beforeEach(async () => {
  quest = {
    playerIDs: new Set(),
    joinMessage: jest.fn(() => "join"),
    cost: 1,
    step: jest.fn(async (status) => status + 1),
    limits: [1],
    announceMessage: jest.fn(() => "announce"),
  }
  qm = await import("../../../yuki/rpg/quests/QuestSystemState")
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
})

describe("Quest Command", () => {
  const command = ">quest"

  beforeEach(async () => {
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
  })

  describe("Quest Active", () => {
    beforeEach(async () => {
      yuki = await testYuki((y) => {
        qm.QuestPassive(y)
        qm.QuestCommand(y)
        sendSpy = jest.spyOn(y, "sendMessage")
      })
      await yuki.feedMessage("_")
      sendSpy.mockReset()
    })
    it("should add user to quest", async () => {
      const { authorDetails } = await yuki.feedMessage(command)
      expect(quest.playerIDs.has(authorDetails.channelId)).toBe(true)
    })
    it("should step quest", async () => {
      await yuki.feedMessage(command)
      expect(quest.step).toHaveBeenCalledTimes(1)
    })
    it("should send join message", async () => {
      const {
        authorDetails: { displayName },
      } = await yuki.feedMessage(command)
      expect(quest.joinMessage).toHaveBeenCalledTimes(1)
      expect(quest.joinMessage).toHaveBeenCalledWith(displayName)
      expect(sendSpy).toHaveBeenCalledTimes(1)
      expect(sendSpy).toHaveBeenCalledWith(quest.joinMessage(displayName))
    })
  })
})
