---
title: Przyciski opcji
en: Radio and Radio Group
batch: html
native: html
summary: Grupa pól input typu radio w fieldset. Tab wchodzi do grupy raz, strzałki zmieniają wybór.
criteria: ["1.3.1", "2.1.1", "4.1.2"]
preview: <span class="p-radio"><b>●</b> Kurier <b>○</b> Paczkomat</span>
steps:
  - do: Wejdź do grupy. Fokus trafia na zaznaczoną opcję.
    keys: [Tab]
    hear: Kurier, przycisk opcji, zaznaczone, 1 z 3
  - do: Wybierz następną opcję.
    keys: ["↓"]
    hear: Paczkomat, przycisk opcji, zaznaczone, 2 z 3
  - do: Wybierz ostatnią.
    keys: ["↓"]
    hear: Odbiór osobisty, przycisk opcji, zaznaczone, 3 z 3
  - do: Wróć o jedną.
    keys: ["↑"]
    hear: Paczkomat, przycisk opcji, zaznaczone, 2 z 3
aria:
  - attr: checked
    on: opcja „Kurier”
    selector: "#kurier"
    meaning: Czy opcja jest wybrana. W grupie o tej samej nazwie wybrana może być jedna.
  - attr: checked
    on: opcja „Paczkomat”
    selector: "#paczkomat"
    meaning: Jak wyżej.
  - attr: checked
    on: opcja „Odbiór osobisty”
    selector: "#odbior"
    meaning: Jak wyżej.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
  deque: https://dequeuniversity.com/library/aria/radio-and-radio-group
status: szkic
---
## Kiedy używać

Gdy osoba wybiera dokładnie jedną z kilku widocznych opcji. Przy kilkunastu opcjach lepsza będzie lista `select`.

Natywne pola z tym samym atrybutem `name` robią całą pracę: Tab zatrzymuje się w grupie raz, na zaznaczonej opcji, strzałki przesuwają wybór, a czytnik mówi pozycję, na przykład „2 z 3”. `fieldset` i `legend` dają grupie [nazwę](slownik:nazwa), którą czytnik zapowiada przy wejściu. Własna grupa z `role="radiogroup"` musi to wszystko odtworzyć skryptem, łącznie z wędrującym `tabindex`.

## Typowe błędy

- Pytanie nad opcjami jako zwykły akapit zamiast `legend`. Czytnik czyta „Paczkomat, przycisk opcji” bez kontekstu.
- Każda opcja osobnym przystankiem Tab. Tak działają pola wyboru, nie przyciski opcji.
- Opcje z różnym `name`. Każda staje się osobną grupą i da się zaznaczyć wszystkie.
- Przyciski opcji, które od razu przeładowują stronę po zmianie wyboru. Strzałka wybiera opcję, więc osoba z klawiaturą nie dojdzie do następnej.

## Jak sprawdzić

- Wejdź do grupy klawiszem Tab i zmieniaj wybór strzałkami. Tab ma wyjść z grupy, a nie przejść do następnej opcji.
- W czytniku posłuchaj nazwy grupy przy wejściu i pozycji opcji.
- Kliknij w tekst opcji. Opcja musi się zaznaczyć.
