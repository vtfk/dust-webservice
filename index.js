const invokePSFile = require('./lib/invoke-ps-file');
const config = require('./config');

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  console.log('Hello world', req.ip);
  res.send('Poste ut en beskrivende oversikt over hva API\'en kan!');
});

app.get('/ps/file/invoke', (req, res) => {
  console.log(req.body);

  if (!req.body) {
    return res.json({
      statusCode: 500,
      message: "JSON input is required!"
    });
  }

  if (!req.body.filePath) {
    return res.json({
      statusCode: 500,
      message: "filePath is required"
    });
  }

  const result = invokePSFile(req.body.filePath, req.body.args || undefined);
  res.send(result);
  console.log("After exec og res send");
});

app.listen(config.EXPRESS_PORT, () => {
  console.log(`DUST service listening on port ${config.EXPRESS_PORT}!`);
});
