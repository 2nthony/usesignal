import { execSync } from 'node:child_process'
import path from 'node:path'
import { version } from '../package.json'

// TODO: make this dynamic
const packages = ['core']

execSync('npm run build', { stdio: 'inherit' })

let command = 'npm publish --access public'

if (version.includes('beta'))
  command += ' --tag beta'

for (const name of packages) {
  execSync(command, { stdio: 'inherit', cwd: path.join('packages', name) })
  console.info(`Published @usesignal/${name}`)
}
