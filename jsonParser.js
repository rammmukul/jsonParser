input = `${process.argv[2]}`

console.log(stringParser(input))

function nullParser(input) {
    regex = /^null/
    if (!regex.test(input)) {
        return null
    }

    return [input.match(regex)[0], input.replace(regex, '')]
}

function whiteSpaceParser(input) {
    regex = /^\s+/
    if (!regex.test(input)) {
        return null
    }

    return [input.match(regex)[0], input.replace(regex, '')]
}

function boolParser(input) {
    regex = /^(true|false)/
    if (!regex.test(input)) {
        return null
    }

    bool = input.match(regex)[0] == 'true' ? true : false

    return [bool, input.replace(regex, '')]
}

function stringParser(input) {
    regex = /^"([^"\\]|\\"|\\\\|\\\/|\\b|\\f|\\n|\\r|\\t)*"/
    if (!regex.test(input)) {
        return null
    }

    bffr=input.match(regex)[0]
    strg=bffr.replace(/\\\\/g,'\\')
    strg=strg.replace(/\\\//g,'\/')
    strg=strg.replace(/\\b/g,'\b')
    strg=strg.replace(/\\f/g,'\f')
    strg=strg.replace(/\\n/g,'\n')
    strg=strg.replace(/\\r/g,'\r')
    strg=strg.replace(/\\t/g,'\t')
    strg=strg.replace(/^"/g,'')
    strg=strg.replace(/"$/g,'')


    return [strg, input.replace(regex, '')]
}


function numberParser(input) {
    regex = /^(-)?(0|\d+)(\.\d+)?((e|E)(\+|-)?\d+)?/
    if (!regex.test(input)) {
        return null
    }
    
    num = Number(input.match(regex)[0])

    return [num, input.replace(regex, '')]
}

function valueParser(input){
    return nullParser(input) || 
            boolParser(input)||
            stringParser(input)||
            numberParser(input)
}