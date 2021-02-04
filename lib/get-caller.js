module.exports = req => {
  return (req.user && req.user.caller) || req.headers['x-forwarded-for'] || req.socket.remoteAddress
}
