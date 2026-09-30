---
title: Ikona jako przycisk
summary: Znak × bez nazwy zamyka komunikat. Daj przyciskowi nazwę, a ikonę schowaj przed czytnikiem ekranu.
criteria: ["4.1.2", "2.1.1", "1.1.1", "2.5.8"]
effort: 1 linia
gain: Czytnik mówi „Zamknij komunikat, przycisk” zamiast milczeć, a klawiatura dochodzi do przycisku.
preview: <span class="p-x">×</span>
simulations:
  klawiatura: 'W wersji zepsutej Tab przeskakuje znak ×, więc lista kroków zostaje pusta, a komunikatu nie da się zamknąć. W wersji poprawnej przycisk dostaje numer 1 i zamyka komunikat Enterem.'
status: szkic
bad:
  why: Znak × w elemencie div z obsługą kliknięcia. Nie ma roli, nazwy ani miejsca w kolejności Tab. Cel ma 20 na 20 pikseli.
  announces: Nic sensownego. Tab pomija element, a przy czytaniu po kolei czytnik mówi „razy” albo „iks” jako zwykły tekst.
good:
  why: Prawdziwy element button z nazwą w aria-label. Ikona SVG jest schowana przed czytnikiem, bo nazwa już ją opisuje. Cel ma 44 na 44 piksele.
  announces: „Zamknij komunikat, przycisk”. Element jest w kolejności Tab i reaguje na Enter oraz spację.
---
Komunikat „Zapisano zmiany” z przyciskiem zamykania w rogu. Obie wersje wyglądają niemal tak samo. Różnica jest w tym, co dostaje osoba, która nie widzi znaku × albo nie używa myszy.
