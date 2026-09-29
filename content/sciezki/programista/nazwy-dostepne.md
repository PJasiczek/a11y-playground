---
title: Nazwy dostępne
summary: Skąd przycisk, pole i link biorą nazwę, i czemu sama ikona to za mało.
criteria: ["1.1.1", "2.5.3", "4.1.2"]
examples: [ikona-jako-przycisk]
keep:
  - Każdy element interaktywny ma nazwę, którą czytnik wypowie.
  - Widoczny tekst jest częścią nazwy. Kto steruje głosem, mówi to, co widzi.
  - Ikona bez tekstu potrzebuje nazwy w aria-label albo w ukrytym tekście.
status: szkic
---
Przeglądarka liczy [nazwę](slownik:nazwa) elementu w ustalonej kolejności. Najpierw `aria-labelledby`, potem `aria-label`, potem treść elementu albo powiązana [etykieta](slownik:etykieta), na końcu `title`. Wynik zobaczysz w narzędziach deweloperskich, w zakładce dostępności.

## Przyciski z ikoną

Przycisk z samą ikoną SVG nie ma nazwy. Czytnik powie tylko „przycisk”. Dodaj `aria-label="Zamknij"` na przycisku albo tekst ukryty wizualnie w środku. Samej ikonie daj `aria-hidden="true"`, żeby nie dokładała szumu.

Obrazek w linku jest nazwą linku. Jeśli jest jedyną treścią, jego `alt` mówi, dokąd link prowadzi, a nie co przedstawia obrazek. To wynika z kryterium 1.1.1 o [treści nietekstowej](slownik:tresc-nietekstowa).

## Etykieta w nazwie

Kryterium 2.5.3 wymaga, żeby widoczny tekst był zawarty w nazwie. Przycisk z napisem „Szukaj” i `aria-label="Wyszukaj w serwisie"` sprawia kłopot osobom sterującym głosem. Mówią „kliknij Szukaj”, a program nie znajduje takiej nazwy. Najprościej nie nadpisywać widocznego tekstu wcale.
