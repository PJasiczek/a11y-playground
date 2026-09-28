// Shared axe settings for the e2e suite.

// wcag2aaa is included on purpose: we opt into 1.4.6 Contrast (Enhanced).
export const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa"];

// Broken examples are broken on purpose. Their iframes are tested separately in examples.spec.ts.
export const brokenExamples = 'iframe[data-variant="bad"]';
