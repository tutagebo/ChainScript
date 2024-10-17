import { OpID, Variable } from "./variable.js";

export class Executer{
    variableArray = [];
    /** @type {string[]} */
    #processArray;
    nowScope = [];
    nowPoint = 0;
    variableObject = {};
    constructor(processArray){
        this.#processArray = processArray;
    }
    startExe(){
        /** @type {Variable} */
        let targetVariable = null;
        this.nowScope = this.#processArray[this.nowPoint];
        /** @type {number[]} */
        const returnScope = [];
        /** @type {number[]} */
        const pointStack = [];
        for(let i=0;i<this.nowScope.length;i++){
            if(!this.nowScope[i].startsWith("@"))continue;
            console.log(this.nowScope[i]);
            if(this.nowScope[i]=="@DEF"){
                if(targetVariable)this.variableArray.push(targetVariable);
                targetVariable = new Variable(this.nowScope[i+1]);
            }else if(this.nowScope[i]=="@IN"){
                targetVariable.in(this.nowScope[i+1]);
            }else if(this.nowScope[i]=="@END"){
                targetVariable = this.variableArray.pop();
            }else if(OpID.NumAll.includes(this.nowScope[i])){
                targetVariable.numberMethodSwitch(this.nowScope[i],this.nowScope[i+1]);
            }else if(OpID.BoolAll.includes(this.nowScope[i])){
                targetVariable.boolMethodSwitch(this.nowScope[i],this.nowScope[i+1]);
            }else if(this.nowScope[i]==OpID.THEN){
                if(!targetVariable.getBool()){
                    continue;
                }
                //this.variableArray.push(targetVariable);
                const arg = this.nowScope[i+1]
                this.nowScope = this.#processArray[arg];
                pointStack.push(i+1);
                i=-1;   //終了時に++されるので0になる
                returnScope.push(this.nowPoint);
            }else if(this.nowScope[i]==OpID.BACK){
                this.nowPoint = returnScope.pop();
                this.nowScope = this.#processArray[this.nowPoint];
                i = pointStack.pop();
            }else if(this.nowScope[i]==OpID.FLAG){
                targetVariable.flag(this.nowScope[i+1],i);
            }else if(this.nowScope[i]==OpID.JUMP){
                targetVariable.getFlag(this.nowScope[i+1]);
            }
        }
    }
}

