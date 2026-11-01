from pathlib import Path
import base64
import html

root = Path(__file__).resolve().parents[1]
out = root / 'docs/design/2026-11-01-seo'
out.mkdir(parents=True, exist_ok=True)
scene = base64.b64encode((root / 'public/images/playground-hero.png').read_bytes()).decode()
font = base64.b64encode((root / 'node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2').read_bytes()).decode()
colors = ['#a8dffc', '#acf0b6', '#d0b9fa', '#ffd2aa']
brand = ''.join(f'<rect x="{64+i*21}" y="64" width="15" height="42" rx="7" fill="{c}"/>' for i,c in enumerate(colors))
brand += '<text x="164" y="96" font-size="30" font-weight="800">a11y playground</text>'
def svg(name, label, lines, desc, mode):
    art = f'<image href="data:image/png;base64,{scene}" x="625" y="140" width="540" height="420"/>' if mode == 'scene' else '''<rect x="768" y="174" width="322" height="304" rx="40" fill="#a8dffc" transform="rotate(5 930 326)"/><rect x="728" y="204" width="322" height="304" rx="40" fill="#fff" stroke="#d0b9fa" stroke-width="3"/><text x="778" y="308" font-size="46" font-weight="800">Aa</text><rect x="778" y="344" width="218" height="88" rx="22" fill="#06316b"/><text x="810" y="401" style="fill:#fff" font-size="42" font-weight="800">4,5 : 1</text>'''
    if mode == 'square':
        art = f'<image href="data:image/png;base64,{scene}" x="380" y="380" width="670" height="570"/>'
    size = '1080 1080' if mode == 'square' else '1200 630'
    w,h = size.split()
    title = ''.join(f'<text x="64" y="{246+i*79}" font-size="68" font-weight="800" letter-spacing="-2">{line}</text>' for i,line in enumerate(lines))
    body = f'<text x="64" y="{445 if mode != "square" else 460}" font-size="26">{desc}</text>'
    s = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {size}" role="img" aria-label="{label}"><defs><style>@font-face{{font-family:Geist;src:url(data:font/woff2;base64,{font})}}text{{font-family:Geist,Arial,sans-serif;fill:#06316b}}</style></defs><rect width="{w}" height="{h}" fill="#fdfbf6"/><circle cx="1120" cy="40" r="260" fill="#ffe78a" opacity=".28"/>{brand}<text x="64" y="166" font-size="23" font-weight="700">{label}</text>{title}{body}{art}<text x="64" y="{int(h)-55}" font-size="22">WCAG po polsku · wiedza i praktyka</text></svg>'''
    (out / name).write_text(s, encoding='utf-8')
    return s

a = svg('og-home.svg', 'DOSTĘPNOŚĆ CYFROWA', ['Małe kroki.', 'Wielka zmiana.'], 'Poznaj WCAG. Sprawdź w praktyce.', 'scene')
b = svg('og-criterion.svg', 'KRYTERIUM WCAG 2.2 · 1.4.3', ['Kontrast', 'bez zgadywania.'], 'Zobacz różnicę. Poznaj zasady.', 'card')
c = svg('social-square.svg', 'UCZ SIĘ PRZEZ DZIAŁANIE', ['Dostępność', 'zaczyna się tutaj.'], 'Kryteria · przykłady · ścieżki nauki', 'square')
def image(s, alt):
    return '<img alt="'+alt+'" src="data:image/svg+xml;base64,'+base64.b64encode(s.encode()).decode()+'">'

