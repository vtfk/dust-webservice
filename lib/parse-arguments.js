module.exports = args => {
  let argumemts = '';
  for (key of Object.keys(args)) {
    argumemts += `-${key} ${args[key]} `;
  }
  return argumemts;
}
