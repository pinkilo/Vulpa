import ENV from "../../env"
import { walletCache } from "./config"

export const transact = () => new TransactionBuilder()

export default class TransactionBuilder {
  private batch: [string, number][] = []

  deposit(uid: string, amount: number): this {
    this.batch.push([uid, amount])
    return this
  }

  withdraw(uid: string, amount: number): this {
    this.batch.push([uid, -1 * amount])
    return this
  }

  async execute() {
    this.batch
      .map<[string, number]>(([uid, amount]) => [uid, walletCache.get(uid) + amount])
      .forEach(([uid, amount]) => walletCache.put(uid, amount))
    if (!ENV.DEV) await walletCache.save(ENV.FILE.CACHE.BANK)
  }
}
