# Instructions de Configuration - Hugging Face API

Ce guide vous aide à configurer Hugging Face pour générer automatiquement des images hero pour vos articles de blog.

## Aperçu rapide

1. Créez un compte Hugging Face gratuit
2. Générez un token API
3. Ajoutez le token comme secret Supabase
4. Générez les images via l'interface admin
5. Profitez des images sur votre blog !

---

## Configuration détaillée

### Étape 1 : Créer un compte Hugging Face

#### Via le site web :

```
1. Allez sur https://huggingface.co
2. Cliquez sur "Sign Up" (en haut à droite)
3. Remplissez les informations :
   - Email (confirmez-le)
   - Nom d'utilisateur
   - Mot de passe
4. Confirmez votre adresse email
```

**Résultat** : Vous avez un compte Hugging Face actif.

---

### Étape 2 : Générer un token API

#### Aller à la page des tokens :

```
1. Connectez-vous à https://huggingface.co
2. Cliquez sur votre profil (en haut à droite)
3. Cliquez sur "Settings"
4. Cliquez sur "Access Tokens" dans le menu de gauche
```

#### Créer un nouveau token :

```
1. Cliquez sur le bouton "New token"
2. Remplissez :
   - Token name : "CryptoCardCompare" ou autre
   - Type : "Read" (lecture seule - idéal pour la sécurité)
   - Expiration : Laissez vide ou définissez une date future
3. Cliquez "Create token"
```

#### Copier le token :

```
- Le token apparaît sur l'écran : hf_xxxxxxxxxxxxxxxxxxxxx
- Cliquez sur l'icône de copie
- Gardez-le à proximité !
```

**Important** : Gardez ce token confidentiel. Ne le partagez jamais !

---

### Étape 3 : Ajouter le token à Supabase

#### Accéder aux secrets Supabase :

```
1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Dans la barre de gauche, cliquez sur "Edge Functions"
4. Cliquez sur l'onglet "Settings"
```

#### Ajouter le secret :

```
1. Trouvez la section "Secrets"
2. Cliquez sur "New secret" ou "+ New"
3. Remplissez :
   - Name : HF_API_KEY (exactement)
   - Value : Collez votre token (ex: hf_xxxxx...)
4. Cliquez "Save" ou "Add secret"
5. Attendez 1-2 secondes pour la synchronisation
```

#### Vérifier la configuration :

```
1. La page doit afficher "HF_API_KEY" dans la liste des secrets
2. S'il n'apparaît pas, rechargez la page
3. S'il apparaît, vous êtes prêt !
```

---

### Étape 4 : Tester la génération d'images

#### Via l'interface admin :

```
1. Allez sur votre site : https://votre-site.com/admin-hero-images
2. Connectez-vous avec votre mot de passe admin
3. Vous devez voir la liste de vos articles
4. Cliquez sur "Générer" pour un article, ou "Générer toutes les images"
5. Attendez quelques minutes...
```

#### Observez la progression :

```
- État "Génération..." : Le système génère l'image
- État "Succès" : L'image a été générée et sauvegardée
- État "Erreur" : Quelque chose s'est mal passé (voir dépannage)
```

#### Vérifiez sur le blog :

```
1. Allez sur https://votre-site.com/blog
2. Les images hero devraient s'afficher sur les cartes
3. Elles apparaîtront progressivement au fur et à mesure
```

---

## Dépannage

### "HF_API_KEY not configured"

**Cause** : Le secret Supabase n'a pas été ajouté ou n'a pas synchronisé.

**Solution** :
```
1. Vérifiez que vous avez ajouté le secret dans Supabase Edge Functions > Settings
2. Vérifiez que le nom du secret est exactement "HF_API_KEY" (majuscules/minuscules)
3. Attendez 1-2 minutes pour la synchronisation
4. Rechargez votre navigateur (Ctrl+F5 ou Cmd+Shift+R)
5. Réessayez la génération
```

### "HF API error: Unauthorized"

**Cause** : Le token Hugging Face est invalide ou expiré.

**Solution** :
```
1. Allez sur https://huggingface.co/settings/tokens
2. Vérifiez que votre token n'a pas expiré
3. Vérifiez que vous avez copié le token complet (sans espaces)
4. Générez un nouveau token si nécessaire
5. Mettez à jour le secret Supabase avec le nouveau token
6. Attendez 1-2 minutes
7. Réessayez
```

