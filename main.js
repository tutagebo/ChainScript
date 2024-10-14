import { Executer } from "./executer.js";
import { Parser } from "./parser.js";

function main(){
    const script = "x.in(1).add(2).multi(3).pow(2).print(0);";
    const parser = new Parser(script);
    console.log(parser.processArray);
    const exe = new Executer(parser.processArray);
    exe.startExe();
}

main()