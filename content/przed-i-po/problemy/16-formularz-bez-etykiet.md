---
title: Pola bez etykiet, wymagane oznaczone tylko kolorem
criteria: ["1.3.1", "3.3.2", "1.4.1"]
marker: formularz
who: [czytnik, daltonizm, telefon]
axe: [label]
pattern: przyciski-opcji
status: szkic
---
## Problem

Nad polami stoi tekst, ale to `div`, a nie `label`. Czytnik ekranu ogłasza „pole edycji” bez nazwy, a dotknięcie tekstu nie przenosi do pola. Przyciski opcji mają tekst obok, lecz bez etykiet i bez `fieldset`, więc nikt nie usłyszy pytania „Rodzaj zgłoszenia”. Pola wymagane różnią się od reszty tylko niebieskim kolorem etykiety.

## Rozwiązanie

Każde pole ma `label` powiązany przez `for` i `id`, przyciski opcji siedzą w `fieldset` z `legend`. Pola wymagane mają słowo „(wymagane)” w etykiecie i atrybut `required`, a nad formularzem jest jedno zdanie, co to oznacza. E-mail ma `type="email"` i `autocomplete`.

```przed
<div class="etykieta wymagane">E-mail</div>
<input type="text" name="email">
<span><input type="radio" name="rodzaj"> Opóźnienie</span>
```

```po
<label for="email">E-mail (wymagane)</label>
<input id="email" type="email" autocomplete="email" required>
<fieldset><legend>Rodzaj zgłoszenia (wymagane)</legend>
  <label><input type="radio" name="rodzaj" required> Opóźnienie</label>
</fieldset>
```
