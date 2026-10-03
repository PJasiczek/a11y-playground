---
title: Łącze
en: Link
batch: html
native: html
summary: Element a z atrybutem href prowadzi w inne miejsce. Tekst łącza mówi dokąd, także wyrwany z kontekstu.
criteria: ["2.4.4", "4.1.2"]
preview: <span class="p-link">regulamin sklepu</span>
steps:
  - do: Przejdź do łącza.
    keys: [Tab]
    hear: regulamin sklepu, łącze
  - do: Otwórz je. Fokus przechodzi do nagłówka, do którego prowadzi.
    keys: [Enter]
    hear: Regulamin, nagłówek, poziom 2
  - do: Wróć do łącza.
    keys: [Shift+Tab]
    hear: regulamin sklepu, łącze
aria:
  - attr: href
    on: łącze
    selector: a
    meaning: Dokąd prowadzi. Bez href element a nie jest łączem i Tab go pomija.
  - attr: tabindex
    on: nagłówek „Regulamin”
    selector: "#regulamin"
    meaning: Wartość -1 pozwala przenieść na nagłówek fokus po otwarciu łącza, ale nie dodaje go do kolejności Tab.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/link/
  deque: https://dequeuniversity.com/library/aria/link
status: szkic
---
## Kiedy używać

Gdy kliknięcie prowadzi pod inny adres albo w inne miejsce tej samej strony. Jeśli wykonuje akcję na miejscu, to przycisk.

Łącze otwiera się Enterem, a nie Spacją: Spacja przewija stronę. Czytnik pozwala też wyświetlić listę samych łączy, dlatego tekst „regulamin sklepu” mówi więcej niż „kliknij tutaj”.

## Typowe błędy

- Element `a` bez `href`. Tab go pomija, a czytnik nie mówi „łącze”.
- Tekst „więcej”, „tutaj”, „czytaj dalej” powtórzony kilka razy na stronie, prowadzący w różne miejsca.
- Łącze otwierające nowe okno bez zapowiedzi w tekście.
- Łącze wyróżnione tylko kolorem w akapicie, bez podkreślenia.

## Jak sprawdzić

- Przejdź do łącza klawiszem Tab i otwórz je Enterem.
- Wyświetl w czytniku listę łączy (w NVDA Insert+F7). Każde ma mówić, dokąd prowadzi.
- Sprawdź, czy łącze w tekście różni się od reszty akapitu czymś więcej niż kolorem.
