// let toParse = `${process.argv[2]}`
// console.log(whiteSpaceParser(toParse))
let fs = require('fs')
let file = './twitter.json'
fs.readFile(file, 'utf-8', function read(error, str) {
  if (error) throw error
  console.log(str);
  let result = JSON.stringify(valueParser(str))
  console.log('\nFINAL RESULT : ', result);
});


function valueParser(input){
    if(whiteSpaceParser(input)){
        input=whiteSpaceParser(input)[1]
    }

    return arrayParser(input)||
            objectParser(input)||
            boolParser(input)||
            stringParser(input)||
            numberParser(input)||
            nullParser(input)
}

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

    return [match[0], input.replace(regex,'')]
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
    let regex = /^"([^"\\]|\\"|\\n)*"/
    let match = input.match(regex)
    if (!match) {
        return null
    }

    let bffr=match[0]
    let strg=""
    let prevEscape=false
    for(let i=1; i<bffr.length && (bffr[i]!='"' || !prevEscape); i++){
        strg += prevEscape ? '"' : bffr[i]
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

function objectParser(isObject){
    if (!openCurlyParser(isObject)) {
        return null
    }

    function openCurlyParser(input){
        let openSquare = /^\{/
        let match = input.match(openSquare)
        if (!match) {
            return null
        }
        
        return [match[0], input.slice(match[0].length)]
    }
    
    function closeCurlyParser(input){
        let closeSquare = /^\}/
        let match = input.match(closeSquare)
        if (!closeSquare.test(input)) {
            return null
        }
        
        return [match[0], input.slice(match[0].length)]
    }

    function colenParser(input){
        let colen = /^:/
        let match = input.match(colen)
        if (!match) {
            return null
        }
        
        return [match[0], input.slice(match[0].length)]
    }
    
    let obj={}
    isObject=openCurlyParser(isObject)[1]

    while(!closeCurlyParser(isObject)){

        if(whiteSpaceParser(isObject)){
            isObject=whiteSpaceParser(isObject)[1]
        }
        
        let key = stringParser(isObject)[0]
        isObject = stringParser(isObject)[1]

        if(whiteSpaceParser(isObject)){
            isObject=whiteSpaceParser(isObject)[1]
        }

        isObject=colenParser(isObject)[1]

        if(whiteSpaceParser(isObject)){
            isObject=whiteSpaceParser(isObject)[1]
        }

        let value = ''
        if(valueParser(isObject)){
            value = valueParser(isObject)[0]
            isObject = valueParser(isObject)[1]
        }

        obj[key]=value

        if(whiteSpaceParser(isObject)){
            isObject=whiteSpaceParser(isObject)[1]
        }

        if(commaParser(isObject)){
            isObject=commaParser(isObject)[1]
            continue
        }
        break
    }

    if(closeCurlyParser(isObject)){
        isObject=closeCurlyParser(isObject)[1]
    }

    return [obj,isObject]
}
