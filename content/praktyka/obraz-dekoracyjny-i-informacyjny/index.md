---
title: Obraz dekoracyjny i informacyjny
summary: Ozdobnik opisany słowami, a wykres bez opisu. Ozdobnikowi daj pusty alt, a wykresowi tekst z tym, co pokazuje.
criteria: ["1.1.1"]
effort: 2 minuty
gain: Czytnik pomija szlaczek i czyta, co pokazuje wykres, zamiast nazwy pliku.
preview: <span class="p-img">IMG_2041.png</span>
status: szkic
bad:
  why: Szlaczek ma opisowy alt, który tylko spowalnia słuchanie. Wykres nie ma atrybutu alt wcale.
  announces: „Ozdobny szlaczek z zielonymi listkami, grafika”, a potem przy wykresie nazwa pliku albo samo „grafika”.
  axe: [image-alt]
good:
  why: Szlaczek ma alt="", więc czytnik go pomija. Wykres ma krótki alt z wnioskiem, a dane są w podpisie pod nim.
  announces: Szlaczka nie słychać. Przy wykresie „Sprzedaż rośnie co kwartał, od 40 do 70 tysięcy złotych, grafika”, a potem podpis z danymi.
---
Ten sam fragment raportu: ozdobny szlaczek pod nagłówkiem i wykres sprzedaży. Pierwszy obraz niczego nie mówi, drugi mówi najwięcej na stronie. Tekst alternatywny powinien to odzwierciedlać.
