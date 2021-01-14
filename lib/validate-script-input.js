const { existsSync } = require('fs')
const { basename } = require('path')

const { ACCEPTED_PATH_ROOT } = require('../config')

module.exports = script => {
  if (!script) {
    return new Error('Script not set')
  }
  
  if (!existsSync(script)) {
    return new Error(`'${basename(script)}' does not exist`)
  }

  if (!script.toLowerCase().endsWith('.ps1')) {
    return new Error(`'${basename(script)}' is not a PowerShell script`)
  }

  if (!script.toLowerCase().startsWith(ACCEPTED_PATH_ROOT.toLowerCase())) {
    return new Error(`'${basename(script)}' has invalid script root`)
  }

  return true
}
