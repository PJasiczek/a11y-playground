---
title: Własna lista zamiast select
summary: Lista rozwijana zbudowana z div działa tylko myszą. Najprościej użyj natywnego elementu select.
criteria: ["4.1.2", "2.1.1"]
effort: refaktor
gain: Lista działa z klawiatury, strzałkami i na telefonie, a czytnik podaje, co jest wybrane.
preview: <span class="p-select">Wybierz miasto ▾</span>
simulations:
  klawiatura: 'W wersji zepsutej lista nie przyjmuje fokusu, więc Tab jej nie zauważa i miasta nie da się wybrać. W wersji poprawnej pole dostaje numer i reaguje na strzałki.'
status: szkic
bad:
  why: Div wyglądający jak pole, który rozwija listę po kliknięciu. Nie ma roli, nazwy ani stanu. Tab go pomija, a strzałki nic nie robią.
  announces: „Wybierz miasto”, jak zwykły tekst. Osoba z czytnikiem nie wie, że to pole wyboru, i nie ma jak go otworzyć.
good:
  why: Natywny select z etykietą. Przeglądarka daje obsługę klawiatury, rolę, stan i systemową listę na telefonie.
  announces: „Miasto, lista rozwijana, Kraków, zwinięta”. Strzałki zmieniają wybór, a czytnik podaje nową wartość.
---
Pole wyboru miasta w formularzu zamówienia. Własne listy rozwijane wyglądają ładniej w projekcie, ale każdą funkcję, którą natywny select daje za darmo, trzeba wtedy odtworzyć ręcznie.
