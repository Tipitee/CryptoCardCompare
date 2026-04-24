const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const togetherKey = Deno.env.get("TOGETHER_API_KEY");
    if (!togetherKey) {
      throw new Error("TOGETHER_API_KEY not configured");
    }

    if (req.method !== "POST") {
      throw new Error("Only POST requests allowed");
    }

    const body = await req.json();
    const { model, prompt, width, height, steps, n, response_format } = body;

    if (!prompt) {
      throw new Error("prompt is required");
    }

    console.log("Proxying Together AI request:", {
      model: model || "black-forest-labs/FLUX.1-schnell",
      promptLength: prompt.length,
    });

    let togetherResponse;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Together AI attempt ${attempt}/3`);

        togetherResponse = await fetch("https://api.together.xyz/v1/images/generations", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${togetherKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model || "black-forest-labs/FLUX.1-schnell",
            prompt,
            width: width || 1360,
            height: height || 768,
            steps: steps || 4,
            n: n || 1,
            response_format: response_format || "b64_json",
          }),
        });

        console.log(`Together AI response status: ${togetherResponse.status}`);

        if (!togetherResponse.ok) {
          const errorText = await togetherResponse.text();
          console.error(`Together AI error (attempt ${attempt}):`, {
            status: togetherResponse.status,
            error: errorText,
          });

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
        console.log("Together AI success, returning image data");

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
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

    throw lastError || new Error("Unknown error");
  } catch (error) {
    console.error("together-ai-proxy error:", (error as Error).message);

    return new Response(
      JSON.stringify({
        error: (error as Error).message,
        type: "proxy_error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
