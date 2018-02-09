let fs = require('fs')
let file = `${process.argv[2]}`
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
    result = JSON.stringify(valueParser(str)[0], null, 2)
  } catch (e) {
    throw Error('Invalid JSON')
  }
  console.log('\nFINAL RESULT :\n', result)
})

function valueParser (input) {
  if (whiteSpaceParser(input)) {
    input = whiteSpaceParser(input)[1]
  }
  return arrayParser(input) ||
            objectParser(input) ||
            boolParser(input) ||
            stringParser(input) ||
            numberParser(input) ||
            nullParser(input)
}

function nullParser (input) {
  if (input.slice(0, 4) !== 'null') {
    return null
  }
  return [null, input.slice(4)]
}

function boolParser (input) {
  let regex = /^(true|false)/
  let match = input.match(regex)
  if (!match) {
    return null
  }
  let bool = match[0] === 'true'
  return [bool, input.slice(match[0].length)]
}

function stringParser (input) {
  let regex = /^"([^"\\]|\\"|\\n)*"/
  let match = input.match(regex)
  if (!match) {
    return null
  }
  let strg = match[0].slice(1, -1)
  return [strg, input.slice(match[0].length)]
}

function numberParser (input) {
  let regex = /^(-)?(0|\d+)(\.\d+)?((e|E)(\+|-)?\d+)?/
  let match = input.match(regex)
  if (!match) {
    return null
  }
  let num = Number(match[0])
  return [num, input.slice(match[0].length)]
}

function arrayParser (arrayString) {
  if (!arrayString.startsWith('[')) {
    return null
  }
  let arr = []
  arrayString = arrayString.slice(1)
  while (true) {
    if (whiteSpaceParser(arrayString)) {
      arrayString = whiteSpaceParser(arrayString)[1]
    }
    if (valueParser(arrayString)) {
      arr.push(valueParser(arrayString)[0])
      arrayString = valueParser(arrayString)[1]
    } else if (!arrayString.startsWith(']')) {
      throw Error('Invalid JSON : Excepted "]"')
    }
    if (whiteSpaceParser(arrayString)) {
      arrayString = whiteSpaceParser(arrayString)[1]
    }
    if (arrayString.startsWith(',')) {
      arrayString = arrayString.slice(1)
      continue
    } else if (arrayString.startsWith(']')) {
      arrayString = arrayString.slice(1)
      break
    } else {
      throw Error('Invalid JSON : Excepted "]"')
    }
  }
  return [arr, arrayString]
}

function objectParser (objectString) {
  if (!objectString.startsWith('{')) {
    return null
  }
  let obj = {}
  let expectingNextPair = false
  objectString = objectString.slice(1)
  while (true) {
    if (whiteSpaceParser(objectString)) {
      objectString = whiteSpaceParser(objectString)[1]
    }
    if (objectString.startsWith('}') && !expectingNextPair) {
      objectString = objectString.slice(1)
      break
    } else if (!expectingNextPair && !stringParser(objectString)) {
      throw Error('Invalid JSON')
    } else if (expectingNextPair && !stringParser(objectString)) {
      throw Error('Invalid JSON : Expecting next key value pair')
    }
    let key = stringParser(objectString)[0]
    objectString = stringParser(objectString)[1]
    if (whiteSpaceParser(objectString)) {
      objectString = whiteSpaceParser(objectString)[1]
    }
    if (!objectString.startsWith(':')) {
      throw Error('Invalid JSON : Expected ":"')
    }
    objectString = objectString.slice(1)
    if (whiteSpaceParser(objectString)) {
      objectString = whiteSpaceParser(objectString)[1]
    }
    let value = ''
    if (valueParser(objectString)) {
      value = valueParser(objectString)[0]
      objectString = valueParser(objectString)[1]
    } else {
      throw Error('Invalid JSON : Invalid value')
    }
    obj[key] = value
    expectingNextPair = false
    if (whiteSpaceParser(objectString)) {
      objectString = whiteSpaceParser(objectString)[1]
    }
    if (objectString.startsWith(',')) {
      objectString = objectString.slice(1)
      expectingNextPair = true
      continue
    } else if (objectString.startsWith('}')) {
      objectString = objectString.slice(1)
      break
    } else {
      throw Error('Invalid JSON')
    }
  }
  return [obj, objectString]
}

function whiteSpaceParser (input) {
  let regex = /^\s+/
  let match = input.match(regex)
  if (!match) {
    return null
  }
  return [match[0], input.replace(regex, '')]
}
