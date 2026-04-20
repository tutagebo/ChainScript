import {
    Token,
    Program,
    Statement,
    ChainStatement,
    MethodCall,
    Expr,
    BlockStatement,
} from "../types";

class Parser {
    private tokens: Token[];
    private pos: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private current(): Token {
        return this.tokens[this.pos];
    }

    private consume<T extends Token["type"]>(
        type: T,
    ): Extract<Token, { type: T }> {
        const token = this.current();

        if (token.type !== type) {
            throw new Error(
                `Expected ${type}, got ${token.type} at ${token.pos.index}`,
            );
        }

        this.pos++;
        return token as Extract<Token, { type: T }>;
    }

    private match<T extends Token["type"]>(
        type: T,
    ): Extract<Token, { type: T }> | null {
        const token = this.current();
        if (token.type !== type) return null;
        this.pos++;
        return token as Extract<Token, { type: T }>;
    }

    parseProgram(): Program {
        const body: Statement[] = [];

        while (this.current().type !== "EOF") {
            body.push(this.parseStatement());
        }

        return {
            type: "Program",
            body,
        };
    }

    private parseStatement(): Statement {
        const stmt = this.parseChainStatement();
        this.consume("Semicolon");
        return stmt;
    }

    private parseChainStatement(): ChainStatement {
        const target = this.consume("Identifier").value;
        const calls: MethodCall[] = [];

        while (this.match("Dot")) {
            const methodName = this.consume("Identifier").value;
            this.consume("LParen");

            let args: Expr[] = [];
            let block: BlockStatement | undefined;

            // funcDef({ ... }) や then({ ... }) 用
            if (this.current().type === "LBrace") {
                block = this.parseBlock();
            } else {
                args = this.parseArguments();
            }

            this.consume("RParen");

            calls.push({
                type: "MethodCall",
                name: methodName,
                args,
                ...(block ? { block } : {}),
            });
        }

        return {
            type: "ChainStatement",
            target,
            calls,
        };
    }

    private parseArguments(): Expr[] {
        const args: Expr[] = [];

        if (this.current().type === "RParen") {
            return args;
        }

        args.push(this.parseExpression());

        while (this.match("Comma")) {
            args.push(this.parseExpression());
        }

        return args;
    }

    private parseExpression(): Expr {
        const token = this.current();

        switch (token.type) {
            case "Identifier":
                this.pos++;
                return {
                    type: "Identifier",
                    name: token.value,
                };

            case "Number":
                this.pos++;
                return {
                    type: "NumberLiteral",
                    value: token.value,
                };

            case "String":
                this.pos++;
                return {
                    type: "StringLiteral",
                    value: token.value,
                };

            default:
                throw new Error(
                    `Unexpected token ${token.type} in expression at ${token.pos.index}`,
                );
        }
    }

    private parseBlock(): BlockStatement {
        this.consume("LBrace");

        const body: Statement[] = [];
        while (this.current().type !== "RBrace") {
            body.push(this.parseStatement());
        }

        this.consume("RBrace");

        return {
            type: "BlockStatement",
            body,
        };
    }
}
