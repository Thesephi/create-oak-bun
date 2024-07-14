#!/usr/bin/env node

/**
 * executed by calling `npm create <package_name>`
 */

const isYes = require('./isYes')
const prompt = require('./prompt')
const init = require('init-package-json')
const path = require('node:path')
const fs = require('node:fs')
const { green, yellow } = require('./colors')

// a path to a promzard module.  In the event that this file is
// not found, one will be provided for you.
const initFile = path.resolve(__dirname, '.npm-init')

// the dir where we're doin stuff.
const curDir = process.cwd()

// extra stuff that gets put into the PromZard module's context.
// In npm, this is the resolved config object.  Exposed as 'config'
// Optional.
const configData = {
  yes: isYes
}

// Any existing stuff from the package.json file is also exposed in the
// PromZard module as the `package` object.  There will also be three
// vars for:
// * `filename` path to the package.json file
// * `basename` the tip of the package dir
// * `dirname` the parent of the package dir

async function main() {

  const subDir = isYes ? './' : await prompt(
    'which directory would you like to use for your project? (leave empty to use the current one)',
    './'
  )
  const dir = path.join(curDir, subDir)
  fs.mkdirSync(dir, { recursive: true })

  try {
    const data = await init(dir, initFile, configData)
    // the data's already been written to {dir}/package.json
    // now you can do stuff with it

    fs.cpSync(
      path.join(__dirname, '../template'),
      dir,
      { recursive: true }
    )

    fs.renameSync(path.join(dir, '.gitignore.tpl'), path.join(dir, '.gitignore'))
    fs.renameSync(path.join(dir, '.npmrc.tpl'), path.join(dir, '.npmrc'))

    const fromCurToProjDir = path.relative(curDir, dir)

    console.log('\n' +
      yellow('project scaffolded, you can now do the following:\n\n') +
      (fromCurToProjDir && green(`cd ${fromCurToProjDir}\n`)) +
      green('bun install\n') +
      green('bun run src/index.ts\n')
    )

  } catch (e) {
    if (e.message !== 'canceled') console.error('an error occurred', e.stack)
  }

}

main()
