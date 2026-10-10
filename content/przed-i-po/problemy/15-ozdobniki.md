---
title: Ozdobne ikony opisane jak treść
criteria: ["1.1.1"]
marker: ozdobniki
who: [czytnik]
axe: []
example: obraz-dekoracyjny-i-informacyjny
status: szkic
---
## Problem

Przy każdej wiadomości stoi ikona autobusu z `alt="ikona autobusu"`. Nic nie mówi, a czytnik ekranu powtarza ją trzy razy, przed każdym tytułem. axe tego nie widzi, bo `alt` jest.

## Rozwiązanie

Ozdobnik dostaje pusty `alt=""`, więc czytnik go pomija. Opis, który nic nie dodaje, jest gorszy niż brak opisu.

```przed
<img src="autobus.svg" alt="ikona autobusu">
```

```po
<img src="autobus.svg" alt="">
```
