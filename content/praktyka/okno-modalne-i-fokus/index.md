---
title: Okno modalne i fokus
summary: Okno potwierdzenia zrobione z div. Fokus zostaje za oknem. Użyj elementu dialog i metody showModal.
criteria: ["2.4.3", "2.1.2", "4.1.2"]
effort: refaktor
gain: Klawiatura trafia do okna, Esc je zamyka, a fokus wraca tam, skąd przyszedł.
preview: <span class="p-dialog">Czy na pewno?</span>
simulations:
  klawiatura: 'Przejdź klawiszem Tab do przycisku „Usuń konto” i naciśnij Enter. W wersji zepsutej fokus zostaje pod oknem, a przyciski w oknie nigdy nie dostają numeru, bo Tab ich nie widzi. W wersji poprawnej fokus trafia do okna, a Esc je zamyka.'
status: szkic
bad:
  why: Nakładka z div pokazuje pytanie, ale fokus zostaje na przycisku pod spodem. Tab idzie dalej po stronie za oknem, a Esc nic nie robi.
  announces: Nic nowego. Po kliknięciu czytnik dalej jest na „Usuń konto, przycisk” i nie wie, że pojawiło się okno.
good:
  why: Element dialog otwierany przez showModal. Przeglądarka przenosi fokus do okna, blokuje stronę pod spodem, zamyka okno klawiszem Esc i oddaje fokus przyciskowi.
  announces: „Usunąć konto?, okno dialogowe”, a potem pierwszy przycisk w oknie. Po zamknięciu znowu „Usuń konto, przycisk”.
---
Przycisk „Usuń konto” otwiera okno z pytaniem o potwierdzenie. W obu wersjach okno wygląda tak samo. Różnica jest w tym, gdzie jest fokus i czy osoba z klawiaturą albo czytnikiem ekranu w ogóle trafi do okna.

Wersja zepsuta pokazuje częstszy błąd, czyli fokus uciekający za okno. Nie zamyka fokusu w pułapce, bo taki przykład uwięziłby też czytelnika tej strony.
