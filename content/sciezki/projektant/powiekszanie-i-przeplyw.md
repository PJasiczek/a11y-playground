---
title: Powiększanie i przepływ treści
summary: Strona, która przy 200 i 400 procentach nadal się czyta, bez przewijania w dwóch kierunkach.
criteria: ["1.4.4", "1.4.10", "1.4.12"]
keep:
  - Tekst da się powiększyć do 200 procent bez utraty treści.
  - Przy szerokości 320 pikseli nie ma przewijania w poziomie.
  - Kontenery rosną razem z tekstem, zamiast go ucinać.
status: szkic
---
Wiele osób powiększa stronę na stałe. Projekt, który wygląda dobrze tylko w jednym rozmiarze, dla nich się rozsypuje.

## Powiększenie tekstu

Kryterium 1.4.4 wymaga, żeby tekst dało się powiększyć do 200 procent bez utraty treści i funkcji. Najczęściej psują to kontenery o stałej wysokości, które ucinają tekst, i etykiety na przyciskach, które nachodzą na siebie.

## Przepływ

Kryterium 1.4.10 mówi, że przy szerokości 320 [pikseli CSS](slownik:piksel-css), czyli przy powiększeniu 400 procent na ekranie 1280 pikseli, treść układa się w jedną kolumnę bez przewijania w poziomie. Wyjątkiem jest to, co z natury potrzebuje dwóch wymiarów: mapy, duże tabele, edytory. Zaprojektuj widok wąski jako pełnoprawny, a nie jako skrót.

## Odstępy w tekście

Część osób czyta z własnymi ustawieniami: większą interlinią i odstępami między literami. Kryterium 1.4.12 wymaga, żeby taki tekst się nie ucinał i nie nachodził na siebie. Znowu chodzi o kontenery, które rosną razem z treścią.
