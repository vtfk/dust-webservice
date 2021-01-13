const { exec } = require('child_process');

const { MAX_BUFFER } = require('../config');

const parseArgs = require('./parse-arguments');
const sanitizeError = require('./sanitize-error');

const invoke = (filePath, caller, args) => {
  return new Promise(async (resolve, reject) => {
    if (!filePath) {
      return reject(new Error(`'filePath' must be set`));
    }

    if (args && typeof args !== 'object') {
      return reject(new Error(`'args' must be object`));
    }

    // set encoding directly in the console: "cmd.exe /c chcp 65001>nul &&"
    const cmd = `cmd.exe /c chcp 65001>nul && powershell.exe -NoLogo -ExecutionPolicy ByPass -Command "${filePath}"${args ? ` ${parseArgs(args)}` : ''}`;
    console.log(`${caller} :: exec starting :: ${new Date().toISOString()} :: exec cmd:`, cmd);
    const proc = exec(cmd, { maxBuffer: Number.parseInt(MAX_BUFFER) }, (error, stdout, stderr) => {
      if (stderr !== '') {
        console.log(`${caller} :: exec stderr :: ${new Date().toISOString()} :: ${proc.pid}`);
        return reject(new Error(sanitizeError(filePath, stderr)));
      }
      if (error !== null) {
        console.log(`${caller} :: exec error :: ${new Date().toISOString()} :: ${proc.pid}`);
        return reject(new Error(sanitizeError(filePath, error)));
      }

      console.log(`${caller} :: exec finished :: ${new Date().toISOString()} :: ${proc.pid}`);
      return resolve(stdout);
    });
  })
}

module.exports = invoke;
