const { logger } = require('@vtfk/logger')
const { exec } = require('child_process')
const { dirname } = require('path')

const { MAX_BUFFER } = require('../config')

const parseArgs = require('./parse-arguments')
const sanitizeError = require('./sanitize-error')

const invoke = (filePath, caller, args) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      return reject(new Error("'filePath' must be set"))
    }

    if (args && typeof args !== 'object') {
      return reject(new Error("'args' must be object"))
    }

    // set encoding directly in the console: "cmd.exe /c chcp 65001>nul &&"
    const cmd = `cmd.exe /c chcp 65001>nul && powershell.exe -NoLogo -ExecutionPolicy ByPass -Command "${filePath}"${args ? ` ${parseArgs(args)}` : ''}`
    logger('info', ['invoke-ps-file', caller, 'executing command', cmd])

    const proc = exec(cmd, { cwd: dirname(filePath), maxBuffer: Number.parseInt(MAX_BUFFER) }, (error, stdout, stderr) => {
      if (stderr !== '') {
        logger('error', ['invoke-ps-file', caller, 'exec stderr', proc.pid])
        return reject(new Error(sanitizeError(filePath, stderr)))
      }
      if (error !== null) {
        logger('error', ['invoke-ps-file', caller, 'exec error', proc.pid])
        return reject(new Error(sanitizeError(filePath, error)))
      }

      logger('info', ['invoke-ps-file', caller, 'exec finished', proc.pid])
      return resolve(stdout)
    })
  })
}

module.exports = invoke
