const parser = require('./jsonParser')

test('parse null', () => {
  expect(parser.parseJSON(`null`))
  .toEqual([null, ''])
})

test('parse array', () => {
  expect(parser.parseJSON(`[1,2,3]`))
  .toEqual([[1, 2, 3], ''])
})

test('parse true', () => {
  expect(parser.parseJSON(`true`))
  .toEqual([true, ''])
})

test('parse false', () => {
  expect(parser.parseJSON(`false`))
  .toEqual([false, ''])
})

test('parse number', () => {
  expect(parser.parseJSON(`132.2e-5`))
  .toEqual([132.2e-5, ''])
})

test('parse object', () => {
  expect(parser.parseJSON(`{ "key" : "value" }`))
  .toEqual([{ 'key': 'value' }, ''])
})

test('parse string', () => {
  expect(parser.parseJSON(`"String\\n \\u1234"`))
  .toEqual(['String\n ሴ', ''])
})

test('parse large number', () => {
  expect(() => parser.parseJSON(`132.2e520`))
  .toThrow()
})

test('parse tralling comma object', () => {
  expect(() => parser.parseJSON(`{ "ADSF":12, }`))
  .toThrow()
})

test('parse object only containing comma', () => {
  expect(() => parser.parseJSON(`{ , }`))
  .toThrow()
})

test('parse object only containing key', () => {
  expect(() => parser.parseJSON(`{"fkaljd"}`))
  .toThrow()
})

test('parse object only containing key:', () => {
  expect(() => parser.parseJSON(`{"fkaljd":}`))
  .toThrow()
})

test('parse array traling comma', () => {
  expect(() => parser.parseJSON(`[1,]`))
  .toThrow()
})

test('parse array containing True', () => {
  expect(() => parser.parseJSON(`[True]`))
  .toThrow()
})
