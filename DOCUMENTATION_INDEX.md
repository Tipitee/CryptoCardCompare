# Documentation Index - Hugging Face Setup

Vue d'ensemble de tous les guides et ressources pour configurer et utiliser Hugging Face API.

## Guides rapides

### Pour commencer immédiatement
- **[README_HUGGING_FACE.md](./README_HUGGING_FACE.md)** - 3 min
  - TL;DR : Les 4 étapes essentielles
  - Commandes utiles
  - Tableau des erreurs courantes

### Configuration détaillée étape par étape
- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - 15 min
  - Créer un compte Hugging Face
  - Générer un token API
  - Ajouter le secret à Supabase
  - Tester la génération
  - Dépannage complet avec solutions

### Alternative : Configuration technique avancée
- **[HUGGING_FACE_SETUP.md](./HUGGING_FACE_SETUP.md)** - 10 min
  - Étapes détaillées avec screenshots mentales
  - Configuration CLI alternative
  - Modèles disponibles et configuration
  - Quotas et limites
  - FAQ technique

## Guides techniques

### Architecture générale du projet
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 20 min
  - Stack technologique
  - Structure du projet
  - Flux de données
  - Base de données
  - Edge Functions détaillées
  - Sécurité et RLS
  - Roadmap future

### Résumé d'implémentation
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - 5 min
  - Ce qui a été fait
  - Prochaines étapes
  - Points clés à retenir
  - Vérification finale

## Organisation des fichiers

```
Documentation/
├── README_HUGGING_FACE.md ...................... Quick start (3 min)
├── SETUP_INSTRUCTIONS.md ...................... Configuration (15 min)
├── HUGGING_FACE_SETUP.md ...................... Détails (10 min)
├── ARCHITECTURE.md ............................ Technique (20 min)
├── IMPLEMENTATION_SUMMARY.md .................. Résumé (5 min)
├── DOCUMENTATION_INDEX.md (ce fichier) ........ Navitation
├── .env.example ............................... Template variables
└── README.md (original du projet) ............ Info générale
```

## Choisir le bon guide

### Je veux juste que ça marche
→ **[README_HUGGING_FACE.md](./README_HUGGING_FACE.md)** (3 min)

### Je veux suivre les étapes en détail
→ **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** (15 min)

### J'ai une erreur et je ne sais pas quoi faire
→ **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Section "Dépannage"

### Je veux comprendre comment ça fonctionne techniquement
→ **[ARCHITECTURE.md](./ARCHITECTURE.md)** (20 min)

### Je veux modifier les modèles ou la configuration
→ **[HUGGING_FACE_SETUP.md](./HUGGING_FACE_SETUP.md)** - Section "Modèles"

### Je veux savoir ce qui a été fait
→ **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** (5 min)

## Résumé des étapes

```
1. Créer compte Hugging Face
   Temps: 5 min
   Où: https://huggingface.co
   Guide: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Étape 1

2. Générer token API
   Temps: 2 min
   Où: https://huggingface.co/settings/tokens
   Guide: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Étape 2

3. Ajouter secret Supabase
   Temps: 3 min
   Où: app.supabase.com > Edge Functions > Settings
   Guide: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Étape 3

4. Tester la génération
   Temps: 5-10 min
   Où: /admin-hero-images
   Guide: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Étape 4

5. Vérifier le blog
   Temps: 1 min
   Où: /blog
   Guide: Regarder les images hero apparaître
```

## FAQ rapides

**Q: C'est gratuit ?**
A: Oui ! Hugging Face offre l'accès gratuit. Voir [README_HUGGING_FACE.md](./README_HUGGING_FACE.md)

**Q: Combien de temps ça prend de configurer ?**
A: 15-20 minutes total. Voir [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)

**Q: Qu'est-ce qu'un token API ?**
A: Une clé d'accès pour l'API Hugging Face. Voir [HUGGING_FACE_SETUP.md](./HUGGING_FACE_SETUP.md)

