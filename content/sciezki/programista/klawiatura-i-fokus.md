---
title: Klawiatura i fokus
summary: Każda akcja z klawiatury, widoczny fokus i okno modalne, które trzyma fokus u siebie.
criteria: ["2.1.1", "2.1.2", "2.4.3", "2.4.7", "2.4.11"]
examples: [okno-modalne-i-fokus, kontrast-stanow]
keep:
  - Wszystko, co działa myszą, działa klawiaturą.
  - Fokus zawsze widać. Nie usuwaj obrysu bez zamiennika.
  - Okno modalne przejmuje fokus i oddaje go po zamknięciu.
status: szkic
---
Część ludzi nie używa myszy wcale: bo nie może, bo czytnik ekranu prowadzi ich klawiaturą, bo tak jest szybciej. Dla nich strona to kolejność elementów, po których skacze Tab, i jeden element naraz, który ma [fokus](slownik:fokus).

## Najpierw natywne elementy

Przycisk z elementu `button` dostaje fokus i reaguje na Enter i spację. `div` z `onclick` nie robi żadnej z tych rzeczy. Jeśli coś działa tylko po najechaniu myszą albo po przeciągnięciu, potrzebuje drogi z klawiatury. Tego wymaga kryterium 2.1.1.

## Kolejność i widoczność

[Kolejność fokusu](slownik:kolejnosc-fokusu) wynika z kolejności w HTML. Dodatni `tabindex` ją psuje, więc używaj tylko `0` i `-1`. Fokus musi być widać (2.4.7) i nie może go zasłaniać przyklejony nagłówek ani baner z cookies (2.4.11). Styluj go przez `:focus-visible`, a `outline: none` zostaw w spokoju.

## Okna modalne

Element `dialog` otwierany przez `showModal()` przenosi fokus do okna, blokuje stronę pod spodem i zamyka się klawiszem Esc. Po zamknięciu oddaj fokus przyciskowi, który okno otworzył. Uważaj na [pułapkę na klawiaturę](slownik:pulapka-na-klawiature): z okna musi być wyjście, z osadzonego odtwarzacza też.
