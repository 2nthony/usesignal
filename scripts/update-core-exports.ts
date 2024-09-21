import fs from 'node:fs/promises'
import path from 'node:path'

main()

async function main() {
  const srcDir = path.join(import.meta.dirname, '..', 'packages', 'core', 'src')
  const indexFile = path.join(srcDir, 'index.ts')

  const files = await fs.readdir(srcDir)

  const useFiles = files.filter(file => file.startsWith('use'))
  const exportStatements = useFiles.map((file) => {
    const moduleName = path.basename(file, '.ts')
    return `export * from './${moduleName}'`
  })

  const content = `${exportStatements.join('\n')}\n`

  await fs.writeFile(indexFile, content)
  console.log('index.ts has been updated successfully.')
}
