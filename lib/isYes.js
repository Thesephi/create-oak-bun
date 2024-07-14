const isYes = process.argv.some((v) => ['--yes', '-y', '--force', '-f'].indexOf(v) > -1)
module.exports = isYes
