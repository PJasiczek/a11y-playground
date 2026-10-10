---
title: Tablica odjazdów z elementów div
criteria: ["1.3.1"]
marker: tablica
who: [czytnik]
axe: []
example: tabela-z-naglowkami
pattern: tabela-responsywna
status: szkic
---
## Problem

Tablica wygląda jak tabela, ale to siatka z `div`. Czytnik ekranu czyta ją jako ciąg słów: „Linia Kierunek Odjazd 7 Dworzec Główny 12:04 14 Osiedle Słoneczne 12:06”. Nie da się przejść po kolumnie „Odjazd” ani usłyszeć, do którego nagłówka należy „12:06”.

## Rozwiązanie

Element `table` z `caption` i nagłówkami `th scope="col"`. Czytnik ogłasza wtedy liczbę wierszy i kolumn, a przy każdej komórce jej nagłówek.

```przed
<div class="wiersz opis"><div>Linia</div><div>Kierunek</div>…</div>
<div class="wiersz"><div class="linia">7</div><div>Dworzec Główny</div>…</div>
```

```po
<table>
  <caption>Najbliższe odjazdy</caption>
  <thead><tr><th scope="col">Linia</th><th scope="col">Kierunek</th>…</tr></thead>
  <tbody>…</tbody>
</table>
```
