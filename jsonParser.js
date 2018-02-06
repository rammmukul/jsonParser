input = `${process.argv[2]}`

function nullParser(input) {
    let regex = /^null/
    if (!regex.test(input)) {
        return null
    }

    return [null, input.replace(regex, '')]
}

function whiteSpaceParser(input) {
    let regex = /^\s+/
    if (!regex.test(input)) {
        return null
    }

    return [input.match(regex)[0], input.replace(regex, '')]
}

function boolParser(input) {
    let regex = /^(true|false)/
    if (!regex.test(input)) {
        return null
    }

    let bool = input.match(regex)[0] == 'true' ? true : false

    return [bool, input.replace(regex, '')]
}

function stringParser(input) {
    let regex = /^"([^"\\]|\\"|\\\\|\\\/|\\b|\\f|\\n|\\r|\\t)*"/
    if (!regex.test(input)) {
        return null
    }

    let bffr=input.match(regex)[0]
    let strg=bffr.replace(/\\\\/g,'\\')
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
    let regex = /^(-)?(0|\d+)(\.\d+)?((e|E)(\+|-)?\d+)?/
    if (!regex.test(input)) {
        return null
    }
    
    let num = Number(input.match(regex)[0])

    return [num, input.replace(regex, '')]
}

function valueParser(input){

    return boolParser(input)||
            stringParser(input)||
            numberParser(input)||
            arrayParser(input)||
            nullParser(input)
}

function commaParser(input){
    let regex = /^,/
    if (!regex.test(input)) {
        return null
    }
    
    return [input.match(regex)[0], input.replace(regex, '')]
}

function openSquareParser(input){
    let regex = /^\[/
    if (!regex.test(input)) {
        return null
    }
    
    return [input.match(regex)[0], input.replace(regex, '')]
}

function closeSquareParser(input){
    let regex = /^\]/
    if (!regex.test(input)) {
        return null
    }
    
    return [input.match(regex)[0], input.replace(regex, '')]
}

function arrayParser(input){
    let regex = /^\[.*\]/
    if (!regex.test(input)) {
        return null
    }

    let arr=[]
    input=openSquareParser(input)[1]

    while(!closeSquareParser(input)){

        if(whiteSpaceParser(input)){
            input=whiteSpaceParser(input)[1]
        }

        if(valueParser(input)){
            arr.push(valueParser(input)[0])
            input=valueParser(input)[1]
        }

        if(whiteSpaceParser(input)){
            input=whiteSpaceParser(input)[1]
        }

        if(commaParser(input)){
            input=commaParser(input)[1]
        }
    }

    input=closeSquareParser(input)[1]

    return [arr,input]
}

console.log(valueParser(input))
