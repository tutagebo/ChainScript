import { Token, SourcePos } from "../types";

class Lexer {
    private input: string;
    private pos: number = 0;

    constructor(input: string) {
        this.input = input;
    }

    private currentPos(): SourcePos {
        return { index: this.pos };
    }

    private peek(): string | null {
        return this.input[this.pos] ?? null;
    }

    private next(): string | null {
        return this.input[this.pos++] ?? null;
    }

    private isAlpha(ch: string | null): boolean {
        return ch !== null && /[A-Za-z_]/.test(ch);
    }

    private isDigit(ch: string | null): boolean {
        return ch !== null && /[0-9]/.test(ch);
    }

    private skipWhitespace(): void {
        while (true) {
            const ch = this.peek();
            if (ch === null || !/\s/.test(ch)) break;
            this.next();
        }
    }

    private readIdentifier(): Token {
        const start = this.currentPos();
        let value = "";

        while (true) {
            const ch = this.peek();
            if (ch === null || !/[A-Za-z0-9_]/.test(ch)) break;
            value += this.next();
        }

        return {
            type: "Identifier",
            value,
            pos: start,
        };
    }

    private readNumber(): Token {
        const start = this.currentPos();
        let value = "";

        while (true) {
            const ch = this.peek();
            if (ch === null || !/[0-9]/.test(ch)) break;
            value += this.next();
        }

        return {
            type: "Number",
            value: Number(value),
            pos: start,
        };
    }

    private readString(): Token {
        const start = this.currentPos();
        const quote = this.next();

        if (quote !== `"` && quote !== `'`) {
            throw new Error("String literal must start with quote");
        }

        let value = "";

        while (true) {
            const ch = this.peek();
            if (ch === null) {
                throw new Error(
                    `Unterminated string literal at ${start.index}`,
                );
            }
            if (ch === quote) {
                this.next();
                break;
            }

            // 最小実装: エスケープはまだ簡易
            if (ch === "\\") {
                this.next();
                const escaped = this.peek();
                if (escaped === null) {
                    throw new Error(
                        `Unterminated escape sequence at ${this.pos}`,
                    );
                }
                value += this.next();
                continue;
            }

            value += this.next();
        }

        return {
            type: "String",
            value,
            pos: start,
        };
    }

    tokenize(): Token[] {
        const tokens: Token[] = [];

        while (this.pos < this.input.length) {
            this.skipWhitespace();
            const ch = this.peek();
            if (ch === null) break;

            if (this.isAlpha(ch)) {
                tokens.push(this.readIdentifier());
                continue;
            }

            if (this.isDigit(ch)) {
                tokens.push(this.readNumber());
                continue;
            }

            if (ch === `"` || ch === `'`) {
                tokens.push(this.readString());
                continue;
            }

            const pos = this.currentPos();

            switch (ch) {
                case ".":
                    this.next();
                    tokens.push({ type: "Dot", value: ".", pos });
                    break;
                case "(":
                    this.next();
                    tokens.push({ type: "LParen", value: "(", pos });
                    break;
                case ")":
                    this.next();
                    tokens.push({ type: "RParen", value: ")", pos });
                    break;
                case "{":
                    this.next();
                    tokens.push({ type: "LBrace", value: "{", pos });
                    break;
                case "}":
                    this.next();
                    tokens.push({ type: "RBrace", value: "}", pos });
                    break;
                case ",":
                    this.next();
                    tokens.push({ type: "Comma", value: ",", pos });
                    break;
                case ";":
                    this.next();
                    tokens.push({ type: "Semicolon", value: ";", pos });
                    break;
                default:
                    throw new Error(
                        `Unexpected character '${ch}' at ${this.pos}`,
                    );
            }
        }

        tokens.push({
            type: "EOF",
            value: null,
            pos: { index: this.pos },
        });

        return tokens;
    }
}
