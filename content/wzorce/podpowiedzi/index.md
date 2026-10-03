---
title: Podpowiedzi przy wpisywaniu
en: Predictive Text
batch: zmiany
native: tylko-aria
summary: Pole z listą podpowiedzi pod spodem. Fokus zostaje w polu, strzałki przesuwają podświetlenie po liście, a aria-activedescendant mówi czytnikowi, która opcja jest podświetlona.
criteria: ["4.1.2", "4.1.3", "1.3.5"]
examples: [wlasna-lista-zamiast-select]
preview: '<span class="p-dialog-still"><b>Miasto: Gd</b> → Gdańsk · Gdynia</span>'
steps:
  - do: Przejdź do pola.
    keys: [Tab]
    hear: Miasto, pole kombi, zwinięte
  - do: Otwórz podpowiedzi. Fokus zostaje w polu, a czytnik czyta pierwszą opcję.
    keys: ["↓"]
    hear: Gdańsk, opcja, wybrane, 1 z 4
  - do: Przejdź do następnej opcji.
    keys: ["↓"]
    hear: Gdynia, opcja, wybrane, 2 z 4
  - do: Wybierz ją. Miasto trafia do pola, lista się zamyka.
    keys: [Enter]
    hear: zwinięte
aria:
  - attr: aria-expanded
    on: pole
    selector: "#miasto"
    meaning: Czy lista podpowiedzi jest otwarta.
  - attr: aria-activedescendant
    on: pole
    selector: "#miasto"
    meaning: Identyfikator podświetlonej opcji. Fokus zostaje w polu, a czytnik czyta opcję, na którą wskazuje ten atrybut.
  - attr: aria-autocomplete
    on: pole
    selector: "#miasto"
    meaning: Że pole podpowiada listą, a nie uzupełnia tekstu samo.
  - attr: role
    on: lista
    selector: "#miasta"
    meaning: Lista wyboru z opcjami.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
  deque: https://dequeuniversity.com/library/aria/predictive-text
status: szkic
---
## Kiedy używać

Gdy możliwych wartości jest za dużo na listę `select`, a ludzie znają początek tego, czego szukają: miasto, ulica, produkt. Przy kilku opcjach `select` jest prostszy i daje wszystko za darmo. Element `datalist` też podpowiada, ale jego wygląd i obsługa czytnikiem bardzo się różnią między przeglądarkami.

To najtrudniejszy wzorzec z listy, bo fokus nigdy nie opuszcza pola: osoba może dalej pisać. Strzałki przesuwają tylko podświetlenie, a `aria-activedescendant` na polu mówi czytnikowi, którą opcję przeczytać. Liczba podpowiedzi idzie do `role="status"` (4.1.3), więc osoba wie, że lista się pojawiła albo zmieniła. `autocomplete` w znaczeniu HTML (1.3.5) to co innego: dotyczy podpowiedzi przeglądarki z danymi osoby i tu jest wyłączony, żeby nie nakładał się na naszą listę.

## Typowe błędy

- Fokus przenoszony do listy. Osoba nie może poprawić tego, co wpisała, bez wracania do pola.
- Lista, która otwiera się i zamyka, ale czytnik nic o tym nie mówi.
- Opcje wybierane tylko myszą.
- Podświetlona opcja pokazana tylko kolorem tła.

## Jak sprawdzić

- Wpisz kilka liter i przejdź po podpowiedziach strzałkami. Fokus ma zostać w polu.
- Posłuchaj w czytniku, czy słychać podświetloną opcję i liczbę podpowiedzi.
- Wybierz opcję Enterem i zamknij listę klawiszem Esc.
