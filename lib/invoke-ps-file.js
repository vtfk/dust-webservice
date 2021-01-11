const { exec } = require('child_process')

const parseArgs = args => {
  let argumemts = '';
  for (key of Object.keys(args)) {
    argumemts += `-${key} ${args[key]} `;
  }
  return argumemts;
}

const invoke = (filePath, args) => {
  if (!filePath) {
    return new Error(`'filePath' must be set`);
  }

  if (args && typeof args !== 'object') {
    return new Error(`'args' must be object`);
  }

  const cmd = `powershell.exe -NoLogo -ExecutionPolicy ByPass -File '${filePath}'${args ? ` ${parseArgs(args)}` : ''}`;
  const proc = exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution of '${cmd}' caused an error:`, error.stack);
      console.error('Error code:', error.code);
      console.error('Signal received:', error.signal);
      return new Error(`Execution of '${cmd}' caused an error:`, error.stack);
    }

    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    return stdout;
  });
}

module.exports = invoke;
