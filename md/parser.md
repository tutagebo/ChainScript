# Parser Specification

## 概要

Parserはトークン列を読み取り、AST（抽象構文木）を構築する。

---

## 入力

- `Token[]`

---

## 出力

- `Program`

---

## AST定義

### Program

```ts
type Program = {
    type: "Program";
    body: Statement[];
};
```

---

### Statement

```ts
type Statement = ChainStatement;
```

---

### ChainStatement

```ts
type ChainStatement = {
    type: "ChainStatement";
    target: string;
    calls: MethodCall[];
};
```

---

### MethodCall

```ts
type MethodCall = {
    type: "MethodCall";
    name: string;
    args: Expr[];
    block?: BlockStatement;
};
```

---

### BlockStatement

```ts
type BlockStatement = {
    type: "BlockStatement";
    body: Statement[];
};
```

---

### Expr

```ts
type Expr =
    | { type: "Identifier"; name: string }
    | { type: "NumberLiteral"; value: number }
    | { type: "StringLiteral"; value: string };
```

---

## 文法（簡易）

```ebnf
Program        = Statement* EOF ;

Statement      = ChainStatement ";" ;

ChainStatement = Identifier MethodChain ;

MethodChain    = ("." MethodCall)* ;

MethodCall     = Identifier "(" (Arguments | Block)? ")" ;

Arguments      = Expr ("," Expr)* ;

Block          = "{" Statement* "}" ;
```

---

## 動作仕様

### 1. チェーン構文

```js
x.in(0).add(arg).print(0);
```

→

- target: `x`
- calls: `in`, `add`, `print`

---

### 2. ブロック付きメソッド

```js
x.then({
  y.print(0);
});
```

- block を持つ MethodCall として扱う

---

### 3. ネスト構造

```js
a.then({
  b.then({
    c.print(0);
  });
});
```

→ BlockStatement のネストで表現

---

## エラー

### トークン不一致

```
Expected <TokenType>, got <TokenType>
```

---

### 不正な式

```
Unexpected token in expression
```

---

### 括弧不一致

```
Expected RParen
Expected RBrace
```

---

## 非対応（今後拡張）

- 優先順位付き演算
- 単項演算（-x）
- 配列
- オブジェクト
- 型システム
- import/export

---

## 例

### 入力

```js
x.in(0).add(arg).print(0);
```

### AST

```json
{
    "type": "ChainStatement",
    "target": "x",
    "calls": [
        { "name": "in", "args": [0] },
        { "name": "add", "args": ["arg"] },
        { "name": "print", "args": [0] }
    ]
}
```

---

## 設計方針

- ASTは意味が読み取れる構造にする
- 命令列には変換しない（別レイヤで処理）
- エラーはできるだけ早期検出
- ブロック構造を明示的に保持する
