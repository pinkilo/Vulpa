import MoneySystem from "../yuki/MoneySystem"
import { startingWallet, walletCache } from "../yuki/MoneySystem/config"
import TransactionBuilder from "../yuki/MoneySystem/TransactionBuilder"

describe("dsl", () => {
  it("should return a builder", () => {
    expect(MoneySystem.transact()).toBeInstanceOf(TransactionBuilder)
  })
})

describe("builder", () => {
  const uid = "uid"
  let builder

  beforeEach(() => {
    builder = new TransactionBuilder()
  })

  it("should save wallet cache on execute", async () => {
    builder.deposit(uid, 0)
    await builder.execute()
    expect(walletCache.save).toHaveBeenCalledTimes(1)
  })

  it("should add to existing value on deposit", async () => {
    builder.deposit(uid, 1)
    await builder.execute()
    expect(walletCache.put).toHaveBeenCalledWith(uid, startingWallet + 1)
  })

  it("should remove from existing value on deposit", async () => {
    builder.withdraw(uid, 1)
    await builder.execute()
    walletCache.put("", 0)
    expect(walletCache.put).toHaveBeenCalledWith(uid, startingWallet - 1)
  })
})
