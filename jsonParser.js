let toParse = `${process.argv[2]}`
console.log(valueParser(toParse))

function nullParser(input) {
    if (input.substring(0,4)!='null') {
        return null
    }

    return [null, input.substring(4)]
}

function whiteSpaceParser(input) {
    let regex = /^\s+/
    let match = input.match(regex)
    if (!match) {
        return null
    }

    return [match[0], input.slice(match[0].length)]
}

function boolParser(input) {
    let regex = /^(true|false)/
    let match = input.match(regex)
    if (!match) {
        return null
    }

    let bool = match[0] == 'true' ? true : false

    return [bool, input.slice(match[0].length)]
}

function stringParser(input) {
    let regex = /^"([^"\\]|\\")*"/
    let match = input.match(regex)
    if (!match) {
        return null
    }

    let bffr=match[0]
    let strg=""
    let prevEscape=false
    for(let i=1; i<bffr.length && bffr[i]!='"' && !prevEscape; i++){
        strg+=bffr[i]
        prevEscape=bffr[i]=='\\'
    }

    return [strg, input.slice(match[0].length)]
}


function numberParser(input) {
    let regex = /^(-)?(0|\d+)(\.\d+)?((e|E)(\+|-)?\d+)?/
    let match = input.match(regex)
    if (!match) {
        return null
    }
    
    let num = Number(match[0])

    return [num, input.slice(match[0].length)]
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
    let match = input.match(regex)
    if (!match) {
        return null
    }
    
    return [match[0], input.slice(match[0].length)]
}

function arrayParser(isArray){
    let regex = /^\[.*\]/
    if (!regex.test(isArray)) {
        return null
    }

    function openSquareParser(input){
        let openSquare = /^\[/
        let match = input.match(openSquare)
        if (!match) {
            return null
        }
        
        return [match[0], input.slice(match[0].length)]
    }
    
    function closeSquareParser(input){
        let closeSquare = /^\]/
        let match = input.match(closeSquare)
        if (!closeSquare.test(input)) {
            return null
        }
        
        return [match[0], input.slice(match[0].length)]
    }

    let arr=[]
    isArray=openSquareParser(isArray)[1]

    while(!closeSquareParser(isArray)){

        if(whiteSpaceParser(isArray)){
            isArray=whiteSpaceParser(isArray)[1]
        }

        if(valueParser(isArray)){
            arr.push(valueParser(isArray)[0])
            isArray=valueParser(isArray)[1]
        }

        if(whiteSpaceParser(isArray)){
            isArray=whiteSpaceParser(isArray)[1]
        }

        if(commaParser(isArray)){
            isArray=commaParser(isArray)[1]
        }
    }

    isArray=closeSquareParser(isArray)[1]

    return [arr,isArray]
}
