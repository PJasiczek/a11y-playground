---
title: Podmenu otwiera się tylko pod myszą
criteria: ["2.1.1", "4.1.2"]
marker: podmenu
who: [klawiatura, czytnik, telefon]
axe: []
pattern: nawigacja-wielopoziomowa
status: szkic
---
## Problem

„Rozkłady”, „Bilety” i „O nas” rozwijają listy, gdy najedzie się na nie myszą (`li:hover`). Tab przechodzi przez „Rozkłady” do „Bilety”, a lista się nie pokazuje, więc z klawiatury do rozkładu tramwajów nie da się dojść. Na ekranie dotykowym nie ma najechania. Czytnik ekranu nie wie, że pod pozycją coś jest.

## Rozwiązanie

Każda pozycja z podmenu to przycisk z `aria-expanded` i `aria-controls`. Enter i spacja otwierają listę, Esc ją zamyka i zwraca fokus na przycisk, a kliknięcie poza menu też ją zamyka.

```przed
<li><a href="#">Rozkłady</a>
  <ul class="pod">…</ul>
</li>
.menu li:hover .pod { display: block; }
```

```po
<li><button aria-expanded="false" aria-controls="pod-rozklady">Rozkłady</button>
  <ul class="pod" id="pod-rozklady" hidden>…</ul>
</li>
```
