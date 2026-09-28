---
title: Karuzela automatyczna
summary: Slajdy zmieniają się same co 3 sekundy i nie da się ich zatrzymać. Dodaj widoczny przycisk pauzy i zatrzymuj karuzelę przy fokusie.
criteria: ["2.2.2", "2.2.1"]
effort: 15 minut
gain: Każdy przeczyta slajd we własnym tempie, a czytnik nie jest przerywany w pół zdania.
preview: <span class="p-slides">● ○ ○</span>
motion: true
status: szkic
bad:
  why: Slajd zmienia się co 3 sekundy, bez przycisku pauzy i bez przycisków przewijania. Zmiana następuje też wtedy, gdy ktoś właśnie czyta.
  announces: Czytnik zaczyna czytać slajd, a w połowie zdania treść znika i pojawia się następny. Nie ma kontrolki, która to zatrzyma.
good:
  why: Przycisk „Wstrzymaj” jest pierwszy i zawsze widoczny. Karuzela zatrzymuje się, gdy fokus albo kursor są w jej wnętrzu, i nie rusza się wcale przy ustawieniu ograniczenia ruchu.
  announces: „Wstrzymaj, przycisk”, a po naciśnięciu „Wznów, przycisk”. Slajd czytany jest w całości, bo przy fokusie karuzela stoi.
---
Karuzela z trzema ogłoszeniami. Oba warianty ruszają dopiero po naciśnięciu „Uruchom przykład”, bo ta strona sama musi spełniać kryterium 2.2.2.
