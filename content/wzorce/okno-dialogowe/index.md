---
title: Okno dialogowe
en: Dialog
batch: pokazywanie
native: html
summary: Element dialog otwierany metodą showModal. Przeglądarka przenosi fokus do okna, blokuje stronę pod nim i zamyka je klawiszem Esc.
criteria: ["2.4.3", "2.1.2", "4.1.2"]
examples: [okno-modalne-i-fokus]
preview: <span class="p-dialog-still"><b>Adres dostawy</b> Ulica ▭</span>
steps:
  - do: Przejdź do przycisku.
    keys: [Tab]
    hear: Zmień adres, przycisk
  - do: Otwórz okno. Czytnik zapowie okno, a fokus trafi do pierwszego pola.
    keys: [Enter]
    hear: Ulica, pole edycji
  - do: Przejdź do następnej kontrolki w oknie.
    keys: [Tab]
    hear: Zapisz, przycisk
  - do: Zamknij okno. Fokus wraca do przycisku, który je otworzył.
    keys: [Esc]
    hear: Zmień adres, przycisk
aria:
  - attr: open
    on: okno
    selector: dialog
    meaning: Czy okno jest otwarte. Ustawia go showModal, zdejmuje close albo Esc.
  - attr: aria-labelledby
    on: okno
    selector: dialog
    meaning: Nazwa okna z jego nagłówka. Czytnik mówi ją przy wejściu do okna.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
  deque: https://dequeuniversity.com/library/aria/simple-dialog
status: szkic
---
## Kiedy używać

Gdy zadanie trzeba zrobić, zanim wróci się do strony: zmiana adresu, potwierdzenie, krótki formularz. Jeśli czytelnik ma móc zerknąć na stronę w trakcie, okno modalne mu w tym przeszkodzi.

Element `dialog` otwarty metodą `showModal()` robi sam to, co dawniej wymagało kilkudziesięciu linii skryptu: przenosi [fokus](slownik:fokus) do okna, robi stronę pod spodem niedostępną dla myszy, klawiatury i czytnika, zamyka okno klawiszem Esc i oddaje fokus przyciskowi, który je otworzył. Ty dajesz mu tylko nazwę, przez `aria-labelledby` wskazujące nagłówek.

Okno otwarte atrybutem `open` albo metodą `show()` nie jest modalne. Strona pod spodem zostaje dostępna.

## Typowe błędy

- Okno z `div` i `role="dialog"` bez skryptu, który przenosi fokus. Fokus zostaje pod oknem.
- Okno bez nazwy. Czytnik mówi „okno dialogowe” i nic więcej.
- Zamknięcie okna, po którym fokus ląduje na początku strony zamiast na przycisku.
- Okno, którego nie da się zamknąć klawiszem Esc albo przyciskiem.

## Jak sprawdzić

- Otwórz okno z klawiatury. Fokus ma być w oknie, a czytnik ma powiedzieć jego nazwę.
- Spróbuj dojść Tabem albo myszą do strony pod oknem. Nie powinno się dać.
- Zamknij okno klawiszem Esc. Fokus ma wrócić na przycisk.
