---
title: Łącza „Więcej” i „Kliknij tutaj”
criteria: ["2.4.4"]
marker: linki
who: [czytnik]
axe: []
pattern: lacze
status: szkic
---
## Problem

Pod każdą wiadomością jest „Więcej”, a na każdym slajdzie karuzeli „Kliknij tutaj”. Na liście łączy w czytniku ekranu widać trzy razy „Więcej” i trzy razy „Kliknij tutaj”, bez słowa o tym, dokąd prowadzą. „Kliknij” zakłada też mysz.

## Rozwiązanie

Tekst łącza mówi, dokąd prowadzi: tytuł wiadomości jest łączem, a na slajdzie stoi „Rozkład linii 14”. Jedno łącze na wiadomość zamiast dwóch.

```przed
<b>Remont wiaduktu na Kolejowej: objazdy linii 3 i 7</b>
<a href="…">Więcej</a>
```

```po
<h3><a href="…">Remont wiaduktu na Kolejowej: objazdy linii 3 i 7</a></h3>
```
