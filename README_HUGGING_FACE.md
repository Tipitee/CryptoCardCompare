# Hugging Face Image Generation Setup - Quick Start

Ce document guide vous aide à configurer rapidement la génération d'images avec Hugging Face.

## TL;DR - Résumé rapide

1. Créez un compte sur [huggingface.co](https://huggingface.co)
2. Générez un token dans Settings > Access Tokens
3. Ajoutez-le comme secret `HF_API_KEY` dans Supabase Edge Functions
4. Allez sur `/admin-hero-images` et générez vos images !

## Configuration détaillée

Consultez les guides complets :

- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Guide complet étape par étape avec dépannage
- **[HUGGING_FACE_SETUP.md](./HUGGING_FACE_SETUP.md)** - Configuration détaillée et alternatives CLI

## Architecture

Pour comprendre comment ça fonctionne :

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Vue d'ensemble du projet et de la structure

## Commandes utiles

```bash
# Build le projet
npm run build

# Vérifier les types TypeScript
npm run typecheck

# Redéployer une edge function
supabase functions deploy generate-hero-image

# Consulter les logs
supabase functions list
```

## Structure d'une edge function

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Votre logique ici
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
```

## Appeler une edge function depuis le frontend

```typescript
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-hero-image`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "X-Admin-Secret": adminSecret,
    },
    body: JSON.stringify({ slug, title, excerpt, tags }),
  }
);
```

## Erreurs courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `HF_API_KEY not configured` | Secret Supabase manquant | Vérifiez Supabase > Edge Functions > Settings > Secrets |
| `HF API error: Unauthorized` | Token invalide | Régénérez un nouveau token Hugging Face |
| `Failed to generate image` | Timeout ou modèle occupé | Attendez et réessayez, c'est normal |
| Les images ne s'affichent pas | Plusieurs causes | Consultez SETUP_INSTRUCTIONS.md |

## Fichiers clés

- `supabase/functions/generate-hero-image/index.ts` - Edge Function
- `src/pages/AdminHeroImages.tsx` - Interface de génération
- `src/pages/Blog.tsx` - Affichage des images
- `src/lib/supabase.ts` - Client Supabase

## Prochaines étapes

1. Créer un compte Hugging Face
2. Ajouter le secret Supabase
3. Tester la génération via `/admin-hero-images`
4. Vérifier les images sur `/blog`
5. Profitez !

## Support

- [Hugging Face Documentation](https://huggingface.co/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Deno Manual](https://docs.deno.com/)

---

**Besoin d'aide ?** Consultez [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) pour le dépannage détaillé.
