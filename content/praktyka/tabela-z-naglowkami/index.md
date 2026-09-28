---
title: Tabela z nagłówkami
summary: Wiersz nagłówka zrobiony z pogrubionych komórek zwykłych. Użyj th ze scope i dodaj podpis tabeli.
criteria: ["1.3.1"]
effort: 2 minuty
gain: Przy każdej komórce czytnik podaje nagłówek kolumny, więc liczba „129” znaczy „Cena, 129 zł”.
preview: <span class="p-table">Miasto · Cena · Termin</span>
status: szkic
bad:
  why: Pierwszy wiersz wygląda jak nagłówek, bo jest pogrubiony, ale w kodzie to zwykłe komórki td. Tabela nie ma podpisu.
  announces: Przy przechodzeniu po komórkach samo „129 zł”, bez informacji, której kolumny to dotyczy.
good:
  why: Nagłówki kolumn i wierszy jako th z atrybutem scope. Podpis w elemencie caption mówi, czego dotyczy tabela.
  announces: „Ceny biletów, tabela, 3 kolumny, 3 wiersze”, a przy komórce „Kraków, Cena, 129 zł”.
---
Mała tabela z cenami biletów. Wzrokowo obie wersje są niemal identyczne. Różnica jest w tym, czy czytnik ekranu potrafi powiązać komórkę z jej nagłówkiem.
