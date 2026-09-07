# AI Perception Check — 2026-09-02 (mensuel, 1er mercredi)

Méthode : requêtes de marque directes ("What is TopCryptoCards", "TopCryptoCards comparateur cartes crypto avis") via WebSearch, FR + EN. Comparé à `your-site/brand-voice.md` → "How AI should describe us".

| Dimension | Ce que renvoie l'IA (requête de marque directe) | Match | Cause de l'écart |
|---|---|---|---|
| CATEGORY | « plateforme de comparaison de cartes crypto / comparateur », pas exchange ni blog | **Oui** | Le site se classe #1 sur son propre nom, catégorie bien lue |
| DIFFERENTIATOR | cite « 84 cartes, 10 critères, 15+ cryptos, 100% gratuit, quiz 6 questions » | **Partiel** | L'IA reprend un chiffre daté (84 vs 90+) et **ne mentionne pas** l'angle « 7 marchés européens × dispo par pays × frais vérifiés à la main » — le vrai différenciateur du brand-voice n'est pas repris |
| AUDIENCE | « utilisateurs européens, en particulier français / UE » | **Oui** | Correct |
| TRUST | « 100% gratuit, sans création de compte » | **Partiel** | L'indépendance et la méthodologie (comparatif indépendant, commissions d'affiliation transparentes) ne sont pas citées — l'IA parle de « gratuit » mais pas de « indépendant » |

**Verdict perception :** la catégorie est bonne (on n'est PAS classés « blog crypto »), mais la perception ne mord que sur les requêtes de marque. Le différenciateur clé (7 marchés + frais vérifiés + dispo par pays) ne remonte pas, et l'IA cite un compte de cartes obsolète (84).

**Correction prioritaire perception :** rendre la phrase-étalon du brand-voice (« comparateur indépendant … 90+ cartes … 7 marchés européens … frais vérifiés à la main et mis à jour en continu ») littéralement présente et unique dans le `<meta name="description">` de la home + un bloc "À propos / méthodologie" en tête de home, avec le nombre de cartes généré dynamiquement depuis Supabase (plus de "84" figé). Les modèles reprennent mot pour mot ce qui est en haut de page.
