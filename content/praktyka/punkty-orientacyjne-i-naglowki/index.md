---
title: Punkty orientacyjne i nagłówki
summary: Strona z samych div i nagłówków dobranych na oko. Daj jej header, nav, main i footer, a nagłówkom kolejne poziomy.
criteria: ["1.3.1", "2.4.1", "2.4.6"]
effort: 15 minut
gain: Czytnik skacze klawiszem D prosto do treści, a klawiszem H idzie po spisie, w którym nic nie brakuje.
preview: <span class="p-x">div · div · div</span>
status: szkic
simulations:
  punkty-orientacyjne: W wersji zepsutej obrysy dostają tylko dwie nawigacje, obie bez nazwy. Górny pasek, treść i stopka to zwykłe div, więc czytnik ich nie zna. W wersji poprawnej jest komplet, a nawigacje mają nazwy.
  naglowki: W wersji zepsutej po H1 od razu jest H4, a „Ulica Polna” to pogrubiony tekst, którego nie ma na liście nagłówków. W wersji poprawnej poziomy idą po kolei, od H1 do H3.
bad:
  why: Górny pasek, treść i stopka to elementy div. Obie nawigacje nie mają nazw. Po H1 od razu H4, a podtytuł „Ulica Polna” to tylko pogrubiony tekst.
  announces: Na liście punktów orientacyjnych dwa razy „nawigacja”, bez treści głównej. Na liście nagłówków nie ma „Ulica Polna”.
  axe: []
good:
  why: Elementy header, main i footer, obie nawigacje z nazwami w aria-label. Nagłówki H1, H2 i H3 po kolei.
  announces: „baner”, „nawigacja Główna”, „główny”, „nawigacja Aktualności”, „informacje o zawartości”, a nagłówki od H1 do H3 bez przerw.
---
Strona gminy z harmonogramem wywozu odpadów. Obie wersje wyglądają tak samo. Włącz symulację „Punkty orientacyjne” albo „Nagłówki”, żeby zobaczyć, co z tej strony ma czytnik ekranu.
