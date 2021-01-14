const replace = require('./replace-not-allowed')

module.exports = args => {
  let argumemts = ''
  for (const key of Object.keys(args)) {
    argumemts += replace(`-${key} ${typeof args[key] === 'string' ? `'${args[key]}'` : args[key]} `)
  }
  return argumemts
}
