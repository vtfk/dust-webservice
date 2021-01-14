const { logger } = require('@vtfk/logger')

const validatePath = require('../lib/validate-script-input')
const invokePSFile = require('../lib/invoke-ps-file')
const isValidJSON = require('../lib/is-valid-json')

module.exports = (req, res) => {
  const caller = (req.user && req.user.upn) || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const { body } = req

  if (!body) {
    logger('info', ['invoke-ps', caller, 'no body'])
    return res.status(400).json({ error: 'JSON input is required!' })
  }

  if (!body.filePath) {
    logger('info', ['invoke-ps', caller, 'no filePath'])
    return res.status(400).json({ error: 'filePath is required' })
  }

  const result = validatePath(body.filePath)

  if (result instanceof Error) {
    logger('error', ['invoke-ps', caller, 'filepath', body.filePath, 'not valid script', result.message])
    return res.status(400).json({ error: 'Invalid script', message: result.message })
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
