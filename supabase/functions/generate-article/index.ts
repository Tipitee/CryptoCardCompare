import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Admin-Secret",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const adminSecret = Deno.env.get("ADMIN_SECRET");
    const reqSecret = req.headers.get("X-Admin-Secret");
    if (!adminSecret || reqSecret !== adminSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { topic, saveToDb = false } = body as { topic: string; saveToDb?: boolean };

    if (!topic || typeof topic !== "string" || topic.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Le sujet est requis (min 3 caractères)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Tu es un rédacteur expert en cryptomonnaies et en fintech, spécialisé dans les cartes bancaires crypto. Tu rédiges du contenu en français pour CryptoCardCompare, un comparateur de cartes crypto leader en France.

Style et ton :
- Professionnel, clair, engageant et éducatif
- Ton de confiance, comme un expert qui guide le lecteur
- Orienté SEO naturellement (mots-clés pertinents intégrés naturellement)
- Public cible : Français de 25-45 ans, intéressés par la crypto, du débutant à l'intermédiaire

Structure OBLIGATOIRE (en Markdown) :
1. Une introduction accrocheuse (2-3 paragraphes) qui pose le problème ou l'opportunité
2. Au moins 4 sections H2 avec du contenu substantiel
3. Des sous-titres H3 quand approprié
4. Au moins un tableau comparatif si pertinent (en Markdown)
5. Des listes à puces pour les points clés
6. Des encadrés ou points forts (en gras)
7. Une conclusion avec un CTA naturel vers le comparateur : "Comparez toutes les cartes crypto sur [CryptoCardCompare](/compare)"

Longueur cible : 1200 à 1800 mots de contenu riche.

IMPORTANT : Tu dois retourner un JSON valide avec exactement ces champs :
{
  "title": "Titre accrocheur (60-70 caractères max)",
  "slug": "slug-url-friendly-en-francais",
  "excerpt": "Résumé en 1-2 phrases percutantes (150-160 caractères)",
  "content": "Contenu complet en Markdown",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "meta_title": "Titre SEO (55-60 caractères)",
  "meta_description": "Description SEO (150-160 caractères)"
}

Les tags doivent être en minuscules, sans accents, pertinents pour le sujet. Exemples : "cashback", "carte-crypto", "defi", "comparatif", "visa", "mastercard", "staking", "frais", etc.`;

    const userMessage = `Rédige un article complet et de haute qualité sur le sujet suivant : "${topic}"

Assure-toi que le contenu est factuel, utile pour un lecteur français qui cherche à choisir sa carte crypto, et qu'il mentionne naturellement que CryptoCardCompare permet de comparer les meilleures cartes disponibles.`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(JSON.stringify({ error: "Claude API error", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anthropicData = await anthropicRes.json();
    const rawContent = anthropicData.content?.[0]?.text ?? "";

    let article: {
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      tags: string[];
      meta_title: string;
      meta_description: string;
    };

    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      article = JSON.parse(jsonMatch[0]);
    } catch {
      return new Response(JSON.stringify({ error: "Failed to parse Claude response", raw: rawContent }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!article.slug) {
      article.slug = slugify(article.title ?? topic);
    }

    if (saveToDb) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sbAdmin = createClient(supabaseUrl, supabaseServiceKey);

      const { data: existing } = await sbAdmin
        .from("blog_posts")
        .select("id")
        .eq("slug", article.slug)
        .maybeSingle();

      if (existing) {
        article.slug = article.slug + "-" + Date.now().toString(36);
      }

      const { data: saved, error: dbErr } = await sbAdmin
        .from("blog_posts")
        .insert({
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          tags: article.tags,
          meta_title: article.meta_title,
          meta_description: article.meta_description,
          published: false,
        })
        .select()
        .single();

      if (dbErr) {
        return new Response(JSON.stringify({ error: "DB insert error", detail: dbErr.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ article: saved }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ article }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
