---
title: Akordeon, jedna sekcja
en: Accordion (Single)
batch: pokazywanie
native: html-i-aria
summary: Nagłówki z przyciskami, z których każdy rozwija swoją sekcję. Otwarcie jednej zamyka poprzednią.
criteria: ["1.3.1", "4.1.2"]
preview: <span class="p-disclosure">Zwroty <b>−</b></span>
steps:
  - do: Przejdź do pierwszego nagłówka.
    keys: [Tab]
    hear: Dostawa, przycisk, zwinięte
  - do: Otwórz sekcję.
    keys: [Enter]
    hear: rozwinięte
  - do: Przejdź do następnego nagłówka. Sekcja nie ma kontrolek, więc Tab ją przeskakuje.
    keys: [Tab]
    hear: Zwroty, przycisk, zwinięte
  - do: Otwórz tę sekcję.
    keys: [Spacja]
    hear: rozwinięte
  - do: Wróć do pierwszego nagłówka. Jego sekcja zamknęła się sama.
    keys: [Shift+Tab]
    hear: Dostawa, przycisk, zwinięte
aria:
  - attr: aria-expanded
    on: przycisk „Dostawa”
    selector: "#akordeon-dostawa"
    meaning: Czy sekcja jest otwarta.
  - attr: aria-expanded
    on: przycisk „Zwroty”
    selector: "#akordeon-zwroty"
    meaning: Jak wyżej. Gdy otwiera się ta sekcja, skrypt zamyka pozostałe.
  - attr: aria-expanded
    on: przycisk „Płatności”
    selector: "#akordeon-platnosci"
    meaning: Jak wyżej.
  - attr: aria-controls
    on: przycisk „Dostawa”
    selector: "#akordeon-dostawa"
    meaning: Która sekcja należy do przycisku.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
  deque: https://dequeuniversity.com/library/aria/accordion-single
status: szkic
---
## Kiedy używać

Gdy długą stronę z kilkoma niezależnymi tematami da się podzielić na sekcje, z których czytelnik zwykle potrzebuje jednej: pytania i odpowiedzi, warunki dostawy, ustawienia. Jeśli wszystkie sekcje są krótkie, pokaż je od razu. Rozwijanie kosztuje kliknięcie.

Przycisk siedzi w nagłówku (`h3`), więc osoba z czytnikiem przeskakuje po sekcjach klawiszem nagłówków i od razu słyszy, czy sekcja jest otwarta. Kilka elementów `details` z tym samym atrybutem `name` też otwiera tylko jedną sekcję naraz i nie potrzebuje skryptu, ale nagłówek w `summary` traci swoją rolę, więc ta nawigacja znika.

Zamykanie poprzedniej sekcji to wybór, nie obowiązek. Jeśli czytelnik może chcieć porównać dwie sekcje, użyj akordeonu z kilkoma sekcjami naraz.

## Typowe błędy

- Przycisk bez nagłówka albo nagłówek bez przycisku. W pierwszym przypadku znika nawigacja po nagłówkach, w drugim Enter i Spacja nic nie robią.
- `aria-expanded` na nagłówku zamiast na przycisku. Czytnik ogłasza stan elementu, który ma fokus.
- Sekcja zamknięta przez wysokość 0. Jej łącza dalej dostają fokus.
- Zamknięcie sekcji, w której jest fokus, bez przeniesienia go gdzie indziej.

## Jak sprawdzić

- Przejdź po nagłówkach klawiszem Tab i otwieraj sekcje Enterem i Spacją.
- W czytniku ekranu wyświetl listę nagłówków (w NVDA Insert+F7). Każda sekcja ma swój nagłówek.
- Otwórz drugą sekcję i sprawdź, czy pierwsza mówi „zwinięte”.