**Q: Je veux changer le modèle d'images ?**
A: Modifiez le fichier `supabase/functions/generate-hero-image/index.ts`. Voir [ARCHITECTURE.md](./ARCHITECTURE.md)

**Q: Ça marche sur mobile ?**
A: Oui ! La génération fonctionne partout. L'interface admin est optimisée pour desktop.

**Q: Peux-je générer d'autres types d'images ?**
A: Oui ! Vous pouvez créer d'autres edge functions. Voir [ARCHITECTURE.md](./ARCHITECTURE.md)

**Q: Où voir les logs si ça ne marche pas ?**
A: Supabase Dashboard > Edge Functions > generate-hero-image > Logs

## Fichiers du projet

### Edge Functions
```
supabase/functions/
├── generate-hero-image/     ← Génération d'images (utilise HF_API_KEY)
│   └── index.ts
├── generate-article/        ← Génération d'articles
├── admin-blog/              ← Gestion admin
└── bulk-generate/           ← Génération en masse
```

### Frontend
```
src/
├── pages/
│   ├── AdminHeroImages.tsx  ← Interface de génération (améliorée)
│   ├── Blog.tsx             ← Page blog (améliée)
│   └── ...
├── components/              ← Composants réutilisables
├── lib/supabase.ts          ← Client Supabase
└── ...
```

### Configuration
```
.
├── .env                     ← Variables d'environnement (local)
├── .env.example             ← Template (committer ce fichier)
├── vite.config.ts           ← Config Vite
├── tailwind.config.js       ← Config Tailwind
└── tsconfig.json            ← Config TypeScript
```

## Variables d'environnement

### Frontend (.env)
```
VITE_SUPABASE_URL=...        # URL Supabase
VITE_SUPABASE_ANON_KEY=...   # Clé anon publique
```

### Edge Functions (Secrets Supabase)
```
HF_API_KEY=...               # Token Hugging Face (ce que vous devez ajouter)
ANTHROPIC_API_KEY=...        # Token Anthropic (déjà configuré)
ADMIN_SECRET=...             # Secret admin (déjà configuré)
```

## Modèles disponibles

Par défaut : **FLUX.1-pro**

Alternatives :
- FLUX.1-dev (plus rapide, qualité similaire)
- stable-diffusion-3.5-large (alternative réputée)

Pour changer : Modifiez `supabase/functions/generate-hero-image/index.ts`

Voir [HUGGING_FACE_SETUP.md](./HUGGING_FACE_SETUP.md) - Section "Modèles"

## Contacts et ressources

### Documentation officielle
- [Hugging Face](https://huggingface.co/docs)
- [Supabase](https://supabase.com/docs)
- [Deno](https://docs.deno.com/)

### Modèles recommandés
- [FLUX.1-pro](https://huggingface.co/black-forest-labs/FLUX.1-pro)
- [Stable Diffusion 3.5](https://huggingface.co/stabilityai/stable-diffusion-3.5-large)

### Support communautaire
- Discord Hugging Face
- Forum Supabase
- GitHub Issues

## Checklist de configuration

- [ ] Compte Hugging Face créé
- [ ] Token API généré
- [ ] Token copié (en sécurité)
- [ ] Secret HF_API_KEY ajouté à Supabase
- [ ] Secret synchronisé (1-2 secondes)
- [ ] Edge function déployée
- [ ] Première génération testée
- [ ] Images visibles sur /blog
- [ ] Profiter du résultat !

## Prochaines étapes après configuration

1. Générer les images de tous vos articles
2. Configurer Anthropic pour les prompts personnalisés
3. Explorer d'autres edge functions
4. Ajouter l'authentification utilisateur
5. Déployer en production

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) - Section "Roadmap"

---

**Dernière mise à jour** : 2026-04-21
**Version** : 1.0
**Status** : Complet et prêt pour la production
