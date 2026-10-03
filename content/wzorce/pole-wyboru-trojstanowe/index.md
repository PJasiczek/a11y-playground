---
title: Pole wyboru trójstanowe
en: Checkbox (Tri-State)
batch: html
native: html-i-aria
summary: Pole „wszystkie” nad listą pól. Gdy zaznaczona jest część, jest częściowo zaznaczone, i czytnik to mówi.
criteria: ["4.1.2", "1.3.1"]
preview: <span class="p-check"><b>–</b> Wszystkie dodatki</span>
steps:
  - do: Przejdź do pola „Wszystkie dodatki”. Zaznaczony jest tylko ser, więc pole jest zaznaczone częściowo.
    keys: [Tab]
    hear: Wszystkie dodatki, pole wyboru, częściowo zaznaczone
  - do: Zaznacz wszystkie.
    keys: [Spacja]
    hear: zaznaczone
  - do: Przejdź do pola „Ser”.
    keys: [Tab]
    hear: Ser, pole wyboru, zaznaczone
  - do: Odznacz ser.
    keys: [Spacja]
    hear: niezaznaczone
  - do: Wróć do pola „Wszystkie dodatki”.
    keys: [Shift+Tab]
    hear: Wszystkie dodatki, pole wyboru, częściowo zaznaczone
aria:
  - attr: indeterminate
    on: pole „Wszystkie dodatki”
    selector: "#wszystkie"
    meaning: Stan częściowy. Ustawia go tylko skrypt, w HTML nie ma takiego atrybutu.
  - attr: checked
    on: pole „Wszystkie dodatki”
    selector: "#wszystkie"
    meaning: Czy zaznaczone są wszystkie dodatki.
  - attr: aria-controls
    on: pole „Wszystkie dodatki”
    selector: "#wszystkie"
    meaning: Które pola zmienia.
  - attr: checked
    on: pole „Ser”
    selector: "#ser"
    meaning: Stan jednego dodatku.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
  deque: https://dequeuniversity.com/library/aria/checkbox-tri
status: szkic
---
## Kiedy używać

Gdy jedno pole zaznacza i odznacza całą grupę: wszystkie dodatki, wszystkie wiadomości, wszystkie zgody marketingowe. Trzeci stan, częściowy, mówi, że w grupie coś jest zaznaczone, ale nie wszystko.

Natywny `input` ma właściwość `indeterminate`, którą ustawia skrypt, a przeglądarka przekazuje ją czytnikowi jako stan częściowy. Własne pole z `role="checkbox"` używa do tego `aria-checked="mixed"`. Pola są w `fieldset` z `legend`, więc czytnik zapowiada grupę, zanim przeczyta pierwsze pole.

## Typowe błędy

- Stan częściowy pokazany tylko kreską w polu, bez `indeterminate` ani `aria-checked="mixed"`. Czytnik mówi „niezaznaczone”.
- Pole „wszystkie”, które nie aktualizuje się po zmianie pojedynczych pól.
- Kliknięcie stanu częściowego, które nic nie robi. Ma zaznaczyć wszystko.

## Jak sprawdzić

- Zaznacz jedno pole z grupy i przejdź Tabem do pola „wszystkie”. Czytnik ma powiedzieć „częściowo zaznaczone”.
- Naciśnij Spację na polu „wszystkie”: zaznaczą się wszystkie pola. Jeszcze raz: odznaczą się.
- Zobacz pole w trybie wysokiego kontrastu. Stan częściowy musi się różnić od pustego.
