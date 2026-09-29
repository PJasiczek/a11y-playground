---
title: Test klawiaturą
summary: Odłóż mysz i przejdź stronę Tabem, Enterem, spacją, strzałkami i Esc.
criteria: ["2.1.1", "2.1.2", "2.4.3", "2.4.7"]
examples: [okno-modalne-i-fokus]
keep:
  - Każdy element, który działa myszą, osiągniesz Tabem i uruchomisz klawiszem.
  - Zawsze widzisz, gdzie jest fokus.
  - Z każdego miejsca wyjdziesz klawiaturą.
status: szkic
---
To najtańszy test ręczny i znajduje najwięcej. Nie potrzebujesz żadnego narzędzia.

## Procedura

1. Załaduj stronę i kliknij w pasek adresu, żeby zacząć od początku.
2. Naciskaj Tab. Pierwszy powinien być link „Przejdź do treści”, jeśli strona go ma.
3. Przy każdym przystanku sprawdź, czy widać [fokus](slownik:fokus) (2.4.7) i czy kolejność zgadza się z układem strony (2.4.3).
4. Uruchom każdy przycisk, link, pole i menu. Przyciski działają na Enter i spację, linki na Enter, listy i zakładki na strzałki (2.1.1).
5. Otwórz każde okno i menu, i zamknij je klawiszem Esc. Sprawdź, gdzie wraca fokus.
6. Szukaj miejsc, z których nie da się wyjść: osadzony odtwarzacz, mapa, edytor tekstu (2.1.2).
7. Shift+Tab ma prowadzić tą samą drogą z powrotem.

## Na co uważać

Elementy, które pojawiają się tylko po najechaniu myszą, na przykład menu albo przycisk „usuń” przy wierszu. Przewijane kontenery, do których nie da się wejść. Fokus, który znika, bo trafił na ukryty element.
