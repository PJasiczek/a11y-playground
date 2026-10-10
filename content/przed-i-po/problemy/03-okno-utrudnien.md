---
title: Okno utrudnień nie przejmuje fokusu
criteria: ["2.1.1", "2.4.3"]
marker: okno
who: [klawiatura, czytnik]
axe: []
example: okno-modalne-i-fokus
pattern: okno-dialogowe
status: szkic
---
## Problem

Okno „Utrudnienia w ruchu” otwiera się przy wejściu i przykrywa stronę ciemną zasłoną. Fokus zostaje pod spodem: Tab chodzi po elementach, których nie widać. Krzyżyk zamykający to `div` z obsługą kliknięcia, więc z klawiatury nie da się go użyć, a Esc nic nie robi. Czytnik ekranu nie wie, że jakieś okno się pojawiło.

## Rozwiązanie

Element `dialog` otwarty metodą `showModal()`. Przeglądarka sama przenosi fokus do okna, blokuje stronę pod spodem i zamyka okno klawiszem Esc. Przycisk „Szczegóły utrudnień” otwiera okno jeszcze raz, a po zamknięciu fokus wraca na niego.

```przed
<div class="okno otwarte">
  <div class="zamknij">✕</div>
  <div class="naglowek">Utrudnienia w ruchu</div>
```

```po
<dialog aria-labelledby="okno-tytul">
  <h2 id="okno-tytul">Utrudnienia w ruchu</h2>
  <form method="dialog"><button>Zamknij</button></form>
</dialog>
<script>okno.showModal();</script>
```
