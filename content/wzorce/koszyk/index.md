---
title: Koszyk
en: Shopping Cart
batch: zmiany
native: html-i-aria
summary: Tabela z produktami, przyciski ilości z nazwą produktu w nazwie i suma w atomowym regionie na żywo. Usunięcie wymaga potwierdzenia w oknie alertu.
criteria: ["4.1.3", "1.3.1", "3.3.4"]
preview: '<span class="p-dialog-still"><b>Razem: 3 produkty, 177 zł</b> − 2 + · Usuń</span>'
steps:
  - do: Przejdź do pierwszego przycisku ilości.
    keys: [Tab]
    hear: "Zmniejsz ilość: Kubek termiczny, przycisk"
  - do: Przejdź do drugiego.
    keys: [Tab]
    hear: "Zwiększ ilość: Kubek termiczny, przycisk"
  - do: Dodaj jeden kubek. Suma zmienia się, a czytnik czyta ją w całości.
    keys: [Enter]
    hear: "Razem: 3 produkty, 177 zł"
  - do: Przejdź do przycisku usuwania.
    keys: [Tab]
    hear: "Usuń: Kubek termiczny, przycisk"
  - do: Usuń kubek. Najpierw pojawi się pytanie.
    keys: [Enter]
    hear: Usunąć „Kubek termiczny” z koszyka?, okno alertu
  - do: Przejdź do przycisku „Usuń” w oknie.
    keys: [Tab]
    hear: Usuń, przycisk
  - do: Potwierdź. Wiersz znika, fokus trafia na nagłówek koszyka, a suma się zmienia.
    keys: [Enter]
    hear: "Razem: 1 produkt, 79 zł"
aria:
  - attr: aria-live
    on: suma
    selector: "#razem"
    meaning: Region na żywo. Każda zmiana ilości ogłasza nową sumę bez ruchu fokusu.
  - attr: aria-atomic
    on: suma
    selector: "#razem"
    meaning: Czytaj całe zdanie, nie tylko liczbę, która się zmieniła.
  - attr: aria-label
    on: przycisk „+” przy kubku
    selector: "[data-step='1']"
    meaning: Nazwa z produktem. W tabeli jest kilka przycisków „+”, a czytnik musi wiedzieć, do czego należy ten.
  - attr: role
    on: okno
    selector: dialog
    meaning: Okno alertu przed usunięciem.
sources:
  deque: https://dequeuniversity.com/library/aria/shopping-cart
status: szkic
---
## Kiedy używać

To nie jest jeden komponent, tylko składanka kilku wzorców w miejscu, gdzie błąd kosztuje pieniądze. Tabela z nagłówkami wierszy i kolumn ([relacje](slownik:relacja) w kodzie, 1.3.1) mówi, który wiersz to który produkt. Przyciski „−” i „+” mają w nazwie produkt, bo w tabeli jest ich kilka par. Suma jest w atomowym regionie na żywo, więc po każdej zmianie czytnik czyta całe zdanie „Razem: 3 produkty, 177 zł”.

Usunięcie produktu pyta w oknie alertu, z fokusem na „Anuluj” (3.3.4). Po potwierdzeniu przycisk, który otworzył okno, już nie istnieje, więc fokus trafia na nagłówek koszyka. Inaczej wylądowałby na początku strony.

## Typowe błędy

- Przyciski „+” i „Usuń” bez produktu w nazwie. Czytnik w trybie listy przycisków mówi „Usuń, Usuń, Usuń”.
- Suma, która zmienia się bez komunikatu.
- Każda zmiana ilości ogłaszana jako osobny komunikat, a nie jedno zdanie z sumą.
- Fokus znikający razem z usuniętym wierszem.

## Jak sprawdzić

- Zmień ilość z klawiatury i posłuchaj sumy w czytniku.
- Wyświetl w czytniku listę przycisków i sprawdź, czy każdy mówi, do którego produktu należy.
- Usuń produkt i sprawdź, gdzie jest fokus.
