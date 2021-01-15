module.exports = (filePath, error) => {
  if (error.includes(`${filePath} : `)) {
    error = error.replace(`${filePath} : `, '')
    return error.substring(0, error.indexOf('At line:')).trim()
  }

  return error
}
