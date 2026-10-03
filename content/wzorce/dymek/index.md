---
title: Dymek
en: Tooltip
batch: pokazywanie
native: tylko-aria
summary: Krótki opis kontrolki, widoczny po najechaniu i po fokusie. Czytnik czyta go jako opis przez aria-describedby.
criteria: ["1.4.13", "4.1.2"]
preview: <span class="p-tooltip-still"><b>⧉</b> Kopiuje adres strony</span>
steps:
  - do: Przejdź do przycisku. Dymek pojawia się też przy fokusie, a czytnik czyta go po nazwie.
    keys: [Tab]
    hear: Kopiuj link, przycisk, Kopiuje adres tej strony do schowka
  - do: Naciśnij przycisk.
    keys: [Enter]
    hear: Skopiowano link.
aria:
  - attr: aria-label
    on: przycisk
    selector: "#kopiuj"
    meaning: Nazwa przycisku z samą ikoną.
  - attr: aria-describedby
    on: przycisk
    selector: "#kopiuj"
    meaning: Dymek jako opis. Czytnik czyta go po nazwie i roli, także gdy dymek jest schowany.
  - attr: role
    on: dymek
    selector: "#kopiuj-opis"
    meaning: Dymek. Nie dostaje fokusu i nie zawiera kontrolek.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
  deque: https://dequeuniversity.com/library/aria/tooltip
status: szkic
---
## Kiedy używać

Do krótkiej podpowiedzi, bez której da się żyć: co robi przycisk z samą ikoną, skrót klawiszowy. Dymek widać tylko po najechaniu albo fokusie, więc na ekranie dotykowym zwykle go nie ma. Nic, czego ktoś potrzebuje do wykonania zadania, nie może być tylko w dymku.

Dymek to opis, nie nazwa. Przycisk ma własną [nazwę](slownik:nazwa) (`aria-label`), a dymek dochodzi przez `aria-describedby`. Kryterium 1.4.13 stawia trzy warunki: dymek da się zamknąć klawiszem Esc bez ruszania fokusu, kursor może na niego najechać, a dymek nie znika sam, dopóki osoba nad nim jest. Ten dymek otwiera się obok przycisku, więc nie zasłania kontrolki, na której jest fokus.

Jeśli w podpowiedzi ma być łącze albo przycisk, to już nie dymek, tylko dymek z oknem.

## Typowe błędy

- Dymek tylko po najechaniu myszą. Osoba z klawiaturą go nie zobaczy.
- Atrybut `title` jako jedyna podpowiedź. Klawiatura i ekran dotykowy go nie pokażą.
- Dymek, który znika, gdy kursor przesuwa się z przycisku na dymek.
- Ważna informacja albo łącze schowane w dymku.

## Jak sprawdzić

- Przejdź do przycisku klawiszem Tab. Dymek ma się pojawić.
- Naciśnij Esc. Dymek ma zniknąć, a fokus zostać na przycisku.
- Najedź myszą na przycisk, potem na dymek. Dymek ma zostać.
- Posłuchaj w czytniku, czy po nazwie przycisku słychać treść dymka.
