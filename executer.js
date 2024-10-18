import { OpID, Variable } from "./variable.js";

export class Executer{
    /** @type {Variable[]} */
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
            if(typeof this.nowScope[i] != "string")continue;
            if(!this.nowScope[i]?.startsWith("@"))continue;
            //console.log(this.nowScope[i]);
            if(this.nowScope[i]=="@DEF"){
                if(targetVariable)this.variableArray.push(targetVariable);
                const existVariable = this.variableArray.find(v => v.getName()==this.nowScope[i+1]);
                if(existVariable) targetVariable = existVariable;
                else targetVariable = new Variable(this.nowScope[i+1]);
            }else if(this.nowScope[i]=="@IN"){
                let arg = this.nowScope[i+1]
                if(!/^"[^"]*"/.test(arg)) {
                    arg *= 1; //数値変換
                    if(isNaN(arg))arg = this.variableArray.find(v => v.getName()==this.nowScope[i+1])?.getValue();
                }
                targetVariable.in(arg);
            }else if(this.nowScope[i]=="@COPY"){
                targetVariable = this.variableArray.find(v => v.getName()==this.nowScope[i+1])?.getValue();
            }else if(this.nowScope[i]=="@END"){
                targetVariable = this.variableArray.pop();
            }else if(OpID.NumAll.includes(this.nowScope[i])){
                targetVariable.numberMethodSwitch(this.nowScope[i],this.nowScope[i+1]);
            }else if(OpID.BoolAll.includes(this.nowScope[i])){
                targetVariable.boolMethodSwitch(this.nowScope[i],this.nowScope[i+1]);
            }else if(this.nowScope[i]==OpID.THEN||this.nowScope[i]==OpID.DO){
                if(!targetVariable.getBool()&&this.nowScope[i]==OpID.THEN){
                    continue;
                }
                this.variableArray.push(targetVariable);
                const arg = this.nowScope[i+1]
                this.nowScope = this.#processArray[arg];
                pointStack.push(i+1);
                i=-1;   //終了時に++されるので0になる
                returnScope.push(this.nowPoint);
            }else if(this.nowScope[i]==OpID.BACK||this.nowScope[i]==OpID.BREAK){
                if(this.nowScope[i]==OpID.BREAK)targetVariable = this.variableArray.pop();
                this.nowPoint = returnScope.pop();
                this.nowScope = this.#processArray[this.nowPoint];
                i = pointStack.pop();
            }else if(this.nowScope[i]==OpID.FLAG){
                targetVariable.flag(this.nowScope[i+1],i);
            }else if(this.nowScope[i]==OpID.JUMP){
                i = targetVariable.getFlag(this.nowScope[i+1]);
            }else if(this.nowScope[i]==OpID.SKIP){
                if(!targetVariable.getBool())continue;
                i += this.nowScope[i+1]*2;
            }
        }
    }
}

