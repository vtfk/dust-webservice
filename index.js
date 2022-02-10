const { JWT_SECRET, EXPRESS_PORT, RATE_LIMIT_MINUTES, RATE_LIMIT_COUNT } = require('./config')
const { logger } = require('@vtfk/logger')
const express = require('express')
const jwt = require('express-jwt')
const rateLimit = require('express-rate-limit')

const app = express()

// limit incomming calls from same address
const limiter = rateLimit({
  windowMs: RATE_LIMIT_MINUTES * 60 * 1000,
  max: RATE_LIMIT_COUNT,
  message: 'APP APP APP APP APP APP APP',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger('warn', ['Someone is running a DDOS attack on us 😱'])
  }
})
app.use('/', limiter)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('etag', false) // disable cache

// JWT AUTH
if (JWT_SECRET) {
  app.use(jwt({ secret: JWT_SECRET, algorithms: ['HS256'] }).unless({ path: ['/', '/favicon.ico'] }))
  app.use(require('./handlers/unauthorized'))
}

// ROUTES
app.get('/', require('./handlers/frontpage')) // default endpoint to list out what I can do
app.get('/:service/invoke', require('./handlers/invoke-service')) // endpoint for invoking scriptname in given service
app.get('/invoke/psfile', require('./handlers/invoke-ps')) // endpoint for invoking script by full path

// start server on specified port
app.listen(Number.parseInt(EXPRESS_PORT), () => {
  logger('info', `Script service listening on port ${EXPRESS_PORT}!`)
})
