---
title: Pasek cookies zasłania element z fokusem
criteria: ["2.4.11"]
marker: cookies
who: [klawiatura, slabe-widzenie]
axe: []
status: szkic
---
## Problem

Pasek cookies jest przyklejony do dołu okna (`position: fixed`). Gdy Tab dochodzi do elementu na dole widocznej części strony, przeglądarka przewija tak, żeby element był w oknie, ale pasek leży na nim. Osoba z klawiaturą nie widzi, gdzie jest fokus, a w powiększeniu pasek zajmuje pół ekranu.

## Rozwiązanie

Pasek jest częścią strony, a nie warstwą nad nią, i ma przycisk zamknięcia. Jeśli coś musi być przyklejone, `scroll-padding-bottom` równy jego wysokości sprawia, że przeglądarka zatrzymuje przewijanie nad nim.

```przed
.cookies { position: fixed; left: 0; right: 0; bottom: 0; }
```

```po
.cookies { /* w obiegu strony, z przyciskiem Zamknij */ }
/* albo, gdy pasek musi zostać przyklejony: */
html { scroll-padding-bottom: 4rem; }
```
