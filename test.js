class ParseTreeRoot {
    /** the first name in the string */
    name;
}

class ParseTreeNode {
    /** the name of the first element */
    name;
    /** the token immidietly following the name */
    token;
}


function parseSymbols(inputString){
    let setMinus = "∖";
    let setIntersect = "∩";
    let setInclusion = "∪";
  
    inputString=inputString.replace(/\<U\+2216\>/gi,setMinus) // set minus
    inputString=inputString.replace(/\<U\+2229\>/gi,setIntersect) // set intersection
    inputString=inputString.replace(/\<U\+222A\>/gi,setInclusion) // set inclusion
  
    // Regular expression to match symbols inside parentheses
    const parenthisisRegex = /\((.*?)\)/g;
    const nextSymbolregex = /(?<name>.*?)(?<token>∖|∩|∪)/

    let tree = {};
  
    let match;
    if((match = regex.exec(parenthisisRegex)) !== null){ //if this is true then there exists nested elements we must deal with first
  
    } else { //base case, if we are here there are no nested elements and we can evaluate the string
        while((match = regex.exec(parenthisisRegex)) !== null){//while there exist more symbols to parse

        }
    }
}

let exampleString=`
hicexploerer_5000∩lasca_5000∩mustache_5000
(lasca_5000∩>mustache_5000)∖(hicexploerer_5000)
(hicexploerer_5000∩mustache_5000)∖(lasca_5000)
(mustache_5000)∖(hicexploerer_5000∪lasca_5000)
(hicexploerer_5000∩lasca_5000)∖(mustache_5000)
(lasca_5000)<U+2216>(hicexploerer_5000∪mustache_5000)
(hicexploerer_5000)∖>(lasca_5000∪mustache_5000)
`