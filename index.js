const invokePSFile = require('./lib/invoke-ps-file');

const config = require('./config');
const express = require('express');
const app = express();

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

  if (!req.body.filePath) {
    res.json({
      statusCode: 500,
      message: "filePath is required"
    });
    return;
  }

  res.send(invokePSFile(req.body.filePath, req.body.args || undefined));
});

app.listen(config.EXPRESS_PORT, () => {
  console.log(`DUST service listening on port ${config.EXPRESS_PORT}!`);
});
