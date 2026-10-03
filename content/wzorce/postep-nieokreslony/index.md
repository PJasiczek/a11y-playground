---
title: Postęp bez końca
en: Progress Bar (Unbounded)
batch: zmiany
native: html-i-aria
summary: Element progress bez wartości, gdy nie wiadomo, ile to potrwa. Lista z wynikami ma aria-busy, a komunikat o stanie mówi, kiedy jest gotowa.
criteria: ["4.1.3", "2.2.2"]
preview: <span class="p-progress p-unbounded"><b></b></span>
steps:
  - do: Przejdź do przycisku.
    keys: [Tab]
    hear: Szukaj kurtek, przycisk
  - do: Szukaj. Najpierw usłyszysz, że wyszukiwanie trwa, potem wynik.
    keys: [Enter]
    hear: Znaleziono 3 kurtki.
aria:
  - attr: aria-busy
    on: lista wyników
    selector: "#wyniki"
    meaning: Lista się zapełnia. Czytnik czeka z czytaniem zmian, aż wróci false.
  - attr: hidden
    on: pasek
    selector: "#ladowanie"
    meaning: Pasek jest widoczny tylko w trakcie.
  - attr: role
    on: komunikat
    selector: "#stan"
    meaning: Region stanu. Mówi „Szukam kurtek.” i „Znaleziono 3 kurtki.”, bez przenoszenia fokusu.
sources:
  deque: https://dequeuniversity.com/library/aria/progress-bar-unbounded
status: szkic
---
## Kiedy używać

Gdy coś trwa, a nie wiadomo jak długo: wyszukiwanie, ładowanie listy, łączenie z serwerem. Element `progress` bez atrybutu `value` jest paskiem bez końca, a czytnik mówi „pasek postępu” bez procentu.

Sam pasek nic nie ogłasza. Osoba z czytnikiem dowiaduje się z komunikatu o stanie: najpierw „Szukam kurtek.”, potem „Znaleziono 3 kurtki.”. Lista wyników ma w trakcie `aria-busy="true"`, żeby czytnik nie czytał jej po jednym elemencie, gdy się zapełnia.

Przeglądarka animuje pasek bez wartości. Tutaj jest narysowany statycznie, w paski, więc na stronie nic się nie rusza (2.2.2, 2.3.3), a słowo w komunikacie i tak mówi, co się dzieje.

## Typowe błędy

- Kręcące się kółko bez tekstu i bez roli.
- Brak komunikatu na końcu. Osoba nie wie, że wyniki już są.
- Animacja, której nie da się zatrzymać, przy długim ładowaniu.
- Region na żywo na liście wyników bez `aria-busy`, który czyta każdy wynik osobno.

## Jak sprawdzić

- Uruchom wyszukiwanie z klawiatury i posłuchaj obu komunikatów.
- Włącz w systemie ograniczony ruch i sprawdź, czy nic nie miga ani się nie kręci.
- Sprawdź, czy fokus zostaje na przycisku.
