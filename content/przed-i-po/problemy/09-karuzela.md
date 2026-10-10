---
title: Karuzela przewija się sama, bez pauzy
criteria: ["2.2.2"]
marker: karuzela
who: [poznawcze, slabe-widzenie, czytnik]
axe: []
example: karuzela-automatyczna
pattern: karuzela
status: szkic
---
## Problem

Po włączeniu ruchu komunikaty zmieniają się co 5 sekund i nie da się tego zatrzymać. Kto czyta wolniej albo w powiększeniu, nie zdąży przeczytać zdania. Ruch obok tekstu rozprasza osoby z ADHD.

## Rozwiązanie

Karuzela startuje zatrzymana. Przycisk „Przewijaj samoczynnie” włącza ruch i mówi stanem `aria-pressed`, czy ruch trwa. Fokus w karuzeli zatrzymuje ruch. Gdy karuzela stoi, zmiana slajdu jest ogłaszana grzecznie (`aria-live="polite"`); gdy się kręci, nie, bo czytnik przerywałby co 5 sekund.

```przed
setInterval(() => pokazSlajd(teraz + 1), 5000);
```

```po
<button class="samoczynnie" aria-pressed="false">Przewijaj samoczynnie</button>
<div class="slajdy" aria-live="polite">…</div>
```
