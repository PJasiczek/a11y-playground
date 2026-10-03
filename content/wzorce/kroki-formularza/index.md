---
title: Kroki formularza
en: Stepper
batch: zlozone
native: html-i-aria
summary: Formularz w kilku krokach. Lista kroków mówi, gdzie jesteś, przez aria-current="step", a po przejściu dalej fokus trafia na nagłówek nowego kroku.
criteria: ["3.3.1", "2.4.3", "1.3.1"]
preview: <span class="p-steps"><b>✓</b><b>2</b><span>3</span></span>
steps:
  - do: Wejdź do pierwszego pytania. Czytnik zapowie grupę, a potem pierwszą opcję.
    keys: [Tab]
    hear: Mieszkanie, przycisk opcji, niezaznaczone, 1 z 2
  - do: Przejdź do przycisku „Dalej”, nic nie wybierając.
    keys: [Tab]
    hear: Dalej, przycisk
  - do: Spróbuj przejść dalej. Fokus wraca do pytania, a czytnik czyta błąd jako opis grupy.
    keys: [Enter]
    hear: Co chcesz ubezpieczyć?, grupa, Błąd. Wybierz, co chcesz ubezpieczyć.
  - do: Wybierz opcję.
    keys: [Spacja]
    hear: zaznaczone
  - do: Przejdź do przycisku „Dalej”.
    keys: [Tab]
    hear: Dalej, przycisk
  - do: Przejdź do następnego kroku. Fokus trafia na jego nagłówek.
    keys: [Enter]
    hear: Krok 2 z 3. Zakres, nagłówek, poziom 2
aria:
  - attr: aria-current
    on: krok „Przedmiot”
    selector: "#krok-1-na-liscie"
    meaning: Bieżący krok na liście. Przechodzi na następny, gdy formularz idzie dalej.
  - attr: aria-current
    on: krok „Zakres”
    selector: "#krok-2-na-liscie"
    meaning: Jak wyżej.
  - attr: aria-describedby
    on: pytanie „Co chcesz ubezpieczyć?”
    selector: fieldset
    meaning: Wskazuje akapit z błędem. Pusty akapit nic nie dodaje, wypełniony czytnik czyta przy wejściu do grupy.
  - attr: tabindex
    on: nagłówek kroku 2
    selector: "#naglowek-2"
    meaning: Wartość -1 pozwala przenieść na nagłówek fokus, ale nie dodaje go do kolejności Tab.
sources:
  deque: https://dequeuniversity.com/library/aria/stepper
status: szkic
---
## Kiedy używać

Gdy długi formularz dzieli się na części, które mają sens osobno: dane, zakres, podsumowanie. Kroki zmniejszają liczbę pól na ekranie, ale dodają kliknięcia, więc krótki formularz zostaw na jednej stronie.

Lista kroków to zwykła lista numerowana `ol`. Bieżący krok ma `aria-current="step"`, a skończone kroki mają ukryte słowo „zrobione”, więc stan nie zależy od koloru kółka. Kroki nie są przyciskami. Jeśli chcesz pozwolić na skok do wcześniejszego kroku, zrób z nich łącza albo przyciski.

Po „Dalej” fokus trafia na nagłówek nowego kroku (z `tabindex="-1"`), więc czytnik mówi, gdzie osoba jest. Gdy krok ma błąd, fokus wraca do pola z błędem, a komunikat jest jego opisem przez `aria-describedby`. To wymaganie kryterium 3.3.1: błąd jest opisany tekstem i wiadomo, którego pola dotyczy.

## Typowe błędy

- Kroki pokazane tylko kolorem kółek.
- Fokus zostaje na przycisku „Dalej”, który teraz jest w innym miejscu. Czytnik milczy, a osoba nie wie, że krok się zmienił.
- Błąd pokazany nad formularzem bez wskazania pola.
- Dane z poprzedniego kroku znikają po powrocie przyciskiem „Wstecz”.

## Jak sprawdzić

- Przejdź cały formularz klawiaturą. Po każdym „Dalej” fokus ma być na nagłówku nowego kroku.
- Spróbuj przejść dalej bez odpowiedzi. Posłuchaj, czy czytnik czyta błąd przy pytaniu.
- Wróć przyciskiem „Wstecz” i sprawdź, czy odpowiedzi zostały.
