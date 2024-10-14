import { Variable } from "./variable.js";

export class Executer{
    variableArray = [];
    /** @type {string[]} */
    #processArray;
    nowPoint = 0;
    variableObject = {};
    constructor(processArray){
        this.#processArray = processArray;
    }
    startExe(){
        let targetVariable;
        for(let i=0;i<this.#processArray.length;i++){
            if(!this.#processArray[i].startsWith("@"))continue;
            if(this.#processArray[i]=="@DEF"){
                targetVariable = new Variable(this.#processArray[i+1]);
                this.variableArray.push(targetVariable);
            }else if(this.#processArray[i]=="@IN"){
                targetVariable.in(this.#processArray[i+1]);
            }else if(this.#processArray[i]=="@END"){
                this.variableArray.push(targetVariable);
            }else{
                targetVariable.methodSwitch(this.#processArray[i],this.#processArray[i+1]);
            }
        }
    }
}

