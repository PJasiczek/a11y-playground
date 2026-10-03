---
title: Przycisk
en: Button
batch: html
native: html
summary: Element button wykonuje akcję na tej stronie. Enter, Spacja, fokus, nazwa i rola przychodzą z przeglądarki.
criteria: ["4.1.2", "2.1.1"]
examples: [ikona-jako-przycisk]
preview: <span class="p-button">Dodaj do koszyka</span>
steps:
  - do: Przejdź do przycisku.
    keys: [Tab]
    hear: Dodaj do koszyka, przycisk
  - do: Naciśnij go.
    keys: [Enter]
    hear: "W koszyku: 1 produkt"
  - do: Naciśnij go jeszcze raz.
    keys: [Spacja]
    hear: "W koszyku: 2 produkty"
aria:
  - attr: role
    on: komunikat pod przyciskiem
    selector: "#koszyk"
    meaning: Region stanu. Czytnik odczyta zmianę jego treści, nie przerywając tego, co właśnie mówi.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/button/
  deque: https://dequeuniversity.com/library/aria/button
status: szkic
---
## Kiedy używać

Gdy kliknięcie robi coś na tej stronie: dodaje do koszyka, otwiera okno, wysyła formularz. Jeśli prowadzi pod inny adres, to jest łącze, nie przycisk.

Element `button` daje za darmo wszystko, czego oczekuje czytnik i klawiatura: [rolę](slownik:rola) „przycisk”, [nazwę](slownik:nazwa) z tekstu, miejsce w kolejności Tab, Enter i Spację. `role="button"` na `div` każe ci to wszystko napisać od nowa.

Komunikat „W koszyku: 1 produkt” siedzi w elemencie z `role="status"`, który jest na stronie od początku. Dzięki temu czytnik odczyta zmianę, a fokus zostaje na przycisku.

## Typowe błędy

- `div` albo `span` z obsługą kliknięcia. Nie ma roli, nie dostaje fokusu i nie reaguje na klawisze.
- `role="button"` bez `tabindex="0"` i obsługi Entera i Spacji.
- Przycisk z samą ikoną i bez nazwy. Czytnik mówi „przycisk” i nic więcej.
- Łącze `href="#"` udające przycisk. Spacja przewija wtedy stronę zamiast nacisnąć.

## Jak sprawdzić

- Przejdź do przycisku klawiszem Tab i naciśnij go Enterem, potem Spacją.
- W czytniku ekranu posłuchaj, czy słychać nazwę i „przycisk”, a po naciśnięciu komunikat o koszyku.
- W narzędziach deweloperskich sprawdź w [drzewie dostępności](slownik:drzewo-dostepnosci), że rola to `button`.
