---
title: Semantyka najpierw
summary: Natywny element daje rolę, stan i obsługę klawiatury za darmo. Div nie daje nic.
criteria: ["1.3.1", "4.1.2"]
examples: [wlasna-lista-zamiast-select]
keep:
  - Najpierw sprawdź, czy istnieje element HTML, który robi to, czego potrzebujesz.
  - Rola, nazwa i stan muszą być dostępne dla czytnika, nie tylko widoczne na ekranie.
  - ARIA niczego nie naprawia sama. Zmienia tylko to, co czytnik usłyszy.
status: szkic
---
[Czytnik ekranu](slownik:czytnik-ekranu) nie widzi pikseli. Czyta [drzewo dostępności](slownik:drzewo-dostepnosci), które przeglądarka buduje z HTML. Dla każdego elementu zapisuje w nim [rolę](slownik:rola) („przycisk”, „pole wyboru”, „nagłówek”), [nazwę](slownik:nazwa) i [stan](slownik:stan), na przykład „zaznaczone” albo „rozwinięte”.

Element `button` ma to wszystko od razu. Dostaje fokus, reaguje na Enter i spację, a czytnik mówi „Zapisz, przycisk”. `div` z obsługą kliknięcia wygląda tak samo, ale w drzewie dostępności jest pustym kontenerem z tekstem.

## Kiedy sięgać po ARIA

Pierwsza zasada ARIA brzmi: nie używaj ARIA, jeśli wystarczy natywny element. `role="button"` na divie zmienia tylko to, co usłyszy czytnik. Fokus, Enter, spację i stan wyłączenia musisz wtedy dopisać sam, a każda z tych rzeczy to miejsce na błąd.

ARIA ma sens tam, gdzie HTML nie ma odpowiednika: zakładki, drzewa, pola z listą podpowiedzi. Wtedy trzymaj się wzorców z WAI-ARIA Authoring Practices i sprawdź wynik czytnikiem.

## Struktura też jest semantyką

Nagłówki od `h1` do `h6`, listy, `nav`, `main` i tabele z nagłówkami to [relacje](slownik:relacja), które widać na ekranie, a które czytnik musi dostać w kodzie. Tego wymaga kryterium 1.3.1. Pogrubiony akapit wygląda jak nagłówek, ale nim nie jest, więc nie da się do niego przeskoczyć.
