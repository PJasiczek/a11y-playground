---
title: Formularz z błędami
summary: Pole bez etykiety, a błąd oznaczony samą czerwoną ramką. Dodaj etykietę, opisz błąd tekstem i powiąż go z polem.
criteria: ["3.3.1", "3.3.2", "1.4.1", "1.3.1"]
effort: 15 minut
gain: Każdy dowiaduje się, które pole jest złe i jak je poprawić, także bez rozróżniania kolorów.
preview: <span class="p-input p-error">jan.kowalski@</span>
status: szkic
bad:
  why: Placeholder zamiast etykiety znika po wpisaniu pierwszego znaku. Błąd to tylko czerwona ramka, bez słowa wyjaśnienia.
  announces: „E-mail, pole edycji”, a po wysłaniu nic. Czytnik nie wie, że pole jest błędne ani dlaczego.
good:
  why: Widoczna etykieta, format podany z góry. Po wysłaniu komunikat tekstowy przy polu, powiązany przez aria-describedby, pole z aria-invalid i fokus przeniesiony do pola.
  announces: „Adres e-mail, pole edycji, nieprawidłowe dane, Podaj adres z małpą, na przykład jan@przyklad.pl”.
---
Formularz z jednym polem na adres e-mail. Obie wersje odrzucają adres bez małpy. Różnica jest w tym, czy osoba wypełniająca dowie się, co poszło nie tak.
