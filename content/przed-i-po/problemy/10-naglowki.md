---
title: Nagłówki to pogrubione div
criteria: ["1.3.1", "2.4.6"]
marker: naglowki
who: [czytnik]
axe: []
example: punkty-orientacyjne-i-naglowki
status: szkic
---
## Problem

„Odjazdy z przystanku Rynek”, „Aktualności”, „Schemat sieci” i „Zgłoś uwagę” wyglądają jak nagłówki, ale to `div` z dużą, grubą czcionką. Lista nagłówków w czytniku ekranu jest pusta, więc klawisz H nic nie robi, a stronę trzeba słuchać od początku do końca.

axe tego nie zgłasza: strona bez nagłówków to dla niego dobra praktyka do poprawy, a nie błąd WCAG.

## Rozwiązanie

H1 z nazwą strony (tu ukryty wizualnie, bo logo pełni jego rolę), H2 dla każdej sekcji, H3 dla wiadomości i slajdów. Poziomy idą po kolei.

```przed
<div class="naglowek">Odjazdy z przystanku Rynek</div>
```

```po
<h1 class="sr-only">Komunikacja Miejska Wrzosów: strona główna</h1>
<h2 id="odjazdy-tytul">Odjazdy z przystanku Rynek</h2>
```
