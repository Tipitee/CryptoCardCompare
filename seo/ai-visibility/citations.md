# AI Citation Tracking — où ChatGPT, Perplexity, Gemini nous citent
PREMIER RUN = baseline. Ensuite chaque mercredi (automations/wednesday-citations.sh).
Inputs : buyer-queries.csv, your-site/brand-voice.md, la semaine précédente dans competitors/share-of-voice.csv.

---

Prends chaque requête de ai-visibility/buyer-queries.csv. Pour chacune, sur ChatGPT, Perplexity et Gemini (dans la langue de la requête — on est un site 7 marchés, tester en FR/DE/EN au minimum) :

1. Quelles marques/sites sont cités ou recommandés, dans quel ordre ? (Perplexity cite ses sources en ligne — noter QUELLE page gagne la citation, pas seulement quelle marque. Nos concurrents habituels : cryptocardindex.com, Koinly, Journal du Coin, Cryptonaute, blogs de vendors.)
2. Apparaissons-nous ? Cité / mentionné en passant / absent — et à quelle position dans la réponse ?
3. Quand on n'apparaît pas : quelle page gagne, et qu'a-t-elle que nous n'avons pas ? (Souvent : page comparaison dédiée, réponse directe en haut de page, mentions tierces — Reddit inclus, structure propre.)
4. Runs hebdo uniquement : comparer à la semaine passée. Requêtes gagnées, perdues, mouvements. Logger dans competitors/share-of-voice.csv.

OUTPUT :
- Score de visibilité : requêtes où on apparaît / total, en % (global + par langue)
- Table : requête | plateforme | qui gagne | notre statut | pourquoi ils gagnent
- Le pattern commun des pages gagnantes
- UNE action recommandée, < 4 h de travail

RÈGLES : ne jamais lisser une baisse. Si une perte ressemble à de la variance de modèle, écrire « à vérifier au prochain run » — ne pas deviner. Être brutal : si on est invisibles, le dire. (La plupart des marques font < 20 % au premier run.)
