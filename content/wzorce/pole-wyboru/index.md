---
title: Pole wyboru
en: Checkbox (Single)
batch: html
native: html
summary: Element input typu checkbox z etykietą. Spacja zaznacza, a czytnik mówi nazwę, rolę i stan.
criteria: ["4.1.2", "1.3.1", "3.3.2"]
preview: <span class="p-check"><b>✓</b> Chcę dostawać newsletter</span>
steps:
  - do: Przejdź do pola.
    keys: [Tab]
    hear: Chcę dostawać newsletter, pole wyboru, niezaznaczone
  - do: Zaznacz je.
    keys: [Spacja]
    hear: zaznaczone
  - do: Odznacz je.
    keys: [Spacja]
    hear: niezaznaczone
aria:
  - attr: checked
    on: pole „Newsletter”
    selector: "#newsletter"
    meaning: Stan pola. To właściwość elementu, nie atrybut, i przeglądarka sama przekazuje ją czytnikowi.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
  deque: https://dequeuniversity.com/library/aria/checkbox-single
status: szkic
---
## Kiedy używać

Gdy osoba wybiera „tak” albo „nie” dla jednej rzeczy, a wybór zadziała dopiero po wysłaniu formularza. Etykieta owija pole, więc kliknięcie w tekst też zaznacza, a cel ma wysokość całego wiersza.

Natywne pole ostylujesz przez `accent-color` albo `appearance: none` z własną ramką. `role="checkbox"` na `div` jest potrzebne tylko wtedy, gdy nie da się użyć `input`, i wymaga obsługi Spacji, fokusu i `aria-checked`.

## Typowe błędy

- Pole bez [etykiety](slownik:etykieta) albo z tekstem obok, który nie jest z nim powiązany. Czytnik mówi „pole wyboru, niezaznaczone” i nic więcej.
- Natywne pole schowane przez `display: none` i zastąpione obrazkiem. Pole znika z klawiatury.
- Zaznaczenie pokazane tylko kolorem ramki.

## Jak sprawdzić

- Przejdź do pola klawiszem Tab i zaznacz je Spacją.
- Kliknij w tekst etykiety. Pole musi się zaznaczyć.
- W czytniku posłuchaj nazwy i stanu.
