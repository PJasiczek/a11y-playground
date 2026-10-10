---
title: Logo, strzałki karuzeli i schemat sieci bez tekstu alternatywnego
criteria: ["1.1.1", "2.4.4"]
marker: obrazy
who: [czytnik]
axe: [image-alt, link-name]
example: obraz-dekoracyjny-i-informacyjny
status: szkic
---
## Problem

Trzy obrazy niosą informację i żaden nie ma atrybutu `alt`. Czytnik ekranu czyta zamiast nich nazwę pliku albo nic. Strzałki karuzeli to łącza z samym obrazkiem, więc łącza nie mają nazwy. Schemat sieci pokazuje, którędy jeżdżą linie, a bez opisu ta wiedza jest tylko dla osób, które widzą.

## Rozwiązanie

Logo stoi w łączu obok tekstu „KMW Komunikacja Miejska Wrzosów”, więc dostaje `alt=""`, a nazwę łącza daje tekst. Strzałki to przyciski z nazwami „Poprzedni komunikat” i „Następny komunikat”. Schemat ma krótki `alt`, a trasy linii są pod nim jako zwykła lista, którą przeczyta każdy.

```przed
<img src="logo.svg">
<a class="strzalka lewa" href="#"><img src="strzalka.svg"></a>
<img src="schemat.svg">
```

```po
<a class="logo" href="/"><img src="logo.svg" alt=""> KMW …</a>
<button aria-label="Poprzedni komunikat">‹</button>
<img src="schemat.svg" alt="Schemat sieci linii KMW. Opis linii jest pod schematem.">
<ul><li>Tramwaj 7: Zajezdnia Lipowa, Plac Wolności, Rynek, Dworzec Główny.</li>…</ul>
```
