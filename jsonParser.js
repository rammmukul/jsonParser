exports.parseJSON = valueParser

function valueParser (input) {
  input = consumeWhiteSpace(input)
  return nullParser(input) ||
            boolParser(input) ||
            numberParser(input) ||
            stringParser(input) ||
            arrayParser(input) ||
            objectParser(input)
}

function nullParser (input) {
  if (input.slice(0, 4) !== 'null') {
    return null
  }
  return [null, input.slice(4)]
}

function boolParser (input) {
  let regex = /^(?:true|false)/
  let match = input.match(regex)
  if (!match) {
    return null
  }
  let bool = match[0] === 'true'
  return [bool, input.slice(match[0].length)]
}

function stringParser (input) {
  let regex = /^"(?:\\"|.)*?"/
  let match = input.match(regex)
  if (!match) {
    return null
  }
  let strg = match[0].slice(1, -1)
  strg = strg.replace(/\\\\/g, '\\')
  strg = strg.replace(/\\\//g, '/')
  strg = strg.replace(/\\b/g, '\b')
  strg = strg.replace(/\\f/g, '\f')
  strg = strg.replace(/\\n/g, '\n')
  strg = strg.replace(/\\r/g, '\r')
  strg = strg.replace(/\\t/g, '\t')
  strg = strg.replace(/\\u([\dABCDEFabcdef]{4})/gu, unicode)
  return [strg, input.slice(match[0].length)]
}

function numberParser (input) {
  let regex = /^(?:-)?(?:0|\d+)(?:\.\d+)?(?:(?:e|E)(?:\+|-)?\d+)?/
  let match = input.match(regex)
  if (!match) {
    return null
  }
  let num = Number(match[0])
  if (-Infinity === num || num === Infinity) {
    throw Error('Invalid JSON : Number out of range')
  }
  return [num, input.slice(match[0].length)]
}

function arrayParser (arrayString) {
  if (!arrayString.startsWith('[')) {
    return null
  }
  let arr = []
  arrayString = arrayString.slice(1)
  let expectingNextElement = false
  while (true) {
    arrayString = consumeWhiteSpace(arrayString)
    let result = valueParser(arrayString)
    if (result) {
      arr.push(result[0])
      arrayString = result[1]
      expectingNextElement = false
    } else if (!arrayString.startsWith(']')) {
      throw Error('Invalid JSON : Excepted "]"')
    }
    arrayString = consumeWhiteSpace(arrayString)
    if (arrayString.startsWith(',')) {
      arrayString = arrayString.slice(1)
      expectingNextElement = true
      continue
    } else if (arrayString.startsWith(']') && !expectingNextElement) {
      arrayString = arrayString.slice(1)
      break
    } else {
      throw Error('Invalid JSON')
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
    objectString = consumeWhiteSpace(objectString)
    let parsedStr = stringParser(objectString)
    if (objectString.startsWith('}') && !expectingNextPair) {
      objectString = objectString.slice(1)
      break
    } else if (!expectingNextPair && !parsedStr) {
      throw Error('Invalid JSON')
    } else if (expectingNextPair && !parsedStr) {
      throw Error('Invalid JSON : Expecting next key value pair')
    }
    let key = parsedStr[0]
    objectString = parsedStr[1]
    objectString = consumeWhiteSpace(objectString)
    if (!objectString.startsWith(':')) {
      throw Error('Invalid JSON : Expected ":"')
    }
    objectString = objectString.slice(1)
    objectString = consumeWhiteSpace(objectString)
    let value = ''
    let parsedValue = valueParser(objectString)
    if (parsedValue) {
      value = parsedValue[0]
      objectString = parsedValue[1]
    } else {
      throw Error('Invalid JSON : Invalid value')
    }
    obj[key] = value
    expectingNextPair = false
    objectString = consumeWhiteSpace(objectString)
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

function consumeWhiteSpace (input) {
  let result = whiteSpaceParser(input)
  if (result) {
    input = result[1]
  }
  return input
}

function unicode (match, p1) {
  return String.fromCharCode(parseInt(p1, 16))
}
