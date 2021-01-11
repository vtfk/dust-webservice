var express = require('express');
var app = express();

app.get('/', (req, res) => {
  console.log('Hello world', req.ip);
  res.send('Poste ut en beskrivende oversikt over hva API\'en kan!');
});

app.get('/ps/file/invoke', (req, res) => {
  if (!req.body) {
    res.json({
      statusCode: 500,
      message: "Body is required"
    });
    return;
  }
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
