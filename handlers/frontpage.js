var md = require('markdown-it')({ html: true })
const { logger } = require('@vtfk/logger')
const { readFileSync } = require('fs')

module.exports = (req, res) => {
  const caller = (req.user && req.user.upn) || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  logger('debug', ['frontpage', caller, 'returning'])

  const usage = readFileSync('USAGE.md', 'utf-8')
  res.send(md.render(usage))
}
