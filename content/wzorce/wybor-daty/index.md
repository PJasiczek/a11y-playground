---
title: Wybór daty
en: Datepicker
batch: zlozone
native: tylko-aria
summary: Pole na datę i przycisk, który otwiera kalendarz w oknie dialogowym. Dni to siatka, po której chodzi się strzałkami, a PageUp i PageDown zmieniają miesiąc.
criteria: ["2.1.1", "3.3.2", "4.1.2"]
preview: <span class="p-dialog-still"><b>Październik 2026</b> 14 · [15] · 16</span>
steps:
  - do: Przejdź do pola. Format daty jest jego opisem.
    keys: [Tab]
    hear: "Data dostawy, pole edycji, Format: dd.mm.rrrr"
  - do: Przejdź do przycisku kalendarza.
    keys: [Tab]
    hear: Wybierz datę, przycisk
  - do: Otwórz kalendarz. Fokus trafia na dzisiejszy dzień.
    keys: [Enter]
    hear: czwartek, 15 października 2026, komórka, bieżąca data
  - do: Przejdź na następny dzień.
    keys: ["→"]
    hear: piątek, 16 października 2026, komórka
  - do: Przejdź o tydzień dalej.
    keys: ["↓"]
    hear: piątek, 23 października 2026, komórka
  - do: Przejdź na ten sam dzień w następnym miesiącu.
    keys: [PageDown]
    hear: poniedziałek, 23 listopada 2026, komórka
  - do: Wybierz ten dzień. Okno się zamyka, data trafia do pola, a fokus wraca do przycisku.
    keys: [Enter]
    hear: Wybierz datę, przycisk
aria:
  - attr: value
    on: pole „Data dostawy”
    selector: "#data"
    meaning: Wybrana data. Pole zostaje zwykłym polem, w które da się ją wpisać.
  - attr: aria-describedby
    on: pole „Data dostawy”
    selector: "#data"
    meaning: Format daty jako opis pola. Czytnik czyta go po nazwie (3.3.2).
  - attr: open
    on: kalendarz
    selector: dialog
    meaning: Czy okno z kalendarzem jest otwarte.
  - attr: role
    on: tabela dni
    selector: table
    meaning: Siatka. Tabela staje się kontrolką, po której chodzi się strzałkami, a nie tylko danymi do przeczytania.
  - attr: aria-live
    on: nazwa miesiąca
    selector: "#miesiac"
    meaning: Region na żywo. Po zmianie miesiąca przyciskami czytnik mówi nowy miesiąc.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
  deque: https://dequeuniversity.com/library/aria/date-picker
status: szkic
---
## Kiedy używać

Najpierw sprawdź, czy wystarczy `input type="date"`. Przeglądarka daje wtedy własny kalendarz, obsługę klawiatury i format daty zgodny z ustawieniami systemu, choć wygląd i zachowanie różnią się między przeglądarkami. Dla daty urodzenia kalendarz w ogóle się nie przydaje: trzy pola albo jedno pole tekstowe są szybsze niż przewijanie czterdziestu lat.

Własny kalendarz ma sens, gdy trzeba pokazać, które dni są dostępne, albo wybrać zakres. Pole tekstowe zostaje: dla wielu osób wpisanie daty jest szybsze niż kalendarz, a format jest opisem pola. Kalendarz otwiera się w elemencie `dialog`, który pilnuje fokusu i zamyka się klawiszem Esc. Dni są w tabeli z `role="grid"`: tylko jeden dzień jest w kolejności Tab, a strzałki, Home, End, PageUp i PageDown przesuwają fokus. Każdy dzień ma pełną nazwę w `aria-label`, bo samo „16” nic nie mówi.

Dzisiejszy dzień jest w tym przykładzie stały, 15 października 2026, żeby ćwiczenie brzmiało tak samo każdego dnia.

## Typowe błędy

- Kalendarz bez pola tekstowego. Osoba z klawiaturą musi przejść strzałkami przez wszystkie miesiące.
- Dni jako przyciski, każdy osobnym przystankiem Tab. Miesiąc to ponad trzydzieści naciśnięć.
- Dni nazwane samą liczbą. Czytnik mówi „16” bez miesiąca i dnia tygodnia.
- Format daty tylko w placeholderze, który znika po wpisaniu pierwszej cyfry.
- Dzisiejszy albo wybrany dzień pokazany tylko kolorem.

## Jak sprawdzić

- Wpisz datę w pole z klawiatury, bez otwierania kalendarza.
- Otwórz kalendarz i przejdź dwa miesiące dalej samymi klawiszami. Wybierz dzień Enterem.
- Posłuchaj w czytniku, czy dzień ma pełną nazwę, i czy słychać dzisiejszą datę.
- Zamknij kalendarz klawiszem Esc. Fokus ma wrócić na przycisk.
