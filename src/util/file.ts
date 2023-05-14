import { promisify } from "util"
import fs from "fs"
import { join, resolve } from "path"
import { file } from "./index"

export default {
  write: promisify(fs.writeFile),
  read: promisify(fs.readFile),
  exists: fs.existsSync,
  list: promisify(fs.readdir),
  cwd: resolve(process.cwd()),
  resourceOf: (path: string) => join(file.cwd, `public/${path}`),
}
