input = process.argv[2]

console.log(stringParser(input))

function nullParser(input) {
    regex = /^null/u
    if (!regex.test(input)) {
        return null
    }

    return [input.match(regex)[0], input.replace(regex, '')]
}

function whiteSpaceParser(input) {
    regex = /^\s+/u
    if (!regex.test(input)) {
        return null
    }

    return [input.match(regex)[0], input.replace(regex, '')]
}

function boolParser(input) {
    regex = /^(true|false)/u
    if (!regex.test(input)) {
        return null
    }

    bool = input.match(regex)[0] == 'true' ? true : false

    return [bool, input.replace(regex, '')]
}

function stringParser(input) {
    regex = /^"([^"\\])*"/u
    if (!regex.test(input)) {
        return null
    }
    bffr=input.match(regex)[0]
    strg=bffr.substring(1,bffr.length-1)

    return [strg, input.replace(regex, '')]
}


function numberParser(input) {
    regex = /^(-)?(0|\d+)(.\d+)?((e|E)(\+|-)?\d+)?/u
    if (!regex.test(input)) {
        return null
    }
    
    num = Number(input.match(regex)[0])

    return [num, input.replace(regex, '')]
}