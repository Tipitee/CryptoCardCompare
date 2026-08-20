#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère les 5 pages statiques de l'étude "cartes crypto 2026" (FR/EN/DE/ES/IT)
dans public/etudes/ à partir d'un template partagé + contenu traduit par langue.
Chiffres RÉELS (base TopCryptoCards, gen-card-stats.mjs, 17/08/2026).
Structure/CSS identiques -> cohérence + hreflang complet 7 marchés.
Relancer chaque année (édition 2027) : mettre à jour NUMS + CONTENT.
"""
import os, re
# Nettoyage "style humain" : supprime les tirets longs (-> virgules) et ne garde
# le gras (.em) que sur les segments contenant un chiffre. Appliqué à tout le
# contenu avant génération, pour que DE/ES/IT restent propres à chaque régénération.
def _clean_str(s):
    s = s.replace(" — ", ", ").replace(" —", ",").replace("— ", ", ").replace("—", ", ")
    s = re.sub(r"\s+,", ",", s); s = re.sub(r",\s*,", ",", s)
    s = re.sub(r'<span class="em">(.*?)</span>',
               lambda m: m.group(0) if re.search(r"\d", m.group(1)) else m.group(1), s)
    return s
def clean_dict(d):
    def c(v):
        if isinstance(v, str): return _clean_str(v)
        if isinstance(v, list): return [c(x) for x in v]
        if isinstance(v, tuple): return tuple(c(x) for x in v)
        if isinstance(v, dict): return {k: c(x) for k, x in v.items()}
        return v
    return c(d)

BASE = "https://topcryptocards.eu"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "etudes")

SLUG = {"fr":"cartes-crypto-2026","en":"crypto-cards-2026","de":"krypto-karten-2026",
        "es":"tarjetas-cripto-2026","it":"carte-crypto-2026"}
def url(l): return f"{BASE}/etudes/{SLUG[l]}"

# hreflang : 7 marchés -> version linguistique (be->fr, at->de)
HREFLANG = "".join(
  f'<link rel="alternate" hreflang="{hl}" href="{url(l)}">\n'
  for hl,l in [("fr","fr"),("fr-BE","fr"),("de","de"),("de-AT","de"),
               ("es","es"),("it","it"),("en-GB","en"),("x-default","fr")])

HOME = {"fr":"/fr","en":"/en","de":"/de","es":"/es","it":"/it"}
CMP  = {"fr":"/fr/comparer","en":"/en/compare","de":"/de/vergleichen",
        "es":"/es/comparar","it":"/it/confrontare"}

CSS = """
  :root{--bg:#0a0e17;--card:#121a2b;--card2:#0f1626;--border:#1e2a44;--text:#e8eef7;--muted:#8ea0bd;
    --cyan:#00d4ff;--red:#ff5c7a;--green:#38e08a;--amber:#ffb54d;--violet:#7a5cff;--maxw:940px}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.65;-webkit-font-smoothing:antialiased}
  a{color:var(--cyan);text-decoration:none} a:hover{text-decoration:underline}
  .wrap{max-width:var(--maxw);margin:0 auto;padding:0 20px}
  .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
  .nav{border-bottom:1px solid var(--border)}
  .nav .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
  .brand{display:flex;align-items:center;gap:10px;font-weight:800}
  .brand img{height:30px;width:auto} .brand .c{color:var(--cyan)}
  .nav a.cta{font-size:14px;border:1px solid var(--border);padding:8px 14px;border-radius:10px;color:var(--text)}
  header.hero{padding:60px 0 36px;border-bottom:1px solid var(--border);background:radial-gradient(1200px 400px at 50% -120px,rgba(0,212,255,.10),transparent)}
  .kicker{color:var(--cyan);font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:13px;margin-bottom:16px}
  h1{font-size:clamp(29px,5vw,50px);line-height:1.08;margin:0 0 18px;font-weight:800;letter-spacing:-.02em}
  h1 .hl{color:var(--cyan)}
  .lede{font-size:19px;color:var(--muted);max-width:710px}.lede strong{color:var(--text)}
  .meta{margin-top:22px;font-size:13px;color:var(--muted)}
  .stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin:34px 0 4px}
  .stat{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px 12px;text-align:center}
  .stat .n{font-size:25px;font-weight:800;letter-spacing:-.02em}
  .stat .n.red{color:var(--red)}.stat .n.cyan{color:var(--cyan)}.stat .n.green{color:var(--green)}.stat .n.amber{color:var(--amber)}
  .stat .l{font-size:12px;color:var(--muted);margin-top:6px;line-height:1.35}
  section{padding:44px 0;border-bottom:1px solid var(--border)}
  h2{font-size:clamp(23px,3.4vw,31px);margin:0 0 12px;font-weight:800;letter-spacing:-.01em}
  h2 .sub{display:block;font-size:14px;color:var(--cyan);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}
  h3{font-size:18px;margin:22px 0 8px}
  p{color:#cdd8ea;margin:0 0 16px}p .em{color:#fff;font-weight:700}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:26px;align-items:center}
  .card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:18px}
  .card h4{margin:0 0 4px;font-size:15px}.card .cap{font-size:12px;color:var(--muted);margin-bottom:14px}
  .bigstat{display:flex;gap:24px;align-items:center;background:var(--card);border:1px solid var(--border);border-radius:18px;padding:26px;margin:6px 0}
  .bigstat .huge{font-size:70px;font-weight:800;color:var(--cyan);line-height:1}.bigstat .t{font-size:16px;color:#cdd8ea}
  .bars{display:grid;gap:13px}
  .brow .top{display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px}
  .brow .nm{font-weight:700}.brow .vals .a{color:var(--muted);text-decoration:line-through;margin-right:6px}.brow .vals .r{color:var(--green);font-weight:700}
  .track{height:20px;background:var(--card2);border-radius:6px;position:relative;overflow:hidden}
  .track .adv{position:absolute;top:0;bottom:0;left:0;background:rgba(255,92,122,.32)}
  .track .real{position:absolute;top:0;bottom:0;left:0;background:var(--green);border-radius:6px}
  .legend{display:flex;gap:16px;font-size:12px;color:var(--muted);margin-top:12px;flex-wrap:wrap}
  .dot{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:middle}
  table{width:100%;border-collapse:collapse;margin:14px 0;font-size:15px}
  th,td{text-align:left;padding:11px 12px;border-bottom:1px solid var(--border)}
  th{color:var(--cyan);font-size:12px;text-transform:uppercase;letter-spacing:.05em}
  td .adv{color:var(--muted);text-decoration:line-through}td .real{color:var(--green);font-weight:700}td .g{color:var(--red);font-weight:800}
  tr.top td{background:rgba(255,92,122,.06)}.rank{color:var(--muted);font-variant-numeric:tabular-nums}
  .pill{display:inline-block;background:rgba(255,181,77,.12);color:var(--amber);border:1px solid rgba(255,181,77,.3);border-radius:999px;padding:1px 9px;font-size:11px;font-weight:700}
  .donuts{display:flex;gap:20px;flex-wrap:wrap;justify-content:center}.du{text-align:center}
  .donut{width:150px;height:150px;border-radius:50%;position:relative;margin:0 auto 10px}
  .donut::after{content:'';position:absolute;inset:26%;background:var(--card);border-radius:50%}
  .donut .ce{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:22px;z-index:1}
  .du .t{font-size:13px;color:var(--muted);max-width:180px;margin:0 auto}
  .box-uk{background:rgba(0,212,255,.06);border:1px solid rgba(0,212,255,.25);border-radius:14px;padding:18px 20px;margin:8px 0}
  .calc{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px}
  .calc .row{display:flex;flex-wrap:wrap;gap:18px;align-items:center;margin-bottom:16px}
  .calc label{font-size:13px;color:var(--muted);display:block;margin-bottom:6px}
  .calc select,.calc input[type=range]{width:100%}
  .calc select{background:var(--card2);color:var(--text);border:1px solid var(--border);border-radius:10px;padding:10px}
  .calc .field{flex:1;min-width:210px}
  .result{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:8px}
  .result .box{border-radius:14px;padding:18px;text-align:center}
  .result .promise{background:rgba(255,92,122,.08);border:1px solid rgba(255,92,122,.25)}
  .result .real{background:rgba(56,224,138,.08);border:1px solid rgba(56,224,138,.25)}
  .result .big{font-size:34px;font-weight:800}.result .promise .big{color:var(--red)}.result .real .big{color:var(--green)}
  .result .lbl{font-size:12px;color:var(--muted);margin-top:4px}
  .verdict{margin-top:14px;font-size:15px;text-align:center;color:var(--muted)}.verdict b{color:#fff}
  ul.take{list-style:none;padding:0;margin:0;display:grid;gap:12px}
  ul.take li{background:var(--card);border:1px solid var(--border);border-left:3px solid var(--cyan);border-radius:10px;padding:14px 16px}ul.take li b{color:#fff}
  .honest{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
  .honest .h{background:var(--card);border:1px solid rgba(56,224,138,.25);border-radius:12px;padding:14px;text-align:center}
  .honest .h .r{color:var(--green);font-weight:800;font-size:22px}.honest .h .n{font-size:13px;margin-top:4px}
  .faq details{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:4px 16px;margin-bottom:10px}
  .faq summary{cursor:pointer;font-weight:700;padding:12px 0;list-style:none}
  .faq summary::-webkit-details-marker{display:none}.faq summary::before{content:'+ ';color:var(--cyan)}
  .faq details[open] summary::before{content:'\\2013 '}.faq p{padding-bottom:12px;margin:0}
  .cite{background:var(--card2);border:1px dashed var(--border);border-radius:14px;padding:18px;font-size:14px;color:var(--muted);font-style:italic}
  footer{padding:32px 0 60px;color:var(--muted);font-size:13px}
  footer .links{display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px}
  @media(max-width:720px){.stats{grid-template-columns:repeat(2,1fr)}.grid2{grid-template-columns:1fr}.result{grid-template-columns:1fr}.bigstat{flex-direction:column;text-align:center}}
"""

# barres (structure identique ; noms de cartes non traduits)
def bars(leg_adv, leg_real):
    rows = [("Bleap Card",20,1,100,5,""),("WhiteBIT Nóva",10,1,50,5,""),
            ("Bybit Card",10,2,50,10,"staking"),("COCA Visa Card",8,1,40,5,""),
            ("Bit2Me Card",7,2,35,10,""),("Uphold Card",6,1,30,5,""),
            ("Plutus Card",9,3,45,15,"staking")]
    h=""
    for nm,a,r,wa,wr,pill in rows:
        p=f' <span class="pill">{pill}</span>' if pill else ""
        h+=(f'<div class="brow"><div class="top"><span class="nm">{nm}{p}</span>'
            f'<span class="vals"><span class="a">{a}%</span><span class="r">{r}%</span></span></div>'
            f'<div class="track"><div class="adv" style="width:{wa}%"></div><div class="real" style="width:{wr}%"></div></div></div>')
    leg=(f'<div class="legend"><span><span class="dot" style="background:rgba(255,92,122,.5)"></span>{leg_adv}</span>'
         f'<span><span class="dot" style="background:var(--green)"></span>{leg_real}</span></div>')
    return h,leg

TABLE_ROWS=[("1","Bleap Card","20","1","-19","top"),("2","WhiteBIT Nóva","10","1","-9",""),
 ("3","Bybit Card","10","2","-8","stk"),("4","Solcard","8","0","-8",""),("5","Kardpay Card","8","0","-8",""),
 ("6","Tap Card","8","0.5","-7.5",""),("7","COCA Visa Card","8","1","-7",""),("8","Plutus Card","9","3","-6","stk"),
 ("9","Bit2Me Card","7","2","-5",""),("10","Uphold Card","6","1","-5",""),("11","Kolo Card","5","0","-5",""),
 ("12","Rizon Visa Card","5","0.1","-4.9","")]
def table(th, stk_word):
    head="".join(f"<th>{x}</th>" for x in th)
    body=""
    for rk,nm,a,r,g,flag in TABLE_ROWS:
        cls=' class="top"' if flag=="top" else ""
        pill=f' <span class="pill">{stk_word}</span>' if flag=="stk" else ""
        body+=(f'<tr{cls}><td class="rank">{rk}</td><td><b>{nm}</b>{pill}</td>'
               f'<td><span class="adv">{a}%</span></td><td><span class="real">{r}%</span></td><td><span class="g">{g} pts</span></td></tr>')
    return f'<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>'

def donut(pct, c1, c2, center, l1, l2, ccenter="var(--amber)", fs="22px"):
    return (f'<div class="du"><div class="donut" style="background:conic-gradient({c1} 0 {pct}%,{c2} {pct}% 100%)">'
            f'<div class="ce" style="color:{ccenter};font-size:{fs}">{center}</div></div>'
            f'<div class="t"><span class="dot" style="background:{c1}"></span>{l1} &nbsp; <span class="dot" style="background:{c2}"></span>{l2}</div></div>')

# ---- CONTENU PAR LANGUE ----
C = {}

C["de"] = dict(
 cur="€", loc="de-DE", market=83, ri="32",
 title="Krypto-Karten zahlen nur 31 % des beworbenen Cashbacks — Studie 2026",
 desc="Wir haben 93 Krypto-Karten in Europa analysiert. Beworbenes Cashback im Schnitt 2,37 %, ohne Staking real erreichbar nur 0,53 % — 31 % des Versprechens. Vollständiges Ranking der größten Lücken.",
 og_desc="93 Karten analysiert. Bleap wirbt mit 20 %, zahlt 1 %. Das komplette Ranking beworben vs. real.",
 kicker="TopCryptoCards-Studie · August 2026 · 93 Karten analysiert",
 h1='Beworben bis zu <span class="hl">20 %</span> Cashback.<br>Sie bekommen <span class="hl">1 %</span>.',
 lede='Wir haben <strong>93 in Europa verfügbare Krypto-Karten</strong> analysiert. Ergebnis: im Schnitt zahlt eine Karte nur <strong>31 % des beworbenen Cashbacks</strong>. Zwischen der großen Zahl in der Werbung und dem, was tatsächlich ankommt, klafft eine systematische Lücke.',
 meta="Von Hand geprüfte Daten · 7 Märkte (FR · BE · DE · AT · ES · IT · UK) · Unabhängiger Vergleich · Stand: 17. August 2026",
 stats=[("cyan","31 %","des beworbenen Cashbacks <b>tatsächlich gezahlt</b>"),("red","2,37 %","durchschnittlich <b>beworben</b>"),
        ("amber","51 %","der Karten mit <b>0 %</b> Cashback"),("green","95 %","ohne <b>Jahresgebühr</b>"),("","9","bereits <b>eingestellt</b>")],
 ri_sub="Die Kennzahl", ri_h2="Der Realitätsindex: 31 %",
 ri_big='Das ist der durchschnittliche Anteil des beworbenen Cashbacks, den ein Nutzer <span class="em">ohne Staking</span> wirklich erhält. Die übrigen 69 % hängen an Treuestufen, Ausgabenvolumen, gesperrten Token oder Monatsdeckeln. Kurz: <span class="em">zwei Drittel des Versprechens verdampfen</span>, bevor sie ankommen.',
 ri_body='Über die 84 aktiven Karten (83 in Deutschland verfügbar) beträgt das <span class="em">beworbene</span> Cashback im Schnitt <span class="em">2,37 %</span>. Ohne Kapitalbindung erreichbar sind nur <span class="em">0,53 %</span>. Der Realitätsindex (real ÷ beworben) fasst die Lücke in einer Zahl: <span class="em">31 %</span> (32 % allein in Deutschland).',
 rank_sub="Das Ranking", rank_h2="Die größten Lücken beworben / real",
 rank_intro='Die große Zahl ist keine Lüge — sie ist eine <span class="em">theoretische Obergrenze</span> mit fast immer versteckter Bedingung. Unten die Karten mit der größten Lücke zwischen Versprechen und Realität.',
 bars_title="Beworben vs. real (ohne Staking)", bars_cap="Die 7 spektakulärsten Lücken · Skala 0–20 %",
 leg_adv="Beworbenes Cashback", leg_real="Real ohne Staking",
 th=["#","Karte","Beworben","Real","Lücke"], stk="staking",
 table_note="Lücke = beworbene Cashback-Punkte, ohne Staking/Bedingung nicht erreichbar. TopCryptoCards-Datenbank, August 2026.",
 calc_sub="Selbst testen", calc_h2="Wie viel bekommen Sie wirklich?",
 calc_intro="Wählen Sie eine Karte und Ihre monatlichen Ausgaben. Vergleichen Sie das Versprechen mit dem, was Sie in einem Jahr wirklich erhalten.",
 calc_card="Karte", calc_spend="Ausgaben pro Monat", adv_word="beworben",
 calc_pl="„versprochenes“ Cashback / Jahr", calc_rl="reales Cashback (ohne Staking) / Jahr",
 calc_vpre="Lücke: <b>", calc_vpost="</b> beworbenes Cashback, das Sie dieses Jahr nicht sehen.",
 market_sub="Für Deutschland & Österreich", market_h2="Was das im DACH-Raum bedeutet",
 market_html='<p style="margin-bottom:8px"><span class="em">83 der 93 Karten sind in Deutschland verfügbar</span> — das Bild ist dasselbe: nur 31 % des beworbenen Cashbacks sind real, und über die Hälfte der Karten zahlt 0 % Basis-Cashback.</p><p style="margin:0">Anbieter unterliegen der <span class="em">BaFin</span> und dem <span class="em">MiCA</span>-Rahmen. Zu beachten: <span class="em">Binance</span> hat den EWR verlassen und <span class="em">BingX</span> ist (noch) nicht MiCA-lizenziert — vor dem Antrag Verfügbarkeit prüfen.',
 honest_sub="Die ehrlichen", honest_h2="Karten, die ihr Versprechen (fast) halten",
 honest_intro='Nicht alles ist schlecht. Eine Minderheit bewirbt ein Cashback <span class="em">ohne Bedingungen</span> — der genannte Satz ist der, den Sie wirklich bekommen. Bescheiden, aber ehrlich.',
 honest=[("2 %","<b>Nexo Card</b><br>2 % in BTC, ohne Staking"),("2 %","<b>Bitpanda Card</b><br>2 %, ohne Staking"),
         ("2 %","<b>Royal Indigo</b><br>beworben 3 %, real 2 %"),("3 %","<b>Frosted Rose Gold</b><br>beworben 5 %, real 3 %")],
 honest_lesson='Die Lektion: ein <span class="em">ehrliches, garantiertes 2 %</span> schlägt ein „bis zu 10 %“, das nur auf dem Papier existiert.',
 oc_sub="Die unbequeme Zahl", oc_h2="Jede zweite Karte zahlt nichts",
 oc_p1='Man hält Cashback für den Standard. Falsch. Von 84 aktiven Karten bewerben <span class="em">43 — 51 % — 0 % Basis-Cashback</span>. Mehr als die Hälfte gibt nichts zurück.',
 oc_p2='Und Staking, der Popanz jedes Vergleichs? Ein Ablenkungsmanöver: <span class="em">nur 8 % der Karten (7 von 84) verlangen es</span>. Die eigentliche Falle ist der Glaube, „beworben“ heiße „erhalten“.',
 oc_l1="0 % Cashback", oc_l2="zahlen etwas",
 fees_sub="Gebühren", fees_h2="Kostenlos im Schaufenster, teuer im Premium",
 fees_p1='Gute Nachricht: <span class="em">95 % der Krypto-Karten haben keine Jahresgebühr</span> (80 von 84). Kostenlos ist Standard.',
 fees_p2='Doch die zahlende Minderheit langt zu: Median <span class="em">151 €/Jahr</span>, Spitze bis <span class="em">1 000 €/Jahr</span> — Premium-Bankpreise für ein Cashback, das selten hält.',
 fees_l1="kostenlos", fees_l2="kostenpflichtig",
 net_sub="Hinter dem Markt", net_h2="Visa dominiert, und jede 10. Karte ist schon weg",
 net_p1='<span class="em">75 % der Karten laufen auf Visa</span> (63 von 84), 25 % auf Mastercard. Fast alle bieten eine physische Karte; nur 3 sind rein virtuell.',
 net_p2='Von 93 Karten sind <span class="em">9 bereits eingestellt</span> — u. a. die <b>Binance-Karte</b>, die <b>Wirex-Karten</b> und kürzlich <b>Brighty</b>. Fast jede zehnte online noch besprochene Karte <span class="em">existiert nicht mehr</span>.',
 token_sub="Die nächste Falle", token_h2="Cashback… in einem volatilen Token",
 token_p1='Selbst wenn es Cashback gibt: prüfen Sie <span class="em">in welcher Währung</span>. Viele Karten zahlen im eigenen Token (CRO, PLU…) oder einem volatilen Asset, nicht in Euro.',
 token_p2='Ein „3 %“-Cashback in einem Token, der 30 % verliert, ist real kaum etwas wert. Karten, die in <span class="em">BTC, Stablecoin (USDC, EURe) oder Euro</span> zahlen, liefern einen weit planbareren Wert.',
 ana_sub="Analyse", ana_h2="Warum ist die Lücke so groß?",
 ana_intro="Drei fast immer kombinierte Mechaniken graben den Graben:",
 ana1='<span class="em">1. Treuestufen.</span> Der Höchstsatz existiert nur an der Spitze einer Pyramide, erreichbar durch Bindung großer Mengen des Haus-Tokens. Unten — wo die meisten sind — ist der Satz ein Bruchteil.',
 ana2='<span class="em">2. Monatsdeckel.</span> Viele Karten deckeln das Cashback bei einigen zehn Euro/Monat. Danach geben Sie aus, ohne etwas zu bekommen.',
 ana3='<span class="em">3. Versteckte Staking-Kosten.</span> Einen volatilen Token zu sperren ist eine Wette: fällt er, frisst der Verlust das „Cashback“. Dieses Risiko steht nie in der großen Zahl.',
 ana_concl='Fazit: die einzige relevante Zahl ist der <span class="em">garantierte Satz, ohne Bedingung und ohne Staking</span> — genau den misst unser Realitätsindex.',
 take_sub="Zum Mitnehmen", take_h2="4 Reflexe vor der Kartenwahl",
 take=["<b>Ignorieren Sie die große Zahl.</b> Suchen Sie den <em>bedingungslosen</em> Satz: ohne Staking, Stufe, Deckel. Im Schnitt bekommen Sie ein Drittel.",
       "<b>Prüfen Sie, ob es überhaupt Cashback gibt</b> — und in welcher Währung. Jede zweite Karte zahlt keines.",
       "<b>Kostenlos ist Standard.</b> 151–1 000 €/Jahr lohnen nur bei sehr hohen Ausgaben — rechnen Sie die Schwelle.",
       "<b>Verlangen Sie Aktualität.</b> Sätze und Verfügbarkeit ändern sich schnell, Karten verschwinden. Daten von 2025 sind schon verdächtig."],
 faq_sub="Häufige Fragen", faq_h2="FAQ",
 faq=[("Ist Krypto-Karten-Cashback eine Lüge?","Nein, aber eine theoretische Obergrenze. Das „bis zu X %“ setzt fast immer Bedingungen voraus. Im Schnitt sind nur 31 % ohne Staking erreichbar."),
      ("Welche Karte hat das beste reale Cashback?","Einige zahlen zuverlässig 2–3 % (Nexo, Bitpanda, Crypto.com Frosted Rose Gold). Siehe unseren aktuellen <a href=\"https://topcryptocards.eu/de/krypto-karte-cashback\">Cashback-Vergleich</a>."),
      ("Muss man für Cashback staken?","Selten — nur 8 % verlangen es. Wichtiger ist bedingungsloses Cashback in nicht-volatiler Währung."),
      ("Sind die Daten aktuell?","Ja. Aus der von Hand geprüften TopCryptoCards-Datenbank, laufend aktualisiert. Zuletzt: 17. August 2026.")],
 meth_sub="Methodik", meth_h2="Wie wir gezählt haben",
 meth='Daten aus der <span class="em">TopCryptoCards</span>-Datenbank (Stand 17.08.2026): 93 Karten, von Hand geprüft über 7 Märkte (FR, BE, DE, AT, ES, IT, UK). „Beworben“ = Höchstsatz des Anbieters; „real“ = ohne Staking erreichbar. Unabhängiger Vergleich. Keine Karte wird gegen Provision besser platziert.',
 cite='Zitieren: „Laut der TopCryptoCards-Studie 2026 (93 europäische Krypto-Karten) zahlen Karten im Schnitt nur 31 % des beworbenen Cashbacks; jede zweite bietet gar keines. Größte Lücke: Bleap, 20 % beworben, 1 % real.“',
 f_home="Startseite", f_cmp="Vergleich", f_cash="Cashback-Karten", f_fees="Gebühren-Index",
)

C["es"] = dict(
 cur="€", loc="es-ES", market=83, ri="32",
 title="Las tarjetas cripto pagan solo el 31 % del cashback que anuncian — Estudio 2026",
 desc="Analizamos 93 tarjetas cripto en Europa. Cashback anunciado medio 2,37 %, real sin staking solo 0,53 % — el 31 % de la promesa. Ranking completo de las mayores brechas.",
 og_desc="93 tarjetas analizadas. Bleap anuncia 20 %, paga 1 %. El ranking completo anunciado vs. real.",
 kicker="Estudio TopCryptoCards · Agosto 2026 · 93 tarjetas analizadas",
 h1='Te prometen hasta un <span class="hl">20 %</span> de cashback.<br>Cobrarás un <span class="hl">1 %</span>.',
 lede='Analizamos <strong>93 tarjetas cripto disponibles en Europa</strong>. Resultado: de media, una tarjeta paga solo el <strong>31 % del cashback que anuncia</strong>. Entre la cifra grande del anuncio y lo que de verdad cobras, la brecha es sistemática.',
 meta="Datos verificados a mano · 7 mercados (FR · BE · DE · AT · ES · IT · UK) · Comparador independiente · Actualizado: 17 de agosto de 2026",
 stats=[("cyan","31 %","del cashback anunciado <b>realmente pagado</b>"),("red","2,37 %","cashback <b>anunciado</b> medio"),
        ("amber","51 %","de tarjetas al <b>0 %</b>"),("green","95 %","sin <b>cuota anual</b>"),("","9","ya <b>descontinuadas</b>")],
 ri_sub="La cifra clave", ri_h2="El índice de realidad: 31 %",
 ri_big='Es la parte media del cashback anunciado que un usuario cobra <span class="em">de verdad, sin staking</span>. El 69 % restante depende de niveles de fidelidad, volúmenes, tokens bloqueados o topes mensuales. En corto: <span class="em">dos tercios de la promesa se evaporan</span>.',
 ri_body='Sobre las 84 tarjetas activas (83 disponibles en España), el cashback <span class="em">anunciado</span> promedia <span class="em">2,37 %</span>. El realmente accesible sin inmovilizar capital cae a <span class="em">0,53 %</span>. El índice de realidad (real ÷ anunciado) lo resume: <span class="em">31 %</span> (32 % solo en España).',
 rank_sub="El ranking", rank_h2="Las mayores brechas anunciado / real",
 rank_intro='La cifra grande no es mentira: es un <span class="em">techo teórico</span> con una condición casi siempre oculta. Aquí las tarjetas con mayor brecha entre promesa y realidad.',
 bars_title="Anunciado vs. real (sin staking)", bars_cap="Las 7 brechas más espectaculares · escala 0–20 %",
 leg_adv="Cashback anunciado", leg_real="Real sin staking",
 th=["#","Tarjeta","Anunciado","Real","Brecha"], stk="staking",
 table_note="Brecha = puntos de cashback anunciados pero inaccesibles sin staking/condición. Base TopCryptoCards, agosto 2026.",
 calc_sub="Pruébalo tú", calc_h2="¿Cuánto cobrarás de verdad?",
 calc_intro="Elige una tarjeta y tu gasto mensual. Compara lo que promete la publicidad con lo que cobrarás en un año.",
 calc_card="Tarjeta", calc_spend="Gasto al mes", adv_word="anunciado",
 calc_pl="cashback «prometido» al año", calc_rl="cashback real (sin staking) al año",
 calc_vpre="Brecha: <b>", calc_vpost="</b> de cashback «prometido» que no verás este año.",
 market_sub="Para España", market_h2="Qué significa en España",
 market_html='<p style="margin-bottom:8px"><span class="em">83 de las 93 tarjetas están disponibles en España</span> — el panorama es el mismo: solo el 31 % del cashback anunciado es real, y más de la mitad de las tarjetas pagan 0 % base.</p><p style="margin:0">Los emisores operan bajo el marco <span class="em">MiCA</span>. Ojo: la <span class="em">CNMV</span> ha señalado a algunas plataformas (p. ej. <span class="em">BingX</span>), y <span class="em">Binance</span> ha salido del EEE. Verifica la disponibilidad antes de solicitarla.',
 honest_sub="Las honestas", honest_h2="Tarjetas que (casi) cumplen su promesa",
 honest_intro='No todo es negro. Una minoría anuncia un cashback <span class="em">sin condiciones</span> — el tipo anunciado es el que cobras. Modestos… pero honestos.',
 honest=[("2 %","<b>Nexo Card</b><br>2 % en BTC, sin staking"),("2 %","<b>Bitpanda Card</b><br>2 %, sin staking"),
         ("2 %","<b>Royal Indigo</b><br>anunciado 3 %, real 2 %"),("3 %","<b>Frosted Rose Gold</b><br>anunciado 5 %, real 3 %")],
 honest_lesson='La lección: un <span class="em">2 % honesto y garantizado</span> vale más que un «hasta 10 %» que solo existe en el papel.',
 oc_sub="La estadística incómoda", oc_h2="Una de cada dos tarjetas no paga nada",
 oc_p1='Imaginamos el cashback como la norma. Falso. De 84 tarjetas activas, <span class="em">43 — el 51 % — anuncian 0 % base</span>. Más de la mitad no devuelve nada.',
 oc_p2='¿Y el staking, el coco de los comparadores? Un señuelo: <span class="em">solo el 8 % (7 de 84) lo exige</span>. La verdadera trampa es creer que «anunciado» es «cobrado».',
 oc_l1="0 % cashback", oc_l2="pagan algo",
 fees_sub="Comisiones", fees_h2="Gratis en el escaparate, caro en el premium",
 fees_p1='Buena noticia: <span class="em">el 95 % no tiene cuota anual</span> (80 de 84). Lo gratis es el estándar.',
 fees_p2='Pero la minoría de pago no disimula: mediana <span class="em">151 €/año</span>, tope hasta <span class="em">1 000 €/año</span> — precios de banca premium, para un cashback que rara vez cumple.',
 fees_l1="gratis", fees_l2="de pago",
 net_sub="Detrás del mercado", net_h2="Visa aplasta a Mastercard, y 1 de cada 10 ya no existe",
 net_p1='<span class="em">El 75 % de las tarjetas son Visa</span> (63 de 84), frente al 25 % de Mastercard. Casi todas ofrecen tarjeta física; solo 3 son solo virtuales.',
 net_p2='De 93 tarjetas, <span class="em">9 ya están descontinuadas</span> — la <b>tarjeta Binance</b>, las <b>tarjetas Wirex</b> y, muy reciente, <b>Brighty</b>. Casi una de cada diez de las que aún se habla <span class="em">ya no existe</span>.',
 token_sub="La siguiente trampa", token_h2="Cashback… pagado en un token volátil",
 token_p1='Aunque haya cashback, mira <span class="em">en qué moneda</span>. Muchas tarjetas pagan en su propio token (CRO, PLU…) o en un activo volátil, no en euros.',
 token_p2='Un cashback «del 3 %» en un token que cae un 30 % vale poco. Las que pagan en <span class="em">BTC, stablecoin (USDC, EURe) o euros</span> ofrecen un valor mucho más previsible.',
 ana_sub="Análisis", ana_h2="¿Por qué la brecha es tan grande?",
 ana_intro="Tres mecánicas, casi siempre combinadas, cavan el foso:",
 ana1='<span class="em">1. Niveles de fidelidad.</span> El tipo máximo solo existe en la cima de una pirámide, alcanzable inmovilizando mucho del token propio. Abajo — donde está la mayoría — el tipo es una fracción.',
 ana2='<span class="em">2. Topes mensuales.</span> Muchas tarjetas limitan el cashback a unas decenas de euros/mes. Por encima, gastas sin recibir nada.',
 ana3='<span class="em">3. El coste oculto del staking.</span> Bloquear un token volátil es una apuesta: si cae, la pérdida se come tu «cashback». Ese riesgo nunca aparece en la cifra grande.',
 ana_concl='Conclusión: la única cifra que importa es el <span class="em">tipo garantizado, sin condiciones y sin staking</span> — justo la que mide nuestro índice de realidad.',
 take_sub="Para recordar", take_h2="4 reflejos antes de elegir",
 take=["<b>Ignora la cifra grande.</b> Busca el tipo <em>sin condiciones</em>: sin staking, nivel ni tope. De media cobrarás un tercio.",
       "<b>Comprueba que hay cashback</b> — y en qué moneda. Una de cada dos no paga ninguno.",
       "<b>Lo gratis es la norma.</b> Pagar 151–1 000 €/año solo compensa con gasto muy alto — calcula el umbral.",
       "<b>Exige frescura.</b> Tipos y disponibilidad cambian rápido, y las tarjetas desaparecen. Un dato de 2025 ya es sospechoso."],
 faq_sub="Preguntas frecuentes", faq_h2="FAQ",
 faq=[("¿El cashback cripto es mentira?","No, pero es un techo teórico. El «hasta X %» casi siempre supone condiciones. De media, solo el 31 % es accesible sin staking."),
      ("¿Qué tarjeta tiene el mejor cashback real?","Algunas pagan un 2–3 % fiable (Nexo, Bitpanda, Crypto.com Frosted Rose Gold). Ve nuestro <a href=\"https://topcryptocards.eu/es/tarjeta-cripto-cashback\">comparador de cashback</a>."),
      ("¿Hay que hacer staking para cobrar?","Rara vez — solo el 8 % lo exige. Lo importante es que el cashback sea incondicional y en moneda no volátil."),
      ("¿Los datos están actualizados?","Sí. De la base TopCryptoCards verificada a mano, actualizada en continuo. Última verificación: 17 de agosto de 2026.")],
 meth_sub="Metodología", meth_h2="Cómo hemos contado",
 meth='Datos de la base <span class="em">TopCryptoCards</span> a 17/08/2026: 93 tarjetas, verificadas a mano en 7 mercados (FR, BE, DE, AT, ES, IT, UK). «Anunciado» = tipo máximo del emisor; «real» = accesible sin staking. Comparador independiente. Ninguna tarjeta sube en el ranking a cambio de comisión.',
 cite='Citar: «Según el estudio 2026 de TopCryptoCards (93 tarjetas cripto europeas), las tarjetas pagan de media solo el 31 % del cashback que anuncian, y una de cada dos no ofrece ninguno. La mayor brecha es de Bleap: 20 % anunciado, 1 % real.»',
 f_home="Inicio", f_cmp="Comparador", f_cash="Tarjetas cashback", f_fees="Índice de comisiones",
)

C["it"] = dict(
 cur="€", loc="it-IT", market=83, ri="32",
 title="Le carte crypto pagano solo il 31 % del cashback promesso — Studio 2026",
 desc="Abbiamo analizzato 93 carte crypto in Europa. Cashback pubblicizzato medio 2,37 %, reale senza staking solo 0,53 % — il 31 % della promessa. Classifica completa dei divari maggiori.",
 og_desc="93 carte analizzate. Bleap pubblicizza 20 %, paga 1 %. La classifica completa pubblicizzato vs. reale.",
 kicker="Studio TopCryptoCards · Agosto 2026 · 93 carte analizzate",
 h1='Ti promettono fino al <span class="hl">20 %</span> di cashback.<br>Ne incasserai l\'<span class="hl">1 %</span>.',
 lede='Abbiamo analizzato <strong>93 carte crypto disponibili in Europa</strong>. Risultato: in media una carta paga solo il <strong>31 % del cashback che pubblicizza</strong>. Tra il numero grande in pubblicità e ciò che incassi davvero, il divario è sistematico.',
 meta="Dati verificati a mano · 7 mercati (FR · BE · DE · AT · ES · IT · UK) · Comparatore indipendente · Aggiornato: 17 agosto 2026",
 stats=[("cyan","31 %","del cashback pubblicizzato <b>realmente pagato</b>"),("red","2,37 %","cashback <b>pubblicizzato</b> medio"),
        ("amber","51 %","delle carte allo <b>0 %</b>"),("green","95 %","senza <b>costi annuali</b>"),("","9","già <b>dismesse</b>")],
 ri_sub="Il dato chiave", ri_h2="L'indice di realtà: 31 %",
 ri_big='È la quota media del cashback pubblicizzato che un utente incassa <span class="em">davvero, senza staking</span>. Il restante 69 % dipende da livelli fedeltà, volumi, token bloccati o tetti mensili. In breve: <span class="em">due terzi della promessa svaniscono</span>.',
 ri_body='Sulle 84 carte attive (83 disponibili in Italia), il cashback <span class="em">pubblicizzato</span> è in media del <span class="em">2,37 %</span>. Quello realmente accessibile senza immobilizzare capitale scende allo <span class="em">0,53 %</span>. L\'indice di realtà (reale ÷ pubblicizzato) lo riassume: <span class="em">31 %</span> (32 % solo in Italia).',
 rank_sub="La classifica", rank_h2="I divari maggiori pubblicizzato / reale",
 rank_intro='Il numero grande non è una bugia: è un <span class="em">tetto teorico</span> con una condizione quasi sempre nascosta. Ecco le carte col divario più ampio tra promessa e realtà.',
 bars_title="Pubblicizzato vs. reale (senza staking)", bars_cap="I 7 divari più spettacolari · scala 0–20 %",
 leg_adv="Cashback pubblicizzato", leg_real="Reale senza staking",
 th=["#","Carta","Pubbl.","Reale","Divario"], stk="staking",
 table_note="Divario = punti di cashback pubblicizzati ma inaccessibili senza staking/condizione. Base TopCryptoCards, agosto 2026.",
 calc_sub="Provalo tu", calc_h2="Quanto incasserai davvero?",
 calc_intro="Scegli una carta e la tua spesa mensile. Confronta ciò che promette la pubblicità con ciò che incasserai in un anno.",
 calc_card="Carta", calc_spend="Spesa al mese", adv_word="pubbl.",
 calc_pl="cashback «promesso» in 1 anno", calc_rl="cashback reale (senza staking) in 1 anno",
 calc_vpre="Divario: <b>", calc_vpost="</b> di cashback «promesso» che non vedrai quest'anno.",
 market_sub="Per l'Italia", market_h2="Cosa significa in Italia",
 market_html='<p style="margin-bottom:8px"><span class="em">83 delle 93 carte sono disponibili in Italia</span> — il quadro è lo stesso: solo il 31 % del cashback pubblicizzato è reale, e oltre la metà delle carte paga 0 % di base.</p><p style="margin:0">Gli emittenti operano sotto <span class="em">MiCA</span> e vigilanza <span class="em">CONSOB/OAM</span>. Da notare: <span class="em">Binance</span> ha lasciato lo SEE e <span class="em">BingX</span> non è (ancora) autorizzata MiCA — verifica la disponibilità prima di richiederla.',
 honest_sub="Le oneste", honest_h2="Carte che (quasi) mantengono la promessa",
 honest_intro='Non è tutto nero. Una minoranza pubblicizza un cashback <span class="em">senza condizioni</span> — il tasso indicato è quello che incassi. Modesti… ma onesti.',
 honest=[("2 %","<b>Nexo Card</b><br>2 % in BTC, senza staking"),("2 %","<b>Bitpanda Card</b><br>2 %, senza staking"),
         ("2 %","<b>Royal Indigo</b><br>pubbl. 3 %, reale 2 %"),("3 %","<b>Frosted Rose Gold</b><br>pubbl. 5 %, reale 3 %")],
 honest_lesson='La lezione: un <span class="em">2 % onesto e garantito</span> vale più di un «fino al 10 %» che esiste solo sulla carta.',
 oc_sub="La statistica scomoda", oc_h2="Una carta su due non paga nulla",
 oc_p1='Immaginiamo il cashback come la norma. Falso. Su 84 carte attive, <span class="em">43 — il 51 % — pubblicizzano 0 % di base</span>. Più di una su due non restituisce nulla.',
 oc_p2='E lo staking, lo spauracchio dei comparatori? Un depistaggio: <span class="em">solo l\'8 % (7 su 84) lo richiede</span>. La vera trappola è credere che «pubblicizzato» significhi «incassato».',
 oc_l1="0 % cashback", oc_l2="ne pagano",
 fees_sub="Costi", fees_h2="Gratis in vetrina, salato nel premium",
 fees_p1='Buona notizia: <span class="em">il 95 % non ha costi annuali</span> (80 su 84). Il gratis è lo standard.',
 fees_p2='Ma la minoranza a pagamento non scherza: mediana <span class="em">151 €/anno</span>, punta fino a <span class="em">1 000 €/anno</span> — prezzi da banca premium, per un cashback che raramente mantiene.',
 fees_l1="gratis", fees_l2="a pagamento",
 net_sub="Dietro il mercato", net_h2="Visa schiaccia Mastercard, e 1 carta su 10 è già sparita",
 net_p1='<span class="em">Il 75 % delle carte è Visa</span> (63 su 84), contro il 25 % Mastercard. Quasi tutte offrono una carta fisica; solo 3 sono solo virtuali.',
 net_p2='Delle 93 carte, <span class="em">9 sono già dismesse</span> — la <b>carta Binance</b>, le <b>carte Wirex</b> e, recentissima, <b>Brighty</b>. Quasi una su dieci di cui si parla ancora <span class="em">non esiste più</span>.',
 token_sub="La trappola successiva", token_h2="Cashback… pagato in un token volatile",
 token_p1='Anche quando il cashback c\'è, guarda <span class="em">in quale valuta</span>. Molte carte pagano nel proprio token (CRO, PLU…) o in un asset volatile, non in euro.',
 token_p2='Un cashback «del 3 %» in un token che perde il 30 % vale poco. Le carte che pagano in <span class="em">BTC, stablecoin (USDC, EURe) o euro</span> offrono un valore molto più prevedibile.',
 ana_sub="Analisi", ana_h2="Perché il divario è così ampio?",
 ana_intro="Tre meccaniche, quasi sempre combinate, scavano il fossato:",
 ana1='<span class="em">1. Livelli fedeltà.</span> Il tasso massimo esiste solo in cima a una piramide, raggiungibile immobilizzando molto del token di casa. In basso — dove sta la maggioranza — il tasso è una frazione.',
 ana2='<span class="em">2. Tetti mensili.</span> Molte carte limitano il cashback a poche decine di euro/mese. Oltre, spendi senza ricevere nulla.',
 ana3='<span class="em">3. Il costo nascosto dello staking.</span> Bloccare un token volatile è una scommessa: se scende, la perdita mangia il «cashback». Rischio mai presente nel numero grande.',
 ana_concl='Conclusione: l\'unico numero che conta è il <span class="em">tasso garantito, senza condizioni e senza staking</span> — proprio quello che misura il nostro indice di realtà.',
 take_sub="Da ricordare", take_h2="4 riflessi prima di scegliere",
 take=["<b>Ignora il numero grande.</b> Cerca il tasso <em>senza condizioni</em>: senza staking, livello o tetto. In media ne prenderai un terzo.",
       "<b>Verifica che ci sia cashback</b> — e in quale valuta. Una carta su due non ne paga.",
       "<b>Il gratis è la norma.</b> Pagare 151–1 000 €/anno conviene solo con spesa molto alta — calcola la soglia.",
       "<b>Pretendi freschezza.</b> Tassi e disponibilità cambiano in fretta, e le carte spariscono. Un dato del 2025 è già sospetto."],
 faq_sub="Domande frequenti", faq_h2="FAQ",
 faq=[("Il cashback delle carte crypto è una bugia?","No, ma è un tetto teorico. Il «fino al X %» presuppone quasi sempre condizioni. In media solo il 31 % è accessibile senza staking."),
      ("Quale carta ha il miglior cashback reale?","Alcune pagano un 2–3 % affidabile (Nexo, Bitpanda, Crypto.com Frosted Rose Gold). Vedi il nostro <a href=\"https://topcryptocards.eu/it/carta-cripto-cashback\">comparatore cashback</a>."),
      ("Bisogna fare staking per il cashback?","Raramente — solo l'8 % lo richiede. Conta di più un cashback incondizionato e in valuta non volatile."),
      ("I dati sono aggiornati?","Sì. Dalla base TopCryptoCards verificata a mano, aggiornata di continuo. Ultima verifica: 17 agosto 2026.")],
 meth_sub="Metodologia", meth_h2="Come abbiamo contato",
 meth='Dati dalla base <span class="em">TopCryptoCards</span> al 17/08/2026: 93 carte, verificate a mano su 7 mercati (FR, BE, DE, AT, ES, IT, UK). «Pubblicizzato» = tasso massimo dell\'emittente; «reale» = accessibile senza staking. Comparatore indipendente. Nessuna carta sale in classifica in cambio di commissione.',
 cite='Citare: «Secondo lo studio 2026 di TopCryptoCards (93 carte crypto europee), le carte pagano in media solo il 31 % del cashback che pubblicizzano, e una su due non ne offre alcuno. Il divario più ampio è di Bleap: 20 % pubblicizzato, 1 % reale.»',
 f_home="Home", f_cmp="Comparatore", f_cash="Carte cashback", f_fees="Indice costi",
)

def build(lang, d):
    u=url(lang); cur=d["cur"]; loc=d["loc"]
    barsHtml, legHtml = bars(d["leg_adv"], d["leg_real"])
    tableHtml = table(d["th"], d["stk"])
    stats="".join(f'<div class="stat"><div class="n {c}">{n}</div><div class="l">{l}</div></div>' for c,n,l in d["stats"])
    honest="".join(f'<div class="h"><div class="r">{r}</div><div class="n">{t}</div></div>' for r,t in d["honest"])
    opts="".join(f'<option value="{v}">{nm} ({d["adv_word"]} {v.split(",")[0]}%)</option>'
                 for v,nm in [("20,1","Bleap Card"),("10,2","Bybit Card"),("9,3","Plutus Card"),
                              ("8,1","COCA Visa Card"),("6,1","Uphold Card"),("5,3","Crypto.com Frosted Rose Gold")])
    takes="".join(f"<li>{t}</li>" for t in d["take"])
    faqs="".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q,a in d["faq"])
    dz=donut(51,"var(--amber)","var(--cyan)","51%",d["oc_l1"],d["oc_l2"])
    df=donut(95,"var(--green)","var(--red)","95%",d["fees_l1"],d["fees_l2"],"var(--green)")
    dn=donut(75,"var(--cyan)","var(--violet)","Visa<br>75%",d["leg_adv"] and "Visa","Mastercard","var(--cyan)","16px")
    dn=donut(75,"var(--cyan)","var(--violet)","Visa<br>75%","Visa","Mastercard","var(--cyan)","16px")
    market_box = (f'<div class="box-uk">{d["market_html"]}</div>')
    footer_links = "".join(f'<a href="{h}">{t}</a>' for h,t in [
        (HOME[lang], d["f_home"]), (CMP[lang], d["f_cmp"]),
        (f'{BASE}{HOME[lang]}/', d["f_cash"]) if False else (d.get("cash_href", HOME[lang]), d["f_cash"]),
    ])
    # footer links (home, compare, cashback, fees, other langs)
    cash_href={"de":"/de/krypto-karte-cashback","es":"/es/tarjeta-cripto-cashback","it":"/it/carta-cripto-cashback"}[lang]
    fees_href={"de":"/de/krypto-karten-gebuehren","es":"/es/tarifas-tarjetas-crypto","it":"/it/tariffe-carte-crypto"}[lang]
    fl=[(HOME[lang],d["f_home"]),(CMP[lang],d["f_cmp"]),(f"{BASE}{cash_href}",d["f_cash"]),
        (f"{BASE}{fees_href}",d["f_fees"]),(url("fr"),"FR"),(url("en"),"EN")]
    footer_links="".join(f'<a href="{h if h.startswith("http") else BASE+h}">{t}</a>' for h,t in fl)
    js=(f"function money(n){{return '{cur}'+Math.round(n).toLocaleString('{loc}');}}")
    schema_desc=d["desc"].replace('"',"'")
    return f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{d["title"]}</title>
<meta name="description" content="{d["desc"]}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{u}">
{HREFLANG}<meta property="og:type" content="article">
<meta property="og:title" content="{d["title"]}"><meta property="og:description" content="{d["og_desc"]}">
<meta property="og:url" content="{u}"><meta property="og:image" content="{BASE}/og-default.jpg">
<meta property="og:site_name" content="TopCryptoCards">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{d["title"]}">
<meta name="twitter:description" content="{d["og_desc"]}"><meta name="twitter:image" content="{BASE}/og-default.jpg">
<link rel="icon" type="image/png" href="/logo-small.png">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Article","headline":"{d["title"]}","description":"{schema_desc}","image":"{BASE}/og-default.jpg","datePublished":"2026-08-17","dateModified":"2026-08-17","inLanguage":"{lang}","author":{{"@type":"Organization","name":"TopCryptoCards","url":"{BASE}"}},"publisher":{{"@type":"Organization","name":"TopCryptoCards","url":"{BASE}","logo":{{"@type":"ImageObject","url":"{BASE}/logo.png"}}}},"mainEntityOfPage":{{"@type":"WebPage","@id":"{u}"}}}}</script>
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Dataset","name":"{d["title"]}","description":"{schema_desc}","url":"{u}","inLanguage":"{lang}","creator":{{"@type":"Organization","name":"TopCryptoCards","url":"{BASE}"}},"publisher":{{"@type":"Organization","name":"TopCryptoCards","url":"{BASE}"}},"license":"https://creativecommons.org/licenses/by/4.0/","dateModified":"2026-08-17"}}</script>
<style>{CSS}</style>
</head>
<body>
<h2 class="sr-only">{d["ri_h2"]}</h2>
<nav class="nav"><div class="wrap">
  <a class="brand" href="{HOME[lang]}"><img src="/logo-small.png" alt="TopCryptoCards">TopCrypto<span class="c">Cards</span></a>
  <a class="cta" href="{CMP[lang]}">{d["f_cmp"]} →</a>
</div></nav>
<header class="hero"><div class="wrap">
  <div class="kicker">{d["kicker"]}</div>
  <h1>{d["h1"]}</h1>
  <p class="lede">{d["lede"]}</p>
  <div class="meta">{d["meta"]}</div>
  <div class="stats">{stats}</div>
</div></header>
<section><div class="wrap"><h2><span class="sub">{d["ri_sub"]}</span>{d["ri_h2"]}</h2>
  <div class="bigstat"><div class="huge">31%</div><div class="t">{d["ri_big"]}</div></div>
  <p>{d["ri_body"]}</p></div></section>
<section><div class="wrap"><h2><span class="sub">{d["rank_sub"]}</span>{d["rank_h2"]}</h2>
  <p>{d["rank_intro"]}</p>
  <div class="card"><h4>{d["bars_title"]}</h4><div class="cap">{d["bars_cap"]}</div>
    <div class="bars">{barsHtml}</div>{legHtml}</div>
  {tableHtml}
  <p style="font-size:13px;color:var(--muted)">{d["table_note"]}</p></div></section>
<section><div class="wrap"><h2><span class="sub">{d["calc_sub"]}</span>{d["calc_h2"]}</h2>
  <p>{d["calc_intro"]}</p>
  <div class="calc"><div class="row">
    <div class="field"><label>{d["calc_card"]}</label><select id="card">{opts}</select></div>
    <div class="field"><label>{d["calc_spend"]}: <output id="spendOut"></output></label>
      <input type="range" id="spend" min="100" max="5000" step="100" value="1000"></div></div>
    <div class="result">
      <div class="box promise"><div class="big" id="pv"></div><div class="lbl">{d["calc_pl"]}</div></div>
      <div class="box real"><div class="big" id="rv"></div><div class="lbl">{d["calc_rl"]}</div></div></div>
    <div class="verdict" id="vd"></div></div></div></section>
<section><div class="wrap"><h2><span class="sub">{d["market_sub"]}</span>{d["market_h2"]}</h2>{market_box}</div></section>
<section><div class="wrap"><h2><span class="sub">{d["honest_sub"]}</span>{d["honest_h2"]}</h2>
  <p>{d["honest_intro"]}</p><div class="honest">{honest}</div>
  <p style="margin-top:16px">{d["honest_lesson"]}</p></div></section>
<section><div class="wrap"><h2><span class="sub">{d["oc_sub"]}</span>{d["oc_h2"]}</h2>
  <div class="grid2"><div><p>{d["oc_p1"]}</p><p>{d["oc_p2"]}</p></div>
  <div class="donuts">{dz}</div></div></div></section>
<section><div class="wrap"><h2><span class="sub">{d["fees_sub"]}</span>{d["fees_h2"]}</h2>
  <div class="grid2"><div class="donuts">{df}</div>
  <div><p>{d["fees_p1"]}</p><p>{d["fees_p2"]}</p></div></div></div></section>
<section><div class="wrap"><h2><span class="sub">{d["net_sub"]}</span>{d["net_h2"]}</h2>
  <div class="grid2"><div class="donuts">{dn}</div>
  <div><p>{d["net_p1"]}</p><p>{d["net_p2"]}</p></div></div></div></section>
<section><div class="wrap"><h2><span class="sub">{d["token_sub"]}</span>{d["token_h2"]}</h2>
  <p>{d["token_p1"]}</p><p>{d["token_p2"]}</p></div></section>
<section><div class="wrap"><h2><span class="sub">{d["ana_sub"]}</span>{d["ana_h2"]}</h2>
  <p>{d["ana_intro"]}</p><p>{d["ana1"]}</p><p>{d["ana2"]}</p><p>{d["ana3"]}</p><p>{d["ana_concl"]}</p></div></section>
<section><div class="wrap"><h2><span class="sub">{d["take_sub"]}</span>{d["take_h2"]}</h2><ul class="take">{takes}</ul></div></section>
<section><div class="wrap"><h2><span class="sub">{d["faq_sub"]}</span>{d["faq_h2"]}</h2><div class="faq">{faqs}</div></div></section>
<section><div class="wrap"><h2><span class="sub">{d["meth_sub"]}</span>{d["meth_h2"]}</h2>
  <p>{d["meth"]}</p><div class="cite">{d["cite"]} (<a href="{u}">topcryptocards.eu</a>)</div></div></section>
<footer><div class="wrap"><div class="links">{footer_links}</div>
  © 2026 TopCryptoCards. Not financial advice.</div></footer>
<script>
var card=document.getElementById('card'),spend=document.getElementById('spend'),
 sO=document.getElementById('spendOut'),pv=document.getElementById('pv'),rv=document.getElementById('rv'),vd=document.getElementById('vd');
{js}
function calc(){{var p=card.value.split(','),adv=+p[0],real=+p[1],s=+spend.value;
 sO.textContent=money(s);var yr=s*12,pr=yr*adv/100,go=yr*real/100;
 pv.textContent=money(pr);rv.textContent=money(go);
 vd.innerHTML='{d["calc_vpre"]}'+money(pr-go)+'{d["calc_vpost"]}';}}
card.addEventListener('change',calc);spend.addEventListener('input',calc);calc();
</script>
</body></html>'''

os.makedirs(OUT, exist_ok=True)
for lang in ["de","es","it"]:
    p=os.path.join(OUT, SLUG[lang]+".html")
    open(p,"w",encoding="utf-8").write(build(lang, clean_dict(C[lang])))
    print("écrit :", os.path.relpath(p))
print("OK")
