---
title: Kontrast i powiększenie
summary: Pipeta, powiększenie do 200 i 400 procent, i kontrast elementów, których automat nie widzi.
criteria: ["1.4.3", "1.4.4", "1.4.10", "1.4.11"]
examples: [kontrast-stanow]
keep:
  - Automat mierzy kontrast tekstu na jednolitym tle. Resztę zmierz pipetą.
  - Powiększ do 200 procent i szukaj uciętego tekstu.
  - Ustaw szerokość 320 pikseli i szukaj przewijania w poziomie.
status: szkic
---
Kontrast i powiększenie wydają się łatwe do automatyzacji, ale narzędzia sprawdzają tylko część przypadków.

## Kontrast

Automat zmierzy tekst na jednolitym tle. Nie zmierzy tekstu na zdjęciu, gradiencie, stanu fokusu i najechania ani obramowania pola (1.4.11). Do tego służy pipeta, na przykład Colour Contrast Analyser. Sprawdź tekst 4,5 do 1 (1.4.3), elementy nietekstowe 3 do 1, i to w każdym stanie.

## Powiększenie

Ustaw w przeglądarce 200 procent (1.4.4). Szukaj uciętego tekstu, nakładających się elementów i przycisków, które zniknęły.

Potem ustaw szerokość okna na 1280 pikseli i powiększ do 400 procent albo zawęź okno do 320 pikseli (1.4.10). Treść powinna ułożyć się w jedną kolumnę. Przewijanie w poziomie jest dopuszczalne tylko dla map, dużych tabel i podobnych treści dwuwymiarowych. Sprawdź też, czy przyklejone elementy nie zajmują połowy ekranu.
