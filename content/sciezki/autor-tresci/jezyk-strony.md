---
title: Język strony i fragmentów
summary: Czytnik czyta polski tekst polską wymową tylko wtedy, gdy wie, że to polski.
criteria: ["3.1.1", "3.1.2"]
keep:
  - Strona ma ustawiony język główny.
  - Cytat albo akapit w innym języku ma ustawiony swój język.
  - Pojedyncze obce słowa, które weszły do polszczyzny, zostają bez oznaczenia.
status: szkic
---
Czytnik ekranu wybiera głos i zasady wymowy na podstawie języka tekstu. Polski tekst przeczytany angielskim głosem jest prawie niezrozumiały.

## Język strony

Kryterium 3.1.1 wymaga, żeby strona miała określony język główny. To zwykle ustawienie całego serwisu, więc sprawdź je raz i poproś o poprawkę, jeśli jest złe.

## Fragmenty w innym języku

Kryterium 3.1.2 dotyczy fragmentów: cytatu po angielsku, akapitu po ukraińsku, nazwy piosenki po francusku. Oznacz je językiem w edytorze, jeśli ma taką opcję, albo poproś o oznaczenie w kodzie przez atrybut `lang`. Wtedy czytnik przełączy wymowę.

Nie oznaczaj słów, które weszły do polszczyzny, jak „weekend” czy „e-mail”, ani nazw własnych. Oznaczanie wszystkiego przeszkadza, bo czytnik przełącza głos w środku zdania.
