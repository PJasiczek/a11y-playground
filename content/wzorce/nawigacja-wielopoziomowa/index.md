---
title: Nawigacja wielopoziomowa
en: Navigation (Hierarchical) with Expand/Collapse
batch: pokazywanie
native: html-i-aria
summary: Menu strony z podmenu za przyciskiem. Łącza zostają łączami, przycisk mówi, czy podmenu jest otwarte, a aria-current wskazuje bieżącą stronę.
criteria: ["4.1.2", "1.3.1", "3.2.3"]
preview: <span class="p-disclosure">Odzież <b>▾</b></span>
steps:
  - do: Wejdź do nawigacji. Czytnik zapowie ją, a potem pierwsze łącze.
    keys: [Tab]
    hear: Nowości, łącze, bieżąca strona
  - do: Przejdź do przycisku podmenu.
    keys: [Tab]
    hear: Odzież, przycisk, zwinięte
  - do: Otwórz podmenu.
    keys: [Enter]
    hear: rozwinięte
  - do: Wejdź do podmenu.
    keys: [Tab]
    hear: Kurtki, łącze
  - do: Zamknij podmenu. Fokus wraca do przycisku.
    keys: [Esc]
    hear: Odzież, przycisk, zwinięte
aria:
  - attr: aria-label
    on: nawigacja
    selector: nav
    meaning: Nazwa nawigacji. Na stronie z kilkoma nawigacjami odróżnia je od siebie.
  - attr: aria-current
    on: łącze „Nowości”
    selector: "#nav-nowosci"
    meaning: Łącze do strony, na której jesteś. Czytnik mówi „bieżąca strona”.
  - attr: aria-expanded
    on: przycisk „Odzież”
    selector: "#nav-odziez"
    meaning: Czy podmenu jest otwarte.
  - attr: aria-controls
    on: przycisk „Odzież”
    selector: "#nav-odziez"
    meaning: Które podmenu należy do przycisku.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
  deque: https://dequeuniversity.com/library/aria/navigation
status: szkic
---
## Kiedy używać

Gdy menu strony ma więcej łączy, niż mieści się w jednym rzędzie, i dzielą się na grupy. Łącza zostają zwykłymi łączami w listach w elemencie `nav`, a każde podmenu otwiera przycisk z `aria-expanded`, jak we wzorcu „Rozwiń i zwiń”. Esc zamyka podmenu i oddaje fokus przyciskowi.

To nie jest `role="menu"`. Menu z ARIA obsługuje się strzałkami jak menu aplikacji, a czytnik przechodzi wtedy w inny tryb. Na stronie internetowej ludzie oczekują łączy, Taba i listy, którą czytnik umie policzyć.

`aria-current="page"` na łączu do bieżącej strony mówi to samo, co pogrubienie albo podkreślenie na ekranie.

## Typowe błędy

- `role="menu"` i `role="menuitem"` na zwykłej nawigacji. Tab przestaje działać tak, jak ludzie się spodziewają.
- Podmenu otwierane tylko po najechaniu myszą.
- Nazwa grupy jako łącze i jednocześnie przycisk. Jedno kliknięcie nie może i prowadzić, i rozwijać.
- Bieżąca strona zaznaczona tylko kolorem.

## Jak sprawdzić

- Przejdź przez nawigację klawiszem Tab, otwórz podmenu Enterem i zamknij je klawiszem Esc.
- Posłuchaj w czytniku, czy przy wejściu słychać nazwę nawigacji, a przy bieżącym łączu „bieżąca strona”.
- Wyświetl w czytniku listę punktów orientacyjnych. Nawigacja ma mieć nazwę.
