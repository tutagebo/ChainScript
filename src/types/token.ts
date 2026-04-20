export type SourcePos = {
  index: number;
};

export type Token =
  | { type: "Identifier"; value: string; pos: SourcePos }
  | { type: "Number"; value: number; pos: SourcePos }
  | { type: "String"; value: string; pos: SourcePos }
  | { type: "Dot"; value: "."; pos: SourcePos }
  | { type: "LParen"; value: "("; pos: SourcePos }
  | { type: "RParen"; value: ")"; pos: SourcePos }
  | { type: "LBrace"; value: "{"; pos: SourcePos }
  | { type: "RBrace"; value: "}"; pos: SourcePos }
  | { type: "Comma"; value: ","; pos: SourcePos }
  | { type: "Semicolon"; value: ";"; pos: SourcePos }
  | { type: "EOF"; value: null; pos: SourcePos };