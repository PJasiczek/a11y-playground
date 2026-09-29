---
title: Ruch, czas i cele dotykowe
summary: Karuzele, które da się zatrzymać, przeciąganie z alternatywą i cele, w które da się trafić.
criteria: ["2.2.2", "2.5.7", "2.5.8"]
examples: [karuzela-automatyczna, przeciaganie-z-alternatywa, cel-24-na-24]
keep:
  - Wszystko, co rusza się dłużej niż 5 sekund, da się zatrzymać.
  - Przeciąganie ma alternatywę pojedynczym kliknięciem.
  - Cel ma co najmniej 24 na 24 piksele albo odstęp od sąsiadów.
status: szkic
---
Ruch na stronie odciąga uwagę, a przy niektórych zaburzeniach uniemożliwia czytanie. Precyzyjne gesty wykluczają osoby z drżeniem rąk albo sterujące przełącznikiem.

## Pauza

Karuzela, która przewija się sama, animowane tło, przewijany pasek wiadomości: jeśli ruch trwa dłużej niż pięć sekund, potrzebny jest przycisk pauzy (2.2.2). Najlepiej, żeby karuzela w ogóle nie ruszała sama. Uszanuj też ustawienie `prefers-reduced-motion`.

## Przeciąganie

Lista porządkowana przeciąganiem, suwak, mapa: kryterium 2.5.7 wymaga, żeby to samo dało się zrobić pojedynczymi kliknięciami, na przykład przyciskami „w górę” i „w dół”. Obsługa klawiatury tego nie załatwia, bo chodzi o osoby, które używają wskaźnika, ale nie utrzymają wciśniętego przycisku.

## Rozmiar celu

[Cel](slownik:cel) ma co najmniej 24 na 24 [piksele CSS](slownik:piksel-css) albo tyle odstępu, żeby okrąg o średnicy 24 pikseli wokół niego nie nachodził na sąsiednie cele (2.5.8). Linki w tekście ciągłym są zwolnione. Ta aplikacja idzie dalej i trzyma 44 piksele, jak w kryterium 2.5.5 z poziomu AAA.
