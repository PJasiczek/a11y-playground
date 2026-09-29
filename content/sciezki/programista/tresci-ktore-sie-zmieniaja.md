---
title: Treści, które się zmieniają
summary: Komunikaty o stanie i zmiany kontekstu, których czytnik nie przegapi.
criteria: ["3.2.1", "3.2.2", "4.1.3"]
keep:
  - Komunikat o stanie idzie przez region na żywo, bez przenoszenia fokusu.
  - Fokus i wybór w polu nie zmieniają kontekstu same z siebie.
  - Region na żywo jest w DOM, zanim wpiszesz do niego tekst.
status: szkic
---
Strona, która zmienia się bez przeładowania, pokazuje osobom widzącym, że coś się stało. Czytnik ekranu nic nie powie, dopóki mu tego nie przekażesz.

## Komunikaty o stanie

„Dodano do koszyka”, „Znaleziono 12 wyników”, „Zapisano” to [komunikaty o stanie](slownik:komunikat-o-stanie). Kryterium 4.1.3 wymaga, żeby czytnik je ogłosił bez przenoszenia fokusu. Służy do tego region na żywo: element z `role="status"` albo `aria-live="polite"`. Pilne błędy mogą użyć `role="alert"`.

Region musi być w DOM od początku. Jeśli wstawisz go razem z tekstem, wiele czytników nic nie powie. Wstaw pusty kontener przy renderze strony i zmieniaj tylko jego treść.

## Zmiana kontekstu

[Zmiana kontekstu](slownik:zmiana-kontekstu) to na przykład przejście na inną stronę, otwarcie okna albo przeniesienie fokusu. Nie może się zdarzyć tylko dlatego, że element dostał fokus (3.2.1) albo że ktoś wybrał opcję z listy (3.2.2). Lista języków, która przeładowuje stronę zaraz po wyborze, zaskakuje każdego, kto przegląda opcje strzałkami. Dodaj przycisk „Zmień” albo uprzedź o tym w etykiecie.
