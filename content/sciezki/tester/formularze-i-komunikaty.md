---
title: Formularze i komunikaty
summary: Wyślij formularz z błędami i posłuchaj, co powie czytnik.
criteria: ["3.3.1", "3.3.3", "4.1.3"]
examples: [formularz-z-bledami]
keep:
  - Wyślij pusty formularz i formularz ze złymi danymi.
  - Błąd musi być w tekście, przy polu, z podpowiedzią.
  - Komunikaty bez przeładowania strony muszą dotrzeć do czytnika.
status: szkic
---
Formularze mają najwięcej stanów do sprawdzenia, a automat zobaczy tylko stan początkowy.

## Procedura

1. Przejdź formularz klawiaturą i czytnikiem. Każde pole ma nazwę i wiadomo, czy jest obowiązkowe.
2. Wyślij pusty formularz. Sprawdź, czy błędy są opisane tekstem (3.3.1), czy stoją przy polach i czy czytnik je przeczyta, gdy wejdziesz w pole.
3. Wpisz złe dane, na przykład datę w złym formacie. Sprawdź, czy komunikat mówi, jak to poprawić (3.3.3).
4. Sprawdź, gdzie jest fokus po wysłaniu. Najlepiej w pierwszym błędnym polu albo na liście błędów.

## Komunikaty o stanie

„Zapisano”, „Dodano do koszyka”, liczba wyników wyszukiwania: sprawdź czytnikiem, czy zostaną ogłoszone bez przenoszenia fokusu (4.1.3). Jeśli widać je na ekranie, a czytnik milczy, to błąd. [Komunikat o stanie](slownik:komunikat-o-stanie) ogłoszony dwa razy albo przerywający czytanie też warto zgłosić.
