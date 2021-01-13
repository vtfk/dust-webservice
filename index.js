const invokePSFile = require('./lib/invoke-ps-file');
const config = require('./config');

const { existsSync } = require('fs');
const { join } = require('path');
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

// default endpoint to list out what I can do
app.get('/', (req, res) => {
  console.log('Hello world', req.headers['x-forwarded-for'] || req.socket.remoteAddress);
  res.send(`Poste ut en beskrivende oversikt over hva API\'en kan! ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
});

// endpoint for invoking scriptname in given service
app.get('/:service/invoke', (req, res) => {
  const caller = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!req.body) {
    return res.status(500).json({
      statusCode: 500,
      message: `JSON input is required for endpoint '${req.params.service}'!`
    });
  }

  if (!req.body.fileName) {
    return res.status(500).json({
      statusCode: 500,
      message: `'fileName' is required for endpoint '${req.params.service}'!`
    });
  }
  
  const servicePath = config[`${req.params.service.toUpperCase()}_PATH`];
  console.log(`${caller} ::`, 'Endpoint:', `'/${req.params.service}/invoke'`, 'ScriptPath:', `'${servicePath}'`);

  if (!servicePath || !existsSync(servicePath)) {
    return res.status(404).json({
      statusCode: 404,
      message: `'${req.params.service}' is not a valid script endpoint!`
    });
  }

  const filePath = join(servicePath, req.body.fileName);

  if (!existsSync(filePath)) {
    return res.status(404).json({
      statusCode: 404,
      message: `'${req.body.fileName}' is not a valid script for endpoint '${req.params.service}'!`
    });
  }

  invokePSFile(filePath, caller, req.body.args || undefined)
    .then(result => {
      const json = isValidJSON(result);
      json ? res.json(json) : res.send({
        statusCode: 200,
        message: result
      });
    })
    .catch(error => {
      console.log(`${caller} ::${error.stack}`);
      const json = isValidJSON(error.message);
      json ? res.status(500).json(json) : res.status(500).send({
        statusCode: 500,
        message: error.message
      });
    });
});

// endpoint for invoking script by full path
app.get('/invoke/psfile', (req, res) => {
  const caller = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!req.body) {
    return res.status(500).json({
      statusCode: 500,
      message: "JSON input is required!"
    });
  }

  if (!req.body.filePath) {
    return res.status(500).json({
      statusCode: 500,
      message: "'filePath' is required"
    });
  }

  if (!existsSync(req.body.filePath)) {
    return res.status(404).json({
      statusCode: 404,
      message: `'${req.body.filePath}' is not a valid script!`
    });
  }

  invokePSFile(req.body.filePath, caller, req.body.args || undefined)
    .then(result => {
      const json = isValidJSON(result);
      json ? res.json(json) : res.send({
        statusCode: 200,
        message: result
      });
    })
    .catch(error => {
      console.log(`${caller} :: ${error.stack}`)
      const json = isValidJSON(error.message);
      json ? res.status(500).json(json) : res.status(500).send({
        statusCode: 500,
        message: error.message
      });
    });
});

// start server on specified port
app.listen(Number.parseInt(config.EXPRESS_PORT), () => {
  console.log(`Script service listening on port ${config.EXPRESS_PORT}!`);
});
