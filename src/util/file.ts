import { promisify } from "util"
import fs from "fs"
import { resolve } from "path"

export default {
  write: promisify(fs.writeFile),
  read: promisify(fs.readFile),
  exists: fs.existsSync,
  list: promisify(fs.readdir),
  cwd: resolve(process.cwd()),
}
