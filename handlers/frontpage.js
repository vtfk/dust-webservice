const md = require('markdown-it')({ html: true })
const { logger } = require('@vtfk/logger')
const { readFileSync } = require('fs')
const getCaller = require('../lib/get-caller')

module.exports = (req, res) => {
  logger('debug', ['frontpage', getCaller(req), 'returning'])

  const usage = readFileSync('USAGE.md', 'utf-8')
  res.send(md.render(usage))
}
