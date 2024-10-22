import { Executer } from "./executer.js";
import { Parser } from "./parser.js";
import fs from "fs";

function main(){
    const script = fs.readFileSync("sampleScript/function.chs", "utf-8");
    //const script = fs.readFileSync("sampleScript/fizzBuzz.chs", "utf-8");
    const parser = new Parser(script);
    console.log(parser.scopeArray);
    const exe = new Executer(parser.scopeArray);
    exe.startExe();
}

main()