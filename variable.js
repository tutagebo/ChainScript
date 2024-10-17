export class Variable{
    #name;
    _value;
    _bool = false;
    _flagArray =  [];
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
    numberMethodSwitch(op, arg){
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
    boolMethodSwitch(op, arg){
        const value = arg;
        switch(op){
            case OpID.EQUAL: {
                this._bool = this._value == arg;
                break;
            }
            case OpID.LESS: {
                this._bool = this._value < arg;
                break;
            }
            case OpID.MORE: {
                this._bool = this._value > arg;
                break;
            }
            case OpID.AND: {
                this._bool = this._value && arg;
                break;
            }
            case OpID.OR: {
                this._bool = this._value || arg;
                break;
            }
            case OpID.NOT: {
                this._bool = !this._value;
                break;
            }
        }
    }
    then(){

    }
    flag(arg,index){
        this._flagArray[arg] = index;
    }
    getFlag(arg){
        return this._flagArray[arg];
    }
    getBool(){
        return this._bool;
    }
}

export class OpID{
    static IN = "@IN";
    static OUT = "@OUT";
    static ADD = "@ADD";
    static SUB = "@SUB";
    static MUL = "@MUL";
    static DIV = "@DIV";
    static MOD = "@MOD";
    static POW = "@POW";
    static PRINT = "@PRINT";
    static NumAll = [
        this.IN,
        this.ADD,
        this.SUB,
        this.MUL,
        this.DIV,
        this.MOD,
        this.POW,
        this.PRINT,
    ];
    static LESS = "@LESS";
    static MORE = "@MORE";
    static EQUAL = "@EQ";
    static AND = "@AND";
    static OR = "@OR";
    static NOT = "@NOT";
    static BoolAll = [
        this.LESS,
        this.MORE,
        this.EQUAL,
        this.AND,
        this.OR,
        this.NOT
    ];
    static FLAG = "@FLAG";
    static JUMP = "@JUMP";
    static THEN = "@THEN";
    static DEF = "@DEF";
    static END = "@END";
    static BACK = "@BACK";
}

export class TypeID{
    static Any = 0;
    static Number = 1;
    static String = 2;
}
