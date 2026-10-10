---
title: Błędy formularza bez wskazania pól
criteria: ["3.3.1", "3.3.3", "4.1.3"]
marker: walidacja
who: [czytnik, poznawcze, klawiatura]
axe: []
example: formularz-z-bledami
status: szkic
---
## Problem

Po wysłaniu złego formularza nad nim pojawia się „Formularz zawiera błędy.” Nie wiadomo, które pola są złe ani co w nich poprawić. Strona przewija się do komunikatu, ale fokus zostaje na przycisku „Wyślij”, a czytnik ekranu nic nie ogłasza: dla osoby niewidomej kliknięcie po prostu nic nie zrobiło.

## Rozwiązanie

Podsumowanie błędów z nagłówkiem „Popraw 2 pola” i listą łączy do pól dostaje fokus, więc czytnik je przeczyta. Pod każdym złym polem jest komunikat, co poprawić, powiązany z polem przez `aria-describedby`, a pole ma `aria-invalid="true"`.

```przed
<div class="bledy">Formularz zawiera błędy.</div>
```

```po
<div class="wynik podsumowanie" tabindex="-1">
  <h3>Popraw 2 pola</h3>
  <ul><li><a href="#email">E-mail: wpisz adres w formacie nazwa@domena.pl</a></li>…</ul>
</div>
<input id="email" aria-invalid="true" aria-describedby="email-blad">
<p class="blad" id="email-blad">Wpisz adres w formacie nazwa@domena.pl</p>
```
