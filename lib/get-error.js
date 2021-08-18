const sanitizeError = require('./sanitize-error')

module.exports = (filePath, error) => ({ message: sanitizeError(filePath, error), stack: error })
