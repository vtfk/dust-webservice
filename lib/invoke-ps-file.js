const { exec } = require('child_process');

const { MAX_BUFFER } = require('../config');

const parseArgs = require('./parse-arguments');

const invoke = (filePath, args) => {
  return new Promise(async (resolve, reject) => {
    if (!filePath) {
      return reject(new Error(`'filePath' must be set`));
    }

    if (args && typeof args !== 'object') {
      return reject(new Error(`'args' must be object`));
    }

    // set encoding directly in the console: "cmd.exe /c chcp 65001>nul &&"
    const cmd = `cmd.exe /c chcp 65001>nul && powershell.exe -NoLogo -ExecutionPolicy ByPass -Command "${filePath}"${args ? ` ${parseArgs(args)}` : ''}`;
    const proc = exec(cmd, { maxBuffer: Number.parseInt(MAX_BUFFER) }, (error, stdout, stderr) => {
      console.log(`${proc.pid}: exec cmd:`, cmd);

      if (stderr !== '') {
        console.log(`${proc.pid}: exec stderr:`, stderr);
        return reject(stderr);
      }
      if (error !== null) {
        console.log(`${proc.pid}: exec error:`, error);
        return reject(error);
      }

      return resolve(stdout);
    });
  })
}

module.exports = invoke;
