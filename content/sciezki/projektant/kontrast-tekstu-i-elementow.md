---
title: Kontrast tekstu i elementów
summary: Ile kontrastu potrzebuje tekst, a ile obramowanie pola i ikona.
criteria: ["1.4.3", "1.4.11"]
examples: [kontrast-stanow]
keep:
  - Zwykły tekst co najmniej 4,5 do 1, duży tekst 3 do 1.
  - Granice pól, ikony i stany kontrolek co najmniej 3 do 1.
  - Sprawdzaj każdy stan, nie tylko domyślny.
status: szkic
---
[Współczynnik kontrastu](slownik:wspolczynnik-kontrastu) porównuje jasność dwóch kolorów, od 1 do 1 (brak różnicy) do 21 do 1 (czerń na bieli). Słabowidzący, starsze osoby i każdy, kto patrzy na telefon w słońcu, potrzebują wyraźnej różnicy.

## Tekst

Kryterium 1.4.3 wymaga 4,5 do 1 dla zwykłego tekstu i 3 do 1 dla [dużego tekstu](slownik:duzy-tekst), czyli od 24 pikseli albo od 18,5 piksela pogrubionego. Szary tekst pomocniczy na jasnoszarym tle to najczęstszy błąd. Placeholder też jest tekstem.

## Elementy, które nie są tekstem

Kryterium 1.4.11 dotyczy granic, po których rozpoznaje się kontrolkę: obramowania pola, stanu zaznaczenia pola wyboru, ikony bez podpisu, wskaźnika fokusu. Potrzebują 3 do 1 wobec tego, co obok. Pole z jasnoszarą ramką na białym tle często go nie ma. Ozdobne elementy są zwolnione.

## Stany

Najedzenie, fokus, wyłączenie, błąd: każdy stan to nowa para kolorów. Przycisk wyłączony jest zwolniony z wymagań, ale tekst błędu i stan fokusu już nie. Wpisz kontrast każdej pary do systemu projektowego, żeby nie liczyć go od nowa przy każdym ekranie.
