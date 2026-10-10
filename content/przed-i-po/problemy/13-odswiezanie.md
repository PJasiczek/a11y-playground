---
title: Tablica sama się przebudowuje i nie da się jej zatrzymać
criteria: ["2.2.2"]
marker: odswiezanie
who: [czytnik, poznawcze, slabe-widzenie]
axe: []
pattern: regiony-na-zywo
status: szkic
---
## Problem

Po włączeniu ruchu tablica co 15 sekund buduje się od nowa. Kto czyta ją powoli albo w powiększeniu, traci miejsce w połowie wiersza. Czytnik ekranu, który był w tablicy, ląduje na początku albo nigdzie. Nie ma przycisku, który to zatrzyma, ani informacji, z której minuty są dane.

## Rozwiązanie

Tablica zmienia się, gdy czytelnik o to poprosi przyciskiem „Odśwież odjazdy”. Godzina ostatniej aktualizacji jest widoczna i siedzi w `role="status"`, więc czytnik ogłasza ją grzecznie, nie przerywając.

```przed
setInterval(pokazOdjazdy, 15000);
```

```po
<p role="status">Stan na 12:01</p>
<button>Odśwież odjazdy</button>
```
