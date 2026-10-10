---
title: Język strony i ramki po ukraińsku nieoznaczony
criteria: ["3.1.1", "3.1.2"]
marker: jezyk
who: [czytnik]
axe: [html-has-lang]
status: szkic
---
## Problem

Element `html` nie ma atrybutu `lang`, więc czytnik ekranu zgaduje język albo bierze ten z ustawień systemu. Ramka „Інформація для пасажирів” jest po ukraińsku, ale nic tego nie mówi. Polski syntezator czyta ją po polsku i wychodzi bełkot, którego nie zrozumie nikt, także osoba z Ukrainy, dla której ta ramka powstała.

## Rozwiązanie

Język całej strony idzie na `html`, a każdy fragment w innym języku dostaje własny `lang`. Łącze „Українською” w nagłówku też jest po ukraińsku, więc też dostaje `lang="uk"`.

```przed
<html>
…
<div class="ramka">
  <div class="naglowek">Інформація для пасажирів</div>
```

```po
<html lang="pl">
…
<section class="ramka" lang="uk">
  <h2>Інформація для пасажирів</h2>
```
