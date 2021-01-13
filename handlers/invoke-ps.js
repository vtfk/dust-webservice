const { logger } = require('@vtfk/logger')
const { existsSync } = require('fs')

const invokePSFile = require('../lib/invoke-ps-file')
const isValidJSON = require('../lib/is-valid-json')

module.exports = (req, res) => {
  const caller = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  if (!req.body) {
    return res.status(500).json({
      statusCode: 500,
      message: 'JSON input is required!'
    })
  }

  if (!req.body.filePath) {
    return res.status(500).json({
      statusCode: 500,
      message: "'filePath' is required"
    })
  }

  if (!existsSync(req.body.filePath)) {
    return res.status(404).json({
      statusCode: 404,
      message: `'${req.body.filePath}' is not a valid script!`
    })
  }

  invokePSFile(req.body.filePath, caller, req.body.args || undefined)
    .then(result => {
      const json = isValidJSON(result)
      json ? res.json(json) : res.send({
        statusCode: 200,
        message: result
      })
    })
    .catch(error => {
      logger('error', `${caller} :: ${error.stack}`)
      const json = isValidJSON(error.message)
      json ? res.status(500).json(json) : res.status(500).send({
        statusCode: 500,
        message: error.message
      })
    })
}
