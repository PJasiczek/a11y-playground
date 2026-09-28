---
title: Przeciąganie z alternatywą
summary: Kolejność listy zmienia się tylko przeciąganiem. Dodaj przyciski przesuwania i ogłaszaj nową pozycję.
criteria: ["2.5.7", "2.1.1", "4.1.3"]
effort: 15 minut
gain: Kolejność zmieni każdy, także bez przytrzymywania przycisku myszy i bez myszy w ogóle.
preview: <span class="p-drag">⠿ Zadanie 1</span>
status: szkic
bad:
  why: Elementy mają atrybut draggable i obsługę przeciągania, nic więcej. Bez przytrzymania przycisku myszy i ruchu nie da się zmienić kolejności.
  announces: Lista z trzema elementami. Czytnik je przeczyta, ale nie ma żadnej kontrolki do zmiany kolejności.
good:
  why: Każdy element ma przyciski „w górę” i „w dół” z nazwą zawierającą nazwę zadania. Po przesunięciu fokus zostaje na przycisku, a region statusu ogłasza nową pozycję.
  announces: „Przenieś Zadanie 1 w dół, przycisk”, a po naciśnięciu „Zadanie 1 jest teraz na pozycji 2 z 3”.
---
Lista zadań, w której kolejność oznacza priorytet. Przeciąganie może zostać, ale nie może być jedynym sposobem.
