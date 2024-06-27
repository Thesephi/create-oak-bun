const readline = require('node:readline')
const { stdin: input, stdout: output } = require('node:process')

const rl = readline.createInterface({ input, output })

module.exports = async (question, def) => {
  return new Promise((resolve) => {
    rl.question(`${question} `, (answer) => {
      resolve(answer || def)
      rl.close()
    })
  })
}
