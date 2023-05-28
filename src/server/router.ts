import express, { Router } from "express"
import { file as f } from "../util"
import { Packet, packetier } from "packetier"
import {
  Alert,
  getAlertHistory,
  MoneySystem as MS,
  nextAlert,
  replayAlert,
} from "../yuki"
import logger from "../logger"
import { popLeaderboardDisplayTimer } from "../yuki/commands/Wallet"
import { Yuki, YukiBuilder } from "@pinkilo/yukibot"

export const pages = Router()
  .get("/", (_, res) => res.sendFile(f.resourceOf("index.html")))
  .get("/fox", (_, res) => res.sendFile(f.resourceOf("fox.html")))
  .get("/alerts", (_, res) => res.sendFile(f.resourceOf("alerts.html")))
  .get("/leaderboard", (_, res) => res.sendFile(f.resourceOf("leaderboard.html")))

const alertApi = Router()
  .get("/next", (_, res) => res.send(packetier(true, nextAlert())))
  .get("/history", async (_, res) => res.send(packetier(true, await getAlertHistory())))
  .post("/replay", (req, res) => {
    if (req.body && (req.body as Packet<Alert>).payload)
      replayAlert((req.body as Packet<Alert>).payload)
    else res.status(400)
  })

export const setupApiRoutes = (y: YukiBuilder | Yuki): Router => {
  const leaderboardApi = Router()
    .get("/", async (_, res) => res.send(packetier(true, await MS.leaderboard(y, true))))
    .get("/duration", (_, res) => res.send(packetier(true, popLeaderboardDisplayTimer())))

  return Router()
    .use(express.json())
    .use((req, _, next) => {
      logger.http(`${req.method} ${req.path}`)
      next()
    })
    .use("/alerts", alertApi)
    .use("/leaderboard", leaderboardApi)
    .get("/chat", ({ query }, res) =>
      res.send(packetier(true, y.getChatFrom(parseInt(query["page"] as string) || 0)))
    )
}
