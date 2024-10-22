import { OpID } from "./variable.js";

export class Parser{
    /** @type {any[]} */
    scopeArray = [];
    scopeIndex = 0;
    /**
     * @param {String} fileStr 
     */
    constructor(fileStr){
        fileStr = fileStr.replace(/\s+/g, '');

        this.scopeArray[this.scopeIndex] = [];
        let splitStart = 0;
        /** @type {number[]} */
        let returnScope = [];
        let isHead = true;
        for(let i=0;i<fileStr.length;i++){
            switch(fileStr[i]){
                case ".":{
                    const word = fileStr.substring(splitStart,i);
                    if(isHead){
                        this.scopeArray[this.scopeIndex].push("@DEF", word);
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
                    this.scopeArray[this.scopeIndex].push(word);
                    splitStart = i;
                    break;
                }
                case ")":{
                    if(splitStart==i)break;
                    const word = fileStr.substring(splitStart,i);
                    this.scopeArray[this.scopeIndex].push(word);
                    splitStart = i;
                    break;
                }
                case "{":{
                    returnScope.push(this.scopeIndex);
                    this.scopeArray[this.scopeIndex].push(this.scopeArray.length);
                    this.scopeIndex = this.scopeArray.length;
                    this.scopeArray[this.scopeIndex] = [];
                    isHead = true;
                    splitStart = i+1;
                    break;
                }
                case "}":{
                    this.scopeArray[this.scopeIndex].push("@BACK");
                    this.scopeIndex = returnScope.pop();
                    isHead = false;
                    splitStart = i+1;
                    break;
                }
                case ";":{
                    this.scopeArray[this.scopeIndex].push("@END");
                    isHead = true;
                    splitStart = i+1;
                    break;
                }
            }
        }
        //this.scopeArray[this.scopeIndex].push("@FILE_END");
    }
    methodSwitch(word){
        switch(word){
            case ".in":{
                this.scopeArray[this.scopeIndex].push(OpID.IN);
                break;
            }
            case ".del":{
                this.scopeArray[this.scopeIndex].push(OpID.DEL);
                break;
            }
            case ".copy":{
                this.scopeArray[this.scopeIndex].push(OpID.COPY);
                break;
            }
            case ".add":{
                this.scopeArray[this.scopeIndex].push(OpID.ADD);
                break;
            }
            case ".sub":{
                this.scopeArray[this.scopeIndex].push(OpID.SUB);
                break;
            }
            case ".multi":{
                this.scopeArray[this.scopeIndex].push(OpID.MUL);
                break;
            }
            case ".div":{
                this.scopeArray[this.scopeIndex].push(OpID.DIV);
                break;
            }
            case ".mod":{
                this.scopeArray[this.scopeIndex].push(OpID.MOD);
                break;
            }
            case ".pow":{
                this.scopeArray[this.scopeIndex].push(OpID.POW);
                break;
            }
            case ".print":{
                this.scopeArray[this.scopeIndex].push(OpID.PRINT);
                break;
            }
            case ".equal":{
                this.scopeArray[this.scopeIndex].push(OpID.EQUAL);
                break;
            }
            case ".less":{
                this.scopeArray[this.scopeIndex].push(OpID.LESS);
                break;
            }
            case ".more":{
                this.scopeArray[this.scopeIndex].push(OpID.MORE);
                break;
            }
            case ".and":{
                this.scopeArray[this.scopeIndex].push(OpID.AND);
                break;
            }
            case ".or":{
                this.scopeArray[this.scopeIndex].push(OpID.OR);
                break;
            }
            case ".not":{
                this.scopeArray[this.scopeIndex].push(OpID.NOT);
                break;
            }
            case ".flag":{
                this.scopeArray[this.scopeIndex].push(OpID.FLAG);
                break;
            }
            case ".jump":{
                this.scopeArray[this.scopeIndex].push(OpID.JUMP);
                break;
            }
            case ".skip":{
                this.scopeArray[this.scopeIndex].push(OpID.SKIP);
                break;
            }
            case ".then":{
                this.scopeArray[this.scopeIndex].push(OpID.THEN);
                break;
            }
            case ".nop":{
                this.scopeArray[this.scopeIndex].push(OpID.NOP);
                break;
            }
            case ".break":{
                this.scopeArray[this.scopeIndex].push(OpID.BREAK);
                break;
            }
            case ".funcDef":{
                this.scopeArray[this.scopeIndex].push(OpID.FUNC);
                break;
            }
            case ".argIn":{
                this.scopeArray[this.scopeIndex].push(OpID.ARG_IN);
                break;
            }
            case ".argOut":{
                this.scopeArray[this.scopeIndex].push(OpID.ARG_OUT);
                break;
            }
            case ".return":{
                this.scopeArray[this.scopeIndex].push(OpID.RETURN);
                break;
            }
            case ".exe":{
                this.scopeArray[this.scopeIndex].push(OpID.EXE);
                break;
            }
        }
    }
}