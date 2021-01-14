const { logger } = require('@vtfk/logger')
const { existsSync } = require('fs')

const invokePSFile = require('../lib/invoke-ps-file')
const isValidJSON = require('../lib/is-valid-json')

module.exports = (req, res) => {
  const caller = (req.user && req.user.caller) || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const { body } = req

  if (!body) {
    logger('info', ['invoke-ps', caller, 'no body'])
    return res.status(400).json({ error: 'JSON input is required!' })
  }

  if (!body.filePath) {
    logger('info', ['invoke-ps', caller, 'no filePath'])
    return res.status(400).json({ error: 'filePath is required' })
  }

  if (!existsSync(body.filePath)) {
    logger('info', ['invoke-ps', caller, 'file doesn\'t exist'])
    return res.status(404).json({ error: `'${body.filePath}' is not a valid script!` })
  }

  logger('info', ['invoke-ps', caller, body.filePath, 'invoking script'])

  invokePSFile(body.filePath, caller, body.args || undefined)
    .then(result => {
      logger('info', ['invoke-ps', caller, body.filePath, 'returning result'])

      const json = isValidJSON(result)
      res.json(json || { result })
    })
    .catch(error => {
      logger('error', ['invoke-ps', caller, error.stack])

      const json = isValidJSON(error.message)
      res.status(500).json(json || { error: error.message })
    })
}
