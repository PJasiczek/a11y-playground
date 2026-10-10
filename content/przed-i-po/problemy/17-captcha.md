---
title: CAPTCHA jako obrazek bez alternatywy
criteria: ["1.1.1"]
marker: captcha
who: [czytnik, slabe-widzenie, poznawcze]
axe: []
status: szkic
---
## Problem

Żeby wysłać zgłoszenie, trzeba przepisać zniekształcony kod z obrazka. Czytnik ekranu słyszy „kod” i nic więcej, osoba słabowidząca nie odczyta liter, a osoba z dysleksją myli je ze sobą. Nie ma wersji dźwiękowej ani innej drogi. axe tego nie widzi, bo obrazek ma `alt`.

## Rozwiązanie

Formularz zgłoszenia nie potrzebuje CAPTCHA. Spam można odsiać po stronie serwera: ukryte pole-pułapka, którego ludzie nie wypełniają, limit zgłoszeń z jednego adresu, filtr treści. Jeśli test jest konieczny, musi mieć alternatywę w innej formie, tak jak wymaga 1.1.1.

```przed
<img src="kod.svg" alt="kod">
<input type="text" name="kod">
```

```po
<!-- bez CAPTCHA: spam odsiewa serwer -->
```
