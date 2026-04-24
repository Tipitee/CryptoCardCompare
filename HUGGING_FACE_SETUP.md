# Configuration Hugging Face API

Ce guide vous aide à configurer Hugging Face pour la génération automatique d'images hero sur vos articles de blog.

## Étape 1 : Créer un compte Hugging Face

1. Allez sur [huggingface.co](https://huggingface.co)
2. Cliquez sur "Sign Up" (en haut à droite)
3. Remplissez le formulaire :
   - Email
   - Nom d'utilisateur (username)
   - Mot de passe
4. Confirmez votre email via le lien reçu

## Étape 2 : Générer un token d'accès API

1. Connectez-vous à votre compte Hugging Face
2. Allez dans **Settings** (cliquez sur votre profil en haut à droite)
3. Sélectionnez **Access Tokens** dans le menu de gauche
4. Cliquez sur **"New token"** (bouton bleu)
5. Configurez le token :
   - **Token name** : `CryptoCardCompare` (ou votre nom)
   - **Type** : `Read` (lecture seule - c'est tout ce dont vous avez besoin)
   - **Expiration** : Laissez vide ou définissez une date future
6. Cliquez **"Create token"**
7. **Copiez le token** (format : `hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - Gardez-le à proximité - vous l'utiliserez à l'étape suivante
   - Ne le partagez jamais !

## Étape 3 : Ajouter le secret à Supabase

### Via le Dashboard Supabase

1. Allez sur votre [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Edge Functions** (dans la barre de gauche)
4. Cliquez sur **Settings** (onglet en haut)
5. Trouvez la section **Secrets**
6. Cliquez sur **"New secret"** ou **"Add secret"**
7. Remplissez les champs :
   - **Name** : `HF_API_KEY`
   - **Value** : Collez votre token Hugging Face (ex: `hf_xxxxxx...`)
8. Cliquez **Save** ou **"Add secret"**
9. Attendez quelques secondes pour que le secret soit synchronisé

### Via la CLI Supabase (alternative)

```bash
supabase secrets set HF_API_KEY=hf_xxxxxxxxxxxxx
```

## Étape 4 : Vérifier la configuration

Pour vérifier que le secret est bien configuré :

1. Dans le Supabase Dashboard
2. Allez dans **Edge Functions**
3. Cliquez sur la fonction `generate-hero-image`
4. Vérifiez que `HF_API_KEY` apparaît dans la liste des secrets

## Étape 5 : Tester la génération

### Via l'interface Admin

1. Allez sur votre site et accédez à `/admin-blog`
2. Connectez-vous avec votre mot de passe admin
3. Cliquez sur **"Générer Images Hero"**
4. Cliquez sur **"Générer toutes les images"** ou sélectionnez des articles individuels
5. Observez la progression
6. Les images devraient s'afficher sur la page Blog

### Via la page Blog

1. Allez sur `/blog`
2. Vérifiez que les images hero s'affichent sur les cartes d'articles
3. Les images apparaîtront progressivement au fur et à mesure de leur génération

## Modèles disponibles

La configuration utilise actuellement **FLUX.1-pro** (meilleure qualité).

Vous pouvez changer de modèle en éditant `supabase/functions/generate-hero-image/index.ts` :

```typescript
const model = "black-forest-labs/FLUX.1-pro"; // Changez cette ligne
```

Modèles recommandés :
- `black-forest-labs/FLUX.1-pro` - Meilleure qualité, gratuit
- `black-forest-labs/FLUX.1-dev` - Légèrement plus rapide
- `stabilityai/stable-diffusion-3.5-large` - Alternative réputée

## Dépannage

### Erreur : "HF_API_KEY not configured"

**Cause** : Le secret n'a pas été ajouté ou n'a pas synchronisé.

**Solution** :
1. Vérifiez que vous avez bien ajouté le secret dans Supabase Edge Functions
2. Attendez 1-2 minutes pour la synchronisation
3. Rechargez la page admin
4. Réessayez

### Erreur : "HF API error: Unauthorized"

**Cause** : Le token Hugging Face est invalide ou expiré.

**Solution** :
1. Vérifiez que vous avez copié le token complet (sans espaces)
2. Allez sur votre compte Hugging Face et vérifiez que le token n'a pas expiré
3. Générez un nouveau token si nécessaire
4. Mettez à jour le secret Supabase avec le nouveau token

### Timeout ou erreur 503

**Cause** : Le modèle Hugging Face redémarre (comportement normal au démarrage).

**Solution** : C'est attendu. Le code réessaiera automatiquement 3 fois avec délai. Attendez quelques minutes et réessayez.

### Les images ne s'affichent pas

**Cause** : Les images sont stockées en base64 qui peuvent être volumineuses.

**Solution** :
1. Vérifiez la colonne `image_hero` dans votre table `blog_posts`
2. Vérifiez la console de navigateur pour les erreurs réseau
3. Assurez-vous que les images ont bien été générées via l'interface admin

## Quotas et limites

Hugging Face offre des quotas généreux gratuitement :
- **Appels API** : Illimités pour les utilisateurs gratuits
- **Bande passante** : Suffisante pour la plupart des projets
- **Stockage** : Les images sont stockées en base64 dans votre Supabase

Pour plus d'informations, consultez [Hugging Face Pricing](https://huggingface.co/pricing).

## Coûts

**Gratuit !** Hugging Face offre un accès gratuit à leurs modèles d'inférence pour les utilisateurs non commerciaux.

Pour un usage commercial, consultez leur documentation de pricing.

## Besoin d'aide ?

- [Documentation Hugging Face](https://huggingface.co/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- Consultez les logs de votre fonction dans le Supabase Dashboard

---

Une fois configuré, vous pouvez générer des images automatiquement pour tous vos articles !
