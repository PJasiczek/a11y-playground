---
title: Rozwiń i zwiń na details
en: Expand/Collapse (based on Details/Summary)
batch: html
native: html
summary: Elementy details i summary. Przeglądarka sama obsługuje klawiaturę i mówi czytnikowi, czy treść jest otwarta.
criteria: ["4.1.2"]
preview: <span class="p-disclosure"><b>▸</b> Koszt dostawy</span>
steps:
  - do: Przejdź do podsumowania.
    keys: [Tab]
    hear: Koszt dostawy, przycisk, zwinięte
  - do: Otwórz treść.
    keys: [Enter]
    hear: rozwinięte
  - do: Zamknij ją.
    keys: [Spacja]
    hear: zwinięte
aria:
  - attr: open
    on: details
    selector: details
    meaning: Czy treść jest otwarta. Przeglądarka przekazuje to czytnikowi jako rozwinięte albo zwinięte.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
  deque: https://dequeuniversity.com/library/aria/expand-collapse-summary
status: szkic
---
## Kiedy używać

Zawsze, gdy chcesz schować blok treści pod jednym przyciskiem, a wygląd przeglądarki ci wystarcza albo dasz radę go ostylować. Nie potrzebujesz ani jednego atrybutu ARIA ani linijki skryptu: `summary` dostaje fokus, Enter i Spacja otwierają, a czytnik słyszy [stan](slownik:stan).

Kilka elementów `details` z tym samym atrybutem `name` działa jak akordeon, w którym otwarta może być tylko jedna sekcja.

## Typowe błędy

- `display: none` albo `display: flex` na `summary`. W części przeglądarek `summary` traci wtedy rolę i przestaje mówić, czy jest otwarte.
- Przycisk albo łącze w środku `summary`. Kontrolka w kontrolce: czytnik i klawiatura nie wiedzą, co dostaje kliknięcie.
- Usunięty znacznik trójkąta bez innego znaku stanu na ekranie.

## Jak sprawdzić

- Przejdź do podsumowania klawiszem Tab, otwórz Enterem, zamknij Spacją.
- W czytniku ekranu posłuchaj, czy słychać „rozwinięte” i „zwinięte”.
- Przejrzyj kod: `summary` musi być pierwszym dzieckiem `details` i nie może zawierać innych kontrolek.
