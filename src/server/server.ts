import express, { Express } from "express"
import { join } from "path"
import * as Routes from "./routes"
import { file } from "../util"

export default (svr: Express) => {
  svr.use("/assets", express.static(join(file.cwd, "public/assets")))
  svr.use("/", Routes.pages)
  svr.use("/api", Routes.api)
  return svr
}
