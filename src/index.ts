import { TextlintRuleModule, TextlintRuleContext } from "@textlint/types";

export interface Options {
    format?: string;
    excludeKeywords?: string[];
    depth?: number;
}

const reporter: TextlintRuleModule<Options> = (context: TextlintRuleContext, options: Options = {}) => {
    const { Syntax, RuleError, report, getSource, fixer } = context;
    const format = options.format || "1.1.";
    const oneCount = (format.match(/1/g) || []).length;
    if (oneCount < 2) {
        throw new Error(`[textlint-rule-header-numbering] Invalid format: "${format}". The format must contain the digit "1" at least twice as placeholders (e.g., "1.1." or "1-1").`);
    }
    if (/[02-9]/.test(format)) {
        throw new Error(`[textlint-rule-header-numbering] Invalid format: "${format}". The format should only use the digit "1" as a placeholder. Other digits are not allowed.`);
    }

    const excludeKeywords = options.excludeKeywords || [];
    const maxDepth = options.depth ?? 6;

    let baseDepth: number | null = null;
    let previousDepth: number | null = null;
    let currentNumbers: number[] = [];

    const getSeparatorAndSuffix = (fmt: string) => {
        const sepMatch = fmt.match(/1([^1]*)1/);
        const separator = sepMatch ? sepMatch[1] : ".";
        const suffixMatch = fmt.match(/1([^1]*)$/);
        const suffix = suffixMatch ? suffixMatch[1] : "";
        return { separator, suffix };
    };

    const escapeRegExp = (str: string) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const { separator, suffix } = getSeparatorAndSuffix(format);
    const escapedSep = escapeRegExp(separator);
    const escapedSuffix = escapeRegExp(suffix);

    const formatRegex = new RegExp(`^(#+)\\s+(\\d+(?:${escapedSep}\\d+)*${escapedSuffix})(?:\\s+(.*))?$`);

    return {
        [Syntax.Document]() {
            baseDepth = null;
            previousDepth = null;
            currentNumbers = [];
        },
        [Syntax.Header](node) {
            const rawText = getSource(node);
            const isExcluded = excludeKeywords.some(keyword => rawText.includes(keyword));

            if (isExcluded) {
                const match = formatRegex.exec(rawText);
                if (match) {
                    const prefixMatch = rawText.match(/^(#+)\s+/);
                    if (prefixMatch) {
                        const numberStartIndex = prefixMatch[0].length;
                        const numberPart = match[2];
                        let removeEndIndex = numberStartIndex + numberPart.length;
                        if (rawText[removeEndIndex] === ' ') {
                            removeEndIndex++;
                        }
                        const newText = rawText.slice(0, numberStartIndex) + rawText.slice(removeEndIndex);
                        report(node, new RuleError("Excluded section has a header number.", {
                            index: numberStartIndex,
                            fix: fixer.replaceText(node, newText)
                        }));
                    }
                }
                return;
            }

            const currentDepth = node.depth;
            if (baseDepth === null) {
                baseDepth = currentDepth;
            }

            const levelIndex = currentDepth - baseDepth;

            if (levelIndex >= maxDepth) {
                return;
            }

            if (levelIndex < 0) {
                report(node, new RuleError(`Header level (${currentDepth}) cannot be higher than the base level (${baseDepth}). The hierarchy is broken.`));
                return;
            }

            if (previousDepth !== null && currentDepth > previousDepth + 1) {
                report(node, new RuleError(`Header level jumping is not allowed: ${previousDepth} -> ${currentDepth}`));
                return;
            }

            currentNumbers[levelIndex] = (currentNumbers[levelIndex] || 0) + 1;
            for (let i = levelIndex + 1; i < currentNumbers.length; i++) {
                currentNumbers[i] = 0;
            }

            previousDepth = currentDepth;

            const expectedNumberStr = currentNumbers.slice(0, levelIndex + 1).join(separator);
            const expectedStr = `${expectedNumberStr}${suffix}`;

            const match = formatRegex.exec(rawText);
            if (match) {
                const actualStr = match[2];
                if (actualStr !== expectedStr) {
                    const prefixMatch = rawText.match(/^(#+)\s+/);
                    if (prefixMatch) {
                        const numberStartIndex = prefixMatch[0].length;
                        const newText = rawText.slice(0, numberStartIndex) + expectedStr + rawText.slice(numberStartIndex + actualStr.length);
                        report(node, new RuleError(`Incorrect section number. Expected: ${expectedStr}`, {
                            index: numberStartIndex,
                            fix: fixer.replaceText(node, newText)
                        }));
                    }
                }
            } else {
                const prefixMatch = rawText.match(/^(#+)\s+/);
                if (prefixMatch) {
                    const numberStartIndex = prefixMatch[0].length;
                    const prefixPart = prefixMatch[0];
                    const newText = prefixPart + expectedStr + " " + rawText.slice(numberStartIndex);
                    report(node, new RuleError(`Missing section number. Expected: ${expectedStr}`, {
                        index: numberStartIndex,
                        fix: fixer.replaceText(node, newText)
                    }));
                }
            }
        }
    };
};

export default {
    linter: reporter,
    fixer: reporter
};
