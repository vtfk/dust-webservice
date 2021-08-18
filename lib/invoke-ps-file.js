const { logger } = require('@vtfk/logger')
const { exec } = require('child_process')
const { dirname } = require('path')

const { MAX_BUFFER } = require('../config')

const parseArgs = require('./parse-arguments')
const getError = require('./get-error')
const getStatusCode = require('./get-error-status-code')

const invoke = (filePath, caller, args) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      const { message, stack } = new Error("'filePath' must be set")
      // eslint-disable-next-line
      return reject({ statusCode: 400, message, stack })
    }

    if (args && typeof args !== 'object') {
      const { message, stack } = new Error("'args' must be object")
      // eslint-disable-next-line
      return reject({ statusCode: 400, message, stack })
    }

    // set encoding directly in the console: "cmd.exe /c chcp 65001>nul &&"
    const cmdPwsh = `powershell.exe -NoLogo -ExecutionPolicy ByPass -Command "${filePath}"${args ? ` ${parseArgs(args)}` : ''}`
    const cmd = `cmd.exe /c chcp 65001>nul && ${cmdPwsh}`
    logger('info', ['invoke-ps-file', caller, 'executing command', cmdPwsh])

    const proc = exec(cmd, { cwd: dirname(filePath), maxBuffer: Number.parseInt(MAX_BUFFER) }, (error, stdout, stderr) => {
      if (stderr !== '') {
        const { message, stack } = getError(filePath, stderr)
        logger('error', ['invoke-ps-file', caller, 'exec stderr', proc.pid, message])
        // eslint-disable-next-line
        return reject({ statusCode: getStatusCode(message), message, stack })
      }
      if (error !== null) {
        const { message, stack } = getError(filePath, stderr)
        logger('error', ['invoke-ps-file', caller, 'exec error', proc.pid, message])
        // eslint-disable-next-line
        return reject({ statusCode: getStatusCode(message), message, stack })
      }

      logger('info', ['invoke-ps-file', caller, 'exec finished', proc.pid])
      return resolve(stdout)
    })
  })
}

module.exports = invoke
