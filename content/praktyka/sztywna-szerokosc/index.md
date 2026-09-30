---
title: Sztywna szerokość i wysokość
summary: Karta o stałej szerokości i przycisk o stałej wysokości. Po powiększeniu treść wychodzi poza ekran albo się ucina.
criteria: ["1.4.10", "1.4.4"]
effort: 2 minuty
gain: Osoby, które powiększają stronę, czytają bez przewijania w bok i widzą cały napis na przycisku.
preview: <span class="p-clip">Dostawa do 3 dni roboczych, zwrot do 30 dni</span>
status: szkic
bad:
  why: Karta ma szerokość 460 pikseli i tekst bez zawijania, więc na wąskim ekranie trzeba ją przewijać w bok. Przycisk ma stałą wysokość i szerokość z ukrytym nadmiarem, więc powiększony napis się ucina.
  announces: Czytnik przeczyta wszystko poprawnie. Ten błąd widać dopiero po powiększeniu, więc czytnik go nie ujawni.
good:
  why: Karta ma tylko maksymalną szerokość i tekst się zawija. Przycisk ma minimalną wysokość i wypełnienie, więc rośnie razem z tekstem.
  announces: To samo co w wersji zepsutej. Różnicę widać, nie słychać.
---
Karta z informacją o dostawie i przycisk. Wymiary podane w [pikselach CSS](slownik:piksel-css) nie rosną razem z tekstem. Wybierz symulację „320 pikseli” albo „Tekst 200%”: w wersji zepsutej karta wychodzi poza ramkę, a napis na przycisku się ucina.
