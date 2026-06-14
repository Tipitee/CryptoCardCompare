import { createClient } from "npm:@supabase/supabase-js@2";
// @deno-types="https://deno.land/x/imagescript@1.3.0/mod.d.ts"
import { Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const FUNCTION_VERSION = "v4-crypto-priority"; // bump this on each deploy to verify

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
  real_card_image: string | null;
}

// ── Prompt builder ────────────────────────────────────────────────────────────
const STYLE_VARIATIONS = [
  "dark background, neon cyan and green accents, abstract crypto/blockchain aesthetic, cinematic lighting",
  "dark background with subtle gradient, glowing cyan and purple geometric shapes, modern tech aesthetic, dramatic shadows",
  "deep blue and black gradient background, emerald green accents, holographic digital art style, volumetric lighting",
  "dark space-like background, bright cyan highlights, abstract connectivity patterns, sleek futuristic design",
  "charcoal background with neon cyan lines, minimalist geometric composition, intense dramatic lighting, tech noir style",
];

// Priority 1 — specific cryptocurrencies (checked first)
const CRYPTO_THEMES: Record<string, string> = {
  ethereum:  "Ethereum ETH diamond crystal symbol, purple violet holographic glow, ethereal light rays",
  ether:     "Ethereum ETH diamond crystal symbol, purple violet holographic glow, ethereal light rays",
  " eth ":   "Ethereum ETH diamond crystal symbol, purple violet holographic glow, ethereal light rays",
  bitcoin:   "Bitcoin BTC golden coin radiant glow, warm orange gold tones, digital gold aura",
  " btc ":   "Bitcoin BTC golden coin radiant glow, warm orange gold tones, digital gold aura",
  solana:    "Solana SOL speed lines purple teal gradient, high-speed blockchain aesthetic",
  " sol ":   "Solana SOL speed lines purple teal gradient, high-speed blockchain aesthetic",
  binance:   "Binance BNB golden hexagonal coin network, warm yellow gold tones",
  " bnb ":   "Binance BNB golden hexagonal coin network, warm yellow gold tones",
  ripple:    "Ripple XRP infinite dark blue network nodes constellation",
  " xrp ":   "Ripple XRP infinite dark blue network nodes constellation",
  cardano:   "Cardano ADA blue geometric layered architecture, academic precision aesthetic",
  " ada ":   "Cardano ADA blue geometric layered architecture, academic precision aesthetic",
  avalanche: "Avalanche AVAX red peak mountain abstract, sharp red geometric shapes",
  " avax ":  "Avalanche AVAX red peak mountain abstract, sharp red geometric shapes",
  polygon:   "Polygon MATIC purple geometric web3 shapes interconnected",
  " matic ": "Polygon MATIC purple geometric web3 shapes interconnected",
  dogecoin:  "Dogecoin DOGE golden shiba inu playful cryptocurrency, fun digital art",
  " doge ":  "Dogecoin DOGE golden shiba inu playful cryptocurrency, fun digital art",
  litecoin:  "Litecoin LTC silver coin fast digital payment network",
  " ltc ":   "Litecoin LTC silver coin fast digital payment network",
  tether:    "Tether USDT stablecoin green dollar crypto bridge abstract",
  usdt:      "Tether USDT stablecoin green dollar crypto bridge abstract",
  usdc:      "USD Coin USDC stablecoin blue dollar crypto circle abstract",
};

// Priority 2 — specific topics
const TOPIC_THEMES: Record<string, string> = {
  staking:   "blockchain staking nodes interconnected glowing rewards crystal formation",
  defi:      "decentralized finance DeFi protocol nodes abstract web glowing",
  kyc:       "identity verification digital biometric scan abstract face recognition",
  impots:    "tax declaration crypto document abstract financial forms digital",
  impôts:    "tax declaration crypto document abstract financial forms digital",
  tax:       "tax declaration crypto document abstract financial forms digital",
  securite:  "cybersecurity shield encryption neon lock blockchain protection",
  sécurité:  "cybersecurity shield encryption neon lock blockchain protection",
  security:  "cybersecurity shield encryption neon lock blockchain protection",
  retrait:   "ATM cash withdrawal crypto machine neon city night",
  atm:       "ATM cash withdrawal crypto machine neon city night",
  europe:    "European Union map crypto payment network constellation stars",
  virtuelle: "virtual digital card holographic interface floating UI elements",
  virtual:   "virtual digital card holographic interface floating UI elements",
  faillite:  "financial risk warning shield broken chain cryptocurrency vault",
  regulation:"legal compliance document blockchain governance abstract scales",
};

