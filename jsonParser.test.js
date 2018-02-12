const parser = require('./jsonParser')

test('parse null', () => {
  expect(parser.parseJSON(`null`))
  .toEqual([null, ''])
})

test('parse array', () => {
  expect(parser.parseJSON(`[1,2,3]`))
  .toEqual([[1,2,3], ''])
})

test('parse true', () => {
  expect(parser.parseJSON(`true`))
  .toEqual([true, ''])
})

test('parse false', () => {
  expect(parser.parseJSON(`false`))
  .toEqual([false, ''])
})

test('parse large number', () => {
  expect(parser.parseJSON(`132.2e520`))
  .toEqual([132.2e520, ''])
})

test('parse number', () => {
  expect(parser.parseJSON(`132.2e-5`))
  .toEqual([132.2e-5, ''])
})

test('parse object', () => {
  expect(parser.parseJSON(`{ "key" : "value" }`))
  .toEqual([{ "key" : "value" }, '']) 
})

test('parse string', () => {
  expect(parser.parseJSON(`String 
  `))
  .toEqual([`String 
  `, ''])
})
