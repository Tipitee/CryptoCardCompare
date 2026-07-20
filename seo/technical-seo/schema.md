# Schema Audit — rich results + citations IA
Trimestriel + à chaque nouvelle page. Input : liste d'URLs.

---

Vérifier ces pages : [liste d'URLs — commencer par les money pages de your-site/overview.md]

Pour chaque page, deux audits :

SCHEMA : quel structured data existe, que manque-t-il qui rapporterait des rich results ou aiderait les modèles IA (FAQPage, FinancialProduct, Article+Person, Organization+sameAs, BreadcrumbList, Dataset — uniquement si pertinent). Écrire le JSON-LD prêt à coller, avec les vraies données du projet (cartes depuis Supabase, auteur depuis src/data/authors.ts). NB : le site a déjà une bonne couverture — chercher les trous (nouvelles pages, pages alternatives, outils) plutôt que refaire l'existant.

AI-READABILITY : les LLM extraient depuis les pages qui répondent proprement. Vérifier : la page donne-t-elle sa réponse clé dans les 100 premiers mots, ou après 6 paragraphes d'échauffement ? Les affirmations sont-elles spécifiques et citables (chiffres, dates de vérification, noms) ou vagues ? Y a-t-il une FAQ avec de vraies questions (depuis ai-visibility/buyer-queries.csv) et des réponses directes ? Les ancres (#frais, #cashback) sont-elles stables ?

OUTPUT par page : schema actuel | JSON-LD à ajouter | 3 réécritures max — chacune : passage actuel, réécriture AI-readable, une ligne de pourquoi.
