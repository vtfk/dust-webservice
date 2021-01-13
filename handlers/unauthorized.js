const { logger } = require('@vtfk/logger')

module.exports = (error, req, res, next) => {
  if (error.name === 'UnauthorizedError') {
    logger('error', ['handle-unauthorized', error])
    res.status(401).json({ error: 'invalid jwt token' })
  }
}