// Priority 3 — generic card/cashback topics
const GENERIC_THEMES: Record<string, string> = {
  cashback:  "crypto cashback rewards coins raining abstract digital",
  carte:     "premium crypto debit card floating holographic surface reflective",
  card:      "premium crypto debit card floating holographic surface reflective",
  frais:     "financial comparison chart fees minimalist dark digital",
  fees:      "financial comparison chart fees minimalist dark digital",
  visa:      "payment network contactless NFC terminal neon card tap",
  guide:     "cryptocurrency guide knowledge blockchain network glow",
};

function detectTheme(title: string, slug: string, tags: string[]): string {
  const titleLower = ` ${title} `.toLowerCase();
  const fullHaystack = ` ${title} ${slug} ${tags.join(" ")} `.toLowerCase();

  // ── Pass 1: Title-only scan for specific crypto names (absolute priority) ──
  // If the article title explicitly names a cryptocurrency, that wins — always.
  for (const [key, val] of Object.entries(CRYPTO_THEMES)) {
    if (titleLower.includes(key)) return val;
  }

  // ── Pass 2: Full haystack scan for specific crypto names ──
  // Catches mentions in slug/tags that didn't appear in the title
  for (const [key, val] of Object.entries(CRYPTO_THEMES)) {
    if (fullHaystack.includes(key)) return val;
  }

  // ── Pass 3: Title-only scan for topic keywords ──
  for (const [key, val] of Object.entries(TOPIC_THEMES)) {
    if (titleLower.includes(key)) return val;
  }

  // ── Pass 4: Full haystack scan for topic keywords ──
  for (const [key, val] of Object.entries(TOPIC_THEMES)) {
    if (fullHaystack.includes(key)) return val;
  }

  // ── Pass 5: Full haystack scan for generic terms ──
  for (const [key, val] of Object.entries(GENERIC_THEMES)) {
    if (fullHaystack.includes(key)) return val;
  }

  return "cryptocurrency payment card digital finance abstract futuristic neon dark";
}

function buildPrompt(title: string, slug: string, tags: string[], detectedCard: CardRow | null): string {
  const randomStyle = STYLE_VARIATIONS[Math.floor(Math.random() * STYLE_VARIATIONS.length)];

  const theme = detectTheme(title, slug, tags);
  console.log(`Theme detected for "${title}": ${theme.substring(0, 60)}...`);

  // If a card was detected, hint the color palette but leave space on the right
  // (card image will be composited there in post-processing)
  let cardHint = "";
  if (detectedCard?.real_card_image) {
    const primary = detectedCard.color_primary || "#00D4FF";
    cardHint = `, dominant color palette ${primary}, leave right third of image as clean dark gradient for card overlay`;
  } else if (detectedCard) {
    const primary = detectedCard.color_primary || "#00D4FF";
    cardHint = `, dominant color palette ${primary}, subtle card shape silhouette floating`;
  }

  return `Cinematic hero image, ${theme}${cardHint}, ${randomStyle}, no text, no letters, no logos, no watermarks, 16:9 ratio, ultra high quality`;
}

// ── Image compositing — overlay card image on FLUX background ─────────────────
async function compositeCardImage(
  bgB64: string,
  cardImageUrl: string,
): Promise<string> {
  // Decode background (JPEG from FLUX)
  const bgBytes = Uint8Array.from(atob(bgB64), (c) => c.charCodeAt(0));
  const bg = await Image.decode(bgBytes);

  // Fetch card image
  const cardRes = await fetch(cardImageUrl, { signal: AbortSignal.timeout(8000) });
  if (!cardRes.ok) throw new Error(`Card image fetch failed: ${cardRes.status}`);
  const cardBytes = new Uint8Array(await cardRes.arrayBuffer());

  // Decode card image (PNG/JPEG/WEBP)
  const card = await Image.decode(cardBytes);

  // Target card width = 30% of background width
  const targetCardW = Math.round(bg.width * 0.30);
  const targetCardH = Math.round(card.height * (targetCardW / card.width));

  // Resize card
  card.resize(targetCardW, targetCardH);

  // Position: right side with padding, vertically centred
  const padding = Math.round(bg.width * 0.04);
  const x = bg.width - targetCardW - padding;
  const y = Math.round((bg.height - targetCardH) / 2);

  // Composite card on top of background
  bg.composite(card, x, y);

  // Encode back to JPEG (quality 92)
  const composited = await bg.encodeJPEG(92);
  return btoa(String.fromCharCode(...composited));
}

