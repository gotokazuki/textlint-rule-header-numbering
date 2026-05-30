import TextLintTester from "textlint-tester";
import rule from "../src/index";

const tester = new TextLintTester();

tester.run("rule", rule, {
    valid: [
        {
            text: "# 1. Title\n## 1.1. Subtitle\n### 1.1.1. Subsubtitle"
        },
        {
            text: "## 1. Top Level\n### 1.1. Sub\n#### 1.1.1. Subsub",
            options: { depth: 3 }
        },
        {
            text: "# Title <!-- omit in toc -->\n## 1. Sub",
            options: { excludeKeywords: ["<!-- omit in toc -->"] }
        },
        {
            text: "# 1 Title\n## 1.1 Sub",
            options: { format: "1.1" }
        },
        {
            text: "# 1. Title\n## 1.1. Sub\n### 1.1.1. Subsub\n#### Ignored",
            options: { depth: 3 }
        }
    ],
    invalid: [
        {
            text: "# Title\n## 1.1. Sub",
            output: "# 1. Title\n## 1.1. Sub",
            errors: [
                { message: "Missing section number. Expected: 1." }
            ]
        },
        {
            text: "# 2. Title",
            output: "# 1. Title",
            errors: [
                { message: "Incorrect section number. Expected: 1." }
            ]
        },
        {
            text: "## 1. Title\n# 2. Level Up",
            errors: [
                { message: "Header level (1) cannot be higher than the base level (2). The hierarchy is broken." }
            ]
        },
        {
            text: "# 1. Title\n### 1.1.1. Jump",
            errors: [
                { message: "Header level jumping is not allowed: 1 -> 3" }
            ]
        },
        {
            text: "# 1. Excluded <!-- omit in toc -->",
            output: "# Excluded <!-- omit in toc -->",
            options: { excludeKeywords: ["<!-- omit in toc -->"] },
            errors: [
                { message: "Excluded section has a header number." }
            ]
        },
        {
            text: "# 1.1. Wrong start",
            output: "# 1. Wrong start",
            errors: [
                { message: "Incorrect section number. Expected: 1." }
            ]
        },
        {
            text: "# 1 Wrong format",
            output: "# 1. 1 Wrong format",
            errors: [
                { message: "Missing section number. Expected: 1." }
            ]
        },
        {
            text: "# 1. Wrong format",
            output: "# 1 1. Wrong format",
            options: { format: "1.1" },
            errors: [
                { message: "Missing section number. Expected: 1" }
            ]
        },
        {
            text: "# Title\n## Sub\n### Subsub",
            output: "# 1. Title\n## 1.1. Sub\n### 1.1.1. Subsub",
            errors: [
                { message: "Missing section number. Expected: 1." },
                { message: "Missing section number. Expected: 1.1." },
                { message: "Missing section number. Expected: 1.1.1." }
            ]
        }
    ]
});
