---
title: Drzewo
en: Tree View
batch: zlozone
native: tylko-aria
summary: Lista z poziomami, jak foldery w menedżerze plików. Strzałki w górę i w dół idą po widocznych elementach, w prawo i w lewo otwierają i zamykają gałęzie.
criteria: ["1.3.1", "2.1.1", "4.1.2"]
preview: <span class="p-tree">▾ Dokumenty<br>&nbsp;&nbsp;&nbsp;umowa.pdf<br>▸ Zdjęcia</span>
steps:
  - do: Wejdź do drzewa. Czytnik powie, na którym poziomie jesteś i ile elementów jest obok.
    keys: [Tab]
    hear: Dokumenty, element drzewa, zwinięte, 1 z 2, poziom 1
  - do: Otwórz folder.
    keys: ["→"]
    hear: rozwinięte
  - do: Przejdź do pierwszego pliku w środku.
    keys: ["↓"]
    hear: umowa.pdf, element drzewa, 1 z 2, poziom 2
  - do: Wróć do folderu nadrzędnego.
    keys: ["←"]
    hear: Dokumenty, element drzewa, rozwinięte, 1 z 2, poziom 1
  - do: Zamknij folder.
    keys: ["←"]
    hear: zwinięte
  - do: Przejdź do następnego folderu. Pliki zamkniętego folderu są pomijane.
    keys: ["↓"]
    hear: Zdjęcia, element drzewa, zwinięte, 2 z 2, poziom 1
aria:
  - attr: aria-expanded
    on: folder „Dokumenty”
    selector: "#drzewo-dokumenty"
    meaning: Czy gałąź jest otwarta. Liście drzewa, czyli pliki, nie mają tego atrybutu.
  - attr: tabindex
    on: folder „Dokumenty”
    selector: "#drzewo-dokumenty"
    meaning: 0 na elemencie z fokusem, -1 na pozostałych. Drzewo to jeden przystanek Tab.
  - attr: tabindex
    on: plik „umowa.pdf”
    selector: "#drzewo-umowa"
    meaning: Jak wyżej.
  - attr: aria-labelledby
    on: folder „Dokumenty”
    selector: "#drzewo-dokumenty"
    meaning: Nazwa z etykiety folderu. Bez tego nazwa zawierałaby też nazwy wszystkich plików w środku.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
  deque: https://dequeuniversity.com/library/aria/tree-view
status: szkic
---
## Kiedy używać

Gdy dane naprawdę są drzewem, a ludzie poruszają się po nim jak po folderach: struktura plików, kategorie z podkategoriami w panelu administracyjnym. Do nawigacji po stronie drzewo jest za ciężkie. Lepsze są zagnieżdżone listy łączy w `nav`, jak we wzorcu „Nawigacja wielopoziomowa”.

HTML nie ma drzewa, więc wszystko robi ARIA: `role="tree"`, `treeitem` i `group` na listach w środku, `aria-expanded` na gałęziach i wędrujący `tabindex`. Czytnik wylicza poziom i pozycję z samej struktury, więc nie trzeba dopisywać `aria-level` ani `aria-posinset`. Klawiatura jest twoja: strzałki, Home, End, a według APG także pierwsza litera nazwy.

Nazwa gałęzi pochodzi z jej etykiety przez `aria-labelledby`. Inaczej, liczona z treści, zawierałaby nazwy wszystkich elementów w środku.

## Typowe błędy

- Drzewo, w którym każdy element jest osobnym przystankiem Tab. Przy stu plikach to sto naciśnięć.
- Strzałka w prawo, która nic nie robi na zamkniętej gałęzi, albo w lewo, która nie wraca do rodzica.
- Fokus znika, gdy zamyka się gałąź, w której był.
- Stan gałęzi pokazany tylko trójkątem, bez `aria-expanded`.

## Jak sprawdzić

- Wejdź Tabem do drzewa i przejdź je strzałkami. Następny Tab ma wyjść z drzewa.
- Otwórz gałąź strzałką w prawo i zamknij strzałką w lewo z jej elementu w środku.
- Posłuchaj w czytniku poziomu i pozycji, na przykład „1 z 2, poziom 2”.
