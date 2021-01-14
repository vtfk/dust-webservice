const { existsSync } = require('fs')
const { join } = require('path')

const validatePath = require('../lib/validate-script-input')
const invokePSFile = require('../lib/invoke-ps-file')
const isValidJSON = require('../lib/is-valid-json')
const config = require('../config')
const { logger } = require('@vtfk/logger')

module.exports = (req, res) => {
  const caller = (req.user && req.user.upn) || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const { body } = req

  if (!body) {
    logger('info', ['invoke-service', caller, 'no body'])
    return res.status(500).json({ error: `JSON input is required for endpoint '${req.params.service}'!` })
  }

  if (!body.fileName) {
    logger('info', ['invoke-service', caller, 'filename is required'])
    return res.status(500).json({ error: `'fileName' is required for endpoint '${req.params.service}'!` })
  }

  const servicePath = config[`${req.params.service.toUpperCase()}_PATH`]

  if (!servicePath || !existsSync(servicePath)) {
    logger('info', ['invoke-service', caller, 'not valid script endpoint', req.params.service])
    return res.status(404).json({ error: `'${req.params.service}' is not a valid script endpoint!` })
  }

  const filePath = join(servicePath, body.fileName)
  const result = validatePath(filePath)

  if (result instanceof Error) {
    logger('error', ['invoke-service', caller, 'filepath', filePath, 'not valid script', result.message])
    return res.status(400).json({ error: `Invalid script for endpoint '${req.params.service}'`, message: result.message })
  }

  logger('info', ['invoke-ps', caller, filePath, 'invoking script'])

  invokePSFile(filePath, caller, body.args || undefined)
    .then(result => {
      logger('info', ['invoke-service', caller, filePath, 'returning result'])

      const json = isValidJSON(result)
      res.json(json || { result })
    })
    .catch(error => {
      logger('error', ['invoke-service', caller, error.stack])

      const json = isValidJSON(error.message)
      res.status(500).json(json || { error: error.message })
    })
}