### "Failed to generate image" ou timeout

**Cause** : Le modèle Hugging Face redémarre (normal au premier appel).

**Solution** :
```
1. C'est attendu - le modèle met un moment à démarrer
2. Le code réessaie automatiquement 3 fois avec délai
3. Attendez 5-10 minutes
4. Réessayez en cliquant "Générer" à nouveau
5. Si ça continue, vérifiez votre token Hugging Face
```

### Les images ne s'affichent pas sur le blog

**Cause** : Plusieurs possibilités...

**Solution** :
```
1. Vérifiez que les images ont bien été générées
   - Allez sur /admin-hero-images
   - Vérifiez que le statut est "Succès"
   
2. Vérifiez la base de données
   - Dans Supabase, allez sur "SQL Editor"
   - Exécutez : SELECT slug, image_hero FROM blog_posts LIMIT 5;
   - Vérifiez que les colonnes image_hero contiennent des images
   
3. Vérifiez votre navigateur
   - Ouvrez la console (F12)
   - Cherchez les erreurs en rouge
   - Rechargez la page avec Ctrl+F5
```

### Erreur lors de la génération

**Cause** : Plusieurs possibilités...

**Solution** :
```
1. Consultez les logs Supabase :
   - Allez sur Supabase Dashboard
   - Edge Functions > generate-hero-image
   - Cliquez sur "Logs"
   - Cherchez les messages d'erreur
   
2. Vérifiez votre token Hugging Face
   - Allez sur https://huggingface.co/settings/tokens
   - Vérifiez que le token a le type "Read"
   
3. Essayez avec un article à la fois
   - Pas "Générer toutes les images"
   - Juste un article pour tester
```

---

## Configuration alternative (CLI)

Si vous préférez la ligne de commande :

```bash
# Installer Supabase CLI si nécessaire
npm install -g supabase

# Ajouter le secret
supabase secrets set HF_API_KEY=hf_xxxxxxxxxxxxx

# Vérifier
supabase secrets list
```

---

## Modèles disponibles

Vous pouvez changer de modèle en éditant le fichier :
`supabase/functions/generate-hero-image/index.ts`

Ligne à modifier :
```typescript
const model = "black-forest-labs/FLUX.1-pro";
```

Modèles recommandés :
- **FLUX.1-pro** : Meilleure qualité (actuellement utilisé)
- **FLUX.1-dev** : Légèrement plus rapide
- **stable-diffusion-3.5-large** : Alternative réputée

Après modification, redéployez :
```bash
# Redéployer la fonction
supabase functions deploy generate-hero-image
```

---

## Questions fréquentes

### Combien ça coûte ?

**Gratuit !** Hugging Face offre un accès gratuit à leurs modèles d'inférence pour la plupart des utilisateurs.

Pour un usage à très grande échelle, consultez [Hugging Face Pricing](https://huggingface.co/pricing).

### Peut-on générer d'autres images ?

Oui ! Vous pouvez modifier la fonction pour générer :
- Des bannières
- Des thumbnails
- Des illustrations de produits
- Etc.

Consultez la documentation Hugging Face pour plus de détails.

### Les tokens Hugging Face expirent-ils ?

Par défaut, non. Mais vous pouvez définir une expiration lors de la création.

Consultez votre compte Hugging Face pour vérifier l'état de votre token.

### Puis-je utiliser un modèle différent ?

Oui ! Modifiez simplement la ligne dans `generate-hero-image/index.ts` :

```typescript
const model = "votre-modele-ici";
```

### Comment arrêter la génération ?

Vous ne pouvez pas arrêter une génération en cours, mais elle s'arrêtera d'elle-même après quelques minutes si elle échoue.

---

## Aide supplémentaire

- **Documentation Hugging Face** : https://huggingface.co/docs
- **Supabase Edge Functions** : https://supabase.com/docs/guides/functions
- **Consulter les logs** : Supabase Dashboard > Edge Functions > Logs

---

## Résumé

Vous êtes maintenant prêt à :
✓ Générer des images automatiquement
✓ Les afficher sur votre blog
✓ Les stocker en base de données
✓ Les personnaliser

Profitez de votre blog amélioré !
