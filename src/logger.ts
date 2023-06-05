import { createLogger, format, transports } from "winston"
import ENV from "./env"

export default createLogger({
  level: ENV.LOG ?? ENV.NODE_ENV === "dev" ? "debug" : "info",
  transports: [new transports.Console()],
  format: format.combine(
    format.errors({ stack: true }),
    format.colorize({ all: true }),
    format.timestamp(),
    format.printf(({ err, level, message, timestamp }) => {
      return `${timestamp} [Yuki] ${level}: ${message} ${err || ""}`
    })
  ),
})
