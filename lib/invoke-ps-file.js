const { logger } = require('@vtfk/logger')
const { exec } = require('child_process')
const { dirname } = require('path')

const { MAX_BUFFER } = require('../config')

const parseArgs = require('./parse-arguments')
const sanitizeError = require('./sanitize-error')

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
        logger('error', ['invoke-ps-file', caller, 'exec stderr', proc.pid])
        const { message, stack } = new Error(sanitizeError(filePath, stderr))
        // eslint-disable-next-line
        return reject({ statusCode: 418, message, stack })
      }
      if (error !== null) {
        logger('error', ['invoke-ps-file', caller, 'exec error', proc.pid])
        const { message, stack } = new Error(sanitizeError(filePath, error))
        // eslint-disable-next-line
        return reject({ statusCode: 418, message, stack })
      }

      logger('info', ['invoke-ps-file', caller, 'exec finished', proc.pid])
      return resolve(stdout)
    })
  })
}

module.exports = invoke
