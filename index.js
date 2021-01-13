const express = require('express')
const app = express()

const handler = require('./lib/handler')
const config = require('./config')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('etag', false) // disable cache

// ROUTES
app.get('/', handler.getFrontpage) // default endpoint to list out what I can do
app.get('/:service/invoke', handler.invokeService) // endpoint for invoking scriptname in given service
app.get('/invoke/psfile', handler.invokePSFile) // endpoint for invoking script by full path

// start server on specified port
app.listen(Number.parseInt(config.EXPRESS_PORT), () => {
  console.log(`Script service listening on port ${config.EXPRESS_PORT}!`)
})
