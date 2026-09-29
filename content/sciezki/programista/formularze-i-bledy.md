---
title: Formularze i błędy
summary: Etykiety, instrukcje i komunikat o błędzie, który mówi, co poprawić.
criteria: ["1.3.5", "3.3.1", "3.3.2", "3.3.3", "3.3.7"]
examples: [formularz-z-bledami]
keep:
  - Każde pole ma widoczną etykietę powiązaną w kodzie.
  - Błąd opisany tekstem, przy polu, z podpowiedzią, jak go poprawić.
  - Nie każ wpisywać drugi raz tego, co ktoś już podał.
status: szkic
---
Formularz to miejsce, w którym dostępność najczęściej decyduje o tym, czy ktoś w ogóle załatwi sprawę.

## Etykiety i instrukcje

Każde pole potrzebuje [etykiety](slownik:etykieta) powiązanej przez `label for` albo przez owinięcie pola. Placeholder nie jest etykietą: znika przy pisaniu i zwykle ma za słaby kontrast. Format, którego oczekujesz, podaj w [instrukcji](slownik:instrukcja) przed polem i powiąż ją przez `aria-describedby` (3.3.2).

Pola z danymi o użytkowniku oznacz atrybutem `autocomplete`, na przykład `email` albo `postal-code` (1.3.5). Przeglądarka wypełni je sama, a to duża pomoc dla osób z niepełnosprawnością ruchową i poznawczą.

## Błędy

Komunikat o błędzie mówi, które pole jest złe i dlaczego (3.3.1), a jeśli wiesz jak, to podpowiada poprawkę (3.3.3). Czerwona ramka to za mało. Tekst błędu powiąż z polem przez `aria-describedby`, ustaw na polu `aria-invalid="true"`, a po wysłaniu przenieś fokus do pierwszego błędnego pola albo do listy błędów.

## Bez powtarzania

Kryterium 3.3.7 mówi, żeby nie kazać wpisywać drugi raz danych podanych wcześniej w tym samym procesie. Adres dostawy może się wypełnić adresem do faktury, a numer zamówienia może przejść na kolejny krok sam.
