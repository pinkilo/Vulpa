import express, { Express } from "express"
import { join } from "path"
import * as Routes from "./routes"

export default (svr: Express) => {
  svr.use("/assets", express.static(join(__dirname, "public/assets")))
  svr.use("/", Routes.pages)
  svr.use("/api", Routes.api)
  return svr
}
