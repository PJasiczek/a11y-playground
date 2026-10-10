---
title: Niewidoczny fokus
criteria: ["2.4.7"]
marker: fokus
who: [klawiatura]
axe: []
status: szkic
---
## Problem

Jedna reguła w CSS, `*:focus { outline: none; }`, usuwa obwódkę fokusu z całej strony i nic jej nie zastępuje. Kto przechodzi stronę klawiaturą, po każdym naciśnięciu Tab musi zgadywać, gdzie jest.

## Rozwiązanie

Nie usuwać obwódki, tylko ją zaprojektować. `:focus-visible` pokazuje ją przy klawiaturze, a nie przy kliknięciu myszą. Na ciemnym tle obwódka jest żółta, na jasnym fioletowa, i w obu miejscach ma kontrast co najmniej 3:1.

```przed
*:focus { outline: none; }
```

```po
:focus-visible { outline: 3px solid #4a1f5c; outline-offset: 2px; }
.karuzela :focus-visible, .stopka :focus-visible { outline-color: #ffc93c; }
```
