# Lexer Specification

## 概要

Lexerは入力されたソースコード文字列をトークン列に変換する。

ParserはLexerの出力にのみ依存し、文字列を直接扱わない。

---

## 入力

- 文字列（UTF-16 JavaScript string）

---

## 出力

- `Token[]`

---

## トークン定義

### 共通構造

```ts
type SourcePos = {
    index: number;
};

type Token = {
    type: TokenType;
    value: any;
    pos: SourcePos;
};
```

---

### TokenType一覧

| type       | value  | 説明             |
| ---------- | ------ | ---------------- |
| Identifier | string | 変数名・関数名   |
| Number     | number | 数値リテラル     |
| String     | string | 文字列リテラル   |
| Dot        | "."    | メソッドチェーン |
| LParen     | "("    | 引数開始         |
| RParen     | ")"    | 引数終了         |
| LBrace     | "{"    | ブロック開始     |
| RBrace     | "}"    | ブロック終了     |
| Comma      | ","    | 引数区切り       |
| Semicolon  | ";"    | 文終端           |
| EOF        | null   | 入力終了         |

---

## 字句ルール

### 1. 空白

- `\s` はすべて無視する
- ただし文字列内は除く

---

### 2. Identifier

```regex
[A-Za-z_][A-Za-z0-9_]*
```

例:

- `x`
- `fizzBuzz`
- `tmp1`

---

### 3. Number

```regex
[0-9]+
```

制限:

- 整数のみ
- 負数は未対応（Parser側で拡張予定）

---

### 4. String

- `"..."` または `'...'`
- エスケープは最小対応

例:

```
"hello"
'world'
```

---

### 5. 記号

| 文字 | Token     |
| ---- | --------- |
| .    | Dot       |
| (    | LParen    |
| )    | RParen    |
| {    | LBrace    |
| }    | RBrace    |
| ,    | Comma     |
| ;    | Semicolon |

---

## エラー

### 未知文字

```
Unexpected character: <char>
```

### 文字列未終了

```
Unterminated string literal
```

---

## 非対応（今後拡張）

- コメント
- 浮動小数点
- 負数
- Unicode識別子
- エスケープ完全対応

---

## 例

### 入力

```js
x.in(0).add(arg);
```

### 出力

```json
[
    { "type": "Identifier", "value": "x" },
    { "type": "Dot" },
    { "type": "Identifier", "value": "in" },
    { "type": "LParen" },
    { "type": "Number", "value": 0 },
    { "type": "RParen" },
    { "type": "Dot" },
    { "type": "Identifier", "value": "add" },
    { "type": "LParen" },
    { "type": "Identifier", "value": "arg" },
    { "type": "RParen" },
    { "type": "Semicolon" }
]
```

---

## 設計方針

- シンプルで拡張しやすい
- Parserに責務を押し付けない
- Tokenは必ず位置情報を持つ
