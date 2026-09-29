---
title: Jak opisać błąd
summary: Zgłoszenie, które da się naprawić bez dopytywania, z kryterium, krokami i oczekiwanym wynikiem.
keep:
  - Jedno zgłoszenie, jeden problem, jedno kryterium.
  - Kroki do odtworzenia z nazwą narzędzia, przeglądarki i czytnika.
  - Oczekiwane i faktyczne zachowanie, najlepiej z tym, co powiedział czytnik.
status: szkic
---
Zgłoszenie „strona jest niedostępna” trafi na koniec kolejki. Zgłoszenie, które mówi, co, gdzie i jak odtworzyć, zostanie naprawione.

## Szablon

- **Tytuł:** krótko, co i gdzie. „Przycisk zamykania okna logowania nie ma nazwy”.
- **Kryterium:** numer i nazwa, na przykład 4.1.2 Nazwa, rola, wartość. Kryterium pozwala ocenić wagę, a programiście przeczytać, czego się od niego oczekuje.
- **Miejsce:** adres strony i element.
- **Środowisko:** przeglądarka, system, czytnik i jego wersja, powiększenie.
- **Kroki:** numerowane, od załadowania strony.
- **Oczekiwane:** co powinno się stać. „Czytnik mówi: Zamknij, przycisk”.
- **Faktyczne:** co się stało. „Czytnik mówi: przycisk”.
- **Wpływ:** kogo to blokuje i jak bardzo.

## Waga

Blokujące są błędy, przez które ktoś nie załatwi sprawy: pułapka na klawiaturę, formularz bez etykiet, przycisk „Zapłać”, którego nie da się uruchomić. Wyżej zgłaszaj to, co leży na głównej ścieżce użytkownika.
