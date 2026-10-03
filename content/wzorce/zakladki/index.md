---
title: Zakładki
en: Tabpanel
batch: zlozone
native: tylko-aria
summary: Lista kart nad panelami. Tab wchodzi do listy raz, strzałki zmieniają kartę, a kolejny Tab przechodzi do jej panelu.
criteria: ["1.3.1", "2.1.1", "4.1.2"]
preview: <span class="p-tabs"><b>Opis</b><span>Wymiary</span><span>Opinie</span></span>
steps:
  - do: Wejdź do listy kart. Fokus trafia na wybraną kartę.
    keys: [Tab]
    hear: Opis, karta, wybrane, 1 z 3
  - do: Przejdź do następnej karty. Panel zmienia się razem z nią.
    keys: ["→"]
    hear: Wymiary, karta, wybrane, 2 z 3
  - do: Skocz do ostatniej karty.
    keys: [End]
    hear: Opinie, karta, wybrane, 3 z 3
  - do: Strzałka z ostatniej karty wraca na pierwszą.
    keys: ["→"]
    hear: Opis, karta, wybrane, 1 z 3
  - do: Przejdź do panelu wybranej karty.
    keys: [Tab]
    hear: Opis, panel karty
aria:
  - attr: aria-selected
    on: karta „Opis”
    selector: "#karta-opis"
    meaning: Która karta jest wybrana. Zmienia się razem z fokusem.
  - attr: aria-selected
    on: karta „Wymiary”
    selector: "#karta-wymiary"
    meaning: Jak wyżej.
  - attr: tabindex
    on: karta „Opis”
    selector: "#karta-opis"
    meaning: 0 na wybranej karcie, -1 na pozostałych. Dzięki temu Tab zatrzymuje się w liście raz.
  - attr: aria-controls
    on: karta „Opis”
    selector: "#karta-opis"
    meaning: Który panel należy do karty.
  - attr: hidden
    on: panel „Wymiary”
    selector: "#panel-wymiary"
    meaning: Panele niewybranych kart są schowane.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
  deque: https://dequeuniversity.com/library/aria/tabpanel
status: szkic
---
## Kiedy używać

Gdy kilka bloków treści dotyczy jednej rzeczy, a czytelnik ogląda je po jednym: opis, wymiary i opinie produktu, ustawienia podzielone na działy. Jeśli ktoś będzie chciał porównać dwa bloki albo przeczytać wszystkie, zwykłe nagłówki na jednej stronie będą lepsze niż zakładki.

HTML nie ma zakładek, więc wszystko robi ARIA i skrypt: `role="tablist"`, `tab` i `tabpanel`, `aria-selected` i wędrujący `tabindex`. Lista kart to jeden przystanek Tab, strzałki zmieniają kartę, Home i End skaczą na początek i koniec. Tu karta zmienia się razem z fokusem, bo panele są gotowe od razu. Jeśli panel ładuje się z serwera, niech strzałka tylko przesuwa fokus, a Enter wybiera kartę.

Panel ma `tabindex="0"`, bo nie ma w nim żadnej kontrolki. Bez tego Tab przeskoczyłby z karty prosto za zakładki.

## Typowe błędy

- Karty jako łącza albo przyciski, każda osobnym przystankiem Tab, bez strzałek.
- `role="tab"` bez `aria-selected`. Czytnik nie mówi, która karta jest wybrana.
- Zakładki użyte jako nawigacja między stronami. Do tego służy `nav` z łączami i `aria-current`.
- Wybrana karta pokazana tylko kolorem.

## Jak sprawdzić

- Wejdź Tabem do listy kart i zmieniaj kartę strzałkami, Home i End. Następny Tab ma trafić do panelu.
- Posłuchaj w czytniku, czy słychać „karta”, „wybrane” i pozycję, na przykład „2 z 3”.
- Zobacz zakładki w trybie wysokiego kontrastu. Wybrana karta ma się wyróżniać czymś więcej niż kolorem.
