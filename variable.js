export class Variable{
    #name;
    _value;
    #type = TypeID.Any;
    constructor(name){
        this.#name = name;
    }
    /**
     * @param {string} value 
     */
    in(value){
        switch(true){
            case /^[0-9]+/.test(value): { //number
                this.#type = TypeID.Number;
                this._value = parseInt(value);
                break;
            }
            case /^"[^"]*"/.test(value): { //string
                this.#type = TypeID.String;
                this._value = value;
                break;
            }
        }
    }
    /**
     * 
     * @param {string} op 
     * @param {string} value 
     */
    methodSwitch(op, arg){
        const value = parseInt(arg);
        switch(op){
            case OpID.ADD: {
                this._value += value;
                break;
            }
            case OpID.SUB: {
                this._value -= value;
                break;
            }
            case OpID.MUL: {
                this._value *= value;
                break;
            }
            case OpID.DIV: {
                this._value /= value;
                break;
            }
            case OpID.MOD: {
                this._value %= value;
                break;
            }
            case OpID.POW: {
                this._value **= value;
                break;
            }
            case OpID.PRINT: {
                console.log(this._value);
                break;
            }
        }
    }
}

export class OpID{
    static All = ["@IN","@ADD","@SUB","@MUL","@DIV","@MOD","@POW","@PRINT"];
    static IN = "@IN";
    static ADD = "@ADD";
    static SUB = "@SUB";
    static MUL = "@MUL";
    static DIV = "@DIV";
    static MOD = "@MOD";
    static POW = "@POW";
    static PRINT = "@PRINT";
}

export class TypeID{
    static Any = 0;
    static Number = 1;
    static String = 2;
}
