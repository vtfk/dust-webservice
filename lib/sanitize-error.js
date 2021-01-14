const { logger } = require('@vtfk/logger')

module.exports = (filePath, error) => {
  if (error.includes(`${filePath} : `)) {
    logger('info', 'sanitize-error: Removing "filePath : " and substringing error')
    error = error.replace(`${filePath} : `, '')

    return error.substring(0, error.indexOf('At line:')).trim()
  }

  return error
}
