---
title: Co wyłapie automat, a czego nie
summary: Axe i Lighthouse znajdą brakujący alt i słaby kontrast. Nie powiedzą, czy alt ma sens.
examples: [obraz-dekoracyjny-i-informacyjny, kontrast-stanow, cel-24-na-24]
keep:
  - Automat to pierwszy krok, nie cały test.
  - Zero błędów w axe nie znaczy, że strona jest dostępna.
  - To, co automat zgłasza, zwykle jest prawdziwym błędem. Nie ignoruj go.
status: szkic
---
Narzędzia takie jak axe, Lighthouse czy WAVE sprawdzają kod strony według reguł. Są szybkie i powtarzalne, więc warto je uruchamiać przy każdej zmianie, także w ciągłej integracji. Znajdują jednak tylko to, co da się rozstrzygnąć bez zrozumienia treści.

## Co znajdą

- Obrazek bez atrybutu `alt`.
- Kontrast tekstu poniżej progu, jeśli tło jest jednolite.
- Pole formularza bez etykiety.
- Przycisk bez nazwy.
- Zbyt mały cel dotykowy.
- Brak języka strony, zdublowane identyfikatory, błędne użycie ARIA.

## Czego nie znajdą

- Czy opis obrazka mówi to, co trzeba.
- Czy kolejność fokusu ma sens i czy wszystko działa z klawiatury.
- Czy okno modalne zatrzymuje fokus.
- Czy komunikat o stanie zostanie ogłoszony.
- Czy nagłówki opisują treść i czy napisy do wideo są poprawne.

Dlatego po automacie przychodzi test klawiaturą i czytnikiem, opisany w kolejnych lekcjach. Przykłady w materiałach pokazują błędy, które axe wykrywa. Zobacz, które reguły zgłasza w wersji zepsutej.
