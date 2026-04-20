import { OpID, Variable } from "./variable.js";

export class Executer{
    /** @type {Variable[]} */
    variableArray = [];
    /** @type {string[]} */
    #processArray;
    nowScope = [];
    nowPoint = 0;   //スコープのインデックス
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
        const argVariables = [];
        for(let i=0;i<this.nowScope.length;i++){
            //console.log(this.nowScope[i]);
            if(typeof this.nowScope[i] != "string")continue;
            if(!this.nowScope[i]?.startsWith("@"))continue;
            if(this.nowScope[i]=="@DEF"){
                if(targetVariable)this.variableArray.push(targetVariable);
                const existVariable = this.variableArray.find(v => v.getName()==this.nowScope[i+1]);
                if(existVariable) targetVariable = existVariable;
                else targetVariable = new Variable(this.nowScope[i+1]);
            }else if(this.nowScope[i]=="@IN"){
                let arg = changeVariable(this.nowScope[i+1],this.variableArray,targetVariable)
                targetVariable.in(arg);
            }else if(this.nowScope[i]=="@COPY"){
                targetVariable = this.variableArray.find(v => v.getName()==this.nowScope[i+1])?.getValue();
            }else if(this.nowScope[i]=="@END"){
            }else if(this.nowScope[i]==OpID.DEL){
                //targetVariable = this.variableArray.pop();
            }else if(OpID.NumAll.includes(this.nowScope[i])){
                let arg = changeVariable(this.nowScope[i+1],this.variableArray,targetVariable)
                targetVariable.numberMethodSwitch(this.nowScope[i],arg);
            }else if(OpID.BoolAll.includes(this.nowScope[i])){
                let arg = changeVariable(this.nowScope[i+1],this.variableArray,targetVariable)
                targetVariable.boolMethodSwitch(this.nowScope[i],arg);
            }else if(this.nowScope[i]==OpID.THEN||this.nowScope[i]==OpID.DO){
                if(!targetVariable.getBool()&&this.nowScope[i]==OpID.THEN){
                    continue;
                }
                this.variableArray.push(targetVariable);
                pointStack.push(i+1);
                returnScope.push(this.nowPoint);
                this.nowPoint = this.nowScope[i+1]
                this.nowScope = this.#processArray[this.nowPoint];
                i=-1;   //終了時に++されるので0になる
            }else if(this.nowScope[i]==OpID.BACK||this.nowScope[i]==OpID.BREAK){
                targetVariable = this.variableArray.pop();
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
            }else if(this.nowScope[i]==OpID.FUNC){
                targetVariable.defFunc(this.nowScope[i+1]);
            }else if(this.nowScope[i]==OpID.EXE){
                argVariables.push(targetVariable.getArg());
                this.variableArray.push(targetVariable);
                returnScope.push(this.nowPoint);
                const arg = this.nowScope[i+1];
                this.nowPoint = this.variableArray.find(v=>v.getName()==arg).getFuncScope();
                this.nowScope = this.#processArray[this.nowPoint];
                pointStack.push(i+1);
                i=-1;   //終了時に++されるので0になる
            }else if(this.nowScope[i]==OpID.ARG_IN){
                let arg = changeVariable(this.nowScope[i+1],this.variableArray,targetVariable)
                targetVariable.inArg(arg);
            }else if(this.nowScope[i]==OpID.ARG_OUT){
                targetVariable.in(argVariables.pop());
            }
        }
    }
}
/**
 * 
 * @param {string} target 
 * @param {Variable[]} vArray 
 * @param {Variable} vNow 
 * @returns 
 */
function changeVariable(target,vArray,vNow){
    let arg = target
    if(!/^"[^"]*"/.test(arg)) {
        arg *= 1; //数値変換
        if(isNaN(arg)){
            if(vNow.getName()==target)return vNow.getValue();
            return vArray.find(v => v.getName()==target)?.getValue();
        }
    }
    return arg;
}
