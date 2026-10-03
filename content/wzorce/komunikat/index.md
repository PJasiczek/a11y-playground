---
title: Komunikat
en: Alert
batch: html
native: tylko-aria
summary: Element z role="alert" czeka pusty na stronie. Gdy skrypt wpisze w niego tekst, czytnik przerywa i go odczytuje.
criteria: ["4.1.3"]
preview: <span class="p-alert"><b>!</b> Nie zapisano.</span>
steps:
  - do: Przejdź do przycisku.
    keys: [Tab]
    hear: Zapisz zmiany, przycisk
  - do: Zapisz. Serwer nie odpowiada, więc pojawia się komunikat o błędzie.
    keys: [Enter]
    hear: Nie zapisano. Brak połączenia z serwerem, spróbuj za minutę.
aria:
  - attr: role
    on: miejsce na komunikat
    selector: "#blad"
    meaning: Region alertu. Czytnik odczyta każdą zmianę jego treści od razu, przerywając to, co mówi.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
  deque: https://dequeuniversity.com/library/aria/alert
status: szkic
---
## Kiedy używać

Gdy trzeba powiedzieć coś ważnego i pilnego bez przenoszenia fokusu: zapis się nie udał, sesja zaraz wygaśnie. `role="alert"` przerywa czytnik, więc zostaw go dla błędów. Potwierdzenia w rodzaju „Zapisano” idą do `role="status"`, który poczeka, aż czytnik skończy zdanie. Oba to [komunikaty o stanie](slownik:komunikat-o-stanie).

Region jest na stronie od początku, pusty. Część czytników nie zauważa regionu dodanego razem z tekstem.

## Typowe błędy

- `role="alert"` na wszystkim, także na potwierdzeniach. Czytnik przerywa osobę przy każdym kliknięciu.
- Komunikat, który znika po trzech sekundach. Osoba nie zdąży go przeczytać ani wrócić do niego.
- Region alertu wstawiany do strony razem z treścią zamiast pustego regionu czekającego na tekst.
- Błąd pokazany tylko czerwoną ramką, bez tekstu.

## Jak sprawdzić

- Wywołaj błąd z klawiatury. Fokus ma zostać tam, gdzie był.
- W czytniku posłuchaj, czy komunikat przerywa to, co czytnik akurat mówił.
- Sprawdź, czy komunikat zostaje na ekranie, dopóki osoba czegoś nie zrobi.
