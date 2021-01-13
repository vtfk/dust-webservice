const { existsSync } = require('fs')
const { join } = require('path')

const invokePSFile = require('../lib/invoke-ps-file')
const isValidJSON = require('../lib/is-valid-json')
const config = require('../config')
const { logger } = require('@vtfk/logger')

module.exports = (req, res) => {
  const caller = req.user || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const { body } = req

  if (!body) {
    logger('info', ['invoke-service', caller, 'no body'])
    return res.status(500).json({ message: `JSON input is required for endpoint '${req.params.service}'!` })
  }

  if (!body.fileName) {
    logger('info', ['invoke-service', caller, 'filename is required'])
    return res.status(500).json({ message: `'fileName' is required for endpoint '${req.params.service}'!` })
  }

  const servicePath = config[`${req.params.service.toUpperCase()}_PATH`]
  if (!servicePath || !existsSync(servicePath)) {
    logger('info', ['invoke-service', caller, 'not valid script endpoint', req.params.service])
    return res.status(404).json({ message: `'${req.params.service}' is not a valid script endpoint!` })
  }

  const filePath = join(servicePath, body.fileName)
  if (!existsSync(filePath)) {
    logger('info', ['invoke-service', caller, 'file not found', filePath])
    return res.status(404).json({ message: `'${body.fileName}' is not a valid script for endpoint '${req.params.service}'!` })
  }

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
