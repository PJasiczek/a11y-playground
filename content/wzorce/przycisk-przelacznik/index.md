---
title: Przycisk przełącznik
en: Button (Toggle)
batch: html
native: html-i-aria
summary: Przycisk, który ma dwa stany. Nazwa zostaje ta sama, a stan mówi atrybut aria-pressed.
criteria: ["4.1.2", "1.4.1"]
preview: <span class="p-toggle"><b>✓</b> Wycisz</span>
steps:
  - do: Przejdź do przycisku.
    keys: [Tab]
    hear: Wycisz, przycisk przełącznik, nienaciśnięte
  - do: Włącz wyciszenie.
    keys: [Enter]
    hear: naciśnięte
  - do: Wyłącz je.
    keys: [Spacja]
    hear: nienaciśnięte
aria:
  - attr: aria-pressed
    on: przycisk „Wycisz”
    selector: "#wycisz"
    meaning: Czy przełącznik jest włączony. Sama obecność atrybutu robi z przycisku przełącznik.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/button/
  deque: https://dequeuniversity.com/library/aria/button-toggle
status: szkic
---
## Kiedy używać

Gdy przycisk włącza i wyłącza jedną rzecz, a jego nazwa ma zostać ta sama: wycisz, pogrub, pokaż tylko nieprzeczytane. Czytnik powie „Wycisz, przycisk przełącznik, naciśnięte”, więc osoba wie i co to jest, i w jakim stanie.

Jeśli wolisz zmieniać nazwę („Wycisz”, potem „Włącz dźwięk”), nie dodawaj `aria-pressed`. Jedno albo drugie: zmiana nazwy i stan razem mówią to samo dwa razy i mylą.

Do ustawień, które działają od razu jak włącznik światła, pasuje też `role="switch"` z `aria-checked`.

## Typowe błędy

- Stan pokazany tylko kolorem tła. Osoba, która nie rozróżnia kolorów, i czytnik ekranu nie wiedzą, czy przycisk jest włączony.
- `aria-pressed` i zmieniająca się nazwa naraz.
- Stan zmieniony w wyglądzie, ale nie w atrybucie.

## Jak sprawdzić

- Przejdź do przycisku klawiszem Tab i przełącz go Enterem i Spacją.
- Posłuchaj w czytniku, czy słychać „naciśnięte” i „nienaciśnięte”.
- Zobacz przycisk w skali szarości. Włączony musi się różnić od wyłączonego czymś więcej niż kolorem.
