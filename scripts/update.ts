import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const DIR_ROOT = resolve(__dirname, '..')
export const DIR_SRC = resolve(__dirname, '../packages')

run()

async function run() {
  await updatePackageJSON()
}

async function updatePackageJSON() {
  const { version } = await fs.readJSON('package.json')
  // TODO: make this dynamic
  const packageDir = resolve(DIR_SRC, 'core')
  const packageJSONPath = resolve(packageDir, 'package.json')

  const packageJSON = await fs.readJSON(packageJSONPath)
  packageJSON.version = version

  await fs.writeJSON(packageJSONPath, packageJSON, { spaces: 2 })
}
