# textlint-rule-header-numbering

[English Documentation](./README.md)

Markdown の見出し（ヘッダー）に対して、セクション番号が正しい連番で振られているかを検証し、自動修正する [textlint](https://github.com/textlint/textlint) のルールです。

## 特徴（Features）

- **連番チェック**: 見出し番号が `1.` から始まり、階層構造（例: `1.1.`, `1.1.1.`）に沿って厳密に付与されているかを検証します。
- **自動修正（Auto Fix）**: `textlint --fix` を実行することで、欠落しているセクション番号を追加したり、間違った番号を自動で正しいものに修正します。
- **深さのカスタマイズ**: どの見出しレベルまで番号を振るかを指定できます（デフォルトは `###` レベル3まで）。
- **柔軟なフォーマット指定**: テンプレート文字列を指定することで、ドットあり（`1.1.`）、ドットなし（`1.1`）、ハイフン区切り（`1-1`）など、任意のフォーマットに対応します。
- **除外設定**: `<!-- omit in toc -->` のような特定のキーワードを含む見出しを番号付けの対象外に設定できます。
- **見出しのスキップ（ジャンプ）検知**: `#` の次にいきなり `###` が来るような、不正な見出しレベルのジャンプを検知します。

## インストール

[npm](https://www.npmjs.com/) 経由でインストールします:

```bash
npm install textlint-rule-header-numbering
```

## 使い方

### `.textlintrc.json` 経由（推奨）

```json
{
    "rules": {
        "header-numbering": true
    }
}
```

### CLI 経由

```bash
textlint --rule header-numbering README.md
```

## オプション設定

`.textlintrc.json` でオプションを設定できます:

```json
{
    "rules": {
        "header-numbering": {
            "format": "1.1.",
            "excludeKeywords": ["<!-- omit in toc -->"],
            "depth": 3
        }
    }
}
```

### `format`

- **型**: `string`
- **デフォルト**: `"1.1."`
- **説明**: `1` を数字のプレースホルダーとして扱い、任意のフォーマットを指定します。`1` 以外の文字はセパレーターとして扱われます。
- **指定可能な値の例**:
  - `"1.1."` : 末尾にドットをつける標準的な形式（例: `# 1. Title`, `## 1.1. Subtitle`）
  - `"1.1"` : 末尾にドットをつけない形式（例: `# 1 Title`, `## 1.1 Subtitle`）
  - `"1-1"` : ハイフン区切りの形式（例: `# 1 Title`, `## 1-1 Subtitle`）
  - `"1/1/"` : スラッシュ区切りで末尾にもスラッシュをつける形式（例: `# 1/ Title`, `## 1/1/ Subtitle`）

### `excludeKeywords`

- **型**: `string[]`
- **デフォルト**: `[]`
- **説明**: ここで指定したキーワードを含む見出しは、セクション番号チェックの対象外となります。自動修正時にも番号は付与されません。
- **例**: `["<!-- omit in toc -->", "[draft]"]`

### `depth`

- **型**: `number`
- **デフォルト**: `3`
- **説明**: 見出しの階層をどこまでチェックするかを指定します。深さを `3` に設定した場合、ベースとなる見出しから3階層下まで検証します。
- **例**: ドキュメントが `##` から始まり `depth` が `3` の場合、`##`, `###`, `####` がチェック対象になります。

## 例

### ❌ 無効な例 (Invalid)

```markdown
# Title
## 1.2. Subtitle
### Jump
```
*エラー内容:*
- トップレベルの見出しに番号がありません。
- `1.2.` は間違っています（`1.1.` が期待されます）。
- `###` に番号がありません（`1.1.1.` が期待されます）。

### ✅ 有効な例 (Valid)

```markdown
# 1. Title
## 1.1. Subtitle
### 1.1.1. Sub-subtitle

# 2. Level 1 again
## 2.1. Another subtitle

# Excluded Header <!-- omit in toc -->
```

## 自動修正 (Auto-fix)

`--fix` オプションを付与することで、不足している番号の追加や誤った番号の修正を自動で行うことができます:

```bash
textlint --fix README.md
```

修正前 (Before):
```markdown
# Intro
## Sub
```

修正後 (After):
```markdown
# 1. Intro
## 1.1. Sub
```

## ビルド

```bash
pnpm install
pnpm run build
pnpm test
```
