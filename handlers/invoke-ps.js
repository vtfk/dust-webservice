const { logger } = require('@vtfk/logger')
const { existsSync } = require('fs')

const invokePSFile = require('../lib/invoke-ps-file')
const isValidJSON = require('../lib/is-valid-json')

module.exports = (req, res) => {
  const caller = req.user.upn || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const { body } = req

  if (!body) {
    logger('info', ['invoke-ps', caller, 'no body'])
    return res.status(400).json({ message: 'JSON input is required!' })
  }

  if (!body.filePath) {
    logger('info', ['invoke-ps', caller, 'no filePath'])
    return res.status(400).json({ message: 'filePath is required' })
  }

  if (!existsSync(body.filePath)) {
    logger('info', ['invoke-ps', caller, 'file doesn\'t exist'])
    return res.status(404).json({ message: `'${body.filePath}' is not a valid script!` })
  }

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
