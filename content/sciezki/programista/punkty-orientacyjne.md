---
title: Punkty orientacyjne i nagłówki
summary: Header, nav, main i footer oraz nagłówki po kolei to mapa strony, po której czytnik skacze.
criteria: ["1.3.1", "2.4.1", "2.4.6"]
examples: [punkty-orientacyjne-i-naglowki]
keep:
  - Jeden header, jeden main i jeden footer na stronę. Treść główna zawsze w main.
  - Dwie nawigacje na stronie potrzebują dwóch różnych nazw w aria-label.
  - Poziom nagłówka wynika ze struktury, a rozmiar ustawiasz w CSS.
status: szkic
---
[Czytnik ekranu](slownik:czytnik-ekranu) pozwala skakać po stronie na dwa sposoby. Klawiszem D w NVDA przechodzi między punktami orientacyjnymi: banerem, nawigacją, treścią główną, stopką. Klawiszem H idzie po nagłówkach, jak po spisie treści. Oba skróty działają tylko wtedy, gdy strona ma te elementy w kodzie, a nie tylko na ekranie.

## Punkty orientacyjne

Elementy `header`, `nav`, `main`, `aside` i `footer` same stają się punktami orientacyjnymi. `header` i `footer` liczą się tylko poza `article`, `section`, `main` i `nav`, bo tam są nagłówkiem i stopką fragmentu, a nie strony. `section` i `form` stają się punktem dopiero z nazwą.

Kiedy na stronie są dwie nawigacje, czytnik powie dwa razy „nawigacja”. Nazwa w `aria-label` („Główna”, „Okruszki”) mówi, która jest która.

## Nagłówki

Jeden `h1` mówi, o czym jest strona. Pod nim `h2` dla sekcji, `h3` dla ich części, bez przeskoków. Jeśli `h4` ma rozmiar, który pasuje do projektu, to ustaw ten rozmiar w CSS dla `h2`, zamiast zmieniać poziom. Pogrubiony akapit wygląda jak nagłówek, ale na liście nagłówków czytnika go nie ma.

## Sprawdź to sam

Otwórz przykład i włącz symulację „Punkty orientacyjne”, a potem „Nagłówki”. Pod każdą ramką zobaczysz listę tego, co znalazł czytnik, i uwagi. To samo dla całej strony, na której jesteś, pokazuje przycisk „Struktura strony” w prawym dolnym rogu.
