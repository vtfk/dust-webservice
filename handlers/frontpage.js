var md = require('markdown-it')({ html: true })
const { readFileSync } = require('fs')

module.exports = (req, res) => {
  const usage = readFileSync('USAGE.md', 'utf-8')
  res.send(md.render(usage))
}
