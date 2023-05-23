import { testYuki } from "@pinkilo/yukibot/"
import { TestYuki } from "@pinkilo/yukibot"
import { enqueueNewAlert, Hydrate, Pushups, FitCheck } from "../../yuki"
import MoneySystem from "../../yuki/MoneySystem"

jest.mock("../../yuki/alerts", () => ({
  __esModule: true,
  ...jest.requireActual("../../yuki/alerts"),
  enqueueNewAlert: jest.fn(),
}))

jest.mock("../../yuki/MoneySystem", () => ({
  __esModule: true,
  default: {
    ...jest.requireActual("../../yuki/MoneySystem").default,
    transactionBatch: jest.fn(),
    walletCache: {
      get: jest.fn().mockImplementation(() => 0),
    },
  },
}))

let ty: TestYuki

it("should enqueue alert on hydrate", async () => {
  ty = await testYuki((y) => {
    y.yukiConfig.prefix = /^>/
    y.googleConfig = { clientId: "", clientSecret: "", redirectUri: "" }
    y.tokenLoader = async () => ({})
    Hydrate(y)
  })
  await ty.feedMessage(`>hydrate`)
  expect(enqueueNewAlert).toHaveBeenCalledTimes(1)
})

it("should enqueue alert on fitcheck", async () => {
  ty = await testYuki((y) => {
    y.yukiConfig.prefix = /^>/
    y.googleConfig = { clientId: "", clientSecret: "", redirectUri: "" }
    y.tokenLoader = async () => ({})
    FitCheck(y)
  })
  await ty.feedMessage(`>fitcheck`)
  expect(enqueueNewAlert).toHaveBeenCalledTimes(1)
})

describe("pushups", () => {
  let sendSpy

  beforeEach(async () => {
    ty = await testYuki((y) => {
      y.yukiConfig.prefix = /^>/
      y.googleConfig = { clientId: "", clientSecret: "", redirectUri: "" }
      y.tokenLoader = async () => ({})
      Pushups(y)
      sendSpy = jest.spyOn(y, "sendMessage")
    })
  })

  it("should not invoke without money", async () => {
    await ty.feedMessage(">pushups")
    expect(sendSpy).toHaveBeenCalledTimes(0)
    expect(enqueueNewAlert).toHaveBeenCalledTimes(0)
    expect(MoneySystem.transactionBatch).toHaveBeenCalledTimes(0)
  })
  it("should check bank", async () => {
    await ty.feedMessage(">pushups")
    expect(MoneySystem.walletCache.get).toHaveBeenCalledTimes(1)
  })

  describe("with money", () => {
    beforeEach(() => {
      ;(MoneySystem.walletCache.get as jest.Mock).mockImplementation(() => 10000)
    })
    it("should send message", async () => {
      await ty.feedMessage(">pushups")
      expect(sendSpy).toHaveBeenCalledTimes(1)
    })
    it("should enqueue new alert", async () => {
      await ty.feedMessage(">pushups")
      expect(enqueueNewAlert).toHaveBeenCalledTimes(1)
    })
    it("should update bank", async () => {
      await ty.feedMessage(">pushups")
      expect(MoneySystem.transactionBatch).toHaveBeenCalledTimes(1)
    })
  })
})
