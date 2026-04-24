import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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

    const sb = getAdminClient();

    if (req.method === "GET") {
      const { data, error } = await sb
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ posts: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body as { action: string };

    if (action === "list") {
      const { data, error } = await sb
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ posts: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "upsert") {
      const { post } = body as {
        post: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          image_hero?: string | null;
          tags: string[];
          meta_title: string;
          meta_description: string;
          published: boolean;
        };
      };

      const payload = {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image_hero: post.image_hero ?? null,
        tags: post.tags,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        published: post.published,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (post.id) {
        const { data, error } = await sb
          .from("blog_posts")
          .update(payload)
          .eq("id", post.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await sb
          .from("blog_posts")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        result = data;
      }

      return new Response(JSON.stringify({ post: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const { id } = body as { id: string };
      const { error } = await sb.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
