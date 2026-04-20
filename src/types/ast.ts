export type Expr =
  | { type: "Identifier"; name: string }
  | { type: "NumberLiteral"; value: number }
  | { type: "StringLiteral"; value: string };

export type MethodCall = {
  type: "MethodCall";
  name: string;
  args: Expr[];
  block?: BlockStatement;
};

export type ChainStatement = {
  type: "ChainStatement";
  target: string;
  calls: MethodCall[];
};

export type BlockStatement = {
  type: "BlockStatement";
  body: Statement[];
};

export type Statement = ChainStatement;

export type Program = {
  type: "Program";
  body: Statement[];
};