import { SyncCache } from "../../util"

export const startingWallet = 100
export const name = "rupee"
export const walletCache = new SyncCache<number>(() => startingWallet)
