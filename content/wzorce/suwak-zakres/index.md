---
title: Suwak z zakresem
en: Slider (Multirange)
batch: zlozone
native: html-i-aria
summary: Dwa suwaki w jednej grupie, „od” i „do”. Każdy jest zwykłym input typu range, a skrypt pilnuje, żeby się nie minęły.
criteria: ["2.5.7", "4.1.2", "1.3.1"]
examples: [przeciaganie-z-alternatywa]
preview: <span class="p-slider p-range"><b></b><b></b></span>
steps:
  - do: Wejdź do grupy. Czytnik zapowie ją, a potem pierwszy suwak.
    keys: [Tab]
    hear: Od, suwak, 100 zł
  - do: Podnieś dolną granicę.
    keys: ["→"]
    hear: 150 zł
  - do: Przejdź do górnej granicy.
    keys: [Tab]
    hear: Do, suwak, 500 zł
  - do: Spróbuj zjechać na sam dół. Górna granica zatrzyma się na dolnej.
    keys: [Home]
    hear: 150 zł
aria:
  - attr: aria-valuetext
    on: suwak „Od”
    selector: "#cena-od"
    meaning: Dolna granica z jednostką.
  - attr: aria-valuetext
    on: suwak „Do”
    selector: "#cena-do"
    meaning: Górna granica z jednostką.
  - attr: value
    on: suwak „Do”
    selector: "#cena-do"
    meaning: Skrypt nie pozwala jej zejść poniżej dolnej granicy.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
  deque: https://dequeuniversity.com/library/aria/slider-multirange
status: szkic
---
## Kiedy używać

Gdy ktoś wybiera przedział: cena od i do, godziny dostawy, rok produkcji. Dwa pola liczbowe robią to samo i często są wygodniejsze. Suwak pomaga, gdy liczy się, gdzie przedział leży na całej skali.

Wspólny tor z dwoma uchwytami wygląda zgrabnie, ale wymaga własnego suwaka z ARIA. Tu są dwa natywne suwaki w `fieldset`: każdy ma swoją etykietę, „Od” i „Do”, a grupa nazwę „Cena”, którą czytnik mówi przy wejściu. Skrypt dokłada `aria-valuetext` i pilnuje, żeby górna granica nie zeszła poniżej dolnej.

Gdy skrypt poprawia wartość, czytnik słyszy wartość poprawioną, a nie tę, którą ustawił klawisz.

## Typowe błędy

- Dwa uchwyty na jednym torze, z których tylko jeden dostaje fokus.
- Suwaki bez etykiet albo oba nazwane „Cena”.
- Granice, które się mijają, bo nikt nie sprawdza, która jest większa.
- Brak sposobu na ustawienie wartości bez przeciągania.

## Jak sprawdzić

- Przejdź Tabem przez oba suwaki i zmieniaj wartości klawiszami.
- Spróbuj ustawić górną granicę poniżej dolnej, myszą i z klawiatury.
- Posłuchaj w czytniku nazwy grupy i nazw obu suwaków.
