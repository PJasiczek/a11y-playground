---
title: Cele i gesty
summary: Przyciski, w które trafi palec, i gesty, które mają prostszą alternatywę.
criteria: ["2.5.1", "2.5.7", "2.5.8"]
examples: [cel-24-na-24, przeciaganie-z-alternatywa]
keep:
  - Cel ma co najmniej 24 na 24 piksele, a lepiej 44.
  - Gest dwoma palcami albo po ścieżce ma odpowiednik jednym dotknięciem.
  - Przeciąganie ma odpowiednik w przyciskach.
status: szkic
---
Drżenie rąk, sztywne palce, duże palce, telefon w jadącym tramwaju: mały [cel](slownik:cel) i precyzyjny gest wykluczają więcej osób, niż się wydaje.

## Rozmiar i odstęp

Kryterium 2.5.8 wymaga co najmniej 24 na 24 [piksele CSS](slownik:piksel-css) albo odstępu, dzięki któremu okrąg o średnicy 24 pikseli wokół celu nie nachodzi na sąsiada. Ikona może być mniejsza, jeśli obszar klikalny jest większy. Dobrą praktyką jest 44 piksele, zwłaszcza dla głównych akcji.

## Gesty

Przybliżanie dwoma palcami, przesunięcie po określonej ścieżce, rysowanie wzoru: to [gesty wielopunktowe](slownik:gest-wielopunktowy) albo oparte na ścieżce. Kryterium 2.5.1 wymaga, żeby to samo dało się zrobić jednym punktem bez ścieżki, na przykład przyciskami plus i minus przy mapie.

## Przeciąganie

Kryterium 2.5.7 idzie dalej: przeciąganie, nawet jednym palcem, potrzebuje alternatywy pojedynczym dotknięciem. Suwak dostaje pole do wpisania wartości, a lista porządkowana przeciąganiem dostaje przyciski „wyżej” i „niżej”. Zaprojektuj je od razu, a nie jako łatkę.
