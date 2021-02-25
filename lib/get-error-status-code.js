module.exports = message => {
  const statuses = [
    {
      code: 400, // bad request
      texts: [
        'missing',
        'failed'
      ]
    },
    {
      code: 404, // not found
      texts: [
        'not found'
      ]
    }
  ]

  const statusCode = statuses.find(status => {
    return status.texts.find(text => {
      return message.toLowerCase().includes(text.toLowerCase())
    })
  })

  return (statusCode && statusCode.code) || 500
}
