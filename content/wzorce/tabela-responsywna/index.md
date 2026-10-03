---
title: Tabela na wąskim ekranie
en: Table (Responsive, Collapsible)
batch: zmiany
native: html
summary: Szeroka tabela przewija się w bok w regionie, do którego da się dojść klawiszem Tab. Na wąskim ekranie wiersze stają się kartami, a nagłówki kolumn ich etykietami.
criteria: ["1.4.10", "1.3.1"]
examples: [tabela-z-naglowkami]
preview: '<span class="p-dialog-still"><b>Kraków</b> Adres: ul. Długa 5</span>'
steps:
  - do: Przejdź do przełącznika widoku.
    keys: [Tab]
    hear: Pokaż jak na wąskim ekranie, pole wyboru, niezaznaczone
  - do: Przejdź do tabeli. Jej region dostaje fokus, żeby dało się ją przewijać strzałkami.
    keys: [Tab]
    hear: Oddziały, region
  - do: Przejdź do pierwszego łącza w tabeli.
    keys: [Tab]
    hear: "Mapa: Kraków, łącze"
  - do: Wróć do regionu tabeli.
    keys: [Shift+Tab]
    hear: Oddziały, region
  - do: Wróć do przełącznika.
    keys: [Shift+Tab]
    hear: Pokaż jak na wąskim ekranie, pole wyboru, niezaznaczone
  - do: Pokaż widok wąskiego ekranu. Wiersze stają się kartami.
    keys: [Spacja]
    hear: zaznaczone
  - do: Przejdź do pierwszego łącza. Czytnik najpierw zapowie kartę oddziału.
    keys: [Tab]
    hear: "Mapa: Kraków, łącze"
aria:
  - attr: role
    on: opakowanie tabeli
    selector: ".table-region"
    meaning: Region z nazwą z podpisu tabeli. Dzięki niemu fokus na opakowaniu ma sens dla czytnika.
  - attr: tabindex
    on: opakowanie tabeli
    selector: ".table-region"
    meaning: Wartość 0 pozwala dojść do tabeli klawiszem Tab i przewijać ją strzałkami (2.1.1).
  - attr: aria-labelledby
    on: opakowanie tabeli
    selector: ".table-region"
    meaning: Nazwa regionu z podpisu tabeli.
sources:
  deque: https://dequeuniversity.com/library/aria/table-responsive
status: szkic
---
## Kiedy używać

Zawsze, gdy tabela ma więcej kolumn, niż zmieści się na telefonie. Kryterium 1.4.10 zwalnia tabele z danymi z wymogu mieszczenia się w 320 pikselach, bo układ w dwóch wymiarach jest częścią treści. Wtedy tabela przewija się w bok, ale tylko wewnątrz regionu, który ma nazwę i dostaje fokus, żeby dało się go przewijać klawiaturą.

Gdy wiersze są niezależne, na przykład oddziały albo zamówienia, czytelniejsze bywają karty: każdy wiersz to sekcja z nazwą z pierwszej komórki, a nagłówki kolumn stają się etykietami w liście opisów `dl`. Ten przykład buduje karty z tabeli skryptem, więc dane są w jednym miejscu, a CSS pokazuje tylko jedną wersję naraz. Przełącznik pokazuje karty bez zwężania okna.

Nie zamieniaj tabeli w karty przez `display: block` na `table` i `td`. Część przeglądarek usuwa wtedy z drzewa dostępności role tabeli i czytnik traci nagłówki.

## Typowe błędy

- Tabela, która wychodzi poza ekran razem z całą stroną.
- Przewijany region bez nazwy i bez `tabindex`. Klawiatura go nie przewinie.
- Karty bez etykiet: „ul. Długa 5, 8–18” i nie wiadomo, co jest czym.
- `display: block` na komórkach tabeli.

## Jak sprawdzić

- Powiększ stronę do 400% albo zwęź okno do 320 pikseli. Strona nie może przewijać się w bok, tylko tabela w swoim regionie.
- Przejdź Tabem do regionu i przewiń go strzałkami.
- W widoku kart posłuchaj w czytniku, czy każda karta ma nazwę, a wartości etykiety.
