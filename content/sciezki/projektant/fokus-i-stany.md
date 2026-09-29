---
title: Fokus i stany w projekcie
summary: Zaprojektuj wskaźnik fokusu jak każdy inny stan i nie zasłaniaj go przyklejonymi elementami.
criteria: ["2.4.7", "2.4.11", "1.4.11"]
examples: [kontrast-stanow]
keep:
  - Wskaźnik fokusu to element systemu projektowego, nie domyślny obrys przeglądarki.
  - Co najmniej 3 do 1 wobec tła, na każdym tle w aplikacji.
  - Przyklejony nagłówek i baner nie mogą zasłonić elementu z fokusem.
status: szkic
---
Projekt zwykle pokazuje stan domyślny i najechanie myszą. Stanu [fokusu](slownik:fokus) często nie ma w ogóle, więc programista zostawia domyślny obrys albo go usuwa, bo „nie pasuje”.

## Zaprojektuj wskaźnik

Kryterium 2.4.7 wymaga, żeby fokus był widoczny. Dobry wskaźnik to obrys grubości 2 do 3 pikseli z odstępem od elementu, w kolorze, który ma 3 do 1 wobec tła (1.4.11). Sprawdź go na jasnych i ciemnych sekcjach, na zdjęciach i na kolorowych przyciskach. Sama zmiana koloru tła przycisku często jest za słaba.

## Nie zasłaniaj

Przyklejony nagłówek, stopka z ciasteczkami albo pływający czat potrafią przykryć element, na który właśnie przeszedł fokus. Kryterium 2.4.11 wymaga, żeby element z fokusem nie był całkiem zasłonięty. Zaplanuj w projekcie, jak strona przewija się pod przyklejonymi elementami, i ogranicz ich wysokość.

## Stany w specyfikacji

Przekaż programistom komplet: domyślny, najechanie, fokus, aktywny, wyłączony, błąd. Każdy z parą kolorów i jej kontrastem.
