import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Admin-Secret",
};

function getAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

Deno.serve(async (req) => {
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

    const { title, excerpt, tags, slug, forceRegenerate } = await req.json();

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    const togetherKey = Deno.env.get("TOGETHER_API_KEY");

    if (!anthropicKey || !togetherKey) {
      throw new Error("Missing ANTHROPIC_API_KEY or TOGETHER_API_KEY");
    }

    // Step 0: Fetch cards and detect matches
    console.log("Fetching cards to detect brand/card mentions...");
    const sb = getAdminClient();
    const { data: cardsData, error: cardsError } = await sb
      .from("cards")
      .select("id, name, issuer, color_primary, color_secondary, cashback_base, cashback_premium, annual_fees, extras, badge");

    if (cardsError) {
      console.error("Error fetching cards:", cardsError);
    }

    interface CardRow {
      id: string;
      name: string;
      issuer: string;
      color_primary: string | null;
      color_secondary: string | null;
      cashback_base: number;
      cashback_premium: number;
      annual_fees: number;
      extras: string[];
      badge: string | null;
    }

    let detectedCard: CardRow | null = null;
    if (cardsData && (cardsData as CardRow[]).length > 0) {
      const text = `${title} ${excerpt} ${tags?.join(" ") ?? ""}`.toLowerCase();

      for (const card of cardsData as CardRow[]) {
        const cardName = card.name.toLowerCase();
        const issuer = card.issuer.toLowerCase();

        if (text.includes(cardName) && cardName.length > 2) {
          detectedCard = card;
          console.log(`Detected card: ${card.name}`);
          break;
        } else if (text.includes(issuer) && issuer.length > 2) {
          detectedCard = card;
          console.log(`Detected card by issuer: ${card.issuer}`);
          break;
        }
      }
    }

    // Step 1: Generate image prompt via Claude
    console.log("Generating image prompt with Claude...");
    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const styleVariations = [
      "dark background, neon cyan and green accents, abstract crypto/blockchain aesthetic, cinematic lighting",
      "dark background with subtle gradient, glowing cyan and purple geometric shapes, modern tech aesthetic, dramatic shadows",
      "deep blue and black gradient background, emerald green accents, holographic digital art style, volumetric lighting",
      "dark space-like background, bright cyan highlights, abstract connectivity patterns, sleek futuristic design",
      "charcoal background with neon cyan lines, minimalist geometric composition, intense dramatic lighting, tech noir style",
    ];

    const randomStyle = styleVariations[Math.floor(Math.random() * styleVariations.length)];

    let cardContext = "";
    if (detectedCard) {
      const features = [];
      if (detectedCard.cashback_premium > 0) {
        features.push(`up to ${detectedCard.cashback_premium}% cashback`);
      }
      if (detectedCard.annual_fees === 0) {
        features.push("no annual fees");
      }
      if (detectedCard.extras && detectedCard.extras.length > 0) {
        features.push(`includes ${detectedCard.extras.slice(0, 2).join(", ")}`);
      }

      cardContext = `\n\nCard Context - The article mentions: ${detectedCard.name} by ${detectedCard.issuer}
Key features: ${features.join(", ")}
Brand colors to incorporate: Primary ${detectedCard.color_primary || "#00D4FF"}, Secondary ${detectedCard.color_secondary || "#0A0E1A"}
IMPORTANT: Subtly integrate visual elements that represent this card (card shape, issuer aesthetic, color palette) without showing text or logos.`;
    }

    const promptResponse = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      messages: [{
        role: "user",
        content: `Write a detailed image generation prompt (max 75 words) for a blog hero image.
Article Title: "${title}"
Article Summary: ${excerpt}
Tags: ${tags?.join(", ") ?? ""}

Style Requirements: ${randomStyle}, no text, no logos, 16:9 aspect ratio.

The image should visually represent the article's topic and feel modern, premium, and relevant to cryptocurrency/blockchain industry.${cardContext}
Return ONLY the prompt.`,
      }],
    });

    const imagePrompt =
      (promptResponse.content[0] as { type: string; text: string }).text.trim();

    console.log("Generated image prompt:", imagePrompt);

    // Step 2: Generate image with Together AI (with retries)
    console.log("Calling Together AI API directly...");

    let imageData = null;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Together AI attempt ${attempt}/3`);

        const togetherResponse = await fetch("https://api.together.xyz/v1/images/generations", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${togetherKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "black-forest-labs/FLUX.1-schnell",
            prompt: imagePrompt,
            width: 1360,
            height: 768,
            steps: 4,
            n: 1,
            response_format: "b64_json",
          }),
        });

        console.log(`Together response status: ${togetherResponse.status}`);

        if (!togetherResponse.ok) {
          const errorText = await togetherResponse.text();
          console.error(`Together error (attempt ${attempt}):`, errorText);
          lastError = new Error(`Together API ${togetherResponse.status}: ${errorText}`);

          if (togetherResponse.status >= 500 && attempt < 3) {
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw lastError;
        }

        const result = await togetherResponse.json();
        imageData = result?.data?.[0]?.b64_json || result?.b64_json;

        if (!imageData) {
          console.error("No image in response:", JSON.stringify(result).slice(0, 200));
          throw new Error("No image data in Together AI response");
        }

        console.log("Successfully generated image");
        break;
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt} failed:`, lastError.message);

        if (attempt < 3 && lastError.message.includes("fetch")) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Network error, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else if (attempt === 3) {
          throw lastError;
        }
      }
    }

    if (!imageData) {
      throw lastError || new Error("Failed to generate image");
    }

    // Step 3: Upload image to Supabase Storage
    console.log("Uploading image to Supabase Storage...");
    const fileName = `${slug}-${Date.now()}.jpg`;
    const fileBuffer = Uint8Array.from(atob(imageData), (c) => c.charCodeAt(0));

    const { data: uploadData, error: uploadError } = await sb
      .storage
      .from("blog-hero-images")
      .upload(fileName, fileBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Step 4: Get public URL and update database
    const { data: { publicUrl } } = sb
      .storage
      .from("blog-hero-images")
      .getPublicUrl(fileName);

    console.log("Updating blog post with image URL...");
    const { data: postData, error: updateError } = await sb
      .from("blog_posts")
      .update({ image_hero: publicUrl })
      .eq("slug", slug)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update post: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: publicUrl,
        post: postData,
        promptUsed: imagePrompt,
        detectedCard: detectedCard ? {
          id: detectedCard.id,
          name: detectedCard.name,
          issuer: detectedCard.issuer,
          colorPrimary: detectedCard.color_primary,
          colorSecondary: detectedCard.color_secondary,
          badge: detectedCard.badge,
        } : null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("generate-hero-image error:", (error as Error).message);
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
