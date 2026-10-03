---
title: Dymek z oknem
en: Tooltip Dialog
batch: pokazywanie
native: html-i-aria
summary: Przycisk otwiera małe okno z wyjaśnieniem. Element z atrybutem popover zamyka się klawiszem Esc i kliknięciem obok, a fokus wraca do przycisku.
criteria: ["1.4.13", "2.4.3", "4.1.2"]
preview: <span class="p-tooltip-still"><b>?</b> Trzy cyfry na odwrocie karty</span>
steps:
  - do: Przejdź do pola kodu.
    keys: [Tab]
    hear: Kod CVC, pole edycji
  - do: Przejdź do przycisku obok.
    keys: [Tab]
    hear: Co to jest CVC?, przycisk, zwinięte
  - do: Otwórz wyjaśnienie. Fokus przechodzi do okna, a czytnik czyta jego treść.
    keys: [Enter]
    hear: CVC, okno dialogowe, Trzy cyfry na odwrocie karty, obok podpisu. Nie podawaj ich nikomu przez telefon.
  - do: Zamknij okno. Fokus wraca do przycisku.
    keys: [Esc]
    hear: Co to jest CVC?, przycisk, zwinięte
aria:
  - attr: role
    on: okno
    selector: "#cvc"
    meaning: Niemodalne okno dialogowe. Strona obok zostaje dostępna.
  - attr: aria-describedby
    on: okno
    selector: "#cvc"
    meaning: Treść okna jako opis, więc czytnik czyta ją, gdy fokus wchodzi do okna.
  - attr: aria-label
    on: okno
    selector: "#cvc"
    meaning: Nazwa okna, którą czytnik mówi przed treścią.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
  deque: https://dequeuniversity.com/library/aria/tooltip-dialog
status: szkic
---
## Kiedy używać

Gdy wyjaśnienie jest dłuższe niż jedno zdanie albo zawiera łącze, czyli wtedy, gdy zwykły dymek nie wystarczy. Pokazuje się po kliknięciu, nie po najechaniu, więc działa też na ekranie dotykowym.

Przycisk z atrybutem `popovertarget` otwiera element z atrybutem `popover`. Przeglądarka zamyka go klawiszem Esc i kliknięciem obok, oddaje fokus przyciskowi i mówi czytnikowi, czy okno jest otwarte. Skrypt dokłada jedno: po otwarciu przenosi fokus do okna, żeby czytnik przeczytał treść. Okno ma `role="dialog"`, nazwę i treść w `aria-describedby`.

Okno nie jest modalne. Jeśli osoba musi coś zdecydować, zanim pójdzie dalej, użyj zwykłego okna dialogowego.

## Typowe błędy

- Wyjaśnienie, które otwiera się po najechaniu i ma w środku łącze. Kursor nie zdąży do niego dojść, a klawiatura nie ma jak.
- Okno otwarte bez przeniesienia fokusu. Czytnik nie wie, że coś się pojawiło.
- Zamknięcie okna, po którym fokus ląduje na początku strony.
- Ikona „?” bez nazwy.

## Jak sprawdzić

- Otwórz okno z klawiatury. Fokus ma być w oknie, a czytnik ma przeczytać treść.
- Zamknij okno klawiszem Esc. Fokus ma wrócić na przycisk.
- Otwórz okno i kliknij obok. Okno ma się zamknąć.
