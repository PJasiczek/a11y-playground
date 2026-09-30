---
title: Formularz z błędami
summary: Pole bez etykiety, a błąd oznaczony samą czerwoną ramką. Dodaj etykietę, opisz błąd tekstem i powiąż go z polem.
criteria: ["3.3.1", "3.3.2", "1.4.1", "1.3.1"]
effort: 15 minut
gain: Każdy dowiaduje się, które pole jest złe i jak je poprawić, także bez rozróżniania kolorów.
preview: <span class="p-input p-error">jan.kowalski@</span>
simulations:
  deuteranopia: 'Wpisz adres bez małpy i wyślij formularz. W wersji zepsutej czerwona ramka pola robi się oliwkowa i niczym nie różni się od zwykłej, więc nie widać, że coś jest źle. W wersji poprawnej zostaje napis „Błąd: …” ze znakiem ostrzeżenia.'
  protanopia: 'Wpisz adres bez małpy i wyślij formularz. Przy protanopii czerwona ramka ciemnieje do brązowej i zlewa się z szarą obwódką pola. W wersji poprawnej błąd opisuje tekst, więc kolor nie jest potrzebny.'
  tritanopia: 'Wpisz adres bez małpy i wyślij formularz. Czerwień zostaje czerwona, więc tutaj różnica jest niewielka. Tritanopia to rzadki typ i ten przykład niewiele o niej mówi.'
  achromatopsja: 'Wpisz adres bez małpy i wyślij formularz. Bez barw ramka błędu w wersji zepsutej różni się od zwykłej tylko grubością. W wersji poprawnej komunikat tekstowy działa i bez koloru.'
  slabe-widzenie: 'Szary placeholder „E-mail” w wersji zepsutej rozmywa się pierwszy, a po wpisaniu znaku znika. Etykieta nad polem w wersji poprawnej zostaje czytelna.'
status: szkic
bad:
  why: Placeholder zamiast etykiety znika po wpisaniu pierwszego znaku. Błąd to tylko czerwona ramka, bez słowa wyjaśnienia.
  announces: „E-mail, pole edycji”, a po wysłaniu nic. Czytnik nie wie, że pole jest błędne ani dlaczego.
good:
  why: Widoczna etykieta, format podany z góry. Po wysłaniu komunikat tekstowy przy polu, powiązany przez aria-describedby, pole z aria-invalid i fokus przeniesiony do pola.
  announces: „Adres e-mail, pole edycji, nieprawidłowe dane, Podaj adres z małpą, na przykład jan@przyklad.pl”.
---
Formularz z jednym polem na adres e-mail. Obie wersje odrzucają adres bez małpy. Różnica jest w tym, czy osoba wypełniająca dowie się, co poszło nie tak.
