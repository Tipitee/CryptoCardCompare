import { createClient } from "npm:@supabase/supabase-js@2";
import { Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const FUNCTION_VERSION = "v4-crypto-priority";

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

const CRYPTO_THEMES: Record<string, string> = {
  ethereum:  "Ethereum ETH diamond crystal symbol, purple violet holographic glow, ethereal light rays, dark background",
  " eth ":   "Ethereum ETH diamond crystal symbol, purple violet holographic glow, ethereal light rays, dark background",
  ether:     "Ethereum ETH diamond crystal symbol, purple violet holographic glow, ethereal light rays, dark background",
  bitcoin:   "Bitcoin BTC golden coin radiant glow, warm orange gold tones, digital gold aura, dark background",
  " btc ":   "Bitcoin BTC golden coin radiant glow, warm orange gold tones, digital gold aura, dark background",
  solana:    "Solana SOL speed lines purple teal gradient, high-speed blockchain aesthetic, dark background",
  " sol ":   "Solana SOL speed lines purple teal gradient, high-speed blockchain aesthetic, dark background",
  " bnb ":   "Binance BNB golden yellow coin, exchange trading aesthetic, dark background neon yellow",
  binance:   "Binance BNB golden yellow coin, exchange trading aesthetic, dark background neon yellow",
  ripple:    "XRP Ripple blue wave payment network, global transfer, dark background cyan blue",
  " xrp ":   "XRP Ripple blue wave payment network, global transfer, dark background cyan blue",
  cardano:   "Cardano ADA blue geometric pattern, proof of stake, dark background blue violet",
  " ada ":   "Cardano ADA blue geometric pattern, proof of stake, dark background blue violet",
  avalanche: "Avalanche AVAX red triangle geometric, high speed subnet, dark background red accent",
  " avax ":  "Avalanche AVAX red triangle geometric, high speed subnet, dark background red accent",
  polygon:   "Polygon MATIC purple geometric web3, layer 2 scaling, dark background purple neon",
  " matic ": "Polygon MATIC purple geometric web3, layer 2 scaling, dark background purple neon",
  dogecoin:  "Dogecoin DOGE shiba inu golden coin, fun dark background yellow",
  " doge ":  "Dogecoin DOGE shiba inu golden coin, fun dark background yellow",
  litecoin:  "Litecoin LTC silver digital coin, fast payment, dark background silver glow",
  " ltc ":   "Litecoin LTC silver digital coin, fast payment, dark background silver glow",
  tether:    "Tether USDT stablecoin green dollar, stable value, dark background green",
  " usdt ":  "Tether USDT stablecoin green dollar, stable value, dark background green",
  " usdc ":  "USD Coin USDC stablecoin blue circle, regulated dollar-backed, dark background blue",
};

const TOPIC_THEMES: Record<string, string> = {
  staking:   "crypto staking rewards locked coins growing, yield farming, dark background green glow",
  defi:      "DeFi decentralized finance liquidity pools smart contracts, dark background neon blue",
  kyc:       "identity verification digital secure blockchain compliance, dark background geometric",
  impots:    "crypto tax declaration France financial compliance, dark background blue",
  securite:  "crypto security shield lock hardware wallet cold storage, dark background",
  retrait:   "ATM cash withdrawal crypto global payment network, dark background cyan",
  europe:    "European Union crypto regulation MiCA EU digital finance, dark background blue gold",
  virtuelle: "virtual digital card contactless payment smartphone NFC, dark background neon",
  faillite:  "financial risk crypto exchange collapse warning, dark background red alert",
  regulation:"crypto regulation legal compliance government digital assets, dark background blue",
};

const GENERIC_THEMES: Record<string, string> = {
  cashback: "cryptocurrency cashback rewards coins raining reward program, dark background cyan green",
  carte:    "premium crypto credit card glowing contactless payment, dark background cyan",
  card:     "premium crypto credit card glowing contactless payment, dark background cyan",
  frais:    "crypto fees comparison chart financial analysis, dark background",
  fees:     "crypto fees comparison chart financial analysis, dark background",
  visa:     "Visa payment network digital globe cryptocurrency transaction, dark background blue",
  guide:    "cryptocurrency guide tutorial steps digital education, dark background",
};

function detectTheme(title: string, slug: string, tags: string[]): string {
  const titleLower = ` ${title} `.toLowerCase();
  const fullHaystack = ` ${title} ${slug} ${tags.join(" ")} `.toLowerCase();

  for (const [key, val] of Object.entries(CRYPTO_THEMES)) {
    if (titleLower.includes(key)) return val;
  }
  for (const [key, val] of Object.entries(CRYPTO_THEMES)) {
    if (fullHaystack.includes(key)) return val;
  }
  for (const [key, val] of Object.entries(TOPIC_THEMES)) {
    if (titleLower.includes(key)) return val;
  }
  for (const [key, val] of Object.entries(TOPIC_THEMES)) {
    if (fullHaystack.includes(key)) return val;
  }
  for (const [key, val] of Object.entries(GENERIC_THEMES)) {
    if (fullHaystack.includes(key)) return val;
  }
  return "cryptocurrency payment card digital finance abstract futuristic neon dark";
}

async function compositeCardImage(bgB64: string, cardImageUrl: string): Promise<string> {
  const bgBytes = Uint8Array.from(atob(bgB64), (c) => c.charCodeAt(0));
  const bg = await Image.decode(bgBytes);
  const cardRes = await fetch(cardImageUrl, { signal: AbortSignal.timeout(8000) });
  if (!cardRes.ok) throw new Error(`Failed to fetch card image: ${cardRes.status}`);
  const cardBytes = new Uint8Array(await cardRes.arrayBuffer());
  const card = await Image.decode(cardBytes);
  const targetCardW = Math.round(bg.width * 0.30);
  const targetCardH = Math.round(card.height * (targetCardW / card.width));
  card.resize(targetCardW, targetCardH);
  const padding = Math.round(bg.width * 0.04);
  const x = bg.width - targetCardW - padding;
  const y = Math.round((bg.height - targetCardH) / 2);
  bg.composite(card, x, y);
  const composited = await bg.encodeJPEG(92);
  return btoa(String.fromCharCode(...composited));
}

interface CardRow {
  id: string; name: string; issuer: string;
  color_primary: string | null; color_secondary: string | null;
  cashback_base: number; cashback_premium: number;
  annual_fees: number; extras: string[]; badge: string | null;
  real_card_image: string | null;
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
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { id, title, excerpt, tags, slug } = await req.json();
    console.log(`[${FUNCTION_VERSION}] Processing: "${title}"`);

    const togetherKey = Deno.env.get("TOGETHER_API_KEY");
    if (!togetherKey) throw new Error("Missing TOGETHER_API_KEY");

    const themeDescription = detectTheme(title || "", slug || "", tags || []);
    console.log(`[${FUNCTION_VERSION}] Theme: ${themeDescription.slice(0, 80)}`);

    const styleVariations = [
      "cinematic lighting, no text, no logos, 16:9 aspect ratio, ultra HD",
      "dramatic shadows, volumetric lighting, no text, no logos, 16:9 photorealistic",
      "holographic aesthetic, glowing particles, no text, no logos, 16:9 8K quality",
      "tech noir style, intense backlight, no text, no logos, 16:9 editorial",
      "minimalist geometric, bold contrast, no text, no logos, 16:9 professional",
    ];
    const randomStyle = styleVariations[Math.floor(Math.random() * styleVariations.length)];

    const sb = getAdminClient();
    const { data: cardsData } = await sb
      .from("cards")
      .select("id, name, issuer, color_primary, color_secondary, cashback_base, cashback_premium, annual_fees, extras, badge, real_card_image");

    let detectedCard: CardRow | null = null;
    if (cardsData) {
      const text = `${title} ${excerpt} ${(tags || []).join(" ")}`.toLowerCase();
      for (const card of cardsData as CardRow[]) {
        const cardName = card.name.toLowerCase();
        const issuer = card.issuer.toLowerCase();
        if (text.includes(cardName) && cardName.length > 2) { detectedCard = card; break; }
        else if (text.includes(issuer) && issuer.length > 2) { detectedCard = card; break; }
      }
    }

    let cardContext = "";
    if (detectedCard) {
      cardContext = ` Brand colors: primary ${detectedCard.color_primary || "#00D4FF"}.`;
    }
    const imagePrompt = `${themeDescription}, ${randomStyle}.${cardContext}`;
    console.log(`[${FUNCTION_VERSION}] Prompt: ${imagePrompt.slice(0, 120)}`);

    let imageData: string | null = null;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const togetherResponse = await fetch("https://api.together.xyz/v1/images/generations", {
          method: "POST",
          headers: { "Authorization": `Bearer ${togetherKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "black-forest-labs/FLUX.1-schnell",
            prompt: imagePrompt,
            width: 1360, height: 768, steps: 4, n: 1,
            response_format: "b64_json",
          }),
        });

        if (!togetherResponse.ok) {
          const errorText = await togetherResponse.text();
          lastError = new Error(`Together API ${togetherResponse.status}: ${errorText}`);
          if (togetherResponse.status >= 500 && attempt < 3) {
            await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
            continue;
          }
          throw lastError;
        }

        const result = await togetherResponse.json();
        imageData = result?.data?.[0]?.b64_json || result?.b64_json;
        if (!imageData) throw new Error("No image data in Together AI response");
        break;
      } catch (error) {
        lastError = error as Error;
        if (attempt < 3) await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        else throw lastError;
      }
    }

    if (!imageData) throw lastError || new Error("Failed to generate image");

    let cardComposited = false;
    if (detectedCard?.real_card_image) {
      try {
        imageData = await compositeCardImage(imageData, detectedCard.real_card_image);
        cardComposited = true;
        console.log("Card image composited");
      } catch (err) {
        console.warn("Compositing failed (non-fatal):", (err as Error).message);
      }
    }

    const fileName = `${slug}-${Date.now()}.jpg`;
    const fileBuffer = Uint8Array.from(atob(imageData), (c) => c.charCodeAt(0));
    const { error: uploadError } = await sb.storage.from("blog-hero-images")
      .upload(fileName, fileBuffer, { contentType: "image/jpeg", upsert: false });
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: { publicUrl } } = sb.storage.from("blog-hero-images").getPublicUrl(fileName);

    const { data: postData, error: updateError } = await sb
      .from("blog_posts").update({ image_hero: publicUrl }).eq("id", id).select().single();
    if (updateError) throw new Error(`DB update failed: ${updateError.message}`);

    return new Response(
      JSON.stringify({
        success: true, imageUrl: publicUrl, post: postData,
        version: FUNCTION_VERSION, promptUsed: imagePrompt,
        cardComposited,
        detectedCard: detectedCard ? { id: detectedCard.id, name: detectedCard.name, issuer: detectedCard.issuer } : null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error(`[${FUNCTION_VERSION}] Error:`, (error as Error).message);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message, version: FUNCTION_VERSION }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
