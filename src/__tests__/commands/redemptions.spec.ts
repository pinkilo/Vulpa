import { testYuki, TestYuki } from "@pinkilo/yukibot"
import { enqueueNewAlert, FitCheck, Hydrate, Pushups } from "../../yuki"
import MoneySystem from "../../yuki/MoneySystem"
import TransactionBuilder from "../../yuki/MoneySystem/TransactionBuilder"

jest.mock("../../yuki/alerts", () => ({
  __esModule: true,
  ...jest.requireActual("../../yuki/alerts"),
  enqueueNewAlert: jest.fn(),
}))

let ty: TestYuki
let depositSpy: jest.SpyInstance
let withdrawSpy: jest.SpyInstance
let executeSpy: jest.SpyInstance

beforeEach(() => {
  depositSpy = jest
    .spyOn(TransactionBuilder.prototype, "deposit")
    .mockImplementation(() => new TransactionBuilder())
  withdrawSpy = jest
    .spyOn(TransactionBuilder.prototype, "withdraw")
    .mockImplementation(() => new TransactionBuilder())
  executeSpy = jest.spyOn(TransactionBuilder.prototype, "execute").mockImplementation()
})

describe("fit check", () => {
  const command = ">fitcheck"
  beforeEach(async () => {
    ty = await testYuki((y) => {
      y.yukiConfig.prefix = /^>/
      FitCheck(y)
    })
  })

  describe("cost rejection", () => {
    beforeEach(() => {
      jest.spyOn(MoneySystem.walletCache, "get").mockImplementation(() => 0)
    })

    it("should not add alert", async () => {
      await ty.feedMessage(command)
      expect(enqueueNewAlert).toHaveBeenCalledTimes(0)
    })

    it("should not execute transaction", async () => {
      await ty.feedMessage(command)
      expect(executeSpy).toHaveBeenCalledTimes(0)
    })
  })

  describe("cost met", () => {
    beforeEach(() => {
      jest.spyOn(MoneySystem.walletCache, "get").mockImplementation(() => 100000)
    })

    it("should enqueue alert", async () => {
      await ty.feedMessage(command)
      expect(enqueueNewAlert).toHaveBeenCalledTimes(1)
    })

    it("should withdraw", async () => {
      await ty.feedMessage(command)
      expect(withdrawSpy).toHaveBeenCalledTimes(1)
    })

    it("should execute transaction", async () => {
      await ty.feedMessage(command)
      expect(executeSpy).toHaveBeenCalledTimes(1)
    })
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

  describe("cost rejection", () => {
    beforeEach(() => {
      jest.spyOn(MoneySystem.walletCache, "get").mockImplementation(() => 0)
    })

    it("should not add alert", async () => {
      await ty.feedMessage(command)
      expect(enqueueNewAlert).toHaveBeenCalledTimes(0)
    })

    it("should not execute transaction", async () => {
      await ty.feedMessage(command)
      expect(executeSpy).toHaveBeenCalledTimes(0)
    })
  })

  describe("cost met", () => {
    beforeEach(() => {
      jest.spyOn(MoneySystem.walletCache, "get").mockImplementation(() => 1000000)
    })

    it("should enqueue alert", async () => {
      await ty.feedMessage(command)
      expect(enqueueNewAlert).toHaveBeenCalledTimes(1)
    })

    it("should withdraw", async () => {
      await ty.feedMessage(command)
      expect(withdrawSpy).toHaveBeenCalledTimes(1)
    })

    it("should execute transaction", async () => {
      await ty.feedMessage(command)
      expect(executeSpy).toHaveBeenCalledTimes(1)
    })
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

  describe("cost rejection", () => {
    beforeEach(() => {
      jest.spyOn(MoneySystem.walletCache, "get").mockImplementation(() => 0)
    })

    it("should not add alert", async () => {
      await ty.feedMessage(command)
      expect(enqueueNewAlert).toHaveBeenCalledTimes(0)
    })

    it("should not execute transaction", async () => {
      await ty.feedMessage(command)
      expect(executeSpy).toHaveBeenCalledTimes(0)
    })
  })

  describe("cost met", () => {
    beforeEach(() => {
      jest.spyOn(MoneySystem.walletCache, "get").mockImplementation(() => 100000)
    })

    it("should enqueue alert", async () => {
      await ty.feedMessage(command)
      expect(enqueueNewAlert).toHaveBeenCalledTimes(1)
    })

    it("should send message", async () => {
      await ty.feedMessage(command)
      expect(sendSpy).toHaveBeenCalledTimes(1)
    })

    it("should withdraw", async () => {
      await ty.feedMessage(command)
      expect(withdrawSpy).toHaveBeenCalledTimes(1)
    })

    it("should execute transaction", async () => {
      await ty.feedMessage(command)
      expect(executeSpy).toHaveBeenCalledTimes(1)
    })
  })
})
