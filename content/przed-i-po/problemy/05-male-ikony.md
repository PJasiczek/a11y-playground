---
title: Ikony mediów społecznościowych 16 na 16 pikseli
criteria: ["2.5.8"]
marker: ikony
who: [telefon]
axe: [target-size]
example: cel-24-na-24
status: szkic
---
## Problem

Łącza do Facebooka, Instagrama i YouTube mają po 16 pikseli i stoją dwa piksele od siebie. Na telefonie palec trafia w sąsiednią ikonę, a osoba z drżeniem rąk nie trafi w żadną. WCAG 2.2 wymaga co najmniej 24 na 24 piksele albo odstępu, który daje tyle samo.

## Rozwiązanie

Ikona może zostać mała, ale łącze wokół niej ma 44 na 44 piksele. Tyle wymaga kryterium 2.5.5 na poziomie AAA, a palcem trafia się w to wygodnie.

```przed
.spolecznosc a { width: 16px; height: 16px; }
.spolecznosc { gap: 2px; }
```

```po
.spolecznosc a {
  display: flex; align-items: center; justify-content: center;
  width: 44px; height: 44px;
}
```
