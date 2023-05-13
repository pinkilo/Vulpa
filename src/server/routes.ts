import express, { Router } from "express"
import { join } from "path"
import yt from "../youtube"
import logger from "../logger"
import {
  Alert,
  getAlertHistory,
  MoneySystem as MS,
  nextAlert,
  replayAlert,
} from "../yuki"
import { Packet, packetier } from "packetier"
import { popLeaderboardDisplayTimer } from "../yuki/_commands/Wallet"
import { file } from "../util"

export const pages = Router()
  .get("/", (_, res) => res.sendFile(join(file.cwd, "public/index.html")))
  .get("/fox", (_, res) => res.sendFile(join(file.cwd, "public/fox.html")))
  .get("/alerts", (_, res) =>
    res.sendFile(join(file.cwd, "public/alerts.html"))
  )
  .get("/leaderboard", (_, res) =>
    res.sendFile(join(file.cwd, "public/leaderboard.html"))
  )

const alertApi = Router()
  .get("/", (_, res) => res.send(packetier(true, nextAlert())))
  .get("/history", async (_, res) =>
    res.send(packetier(true, await getAlertHistory()))
  )
  .post("/replay", (req, res) => {
    if (req.body && (req.body as Packet<Alert>).payload) {
      replayAlert((req.body as Packet<Alert>).payload)
    } else res.status(400)
    res.end()
  })

export const api = Router()
  .use(express.json())
  .use((req, _, next) => {
    logger.info(`${req.method} ${req.path}`)
    next()
  })
  .use("/alerts", alertApi)
  .get("/leaderboard", async (_, res) =>
    res.send(packetier(true, await MS.getLeaderboard(true)))
  )
  .get("/leaderboard/duration", (_, res) =>
    res.send(packetier(true, popLeaderboardDisplayTimer()))
  )
  .get("/chat", ({ query }, res) =>
    res.send(
      packetier(true, yt.chat.getChat(parseInt(query["page"] as string) || 0))
    )
  )
