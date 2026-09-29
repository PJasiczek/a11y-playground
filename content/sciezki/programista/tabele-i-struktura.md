---
title: Tabele i struktura
summary: Nagłówki, obszary i tabele, które czytnik rozumie tak samo jak oko.
criteria: ["1.3.1", "1.3.2", "2.4.6"]
examples: [tabela-z-naglowkami]
keep:
  - Nagłówki od h1 do h6 w kolejności, bez przeskakiwania poziomów.
  - Tabela danych ma th ze scope i podpis w caption.
  - Kolejność w HTML to kolejność czytania. CSS jej nie zmienia.
status: szkic
---
Osoby z czytnikiem rzadko czytają stronę od góry do dołu. Skaczą po nagłówkach, listach i obszarach, a w tabeli poruszają się strzałkami między komórkami.

## Nagłówki i obszary

Jeden `h1` na stronę, pod nim `h2` dla sekcji i tak dalej, bez przeskoków. Nagłówki mają opisywać temat sekcji (2.4.6), bo w liście nagłówków czytnika widać tylko ich tekst. Obszary `header`, `nav`, `main` i `footer` dają drugi sposób nawigacji.

## Tabele

Tabela danych potrzebuje nagłówków w `th` ze `scope="col"` albo `scope="row"`. Wtedy czytnik przy każdej komórce powie, do której kolumny należy. Podpis w `caption` mówi, czego tabela dotyczy. Tabel nie używaj do układu strony.

## Kolejność czytania

Czytnik idzie za kolejnością w HTML, nie za tym, co pokazuje CSS. Właściwość `order` we flexboksie albo pozycjonowanie potrafią pokazać treść w innej kolejności, niż przeczyta ją czytnik. Jeśli od kolejności zależy sens, na przykład w instrukcji krok po kroku, HTML musi ją zachować (1.3.2).
