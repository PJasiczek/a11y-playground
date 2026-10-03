---
title: Tabela z sortowaniem
en: Table (Sortable)
batch: zmiany
native: html-i-aria
summary: Zwykła tabela z przyciskami w nagłówkach kolumn. aria-sort mówi, po której kolumnie i w którą stronę jest posortowana, a komunikat o stanie potwierdza zmianę.
criteria: ["1.3.1", "4.1.2", "4.1.3"]
examples: [tabela-z-naglowkami]
preview: <span class="p-tabs"><b>Miasto ▲</b><span>Liczba klientów ↕</span></span>
steps:
  - do: Przejdź do przycisku w nagłówku kolumny.
    keys: [Tab]
    hear: Miasto, przycisk
  - do: Posortuj rosnąco.
    keys: [Enter]
    hear: Posortowano według kolumny Miasto, rosnąco.
  - do: Odwróć kolejność.
    keys: [Enter]
    hear: Posortowano według kolumny Miasto, malejąco.
  - do: Przejdź do drugiej kolumny.
    keys: [Tab]
    hear: Liczba klientów, przycisk
  - do: Posortuj po niej.
    keys: [Enter]
    hear: Posortowano według kolumny Liczba klientów, rosnąco.
aria:
  - attr: aria-sort
    on: nagłówek „Miasto”
    selector: "#kol-miasto"
    meaning: Kierunek sortowania. Ma go tylko jedna kolumna naraz.
  - attr: aria-sort
    on: nagłówek „Liczba klientów”
    selector: "#kol-klienci"
    meaning: Jak wyżej.
  - attr: role
    on: komunikat pod tabelą
    selector: "#sortowanie"
    meaning: Region stanu. Potwierdza sortowanie, bo zmiana kolejności wierszy sama nic nie ogłasza.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/
  deque: https://dequeuniversity.com/library/aria/table-sortable
status: szkic
---
## Kiedy używać

Gdy w tabeli jest tyle wierszy, że ludzie szukają w niej czegoś po jednej kolumnie: największy oddział, najtańszy produkt. To dalej zwykła tabela z `caption`, `th` i `scope`, więc czytnik czyta nagłówki przy każdej komórce. ARIA dokłada jedno: `aria-sort` na nagłówku posortowanej kolumny.

Sortuje się przyciskiem w nagłówku, a nie samym `th` z obsługą kliknięcia, bo przycisk dostaje fokus i działa Enterem. Przesunięcie wierszy samo nic nie ogłasza, więc zmianę potwierdza `role="status"`. Podpis tabeli ma ukryty dopisek, że kolumny da się sortować.

## Typowe błędy

- Nagłówek z obsługą kliknięcia, bez przycisku. Klawiatura nie posortuje tabeli.
- Kierunek sortowania pokazany tylko strzałką w kolorze.
- `aria-sort="none"` na wszystkich kolumnach. Wystarczy na posortowanej.
- Tabela zbudowana z `div` z wyglądem tabeli. Czytnik nie łączy komórek z nagłówkami.

## Jak sprawdzić

- Posortuj tabelę z klawiatury, po każdej kolumnie i w obie strony.
- Posłuchaj w czytniku komunikatu po sortowaniu i stanu nagłówka.
- Przejdź czytnikiem po komórkach i sprawdź, czy przy każdej słychać nagłówek kolumny.
