---
title: Suwak
en: Slider
batch: zlozone
native: html-i-aria
summary: Element input typu range. Strzałki, Home i End działają same, a aria-valuetext mówi czytnikowi wartość z jednostką.
criteria: ["2.5.7", "4.1.2"]
examples: [przeciaganie-z-alternatywa]
preview: <span class="p-slider"><b></b></span>
steps:
  - do: Przejdź do suwaka.
    keys: [Tab]
    hear: Cena maksymalna, suwak, 300 zł
  - do: Zwiększ cenę o jeden krok.
    keys: ["→"]
    hear: 350 zł
  - do: Skocz do największej wartości.
    keys: [End]
    hear: 1000 zł
  - do: Skocz do najmniejszej.
    keys: [Home]
    hear: 0 zł
aria:
  - attr: value
    on: suwak
    selector: "#cena"
    meaning: Bieżąca wartość. Ustawia ją przeglądarka po każdym klawiszu albo kliknięciu.
  - attr: aria-valuetext
    on: suwak
    selector: "#cena"
    meaning: Wartość tak, jak ma ją usłyszeć człowiek. Bez tego czytnik powie samą liczbę.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
  deque: https://dequeuniversity.com/library/aria/slider
status: szkic
---
## Kiedy używać

Gdy dokładna wartość mniej się liczy niż szybkie ustawienie w zakresie: cena maksymalna, głośność, jasność. Jeśli ktoś musi wpisać dokładną liczbę, daj mu pole liczbowe zamiast suwaka albo obok niego.

Element `input type="range"` robi prawie wszystko: [rolę](slownik:rola) „suwak”, strzałki, Home, End, PageUp i PageDown, kliknięcie w tor. Kliknięcie w tor to alternatywa dla przeciągania, której wymaga kryterium 2.5.7. Skrypt dokłada tylko `aria-valuetext`, bo „300” bez jednostki niewiele mówi.

Wartość jest też widoczna obok suwaka jako zwykły tekst. Nie jako element `output`: ten jest regionem na żywo, więc czytnik mówiłby każdą wartość dwa razy.

## Typowe błędy

- Własny suwak z `div`, który działa tylko przeciągnięciem myszą.
- Brak etykiety. Czytnik mówi „suwak, 300” i nie wiadomo, czego.
- Wartość pokazana tylko w dymku nad uchwytem, który znika po puszczeniu myszy.
- Uchwyt mniejszy niż 24 na 24 piksele.

## Jak sprawdzić

- Przejdź do suwaka klawiszem Tab i zmieniaj wartość strzałkami, Home i End.
- Kliknij w tor obok uchwytu. Wartość ma się zmienić bez przeciągania.
- Posłuchaj w czytniku, czy wartość ma jednostkę.
