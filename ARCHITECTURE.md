# Architecture du Projet - CryptoCardCompare

Vue d'ensemble de l'architecture et des composants principaux.

## Stack technologique

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS
- **Base de données** : Supabase (PostgreSQL)
- **Edge Functions** : Supabase Deno Runtime
- **Authentification** : Supabase Auth (optionnel)
- **AI/ML** :
  - Claude Opus 4.5 (Anthropic) - génération de prompts
  - FLUX.1-pro (Hugging Face) - génération d'images

## Structure du projet

```
project/
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── CardVisual.tsx
│   │   ├── Layout.tsx
│   │   └── ...
│   ├── pages/              # Pages React Router
│   │   ├── Blog.tsx        # Page blog avec articles
│   │   ├── BlogPost.tsx    # Article individuel
│   │   ├── AdminBlog.tsx   # Gestion des articles
│   │   ├── AdminHeroImages.tsx  # Génération d'images
│   │   └── ...
│   ├── lib/
│   │   └── supabase.ts     # Client Supabase et requêtes
│   ├── types/
│   │   ├── blog.ts         # Types TypeScript
│   │   └── card.ts
│   ├── utils/
│   │   ├── markdown.ts     # Parsing markdown
│   │   └── format.ts       # Utilitaires
│   ├── store/
│   │   └── useAppStore.ts  # État global (Zustand)
│   ├── index.css           # Styles globaux
│   └── main.tsx
│
├── supabase/
│   ├── functions/          # Edge Functions Deno
│   │   ├── generate-hero-image/    # Génération d'images
│   │   │   └── index.ts
│   │   ├── generate-article/       # Génération de contenu
│   │   └── admin-blog/             # Gestion admin
│   └── migrations/         # Migrations SQL
│       └── *.sql
│
├── public/                 # Assets statiques
├── dist/                   # Build output
├── .env                    # Variables d'environnement (ne pas committer)
├── .env.example            # Template .env
├── vite.config.ts          # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind
└── package.json
```

## Flux de données

### Génération d'images hero

```
Admin UI (/admin-hero-images)
    ↓
POST /functions/v1/generate-hero-image
    ↓
Edge Function (generate-hero-image)
    ├─ 1. Authentification (ADMIN_SECRET)
    ├─ 2. Génération de prompt (Claude API)
    ├─ 3. Génération d'image (Hugging Face)
    └─ 4. Sauvegarde en DB (Supabase)
    ↓
Blog page (/blog)
    ↓
Affichage des images hero
```

### Génération d'articles

```
Admin UI (/admin-blog)
    ↓
POST /functions/v1/generate-article
    ↓
Edge Function (generate-article)
    ├─ Génération de contenu (Claude API)
    └─ Sauvegarde en DB
    ↓
Blog page (/blog)
    ↓
Affichage des articles
```

## Base de données

### Tables principales

#### `blog_posts`
```sql
- id (uuid)
- slug (text, unique)
- title (text)
- excerpt (text)
- content (text) -- Markdown
- image_hero (text) -- URL ou base64
- tags (text[])
- meta_title (text)
- meta_description (text)
- published (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `crypto_cards`
```sql
- id (uuid)
- issuer (text)
- name (text)
- description (text)
- features (jsonb)
- image (text) -- URL ou base64
- colors (jsonb)
- created_at (timestamptz)
```

#### Autres tables
- `crypto_card_colors` - Palette de couleurs par carte
- `compare_sessions` - Historique des comparaisons

## Edge Functions

### `/generate-hero-image`

**Endpoint** : `POST /functions/v1/generate-hero-image`

**Authentification** : Header `X-Admin-Secret`

**Input** :
```typescript
{
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
}
```

**Process** :
1. Valide le secret admin
2. Génère un prompt optimisé (Claude)
3. Génère l'image (Hugging Face FLUX.1-pro)
4. Sauvegarde en base de données
5. Retourne l'image et le prompt

**Output** :
```typescript
{
  success: boolean;
  imageUrl: string; // data:image/jpeg;base64,...
  prompt: string;
}
```

**Erreurs** :
- 401 : Authentification échouée
- 500 : Erreur API ou base de données

### `/generate-article`

Similaire, génère le contenu des articles via Claude.

### `/admin-blog`

Gestion admin des articles (CRUD operations).

## Styles Tailwind

### Variables de couleur

```css
/* Couleurs principales */
--bg: #0f0f1e (noir)
--bg-elevated: #1a1a2e
--bg-card: #16213e (bleu très foncé)
--bg-border: #2d2d4a

/* Accents */
--cyan-accent: #00b8d4 (cyan)
--green-accent: #10b981 (vert)
--red-accent: #ef4444 (rouge)
```

### Classes réutilisables

```css
.btn-primary     /* Bouton principal */
.btn-secondary   /* Bouton secondaire */
.btn-ghost       /* Bouton transparent */
.card-surface    /* Carte avec borderRadius */
.input-field     /* Champ de saisie */
.chip            /* Badge/tag */
```

## Variables d'environnement

### Côté frontend (.env)

```
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Côté Edge Functions (Secrets Supabase)

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_URL
ADMIN_SECRET
ANTHROPIC_API_KEY
HF_API_KEY  <!-- Token Hugging Face pour génération d'images
```

## Row Level Security (RLS)

### Politiques principales

- **blog_posts** : Lecture publique, écriture admin uniquement
- **crypto_cards** : Lecture publique, écriture admin uniquement
- **compare_sessions** : Lecture/écriture propriétaire (basée auth)

## Performance

### Optimisations actuelles

- Lazy loading des images (`loading="lazy"`)
- Chunking Vite pour le code splitting
- Compression Gzip (via build)
- Caching côté client (React Query, Zustand)
- Retry logic pour API externes

### À améliorer

- Code splitting additionnel pour réduire bundle size
- Image optimization (compression, formats modernes)
- Service Worker pour offline support

## Déploiement

### Frontend

- Build : `npm run build`
- Deploy : Vercel, Netlify, Supabase Hosting, etc.
- Env : Variables Supabase exposées côté client (clé anon seulement)

### Edge Functions

- Deploy : `supabase functions deploy [name]`
- Secrets : Gérés via Supabase Dashboard
- Runtime : Deno (Edge Compute)

### Base de données

- Managed par Supabase
- Migrations : `supabase db push`
- Backups : Automatiques (Supabase)

## Sécurité

### Considérations principales

1. **Clés API** : Jamais exposées côté client
   - Clés admin stockées comme secrets Supabase
   - Clé anon publique est OK (permissions limitées)

2. **Authentification Admin** : Simple secret (améliorer en produit)
   - Idéal : Ajouter Supabase Auth avec roles admin

3. **CORS** : Configuré dans les Edge Functions
   - Inclut headers Supabase requis

4. **RLS** : Activé sur toutes les tables sensibles
   - Gère l'isolation des données

## Roadmap

- [ ] Authentification utilisateur complète
- [ ] Galerie utilisateur (sauvegarder les cartes favorites)
- [ ] Export PDF des comparaisons
- [ ] Notifications (email/SMS pour mises à jour)
- [ ] Analytics (Plausible, Mixpanel)
- [ ] Multilangue (i18n)
- [ ] Mobile app (React Native)
- [ ] API publique REST

## Ressources

- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com)
- [Hugging Face](https://huggingface.co/docs)
- [Anthropic Claude](https://docs.anthropic.com)

---

Pour des questions spécifiques, consultez les fichiers source ou les guides de configuration.
