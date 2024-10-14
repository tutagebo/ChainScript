export class Parser{
    /** @type {string[]} */
    processArray = [];
    /**
     * @param {String} fileStr 
     */
    constructor(fileStr){
        fileStr = fileStr.replace(/\s+/g, '');
        let splitStart = 0;
        let isHead = true;
        for(let i=0;i<fileStr.length;i++){
            switch(fileStr[i]){
                case ".":{
                    const word = fileStr.substring(splitStart,i);
                    if(isHead){
                        this.processArray.push("@DEF", word);
                        isHead = false;
                    }
                    splitStart = i;
                    break;
                }
                case "(":{
                    const word = fileStr.substring(splitStart,i);
                    if(!word.startsWith("."))break;
                    this.methodSwitch(word);
                    splitStart = i+1;
                    break;
                }
                case ",":{
                    const word = fileStr.substring(splitStart,i);
                    this.processArray.push(word);
                    splitStart = i;
                    break;
                }
                case ")":{
                    if(splitStart==i)break;
                    const word = fileStr.substring(splitStart,i);
                    this.processArray.push(word);
                    splitStart = i;
                    break;
                }
                case "{":{
                    splitStart = i;
                    break;
                }
                case "}":{
                    splitStart = i;
                    break;
                }
                case ";":{
                    this.processArray.push("@END");
                    isHead = true;
                    splitStart = i;
                    break;
                }
            }
        }
        //this.processArray.push("@FILE_END");
    }
    methodSwitch(word){
        switch(word){
            case ".in":{
                this.processArray.push("@IN");
                break;
            }
            case ".add":{
                this.processArray.push("@ADD");
                break;
            }
            case ".sub":{
                this.processArray.push("@SUB");
                break;
            }
            case ".multi":{
                this.processArray.push("@MUL");
                break;
            }
            case ".div":{
                this.processArray.push("@DIV");
                break;
            }
            case ".mod":{
                this.processArray.push("@MOD");
                break;
            }
            case ".pow":{
                this.processArray.push("@POW");
                break;
            }
            case ".print":{
                this.processArray.push("@PRINT");
                break;
            }
        }
    }
}