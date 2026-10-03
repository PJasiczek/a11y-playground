---
title: Akordeon, kilka sekcji
en: Accordion (Multiselect)
batch: pokazywanie
native: html-i-aria
summary: Nagłówki z przyciskami, z których każdy rozwija swoją sekcję. Otwarte mogą być wszystkie naraz.
criteria: ["1.3.1", "4.1.2"]
preview: <span class="p-disclosure">Rozmiar <b>−</b></span>
steps:
  - do: Przejdź do nagłówka „Rozmiar”.
    keys: [Tab]
    hear: Rozmiar, przycisk, zwinięte
  - do: Otwórz sekcję.
    keys: [Enter]
    hear: rozwinięte
  - do: Wejdź do sekcji. Czytnik najpierw zapowie region, potem pole.
    keys: [Tab]
    hear: S, pole wyboru, niezaznaczone
  - do: Przejdź do następnego pola.
    keys: [Tab]
    hear: M, pole wyboru, niezaznaczone
  - do: Przejdź do nagłówka „Kolor”.
    keys: [Tab]
    hear: Kolor, przycisk, zwinięte
  - do: Otwórz tę sekcję.
    keys: [Enter]
    hear: rozwinięte
  - do: Wróć. Sekcja „Rozmiar” dalej jest otwarta.
    keys: [Shift+Tab]
    hear: M, pole wyboru, niezaznaczone
aria:
  - attr: aria-expanded
    on: przycisk „Rozmiar”
    selector: "#filtr-rozmiar"
    meaning: Czy sekcja jest otwarta. Otwarcie innej sekcji go nie zmienia.
  - attr: aria-expanded
    on: przycisk „Kolor”
    selector: "#filtr-kolor"
    meaning: Jak wyżej.
  - attr: role
    on: sekcja „Rozmiar”
    selector: "#sekcja-rozmiar"
    meaning: Region nazwany przyciskiem przez aria-labelledby. Czytnik zapowiada go przy wejściu do sekcji.
  - attr: aria-labelledby
    on: sekcja „Rozmiar”
    selector: "#sekcja-rozmiar"
    meaning: Skąd region bierze nazwę.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
  deque: https://dequeuniversity.com/library/aria/accordion-multi
status: szkic
---
## Kiedy używać

Gdy czytelnik może potrzebować kilku sekcji naraz, na przykład filtrów w sklepie: rozmiar i kolor ustawia się razem. Zamykanie poprzedniej sekcji kazałoby mu ją otwierać od nowa.

Każda sekcja z polami ma `role="region"` i nazwę z przycisku. Czytnik zapowiada „Rozmiar, region”, gdy fokus wchodzi do środka, więc osoba wie, do czego należą pola S i M. Daj region tylko kilku sekcjom: przy kilkunastu lista punktów orientacyjnych w czytniku robi się bezużyteczna.

Kilka elementów `details` bez atrybutu `name` działa tak samo i nie potrzebuje skryptu, ale nie daje nagłówków.

## Typowe błędy

- Pola w sekcji bez żadnej grupy ani nazwy. Czytnik mówi „S, pole wyboru” i nie wiadomo, czy to rozmiar, czy coś innego.
- `role="region"` na każdej z kilkunastu sekcji.
- Stan sekcji zapisany tylko w klasie CSS, bez `aria-expanded`.

## Jak sprawdzić

- Otwórz dwie sekcje i sprawdź, czy obie zostają otwarte.
- Wejdź Tabem do sekcji z polami. Czytnik ma zapowiedzieć jej nazwę.
- Wyświetl w czytniku listę regionów i sprawdź, czy jest ich tyle, ile ma sens.
