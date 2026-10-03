---
title: Okno alertu
en: Dialog (Alert Dialog)
batch: pokazywanie
native: html-i-aria
summary: Okno, które przerywa, żeby zapytać o coś nieodwracalnego. Rola alertdialog każe czytnikowi przeczytać pytanie i jego skutek od razu.
criteria: ["2.4.3", "3.3.4", "4.1.2"]
preview: <span class="p-dialog-still"><b>Usunąć adres?</b> Anuluj · Usuń</span>
steps:
  - do: Przejdź do przycisku.
    keys: [Tab]
    hear: Usuń adres, przycisk
  - do: Otwórz okno. Czytnik przeczyta pytanie razem z opisem skutku.
    keys: [Enter]
    hear: Usunąć adres?, okno alertu, Adresu nie da się przywrócić, trzeba go wpisać od nowa.
  - do: Przejdź z bezpiecznej odpowiedzi do tej nieodwracalnej.
    keys: [Tab]
    hear: Usuń, przycisk
  - do: Usuń adres. Okno się zamyka, a komunikat potwierdza skutek.
    keys: [Enter]
    hear: Usunięto adres dostawy.
aria:
  - attr: role
    on: okno
    selector: dialog
    meaning: Okno alertu. Czytnik czyta od razu jego nazwę i opis, a nie tylko pierwszą kontrolkę.
  - attr: aria-describedby
    on: okno
    selector: dialog
    meaning: Akapit ze skutkiem. To on trafia do czytnika razem z pytaniem.
  - attr: open
    on: okno
    selector: dialog
    meaning: Czy okno jest otwarte.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
  deque: https://dequeuniversity.com/library/aria/simple-alert-dialog
status: szkic
---
## Kiedy używać

Tylko przed działaniem, którego nie da się cofnąć albo które dużo kosztuje: usunięcie, wysłanie płatności, wyjście bez zapisu. Każde inne potwierdzenie uczy ludzi klikać „Tak” bez czytania.

To ten sam element `dialog` i `showModal()` co w zwykłym oknie dialogowym. Różnica to `role="alertdialog"` i `aria-describedby` na akapicie ze skutkiem: czytnik przeczyta pytanie i skutek, zanim osoba dotrze do przycisków. Fokus trafia na „Anuluj” (atrybut `autofocus`), żeby przypadkowy Enter niczego nie usunął.

Po zamknięciu komunikat w `role="status"` mówi, co się stało, bo fokus wraca na przycisk, który już niczego nie usuwa.

## Typowe błędy

- Pytanie „Czy na pewno?” bez słowa o tym, co się stanie.
- Fokus na przycisku „Usuń” po otwarciu okna.
- Przyciski „Tak” i „Nie” zamiast nazw działań. Czytane osobno nic nie znaczą.
- `role="alertdialog"` na oknie, które o nic nie pyta.

## Jak sprawdzić

- Otwórz okno z klawiatury i posłuchaj, czy czytnik przeczyta pytanie i skutek, zanim dojdziesz do przycisków.
- Sprawdź, na którym przycisku jest fokus po otwarciu.
- Po potwierdzeniu posłuchaj komunikatu o skutku.
