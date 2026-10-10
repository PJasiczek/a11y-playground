---
title: Menu jasnoszare na żółtym
criteria: ["1.4.3"]
marker: kontrast
who: [slabe-widzenie, telefon]
axe: [color-contrast]
example: kontrast-stanow
status: szkic
---
## Problem

Pozycje menu mają kolor `#bdb49a` na żółtym `#ffc93c`, czyli kontrast 1,35:1. Wymagane minimum to 4,5:1. Na przystanku, w słońcu i na telefonie, menu po prostu znika.

## Rozwiązanie

Ciemny tekst na żółtym tle daje 11,9:1. Żółty zostaje, bo to kolor marki, ale tekst na nim musi być ciemny.

```przed
.menu a { color: #bdb49a; } /* 1,35:1 */
```

```po
.menu a, .menu button { color: #17141c; } /* 11,9:1 */
```
