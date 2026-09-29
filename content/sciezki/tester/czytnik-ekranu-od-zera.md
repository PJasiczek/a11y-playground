---
title: Czytnik ekranu od zera
summary: NVDA z Firefoksem i VoiceOver z Safari. Pięć poleceń, które wystarczą do testu.
criteria: ["1.3.1", "4.1.2"]
examples: [ikona-jako-przycisk, wlasna-lista-zamiast-select]
keep:
  - Testuj na parze czytnik i przeglądarka, której ludzie używają.
  - Sprawdzaj, co czytnik mówi, a nie co widać.
  - Nazwa, rola, stan. Przy każdym elemencie.
status: szkic
---
[Czytnik ekranu](slownik:czytnik-ekranu) zamienia stronę w mowę albo brajla. Test czytnikiem pokazuje, czy w kodzie są informacje, które widać na ekranie. Na Windows najczęściej używa się bezpłatnego NVDA z Firefoksem albo Chrome, na komputerach Apple wbudowanego VoiceOvera z Safari.

## Pięć poleceń na start

- Czytaj dalej: strzałka w dół (NVDA) albo VO+strzałka w prawo (VoiceOver).
- Następny nagłówek: H w NVDA, w VoiceOverze przez pokrętło.
- Lista elementów: NVDA+F7 albo VO+U. Pokazuje nagłówki, linki i obszary.
- Tab: przechodzi po elementach interaktywnych, tak jak bez czytnika.
- Zatrzymanie mowy: Ctrl.

## Czego słuchać

Przy każdym elemencie interaktywnym czytnik powinien powiedzieć [nazwę](slownik:nazwa), [rolę](slownik:rola) i [stan](slownik:stan), na przykład „Newsletter, pole wyboru, niezaznaczone” (4.1.2). Przy treści sprawdź, czy nagłówki są nagłówkami, listy listami, a tabele mają nagłówki kolumn (1.3.1). Otwórz listę nagłówków: czy da się z niej zrozumieć stronę?

Nie zastępuj testu czytnikiem samą inspekcją drzewa dostępności. Drzewo pokazuje dane, czytnik pokazuje, jak z nich korzysta człowiek.
