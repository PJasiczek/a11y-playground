---
title: Rozwiń i zwiń
en: Expand/Collapse
batch: html
native: html-i-aria
summary: Przycisk, który pokazuje i chowa panel pod sobą. Stan mówi atrybut aria-expanded, nie tylko strzałka.
criteria: ["4.1.2", "1.3.1"]
preview: <span class="p-disclosure">Szczegóły zamówienia <b>+</b></span>
steps:
  - do: Przejdź do przycisku.
    keys: [Tab]
    hear: Szczegóły zamówienia, przycisk, zwinięte
  - do: Otwórz panel.
    keys: [Enter]
    hear: rozwinięte
  - do: Przejdź do łącza w panelu.
    keys: [Tab]
    hear: Śledź przesyłkę, łącze
  - do: Wróć do przycisku.
    keys: [Shift+Tab]
    hear: Szczegóły zamówienia, przycisk, rozwinięte
  - do: Zamknij panel.
    keys: [Spacja]
    hear: zwinięte
aria:
  - attr: aria-expanded
    on: przycisk
    selector: "#szczegoly-przycisk"
    meaning: Czy panel jest otwarty. Skrypt zmienia go razem z wyglądem.
  - attr: aria-controls
    on: przycisk
    selector: "#szczegoly-przycisk"
    meaning: Który panel należy do przycisku.
  - attr: hidden
    on: panel
    selector: "#szczegoly"
    meaning: Zamknięty panel znika też dla czytnika i klawiatury.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
  deque: https://dequeuniversity.com/library/aria/expand-collapse
status: szkic
---
## Kiedy używać

Gdy jeden przycisk pokazuje i chowa jeden blok treści: szczegóły zamówienia, dodatkowe pola formularza, długi opis. Jeśli nie potrzebujesz własnego wyglądu ani animacji, wystarczą elementy `details` i `summary`, które robią to samo bez skryptu (wzorzec „Rozwiń i zwiń na details”).

Przycisk jest prawdziwym elementem `button`, więc Enter i Spacja działają same. Skrypt dokłada tylko [stan](slownik:stan): `aria-expanded` mówi czytnikowi, czy panel jest otwarty.

## Typowe błędy

- Stan pokazany tylko strzałką albo plusem. Czytnik mówi „przycisk” i nie wie, czy coś jest otwarte.
- `aria-expanded` ustawione raz w HTML i nigdy nie zmieniane przez skrypt.
- Zamknięty panel schowany przez `opacity: 0` albo wysokość 0. Klawiatura dalej wchodzi do jego łączy, choć ich nie widać.
- Nagłówek albo `div` z obsługą kliknięcia zamiast przycisku.

## Jak sprawdzić

- Przejdź do przycisku klawiszem Tab i otwórz panel Enterem, potem Spacją. Oba klawisze muszą działać.
- W czytniku ekranu posłuchaj, czy po naciśnięciu słychać „rozwinięte” albo „zwinięte”.
- Zamknij panel i przejdź Tabem dalej. Fokus nie może trafić do niczego w zamkniętym panelu.