page = '''<!doctype html><html lang="pl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plan SEO — a11y playground</title><style>
*{box-sizing:border-box}body{margin:0;color:var(--foreground,#06316b);font:16px/1.65 Arial,sans-serif}main{max-width:1100px;margin:auto}h1{font-size:clamp(30px,6vw,48px);line-height:1.1;letter-spacing:-1.5px;margin:12px 0 20px}h2{font-size:25px;line-height:1.3;margin:36px 0 16px}h3{font-size:18px;margin:0 0 8px}p{margin:8px 0 16px}.intro,.panel,figure{color:#06316b;padding:24px;border-radius:24px;background:#fdfbf6}.intro{background:linear-gradient(120deg,#e6ddfa,#fdfbf6 70%)}.tag{font-size:12px;font-weight:bold;letter-spacing:1.5px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.panel{border:1px solid #c5d6e8}.mint{background:#def7e2}.yellow{background:#fff0b6}figure{margin:18px 0;border:1px solid #c5d6e8}figure img{width:100%;display:block;border-radius:14px}figcaption{margin-top:14px}small{font-size:13px}code{font-size:13px;overflow-wrap:anywhere}pre{white-space:pre-wrap;background:#eaf2fa;padding:20px;border-radius:16px;font-size:13px}li{margin:8px 0}a{color:#06316b;text-underline-offset:3px}a:focus-visible{outline:3px solid #06316b;outline-offset:4px}table{width:100%;border-collapse:collapse;font-size:14px}td,th{text-align:left;vertical-align:top;padding:12px 8px;border-bottom:1px solid #c5d6e8}button{font:inherit;padding:10px 18px;background:#06316b;color:white;border:0;border-radius:30px;cursor:pointer;min-height:44px}details{padding:18px;background:#fdfbf6;border-radius:18px;margin:12px 0}summary{cursor:pointer;min-height:44px;font-weight:bold}.square{max-width:540px;margin:auto}.note{font-size:14px;color:#184b7f}@media(max-width:550px){.grid{grid-template-columns:1fr}.panel,figure,.intro{padding:18px}td,th{padding:8px 4px;font-size:12px}}@media print{details{display:block}button{display:none}}
</style><main>
<div class="intro"><span class="tag">A11Y PLAYGROUND / PLAN ROZWOJU / 01.11.2026</span><h1>Łatwiej znaleźć.<br>Chętniej udostępnić.</h1><p>Plan SEO i spójny zestaw grafik do linków. Pastelowy plac zabaw, kremowe tło, granatowa typografia i obecne ilustracje aplikacji.</p><small>Zakres: audyt kodu i lokalnego artefaktu builda + propozycja wdrożenia. Bez zmian w działaniu aplikacji i bez audytu produkcji.</small></div>
<h2>01 / Co już działa, czego brakuje</h2><div class="grid"><div class="panel mint"><h3>Solidna baza już jest</h3><p>TanStack Start prerenderuje strony. <code>pageHead()</code> ustawia tytuły, opisy, canonical i podstawowe OG. Istnieją JSON-LD, <code>robots.txt</code> i generator <code>sitemap.xml</code>.</p><small>Potwierdzone w kodzie; plik sitemap jest także w lokalnym <code>.output/public</code>. Aktualność tego builda względem produkcji wymaga sprawdzenia.</small></div><div class="panel yellow"><h3>Najpilniejsza luka: podgląd linku</h3><p>Brakuje <code>og:image</code>, wymiarów i opisu grafiki. Root ustawia <code>twitter:card=summary</code>. Grafiki istnieją na stronie, ale nie są wskazane jako obrazy kart.</p><small>Cel: czytelna karta marki i osobne karty ważnych treści, dostępne robotom w HTML bez JavaScriptu.</small></div></div>
<h2>02 / Kolejność wdrożenia</h2><div class="panel"><table><thead><tr><th>Etap</th><th>Zmiana</th><th>Warunek odbioru</th></tr></thead><tbody>
<tr><td><b>P0 · baza</b><br>0,5–1 dnia</td><td>Potwierdzić docelową domenę w <code>src/lib/site.ts</code>. Sprawdzić sitemap, robots, canonicale, odpowiedzi 404 i blokadę indeksowania deploymentów preview.</td><td>Publiczne URL-e odpowiadają 200; błędne 404; jeden docelowy host; preview ma skuteczny noindex.</td></tr>
<tr><td><b>P0 · udostępnianie</b><br>1–2 dni</td><td>Eksport grafik do PNG/JPG, fallback marki oraz rozszerzenie <code>PageMeta</code> o obraz i alt. Duża karta X, jawne metadane obrazów.</td><td>Surowy HTML zawiera pełne tagi. Obrazy dostępne publicznie przez HTTPS, bez cookies i autoryzacji.</td></tr>
<tr><td><b>P1 · treść</b><br>1–2 dni</td><td>Unikalne tytuły z intencją wyszukiwania, opisy i H1; linki między kryteriami, praktyką i ścieżkami. Przegląd JSON-LD zgodnie z widoczną treścią.</td><td>Brak pustych/powielonych tytułów i sprzecznych canonicali. Wartościowe strony dostępne z linków HTML.</td></tr>
<tr><td><b>P1 · kontrola</b><br>0,5–1 dnia</td><td>Kontrole SEO w CI, walidacja kart i wydajności. Po publikacji zgłoszenie mapy w Google Search Console.</td><td>Spójny zestaw URL-i w mapie i metadanych; raport przed/po. Obserwacja indeksacji i CTR po 2–4 tygodniach.</td></tr>
</tbody></table><p class="note">Szacunki dla jednego wykonawcy; nie obejmują oczekiwania na indeksację. Dostęp do Search Console będzie potrzebny na etapie zgłoszenia i pomiaru.</p></div>
<h2>03 / Sitemap.xml — rozwinąć istniejący generator</h2><div class="panel"><p>Źródło prawdy pozostaje w <code>src/content/site-pages.ts</code>; generator w <code>src/routes/sitemap[.]xml.ts</code>. Nie tworzyć równoległej, ręcznie utrzymywanej mapy w public.</p><ul><li>Uwzględniać tylko <code>index: true</code>: strony kategorii, kryteria, praktykę, prawo i lekcje. Wykluczyć wyszukiwarkę, dokumenty demo i ukryte odpowiedzi.</li><li>Porównać listę z canonicalami i kodami HTTP. Bez parametrów filtrów, fragmentów, duplikatów, przekierowań i stron noindex.</li><li>Dodać escaping wartości XML. Obecny generator interpoluje adresy bez jawnego escapingu.</li><li><code>lastmod</code> dodawać dopiero z wiarygodną datą istotnej zmiany treści; obecny brak jest właściwszy niż data każdego builda. Google ignoruje <code>priority</code> i <code>changefreq</code> [1].</li><li>Sprawdzić wynik produkcyjnego builda, typ MIME i odwołanie z robots.txt. Po publikacji zgłosić mapę w Search Console; mapa nie gwarantuje indeksacji [1].</li></ul>
<pre>&lt;urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"&gt;
  &lt;url&gt;
    &lt;loc&gt;https://a11y-playground-tau.vercel.app/kryteria&lt;/loc&gt;
  &lt;/url&gt;
&lt;/urlset&gt;</pre><small>Fragment poglądowy. Obecny host pochodzi z repozytorium; po decyzji o domenie trzeba zmienić go spójnie w canonicalach, mapie i OG.</small></div>
<h2>04 / Trzy propozycje grafik</h2><p>Rekomendacja: A jako domyślny podgląd aplikacji, B jako szablon treści. C to dodatkowa grafika do ręcznego publikowania postów. Użyte ilustracje pochodzą z aplikacji; napisy i kompozycje są nowymi propozycjami.</p>
'''
page += '<figure>'+image(a,'Propozycja A: Małe kroki. Wielka zmiana. Obok pastelowy plac zabaw.')+'<figcaption><b>A / Marka — rekomendowana</b><br>1200 × 630. Link do strony głównej i fallback dla pozostałych stron. Duże hasło i znajoma scena bez drobnych etykiet interfejsu.</figcaption></figure>'
page += '<figure>'+image(b,'Propozycja B: Kontrast bez zgadywania. Karta kryterium 1.4.3 z przykładem kontrastu.')+'<figcaption><b>B / Konkretna treść</b><br>1200 × 630. Szablon kryteriów i materiałów. Zmienny tytuł, identyfikator oraz ilustracja. Kolor sekcji zgodny z aplikacją; limit dwóch linii i kontrolowane łamanie długich tytułów.</figcaption></figure>'
page += '<figure><div class="square">'+image(c,'Propozycja C: Dostępność zaczyna się tutaj. Kwadratowy post z ilustracją aplikacji.')+'</div><figcaption><b>C / Post w kwadracie</b><br>1080 × 1080. Materiał do ręcznego dodania do posta, np. na Instagramie. Nie zastępuje obrazu OG dla linku. Oddzielna kompozycja chroni tekst przed przypadkowym kadrowaniem.</figcaption></figure>'
page += '''<div class="panel"><h3>Specyfikacja produkcyjna</h3><p>Geist, granat <code>#06316b</code>, krem <code>#fdfbf6</code>, pastelowe akcenty z DESIGN.md. Bez zrzutu całej strony, małych menu i pozornych przycisków. Stały jasny wariant grafiki niezależny od motywu urządzenia.</p><p>Proponowany plik OG: PNG/JPG 1200 × 630, docelowo poniżej 500 kB po kontroli jakości. Dla X przygotować również 1200 × 600 i przetestować faktyczny kadr. Zachować co najmniej 64 px marginesu oraz przetestować miniaturę 300 px i kadrowanie w docelowych aplikacjach.</p><p class="note">Załączone SVG to projekty do przeglądu, z osadzoną ilustracją i fontem. Do kart społecznościowych wyeksportować je do rastra; nie wdrażać SVG jako uniwersalnego og:image. Podglądy niżej nie są symulacją konkretnej platformy.</p></div>
<h2>05 / Metadane i odbiór</h2><details open><summary>Proponowany kontrakt dla pageHead()</summary><pre>socialImage: { path, alt, width, height, type }

og:image           → bezwzględny HTTPS URL do PNG/JPG
og:image:width     → 1200
og:image:height    → 630
og:image:type      → image/png
og:image:alt       → opis zawartości grafiki
twitter:card       → summary_large_image
twitter:title      → tytuł konkretnej strony
twitter:description → opis konkretnej strony
twitter:image      → bezwzględny URL obrazu
twitter:image:alt  → opis obrazu</pre><p>Fallback marki dla stron bez przypisanego obrazu. Powiązanie grafiki z trasą, nie z parametrami filtrów. Nazwy plików z wersją, np. <code>og-home-v1.png</code>, pomagają przy aktualizacji cache. Tagi mają być obecne w HTML odpowiedzi, a nie dopiero po hydratacji [2][3].</p></details>
<div class="grid"><div class="panel"><h3>Kontrole automatyczne</h3><ul><li>Unikalność i poprawność XML; brak noindex i duplikatów w mapie.</li><li>Metadane w wyrenderowanym HTML: strona główna, kryterium, lekcja, wyszukiwarka i 404.</li><li>Brak zdublowanych tagów po dziedziczeniu z root.</li><li>Publiczny obraz ma poprawny MIME, wymiary i odpowiedź 200.</li></ul></div><div class="panel"><h3>Kontrola po publikacji</h3><ul><li>Facebook Sharing Debugger i LinkedIn Post Inspector; ponowne pobranie metadanych.</li><li>Rzeczywiste udostępnienie linku w X, Messengerze, WhatsApp i Slacku; wynik zależy od klienta i cache.</li><li>Search Console: sitemap i inspekcja reprezentatywnych URL-i.</li><li>Pomiar Core Web Vitals oraz indeksacji, zapytań i CTR względem punktu wyjścia.</li></ul></div></div>
<h2>06 / Źródła i granice audytu</h2><p class="note">Stan repozytorium z 1 listopada 2026. Przejrzano seo.ts, site.ts, structured-data.ts, __root.tsx, site-pages.ts, sitemap[.]xml.ts, robots[.]txt.ts, vite.config.ts i DESIGN.md. Nie potwierdzono produkcyjnych odpowiedzi HTTP, indeksacji ani bieżących kart w serwisach.</p><p class="note">[1] <a href="https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap">Google: budowanie i zgłaszanie sitemap</a><br>[2] <a href="https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics">Google: JavaScript SEO i prerendering</a><br>[3] <a href="https://ogp.me/">Open Graph: obraz, wymiary i alt</a></p>
</main></html>'''
(out / 'plan-seo.html').write_text(page, encoding='utf-8')
print(out / 'plan-seo.html')
