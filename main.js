import { Parser } from "./parser.js";

function main(){
    const script = "x.in(1).add(2).multi(3);";
    const parser = new Parser(script);
    console.log(parser.processArray);
}

main()