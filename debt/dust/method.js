import { TypeID, Variable } from "../variable";

class Method{
    /** @type {Variable} */
    _variable;
    _operation;
    /**
     * 
     * @param {Variable} variable 
     */
    constructor(variable, op, value){
        this._variable = variable;
    }
    /**
     * @param {string} value 
     */
    in(value){
        switch(true){
            case /^[0-9]+/.test(value): { //number
                this._variable.setType(TypeID.Number);
            }
            case /^"[^"]*"/.test(value): { //string
                this._variable.setType(TypeID.String);
            }
        }
        this._variable.setValue(value);
    }
}

export class NumberMethod extends Method{
    /**
     * 
     * @param {string} op 
     * @param {number} value 
     */
    methodSwitch(op, value){
        switch(op){
            case OpID.ADD: {
                this._variable += value;
                break;
            }
            case OpID.SUB: {
                this._variable -= value;
                break;
            }
            case OpID.MUL: {
                this._variable *= value;
                break;
            }
            case OpID.DIV: {
                this._variable /= value;
                break;
            }
            case OpID.MOD: {
                this._variable %= value;
                break;
            }
            case OpID.POW: {
                this._variable **= value;
                break;
            }
            case OpID.PRINT: {
                console.log(this._variable.getValue());
                break;
            }
        }
    }
}

export class OpID{
    static All = ["@IN","@ADD","@SUB","@SUB","@DIV","@MOD","@POW","@PRINT"];
    static IN = "@IN";
    static ADD = "@ADD";
    static SUB = "@SUB";
    static MUL = "@SUB";
    static DIV = "@DIV";
    static MOD = "@MOD";
    static POW = "@POW";
    static PRINT = "@PRINT";
}
