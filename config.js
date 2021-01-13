require('dotenv').config()

module.exports = {
  EXPRESS_PORT: process.env.EXPRESS_PORT || 3000,
  MAX_BUFFER: process.env.MAX_BUFFER || 1024*10000,
  DUST_PATH: process.env.DUST_PATH || '.'
}
