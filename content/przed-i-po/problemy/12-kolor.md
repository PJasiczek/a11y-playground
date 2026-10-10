---
title: Opóźnienie tylko kolorem, łącza bez podkreślenia
criteria: ["1.4.1"]
marker: kolor
who: [daltonizm, czytnik]
axe: [link-in-text-block]
status: szkic
---
## Problem

Na tablicy o opóźnieniu mówi tylko czerwona kropka, a o punktualności zielona. Osoba z deuteranopią widzi dwie podobne, oliwkowe kropki, a czytnik ekranu nie widzi żadnej. Łącza w tekście („rozkładach jazdy”, „komunikatach”, „Kliknij tutaj”) różnią się od zwykłego tekstu tylko kolorem, a kontrast między nimi to 1,4:1.

## Rozwiązanie

Stan kursu słowami: „o czasie”, „opóźniony 4 min”. Znak przed nimi pomaga wzrokowi, ale informację niesie tekst. Łącza w tekście są podkreślone.

```przed
<div class="kropka spozniony"></div>
a { text-decoration: none; }
```

```po
<span class="stan spozniony">opóźniony 4 min</span>
a { text-decoration: underline; text-underline-offset: 3px; }
```
