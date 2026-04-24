# Image Generation - Quick Start Guide

Guide rapide pour générer les images hero de vos articles.

## Prérequis

1. **Token Hugging Face configuré**
   - Allez sur Supabase Dashboard > Edge Functions > Settings
   - Vérifiez que le secret `HF_API_KEY` est présent
   - Si absent, consultez [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)

## Étapes pour générer les images

### 1. Accéder à l'interface admin

```
Allez sur : /admin-hero-images
```

Ou cliquez sur le lien depuis le menu d'administration.

### 2. Connexion

- Entrez votre **mot de passe admin**
- Cliquez sur "Connexion"

### 3. Générer les images

**Option A : Générer un article à la fois**

1. Trouvez l'article dans la liste
2. Cliquez sur le bouton **"Générer"** (vert)
3. Attendez que le statut passe à **"Succès"** (vert)
4. L'image s'affiche dans l'aperçu

**Option B : Générer tous les articles**

1. Cliquez sur **"Générer toutes les images"** (en haut)
2. Confirmez la génération
3. Attendez que tous les articles soient traités
4. Les images s'affichent progressivement

### 4. Vérifier les images

1. Une fois générées, les images s'affichent en aperçu dans l'admin
2. Allez sur `/blog` pour voir les images en production
3. Les images "hero" apparaissent en haut des cartes d'articles

## Statuts possibles

| Statut | Couleur | Signification |
|--------|--------|---------------|
| (vide) | Gris | Non générée |
| Génération... | Bleu | En cours de création |
| Succès | Vert | Image générée et sauvegardée |
| Erreur | Rouge | Erreur - consultez le message |

## Dépannage

### "Génération..." ne finit jamais

**Cause** : Le modèle Hugging Face redémarre

**Solution** :
1. Attendez 2-3 minutes
2. Rechargez la page
3. Cliquez à nouveau sur "Générer"

### Erreur "HF_API_KEY not configured"

**Cause** : Le token Hugging Face n'a pas été ajouté à Supabase

**Solution** :
1. Allez sur Supabase Dashboard
2. Edge Functions > Settings
3. Vérifiez que `HF_API_KEY` est présent
4. Si absent, consultez [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)

### L'image ne s'affiche pas en aperçu

**Cause** : La génération est encore en cours

**Solution** :
1. Attendez quelques secondes
2. L'aperçu s'affichera quand l'image sera prête
3. Si rien ne s'affiche après 5 minutes, essayez à nouveau

### L'image ne s'affiche pas sur le blog

**Cause** : Plusieurs possibilités...

**Solution** :
1. Vérifiez que le statut dans l'admin est "Succès"
2. Rechargez la page blog (Ctrl+F5)
3. Vérifiez que l'aperçu dans l'admin fonctionne
4. Consultez les logs Supabase si le problème persiste

## FAQ

**Q: Combien de temps prend une génération ?**
A: 30 secondes à 2 minutes selon l'état du serveur Hugging Face

**Q: Peux-je générer les images à nouveau ?**
A: Oui ! Les images seront remplacées par les nouvelles

**Q: Qu'est-ce qu'un bon prompt pour les images ?**
A: Les prompts sont générés automatiquement par Claude basé sur le titre et l'extrait de l'article

**Q: Puis-je personnaliser le style des images ?**
A: Oui ! Consultez [HUGGING_FACE_SETUP.md](./HUGGING_FACE_SETUP.md) pour modifier les paramètres

## Conseils

1. **Générez les articles un par un d'abord** pour vérifier que tout fonctionne
2. **Attendez 2-3 minutes entre les générations** en masse pour ne pas surcharger l'API
3. **Vérifiez les images sur le blog** immédiatement après la génération
4. **Consultez les logs Supabase** si vous avez des doutes

## Besoin d'aide ?

- [Guide de configuration complet](./SETUP_INSTRUCTIONS.md)
- [Architecture technique](./ARCHITECTURE.md)
- [Documentation Hugging Face](https://huggingface.co/docs)

---

C'est aussi simple que ça ! Générez vos images et profitez de votre blog amélioré.
