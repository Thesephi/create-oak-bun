const readline = require('node:readline')
const { stdin: input, stdout: output } = require('node:process')

module.exports = async (question, def) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input, output })
    rl.question(`${question} `, (answer) => {
      resolve(answer || def)
      rl.close()
    })
  })
}