// ─────────────────────────────────────────────────────────────────────────────

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

    const { id, title, excerpt, tags, slug, forceRegenerate } = await req.json();

    const togetherKey = Deno.env.get("TOGETHER_API_KEY");
    if (!togetherKey) throw new Error("Missing TOGETHER_API_KEY");

    // ── Step 0: Detect card brand from article text ───────────────────────────
    console.log("Fetching cards to detect brand/card mentions...");
    const sb = getAdminClient();
    const { data: cardsData, error: cardsError } = await sb
      .from("cards")
      .select("id, name, issuer, color_primary, color_secondary, cashback_base, cashback_premium, annual_fees, extras, badge, real_card_image");

    if (cardsError) console.error("Error fetching cards:", cardsError);

    let detectedCard: CardRow | null = null;
    if (cardsData && (cardsData as CardRow[]).length > 0) {
      const text = `${title} ${excerpt} ${(tags ?? []).join(" ")}`.toLowerCase();
      for (const card of cardsData as CardRow[]) {
        const cardName = card.name.toLowerCase();
        const issuer = card.issuer.toLowerCase();
        if (text.includes(cardName) && cardName.length > 2) {
          detectedCard = card;
          console.log(`Detected card: ${card.name} (image: ${card.real_card_image ? "yes" : "no"})`);
          break;
        } else if (text.includes(issuer) && issuer.length > 2) {
          detectedCard = card;
          console.log(`Detected card by issuer: ${card.issuer} (image: ${card.real_card_image ? "yes" : "no"})`);
          break;
        }
      }
    }

    // ── Step 1: Build FLUX prompt ─────────────────────────────────────────────
    const imagePrompt = buildPrompt(title, slug, tags ?? [], detectedCard);
    console.log("Image prompt:", imagePrompt);

    // ── Step 2: Generate background with Together AI ─────────────────────────
    console.log("Calling Together AI...");
    let imageData: string | null = null;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Together AI attempt ${attempt}/3`);
        const togetherRes = await fetch("https://api.together.xyz/v1/images/generations", {
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

        if (!togetherRes.ok) {
          const errText = await togetherRes.text();
          lastError = new Error(`Together API ${togetherRes.status}: ${errText}`);
          if (togetherRes.status >= 500 && attempt < 3) {
            await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
            continue;
          }
          throw lastError;
        }

        const result = await togetherRes.json();
        imageData = result?.data?.[0]?.b64_json || result?.b64_json;
        if (!imageData) throw new Error("No image data in Together AI response");
        console.log("FLUX background generated ✓");
        break;
      } catch (err) {
        lastError = err as Error;
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        } else {
          throw lastError;
        }
      }
    }

    if (!imageData) throw lastError || new Error("Failed to generate background image");

    // ── Step 3: Composite card image on top (if available) ───────────────────
    if (detectedCard?.real_card_image) {
      console.log(`Compositing card image: ${detectedCard.real_card_image}`);
      try {
        imageData = await compositeCardImage(imageData, detectedCard.real_card_image);
        console.log("Card image composited ✓");
      } catch (err) {
        // Non-fatal — continue with plain background
        console.warn("Card compositing failed (using plain background):", (err as Error).message);
      }
    }

    // ── Step 4: Upload to Supabase Storage ───────────────────────────────────
    console.log("Uploading to Supabase Storage...");
    const fileName = `${slug}-${Date.now()}.jpg`;
    const fileBuffer = Uint8Array.from(atob(imageData), (c) => c.charCodeAt(0));

    const { error: uploadError } = await sb
      .storage
      .from("blog-hero-images")
      .upload(fileName, fileBuffer, { contentType: "image/jpeg", upsert: false });

    if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

    const { data: { publicUrl } } = sb.storage.from("blog-hero-images").getPublicUrl(fileName);

    // ── Step 5: Update blog_posts row ────────────────────────────────────────
    console.log("Updating blog post...");
    const { data: postData, error: updateError } = await sb
      .from("blog_posts")
      .update({ image_hero: publicUrl })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw new Error(`DB update failed: ${updateError.message}`);

    return new Response(
      JSON.stringify({
        success: true,
        version: FUNCTION_VERSION,
        imageUrl: publicUrl,
        post: postData,
        promptUsed: imagePrompt,
        cardComposited: !!(detectedCard?.real_card_image),
        detectedCard: detectedCard ? {
          id: detectedCard.id,
          name: detectedCard.name,
          issuer: detectedCard.issuer,
          colorPrimary: detectedCard.color_primary,
          colorSecondary: detectedCard.color_secondary,
          badge: detectedCard.badge,
          hasCardImage: !!detectedCard.real_card_image,
        } : null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("generate-hero-image error:", (error as Error).message);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
