# textlint-rule-header-numbering

[日本語版ドキュメント](./README.ja.md)

A [textlint](https://github.com/textlint/textlint) rule to validate and automatically fix the sequence of section numbering in Markdown headers.

## Features

- **Sequential Check**: Ensures header numbering starts from `1.` and strictly follows the structural hierarchy (e.g., `1.1.`, `1.1.1.`).
- **Auto Fixable**: Automatically adds missing section numbers or corrects incorrect ones using `textlint --fix`.
- **Customizable Depth**: Define how deep the headers should be numbered (default is up to `###` level 3).
- **Format Options**: Supports arbitrary numbering formats by providing a template string (e.g., `"1.1."`, `"1-1"`, `"1/1/"`).
- **Exclusion Support**: Ignore specific headers using keywords like `<!-- omit in toc -->`.
- **Level Jump Detection**: Detects invalid header jumping (e.g., jumping from `#` to `###` without a `##` in between).

## Installation

Install directly from the GitHub repository:

```bash
npm install gotokazuki/textlint-rule-header-numbering
```

## Usage

### Via `.textlintrc.json` (Recommended)

```json
{
    "rules": {
        "header-numbering": true
    }
}
```

### Via CLI

```bash
textlint --rule header-numbering README.md
```

## Options

You can configure options in your `.textlintrc.json`:

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

- **Type**: `string`
- **Default**: `"1.1."`
- **Description**: Defines the numbering format using `1` as a placeholder for digits. Any other character serves as a separator. 
- **Valid Values** (Examples):
  - `"1.1."` : Standard numbering with a trailing dot (e.g., `# 1. Title`, `## 1.1. Subtitle`)
  - `"1.1"` : Numbering without a trailing dot (e.g., `# 1 Title`, `## 1.1 Subtitle`)
  - `"1-1"` : Hyphen-separated (e.g., `# 1 Title`, `## 1-1 Subtitle`)
  - `"1/1/"` : Slash-separated with trailing slash (e.g., `# 1/ Title`, `## 1/1/ Subtitle`)

### `excludeKeywords`

- **Type**: `string[]`
- **Default**: `[]`
- **Description**: If a header contains any of the specified keywords, it will be excluded from the numbering validation. The rule will ensure no number is prefixed for excluded headers.
- **Example**: `["<!-- omit in toc -->", "[draft]"]`

### `depth`

- **Type**: `number`
- **Default**: `3`
- **Description**: Specifies how deep into the header hierarchy the validation should apply. A depth of `3` means it checks down to 3 levels from the base header.
- **Example**: If your document starts with `##`, and depth is `3`, it will validate `##`, `###`, and `####`.

## Examples

### ❌ Invalid Examples

```markdown
# Title
## 1.2. Subtitle
### Jump
```
*Errors:*
- Top-level title is missing its number.
- `1.2.` is incorrect (expected `1.1.`).
- `###` is missing its number (expected `1.1.1.`).

### ✅ Valid Examples

```markdown
# 1. Title
## 1.1. Subtitle
### 1.1.1. Sub-subtitle

# 2. Level 1 again
## 2.1. Another subtitle

# Excluded Header <!-- omit in toc -->
```

## Auto-fix

You can automatically fix missing or incorrect numbering using `--fix`:

```bash
textlint --fix README.md
```

Before:
```markdown
# Intro
## Sub
```

After:
```markdown
# 1. Intro
## 1.1. Sub
```

## Build

```bash
pnpm install
pnpm run build
pnpm test
```
