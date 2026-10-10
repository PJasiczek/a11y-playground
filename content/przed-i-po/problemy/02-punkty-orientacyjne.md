---
title: Brak punktów orientacyjnych i łącza do treści
criteria: ["1.3.1", "2.4.1"]
marker: punkty
who: [czytnik, klawiatura]
axe: []
example: punkty-orientacyjne-i-naglowki
status: szkic
---
## Problem

Cała strona to elementy `div`. Czytnik ekranu nie zna nagłówka, nawigacji, treści głównej ani stopki, więc klawisz D nie ma dokąd skoczyć. Nie ma też łącza „Przejdź do treści”: kto używa klawiatury, przechodzi Tabem przez logo, ikony i całe menu, zanim dotrze do odjazdów.

axe tego nie zgłasza. Reguła `region` należy do dobrych praktyk, a nie do WCAG, więc przy tagach WCAG się nie uruchamia.

## Rozwiązanie

Elementy `header`, `nav` z nazwą, `main` i `footer` oraz łącze „Przejdź do treści” na samym początku strony, widoczne po fokusie.

```przed
<div class="gora">…</div>
<div class="menu">…</div>
<div class="kolumny">…</div>
<div class="stopka">…</div>
```

```po
<a class="przejdz" href="#tresc">Przejdź do treści</a>
<header>…<nav aria-label="Główna">…</nav></header>
<main id="tresc" tabindex="-1">…</main>
<footer>…</footer>
```
