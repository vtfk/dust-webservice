module.exports = (filePath, error) => {
  if (error.includes(`${filePath} : `)) {
    error = error.replace(`${filePath} : `, '')
    return error.substring(0, error.indexOf('At line:')).trim()
  }

  const errorLines = error.split('\n')
  if (errorLines.length > 1 && errorLines[1].includes(`${filePath}:`)) return errorLines[0]

  return error
}
