let fs = require('fs')
let file = `${process.argv[2]}`
let parser = require('./jsonParser.js')
fs.readFile(file, 'utf-8', (error, str) => {
  if (error) {
    throw error
  }
  console.log('String:\n', str)
  console.log('\n\n\n')
  console.log('*******************************************')
  console.log('\n\n\n')
  let start = Date.now()
  let result = JSON.stringify(parser.parseJSON(str)[0], null, 2)
  let stop = Date.now()
  console.log('\nFINAL RESULT :\n', result)
  console.log('In : ', stop - start, 'ms')
})
