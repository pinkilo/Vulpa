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
    joinMessage: jest.fn(),
    cost: 1,
    step: jest.fn(),
    limits: [1],
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
})

describe("Quest Command", () => {
  const command = ">quest"

  beforeEach(async () => {
    yuki = await testYuki((y) => {
      qm.QuestCommand(y)
      sendSpy = jest.spyOn(y, "sendMessage")
    })
  })

  it("should do nothing with no quest set", async () => {
    await yuki.feedMessage(command)
    expect(sendSpy).toHaveBeenCalledTimes(0)
  })

  describe("Quest Active", () => {
    beforeEach(async () => {
      yuki = await testYuki((y) => {
        qm.QuestPassive(y)
        qm.QuestCommand(y)
        sendSpy = jest.spyOn(y, "sendMessage")
      })
      await yuki.feedMessage("_")
    })
    it("should ", async () => {})
  })
})
