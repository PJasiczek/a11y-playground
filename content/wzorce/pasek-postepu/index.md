---
title: Pasek postępu
en: Progress Bar (Bounded)
batch: zmiany
native: html
summary: Element progress z wartością i etykietą. Czytnik zna procent, gdy do niego dojdzie, a koniec ogłasza osobny komunikat o stanie.
criteria: ["4.1.2", "4.1.3"]
preview: <span class="p-progress"><b></b></span>
steps:
  - do: Przejdź do przycisku.
    keys: [Tab]
    hear: Wyślij raport.pdf, przycisk
  - do: Wyślij plik. Pasek rośnie, a gdy dojdzie do końca, komunikat o stanie powie, że gotowe.
    keys: [Enter]
    hear: Wysłano raport.pdf.
aria:
  - attr: value
    on: pasek
    selector: "#postep"
    meaning: Ile już zrobiono. Przeglądarka przekazuje czytnikowi procent.
  - attr: max
    on: pasek
    selector: "#postep"
    meaning: Ile jest do zrobienia w sumie.
  - attr: role
    on: komunikat pod paskiem
    selector: "#stan"
    meaning: Region stanu. Ogłasza koniec, bez przenoszenia fokusu.
sources:
  deque: https://dequeuniversity.com/library/aria/progress-bar-bounded
status: szkic
---
## Kiedy używać

Gdy wiadomo, ile pracy zostało: wysyłanie pliku, kroki importu. Element `progress` z `value` i `max` ma rolę paska postępu i wartość, którą czytnik umie przeczytać, a `label` daje mu [nazwę](slownik:nazwa). `role="progressbar"` z `aria-valuenow` jest potrzebne tylko wtedy, gdy nie da się użyć `progress`.

Pasek nie jest regionem na żywo, więc czytnik nie ogłasza każdego procentu. To dobrze: co 10 procent komunikat zagłuszałby wszystko inne. Koniec ogłasza osobny `role="status"`, bo to jedyna zmiana, na którą osoba czeka.

## Typowe błędy

- Pasek z `div` o zmieniającej się szerokości, bez roli i wartości.
- Każdy procent ogłaszany w regionie na żywo.
- Brak komunikatu na końcu. Osoba z czytnikiem nie wie, że może iść dalej.
- Pasek bez etykiety, gdy na stronie jest ich kilka.

## Jak sprawdzić

- Uruchom wysyłanie z klawiatury i posłuchaj, czy czytnik powie, że skończone.
- Dojdź czytnikiem do paska w trakcie i sprawdź, czy mówi procent i nazwę.
- Sprawdź, czy pasek nie przenosi fokusu.
