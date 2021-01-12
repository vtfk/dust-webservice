const invokePSFile = require('./lib/invoke-ps-file');
const { EXPRESS_PORT } = require('./config');

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('etag', false); // disable cache

const isValidJSON = str => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return false;
  }
}

app.get('/', (req, res) => {
  console.log('Hello world', req.ip);
  res.send('Poste ut en beskrivende oversikt over hva API\'en kan!');
});

app.get('/invoke/psfile', (req, res) => {
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

  invokePSFile(req.body.filePath, req.body.args || undefined)
    .then(result => {
      const json = isValidJSON(result);
      json ? res.json(json) : res.send({
        statusCode: 200,
        message: result
      });
    })
    .catch(error => {
      const json = isValidJSON(error);
      json ? res.status(500).json(json) : res.status(500).send({
        statusCode: 500,
        message: error
      });
    });
});

app.listen(Number.parseInt(EXPRESS_PORT), () => {
  console.log(`DUST service listening on port ${EXPRESS_PORT}!`);
});
