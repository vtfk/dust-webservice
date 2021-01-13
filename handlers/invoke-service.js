const { existsSync } = require('fs')
const { join } = require('path')

const invokePSFile = require('../lib/invoke-ps-file')
const isValidJSON = require('../lib/is-valid-json')
const config = require('../config')
const { logger } = require('@vtfk/logger')

module.exports = (req, res) => {
  const caller = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  if (!req.body) {
    return res.status(500).json({
      statusCode: 500,
      message: `JSON input is required for endpoint '${req.params.service}'!`
    })
  }

  if (!req.body.fileName) {
    logger('info', `${caller} ::'fileName' is required for endpoint '${req.params.service}'`, req.body)
    return res.status(500).json({
      statusCode: 500,
      message: `'fileName' is required for endpoint '${req.params.service}'!`,
      message2: req.params.body
    })
  }

  const servicePath = config[`${req.params.service.toUpperCase()}_PATH`]
  logger('info', `${caller} ::`, 'Endpoint:', `'/${req.params.service}/invoke'`, 'ScriptPath:', `'${servicePath}'`)

  if (!servicePath || !existsSync(servicePath)) {
    return res.status(404).json({
      statusCode: 404,
      message: `'${req.params.service}' is not a valid script endpoint!`
    })
  }

  const filePath = join(servicePath, req.body.fileName)

  if (!existsSync(filePath)) {
    return res.status(404).json({
      statusCode: 404,
      message: `'${req.body.fileName}' is not a valid script for endpoint '${req.params.service}'!`
    })
  }

  invokePSFile(filePath, caller, req.body.args || undefined)
    .then(result => {
      const json = isValidJSON(result)
      json ? res.json(json) : res.send({
        statusCode: 200,
        message: result
      })
    })
    .catch(error => {
      logger('error', `${caller} ::${error.stack}`)
      const json = isValidJSON(error.message)
      json ? res.status(500).json(json) : res.status(500).send({
        statusCode: 500,
        message: error.message
      })
    })
}
