const passThru = (v) => v

const colors = {
  green: (str) => `\x1b[92m${str}\x1b[0m`,
  yellow: (str) => `\x1b[33m${str}\x1b[0m`,
  grey: (str) => `\x1b[90m${str}\x1b[0m`,
}

const noColorSetting = process.env['NO_COLOR']?.toLowerCase()
if (noColorSetting === '1' || noColorSetting === 'true') {
  for (const key in colors) {
    colors[key] = passThru
  }
}

module.exports = colors
