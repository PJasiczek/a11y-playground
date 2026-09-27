# Accessibility

Accessibility is a requirement, not an add-on. Target WCAG 2.2 Level AA, plus the two AAA criteria marked below, which we opt into.

Read this before writing mocks or UI code.

## Checklist

- Text contrast of at least 4.5:1 for body text and 3:1 for large text/graphical elements (criteria 1.4.3, 1.4.11).
- Full keyboard navigation support — every interactive element reachable via Tab, with no focus traps (2.1.1, 2.1.2).
- A clear, visible focus indicator on every interactive element (2.4.7).
- Correct semantic HTML and ARIA roles where needed — don't overuse ARIA when a native element will do (4.1.2).
- Labels on all form fields and controls (`label`, `aria-label`, `aria-labelledby`) (1.3.1, 3.3.2).
- Alt text for meaningful images; decorative images marked as empty/ignored (1.1.1).
- Logical, hierarchical heading structure with no skipped levels (1.3.1, 2.4.6).
- Clickable/touch targets at least 24x24px with adequate spacing (2.5.8, AA). 44x44px preferred, which is 2.5.5 at AAA.
- Respect `prefers-reduced-motion` — animations and transitions need a static/reduced variant (2.3.3, AAA).
- Never convey information through color alone — pair it with an icon, text, or pattern (1.4.1).
