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

beforeEach(() => {
  ;(MoneySystem.walletCache.get as jest.Mock).mockImplementation(() => 0)
})

describe("fit check", () => {
  const command = ">fitcheck"
  beforeEach(async () => {
    ty = await testYuki((y) => {
      y.yukiConfig.prefix = /^>/
      FitCheck(y)
    })
  })
  it("should reject without cash", async () => {
    await ty.feedMessage(command)
    expect(enqueueNewAlert).toHaveBeenCalledTimes(0)
  })
  it("should enqueue alert", async () => {
    ;(MoneySystem.walletCache.get as jest.Mock).mockImplementation(() => 100)
    await ty.feedMessage(command)
    expect(enqueueNewAlert).toHaveBeenCalledTimes(1)
  })
  it("should modify bank on success", async () => {
    ;(MoneySystem.walletCache.get as jest.Mock).mockImplementation(() => 100)
    await ty.feedMessage(command)
    expect(MoneySystem.transactionBatch).toHaveBeenCalledTimes(1)
  })
})

describe("hydrate", () => {
  const command = ">hydrate"
  beforeEach(async () => {
    ty = await testYuki((y) => {
      y.yukiConfig.prefix = /^>/
      Hydrate(y)
    })
  })
  it("should reject without cash", async () => {
    await ty.feedMessage(command)
    expect(enqueueNewAlert).toHaveBeenCalledTimes(0)
  })
  it("should enqueue alert on hydrate", async () => {
    ;(MoneySystem.walletCache.get as jest.Mock).mockImplementation(() => 100)
    await ty.feedMessage(command)
    expect(enqueueNewAlert).toHaveBeenCalledTimes(1)
  })
  it("should modify bank on success", async () => {
    ;(MoneySystem.walletCache.get as jest.Mock).mockImplementation(() => 100)
    await ty.feedMessage(command)
    expect(MoneySystem.transactionBatch).toHaveBeenCalledTimes(1)
  })
})

describe("pushups", () => {
  const command = ">pushups"
  let sendSpy

  beforeEach(async () => {
    ty = await testYuki((y) => {
      y.yukiConfig.prefix = /^>/
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
    await ty.feedMessage(command)
    expect(MoneySystem.walletCache.get).toHaveBeenCalledTimes(1)
  })

  describe("with money", () => {
    beforeEach(() => {
      ;(MoneySystem.walletCache.get as jest.Mock).mockImplementation(() => 10000)
    })
    it("should send message", async () => {
      await ty.feedMessage(command)
      expect(sendSpy).toHaveBeenCalledTimes(1)
    })
    it("should enqueue new alert", async () => {
      await ty.feedMessage(command)
      expect(enqueueNewAlert).toHaveBeenCalledTimes(1)
    })
    it("should modify bank on success", async () => {
      await ty.feedMessage(command)
      expect(MoneySystem.transactionBatch).toHaveBeenCalledTimes(1)
    })
  })
})
