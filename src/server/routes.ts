import { Router } from "express"
import { join } from "path"
import yt from "../youtube"
import logger from "winston"
import { MoneySystem } from "../yuki"

export const pages = Router()
  .get("/", async (_, res) => res.sendFile(join(__dirname, "public/index.html")))
  .get("/fox", async (_, res) => res.sendFile(join(__dirname, "public/fox.html")))

export const oath = Router()
  .get("/auth", (_, res) => res.redirect(yt.auth.getAuthUrl()))
  .get("/callback", async (req, res) => {
    const { code } = req.query
    logger.info("auth code received")
    const tokens = await yt.auth.getTokens(code as string)
    logger.info("tokens received")
    await yt.auth.setCredentials(tokens)
    res.redirect("/")
  })


export const api = Router()
  .get("/leaderboard", (_, res) => res.send(MoneySystem.getLeaderboard()))