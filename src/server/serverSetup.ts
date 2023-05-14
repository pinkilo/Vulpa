import express, { Express } from "express"
import { Server } from "http"
import { file } from "../util"
import { Yuki, YukiBuilder } from "@pinkilo/yukibot"
import { pages, setupApiRoutes } from "./router"
import ENV from "../env"
import logger from "../logger"
import { setSocket } from "./Websocket"
import { WebSocketServer } from "ws"

export default async (svr: Express, y: Yuki | YukiBuilder) => {
  svr.use("/assets", express.static(file.resourceOf("assets")))
  svr.use("/app", pages)
  svr.use("/api", setupApiRoutes(y))
  const server = await new Promise<Server>((resolve) => {
    const server = svr.listen(ENV.PORT, () => {
      logger.info(`http://localhost:${ENV.PORT}`)
      logger.info(`http://localhost:${ENV.PORT}/app`)
      logger.info(`http://localhost:${ENV.PORT}/api`)
    })
    resolve(server)
  })
  const wss = new WebSocketServer({ server, path: "/fox" })
  logger.http(`socket addr: ${JSON.stringify(wss.address())}`)
  setSocket(wss)
}
