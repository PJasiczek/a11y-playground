---
title: Strona ma 1000 pikseli szerokości
criteria: ["1.4.10"]
marker: szerokosc
who: [telefon, slabe-widzenie]
axe: []
example: sztywna-szerokosc
status: szkic
---
## Problem

Strona ma sztywne `width: 1000px`. Na telefonie i przy powiększeniu 400% trzeba ją przewijać w dwie strony, a każdy wiersz tekstu czytać, przesuwając ekran w bok. axe tego nie sprawdza.

## Rozwiązanie

`max-width` zamiast `width` i siatki, które same zmieniają liczbę kolumn. Strona mieści się w 320 pikselach bez przewijania w bok, a tablica odjazdów zawija tekst zamiast się rozpychać.

```przed
.strona { width: 1000px; }
.kolumny { grid-template-columns: 1.3fr 1fr; }
```

```po
.strona { max-width: 1000px; }
.kolumny { grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr)); }
```
