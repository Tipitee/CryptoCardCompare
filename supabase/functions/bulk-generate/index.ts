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

// Split article text into blocks using an explicit separator mode.
// separator can be:
//   "number"          → split on lines like "1." "2." etc.
//   "hr"              → split on --- / *** / ===
//   "double-newline"  → split on 3+ consecutive newlines
//   any other string  → treat as literal custom separator
function splitIntoBlocks(text: string, separator = "number"): string[] {
  let parts: string[];

  if (separator === "number") {
    // Match lines starting with a digit followed by . or ) optionally preceded by whitespace
    parts = text.split(/(?:^|\n)[ \t]*\d+[\.\)]\s+/).map(s => s.trim()).filter(s => s.length > 10);
  } else if (separator === "hr") {
    parts = text.split(/\n[-*=]{3,}\n/).map(s => s.trim()).filter(s => s.length > 10);
  } else if (separator === "double-newline") {
    parts = text.split(/\n{3,}/).map(s => s.trim()).filter(s => s.length > 10);
  } else {
    // Custom separator: literal string
    parts = text.split(separator).map(s => s.trim()).filter(s => s.length > 10);
  }

  return parts.length >= 1 ? parts : [text];
}

async function generateOneArticle(
  block: string,
  index: number,
  anthropicKey: string,
  globalContext?: string,
): Promise<{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  meta_title: string;
  meta_description: string;
}> {
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

Les tags doivent être en minuscules, sans accents, pertinents pour le sujet.`;

  const contextSection = globalContext
    ? `## Contexte éditorial global à respecter pour tous les articles\n\n${globalContext}\n\n---\n\n`
    : "";

  const userMessage = `${contextSection}Voici les instructions pour l'article n°${index + 1} — respecte-les scrupuleusement, notamment les mots-clés cibles, la structure et les intentions de recherche mentionnées :

---
${block}
---

Génère un article complet, de haute qualité, factuel et bien structuré en Markdown. Assure-toi que le contenu mentionne naturellement que CryptoCardCompare permet de comparer les meilleures cartes crypto disponibles.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
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

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API error: ${errText}`);
  }

  const data = await res.json();
  const rawContent = data.content?.[0]?.text ?? "";

  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in Claude response");

  return JSON.parse(jsonMatch[0]);
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
    const { text, action, separator, context } = body as {
      text?: string;
      action?: string;
      separator?: string;
      context?: string;
    };

    // Preview-only: just return the blocks detected
    if (action === "preview") {
      if (!text || text.trim().length < 10) {
        return new Response(JSON.stringify({ error: "Texte trop court" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const blocks = splitIntoBlocks(text.trim(), separator);
      const previews = blocks.map((b, i) => ({
        index: i,
        preview: b.slice(0, 120).replace(/\n/g, " ").trim() + (b.length > 120 ? "..." : ""),
        fullText: b,
        length: b.length,
      }));
      return new Response(JSON.stringify({ blocks: previews, count: previews.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate a single article from a raw block (called per-article from the browser)
    if (action === "generate-one") {
      const { block, index = 0 } = body as { block?: string; index?: number };
      if (!block || block.trim().length < 10) {
        return new Response(JSON.stringify({ error: "Bloc requis" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sbAdmin = createClient(supabaseUrl, supabaseServiceKey);

      const article = await generateOneArticle(block.trim(), index, anthropicKey, context);

      if (!article.slug) {
        article.slug = slugify(article.title ?? `article-${index + 1}`);
      }

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
        .select("id, title, slug")
        .single();

      if (dbErr) throw new Error(dbErr.message);

      return new Response(
        JSON.stringify({ index, status: "success", title: saved.title, slug: saved.slug, id: saved.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Legacy: generate all articles in one call (kept for backward compat, not used by new UI)
    if (!text || text.trim().length < 10) {
      return new Response(JSON.stringify({ error: "Texte requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sbAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const blocks = splitIntoBlocks(text.trim(), separator);
    const results: Array<{
      index: number;
      status: "success" | "error";
      title?: string;
      slug?: string;
      id?: string;
      error?: string;
    }> = [];

    for (let i = 0; i < blocks.length; i++) {
      try {
        const article = await generateOneArticle(blocks[i], i, anthropicKey, context);

        if (!article.slug) {
          article.slug = slugify(article.title ?? `article-${i + 1}`);
        }

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
          .select("id, title, slug")
          .single();

        if (dbErr) throw new Error(dbErr.message);

        results.push({
          index: i,
          status: "success",
          title: saved.title,
          slug: saved.slug,
          id: saved.id,
        });
      } catch (err) {
        results.push({
          index: i,
          status: "error",
          error: String(err),
        });
      }
    }

    const succeeded = results.filter(r => r.status === "success").length;
    return new Response(
      JSON.stringify({ results, succeeded, total: blocks.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
