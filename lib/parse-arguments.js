module.exports = args => {
  let argumemts = '';
  for (key of Object.keys(args)) {
    argumemts += `-${key} ${typeof args[key] === 'string' ? `'${args[key]}'` : args[key]} `;
  }
  return argumemts;
}
