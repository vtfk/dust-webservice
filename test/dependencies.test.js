const { dependencies, devDependencies } = require('../package.json')

// import all dependencies to check that everything will work
test('test dependencies', () => {
  Object.keys(dependencies).forEach(dependency => {
    expect(require(dependency)).toEqual(expect.anything())
  })
})

// import all development dependencies to check that everything will work
test('test development dependencies', () => {
  Object.keys(devDependencies).forEach(dependency => {
    expect(require(dependency)).toEqual(expect.anything())
  })
})
