const { JWT_SECRET, EXPRESS_PORT } = require('./config')
const { logger } = require('@vtfk/logger')
const express = require('express')
const jwt = require('express-jwt')

const app = express()

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
