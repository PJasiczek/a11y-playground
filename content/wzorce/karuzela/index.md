---
title: Karuzela
en: Carousel (based on a tabpanel)
batch: zlozone
native: tylko-aria
summary: Slajdy wybierane kartami, jak w zakładkach. Nie przewijają się same, dopóki ktoś nie naciśnie „Uruchom przewijanie”.
criteria: ["2.2.2", "2.1.1", "4.1.2"]
examples: [karuzela-automatyczna]
preview: <span class="p-dialog-still"><b>Kurtki zimowe −30%</b> ● ○ ○</span>
steps:
  - do: Wejdź do karuzeli. Czytnik zapowie ją i przycisk przewijania.
    keys: [Tab]
    hear: Uruchom przewijanie, przycisk
  - do: Przejdź do kart slajdów.
    keys: [Tab]
    hear: Slajd 1, karta, wybrane, 1 z 3
  - do: Wybierz następny slajd.
    keys: ["→"]
    hear: Slajd 2, karta, wybrane, 2 z 3
  - do: Przejdź do łącza na slajdzie.
    keys: [Tab]
    hear: Zobacz kurtki, łącze
aria:
  - attr: aria-roledescription
    on: karuzela
    selector: section
    meaning: Słowo, którym czytnik nazywa tę sekcję zamiast „region”.
  - attr: aria-roledescription
    on: slajd 2
    selector: "#slajd-2"
    meaning: Słowo, którym czytnik nazywa panel karty.
  - attr: aria-selected
    on: karta „Slajd 1”
    selector: "#karta-1"
    meaning: Który slajd jest pokazany.
  - attr: aria-selected
    on: karta „Slajd 2”
    selector: "#karta-2"
    meaning: Jak wyżej.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
  deque: https://dequeuniversity.com/library/aria/carousel
status: szkic
---
## Kiedy używać

Rzadziej, niż się wydaje. Większość ludzi widzi pierwszy slajd i nic więcej, więc to, co ważne, i tak powinno być na stronie bez karuzeli. Jeśli karuzela zostaje, niech będzie zakładkami ze slajdami: lista kart mówi, ile jest slajdów i który jest pokazany, a strzałki je zmieniają.

`aria-roledescription` zmienia słowa, którymi czytnik nazywa sekcję i panele: „Promocje, karuzela” zamiast „Promocje, region”. Używaj go oszczędnie, bo zastępuje nazwę roli, którą osoba zna.

Kryterium 2.2.2 wymaga, żeby treść, która rusza się sama dłużej niż 5 sekund, dało się zatrzymać. Ta karuzela idzie dalej: przewija się dopiero po naciśnięciu „Uruchom przewijanie” i staje, gdy fokus albo kursor wejdzie do slajdów.

## Typowe błędy

- Automatyczne przewijanie od wejścia na stronę, bez przycisku pauzy.
- Kropki pod slajdami bez nazw i bez stanu. Czytnik mówi „przycisk, przycisk, przycisk”.
- Przewijanie, które przesuwa fokus albo zmienia slajd, gdy osoba czyta go czytnikiem.
- Region na żywo, który ogłasza każdy slajd podczas automatycznego przewijania.

## Jak sprawdzić

- Wejdź na stronę i odczekaj 10 sekund. Nic nie powinno się zmienić samo.
- Zmień slajd strzałkami na kartach i posłuchaj, czy czytnik mówi, który to slajd z ilu.
- Uruchom przewijanie i wejdź Tabem do slajdu. Przewijanie ma stanąć.
