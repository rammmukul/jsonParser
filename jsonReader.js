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
    let result
    try {
      result = JSON.stringify(parser.parseJSON(str)[0], null, 2)
    } catch (e) {
      throw Error('Invalid JSON')
    }
    console.log('\nFINAL RESULT :\n', result)
  })
  