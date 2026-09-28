---
title: Kontrast stanów i tekstu pomocniczego
summary: Jasnoszary tekst pomocniczy i przycisk, który przy najechaniu blednie. Zejdź z jasności kolorów i sprawdź każdy stan.
criteria: ["1.4.3", "1.4.11"]
effort: 1 token
gain: Tekst jest czytelny dla osób słabowidzących, starszych i dla każdego, kto patrzy na ekran w słońcu.
preview: <span class="p-faint">Hasło musi mieć 8 znaków</span>
status: szkic
bad:
  why: Tekst pomocniczy ma kontrast 1,9 do 1. Przycisk przy najechaniu zmienia tekst na jasnoszary. Obramowanie pola ma 1,4 do 1.
  announces: Czytnik przeczyta wszystko poprawnie. Ten błąd dotyczy osób, które patrzą na ekran, więc czytnik go nie ujawni.
  axe: [color-contrast]
good:
  why: Tekst pomocniczy ma 8,4 do 1, obramowanie pola ponad 3 do 1. Przy najechaniu przycisk zmienia tło, a nie jasność tekstu.
  announces: To samo co w wersji zepsutej. Różnicę widać, nie słychać.
---
Pole hasła z podpowiedzią pod spodem i przyciskiem. Kontrast to jedna z niewielu poprawek, które nic nie kosztują w kodzie, jeśli kolory są ustalone w tokenach.
