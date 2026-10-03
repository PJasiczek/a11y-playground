---
title: Regiony na żywo
en: Live Region Playground
batch: zmiany
native: html-i-aria
summary: Plac zabaw do aria-live. Zmień grzeczność, aria-atomic i sposób wstawienia regionu, wyślij komunikat i zobacz w dzienniku, co czytnik by usłyszał.
criteria: ["4.1.3"]
preview: '<span class="p-dialog-still"><b>aria-live="polite"</b> Koszyk: 2 produkty</span>'
steps:
  - do: Wejdź do ustawień. Region jest grzeczny.
    keys: [Tab]
    hear: grzecznie (polite), przycisk opcji, zaznaczone, 1 z 3
  - do: Przejdź do pola aria-atomic.
    keys: [Tab]
    hear: Czytaj cały region (aria-atomic), pole wyboru, zaznaczone
  - do: Przejdź dalej.
    keys: [Tab]
    hear: Wstaw region razem z tekstem, pole wyboru, niezaznaczone
  - do: Przejdź do przycisku.
    keys: [Tab]
    hear: Wyślij komunikat, przycisk
  - do: Wyślij komunikat. Region jest atomowy, więc czytnik czyta go w całości.
    keys: [Enter]
    hear: "Koszyk: 1 produkt"
  - do: Wróć w stronę pola aria-atomic.
    keys: [Shift+Tab]
    hear: Wstaw region razem z tekstem, pole wyboru, niezaznaczone
  - do: Jeszcze o jedno pole.
    keys: [Shift+Tab]
    hear: Czytaj cały region (aria-atomic), pole wyboru, zaznaczone
  - do: Wyłącz aria-atomic.
    keys: [Spacja]
    hear: niezaznaczone
  - do: Przejdź dalej.
    keys: [Tab]
    hear: Wstaw region razem z tekstem, pole wyboru, niezaznaczone
  - do: Przejdź do przycisku.
    keys: [Tab]
    hear: Wyślij komunikat, przycisk
  - do: Wyślij komunikat. Teraz czytnik czyta tylko to, co się zmieniło.
    keys: [Enter]
    hear: 2 produkty
aria:
  - attr: aria-live
    on: region
    selector: "#region"
    meaning: Grzeczność regionu. polite czeka, aż czytnik skończy zdanie, assertive przerywa, off milczy.
  - attr: aria-atomic
    on: region
    selector: "#region"
    meaning: Czy czytać cały region, czy tylko zmienioną część.
sources:
  deque: https://dequeuniversity.com/library/aria/liveregion-playground
status: szkic
---
## Kiedy używać

Region na żywo jest potrzebny, gdy coś zmienia się na stronie, a fokus zostaje w miejscu: licznik koszyka, wynik zapisu, liczba wyników wyszukiwania. Kryterium 4.1.3 wymaga, żeby taki [komunikat o stanie](slownik:komunikat-o-stanie) dotarł do czytnika bez przenoszenia fokusu. Na tym placu zabaw sprawdzisz, od czego zależy, co czytnik usłyszy.

- `aria-live="polite"` (albo `role="status"`) czeka, aż czytnik skończy mówić. To domyślny wybór.
- `aria-live="assertive"` (albo `role="alert"`) przerywa. Zostaw go dla błędów.
- `aria-atomic="true"` każe czytać cały region, a nie tylko zmieniony tekst. „Koszyk: 2 produkty” zamiast „2 produkty”.
- Region musi być na stronie, zanim zmieni się jego treść. Zaznacz „Wstaw region razem z tekstem” i wyślij komunikat: dziennik milczy, tak jak większość czytników.

Ustawienia są w ramce razem z regionem, więc dziennik obok pokazuje też, co czytnik mówi przy przechodzeniu po nich.

## Typowe błędy

- Region dodawany do strony razem z komunikatem.
- `aria-live="assertive"` na każdym komunikacie.
- Region ukryty przez `display: none`, który pojawia się razem z tekstem.
- Każda drobna zmiana, na przykład każda wpisana litera, ogłaszana od nowa.

## Jak sprawdzić

- Wywołaj zmianę z klawiatury i posłuchaj w czytniku, czy komunikat dociera, a fokus zostaje w miejscu.
- Sprawdź w kodzie, czy region jest w HTML strony od początku.
- Porównaj NVDA i VoiceOver. Regiony na żywo różnią się między czytnikami bardziej niż cokolwiek innego.
