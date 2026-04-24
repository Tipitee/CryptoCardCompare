import { createClient } from '@supabase/supabase-js';
import type { CryptoCard, QuizAnswers } from '../types/card';
import type { BlogPost, BlogPostDraft } from '../types/blog';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

const SESSION_KEY = 'ccc_session_id';

export function getSessionId(): string {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid =
      'sess_' +
      Math.random().toString(36).slice(2) +
      Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

type CardRow = {
  id: string;
  name: string;
  issuer: string;
  cashback_base: number;
  cashback_premium: number;
  annual_fees: number;
  staking_required: number;
  cryptos: string[];
  available_france: boolean;
  available_eu: boolean;
  card_network: string;
  daily_limit: number;
  free_withdrawals: boolean;
  extras: string[];
  affiliate_link: string;
  badge: string | null;
  color_primary: string | null;
  color_secondary: string | null;
  real_card_image: string | null;
  image_alt: string | null;
  markets: string[];
};

function rowToCard(row: CardRow): CryptoCard {
  return {
    id: row.id,
    name: row.name,
    issuer: row.issuer,
    cashbackBase: Number(row.cashback_base),
    cashbackPremium: Number(row.cashback_premium),
    annualFees: Number(row.annual_fees),
    stakingRequired: Number(row.staking_required),
    cryptos: row.cryptos || [],
    availableFrance: row.available_france,
    availableEU: row.available_eu,
    cardNetwork: row.card_network,
    dailyLimit: Number(row.daily_limit),
    freeWithdrawals: row.free_withdrawals,
    extras: row.extras || [],
    affiliateLink: row.affiliate_link,
    badge: row.badge,
    colorPrimary: row.color_primary || '#00D4FF',
    colorSecondary: row.color_secondary || '#0A0E1A',
    realCardImage: row.real_card_image,
    imageAlt: row.image_alt,
    markets: row.markets || [],
  };
}

export async function fetchCards(market?: string): Promise<CryptoCard[]> {
  let query = supabase
    .from('cards')
    .select(
      'id, name, issuer, cashback_base, cashback_premium, annual_fees, staking_required, cryptos, available_france, available_eu, card_network, daily_limit, free_withdrawals, extras, affiliate_link, badge, color_primary, color_secondary, real_card_image, image_alt, markets'
    );
  if (market) {
    query = query.contains('markets', [market]);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as CardRow[]).map(rowToCard);
}

export async function fetchFavorites(): Promise<string[]> {
  const sid = getSessionId();
  const { data, error } = await supabase
    .from('favorites')
    .select('card_id')
    .eq('session_id', sid);
  if (error) throw error;
  return (data ?? []).map((r: { card_id: string }) => r.card_id);
}

export async function addFavoriteRemote(cardId: string): Promise<void> {
  const sid = getSessionId();
  const { error } = await supabase
    .from('favorites')
    .insert({ session_id: sid, card_id: cardId });
  if (error && error.code !== '23505') throw error;
}

export async function removeFavoriteRemote(cardId: string): Promise<void> {
  const sid = getSessionId();
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('session_id', sid)
    .eq('card_id', cardId);
  if (error) throw error;
}

export interface CompareSession {
  id: string;
  cardIds: string[];
  createdAt: string;
}

export async function saveCompareSession(cardIds: string[]): Promise<void> {
  if (cardIds.length < 2) return;
  const sid = getSessionId();
  await supabase.from('compare_sessions').insert({
    session_id: sid,
    card_ids: cardIds,
  });
}

export async function fetchRecentCompareSessions(
  limit = 5
): Promise<CompareSession[]> {
  const sid = getSessionId();
  const { data, error } = await supabase
    .from('compare_sessions')
    .select('id, card_ids, created_at')
    .eq('session_id', sid)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []).map((r: { id: string; card_ids: string[]; created_at: string }) => ({
    id: r.id,
    cardIds: r.card_ids ?? [],
    createdAt: r.created_at,
  }));
}

export async function saveQuizResult(
  answers: QuizAnswers,
  topMatches: { cardId: string; score: number }[]
): Promise<void> {
  const sid = getSessionId();
  await supabase.from('quiz_results').insert({
    session_id: sid,
    answers,
    top_matches: topMatches,
  });
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function fetchAllPosts(adminSecret: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  void adminSecret; // validated server-side; RLS allows anon read of published only
  return (data ?? []) as BlogPost[];
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  return data as BlogPost | null;
}

export async function fetchRelatedPosts(
  tags: string[],
  excludeSlug: string,
  limit = 3
): Promise<BlogPost[]> {
  if (tags.length === 0) {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .neq('slug', excludeSlug)
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data ?? []) as BlogPost[];
  }
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .neq('slug', excludeSlug)
    .overlaps('tags', tags)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as BlogPost[];
}

export async function adminFetchAllPosts(adminSecret: string): Promise<BlogPost[]> {
  const res = await fetch(
    `${supabaseUrl}/functions/v1/admin-blog?action=list`,
    {
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'X-Admin-Secret': adminSecret,
      },
    }
  );
  if (!res.ok) throw new Error('Unauthorized');
  const json = await res.json();
  return json.posts as BlogPost[];
}

export async function adminUpsertPost(
  post: Partial<BlogPost> & { slug: string },
  adminSecret: string
): Promise<BlogPost> {
  const res = await fetch(`${supabaseUrl}/functions/v1/admin-blog`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'X-Admin-Secret': adminSecret,
    },
    body: JSON.stringify({ action: 'upsert', post }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error ?? 'Failed to save post');
  }
  const json = await res.json();
  return json.post as BlogPost;
}

export async function adminDeletePost(id: string, adminSecret: string): Promise<void> {
  const res = await fetch(`${supabaseUrl}/functions/v1/admin-blog`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'X-Admin-Secret': adminSecret,
    },
    body: JSON.stringify({ action: 'delete', id }),
  });
  if (!res.ok) throw new Error('Failed to delete post');
}

export interface BulkPreviewBlock {
  index: number;
  preview: string;
  fullText: string;
  length: number;
}

export interface BulkResult {
  index: number;
  status: 'success' | 'error';
  title?: string;
  slug?: string;
  id?: string;
  error?: string;
}

export async function bulkPreviewBlocks(
  text: string,
  adminSecret: string,
  separator?: string,
  context?: string,
): Promise<{ blocks: BulkPreviewBlock[]; count: number }> {
  const res = await fetch(`${supabaseUrl}/functions/v1/bulk-generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'X-Admin-Secret': adminSecret,
    },
    body: JSON.stringify({ action: 'preview', text, separator, context }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur' }));
    throw new Error(err.error ?? 'Erreur de prévisualisation');
  }
  return res.json();
}

export async function bulkGenerateOne(
  block: string,
  index: number,
  adminSecret: string,
  context?: string,
): Promise<BulkResult> {
  const res = await fetch(`${supabaseUrl}/functions/v1/bulk-generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'X-Admin-Secret': adminSecret,
    },
    body: JSON.stringify({ action: 'generate-one', block, index, context }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur' }));
    return { index, status: 'error', error: err.error ?? 'Erreur de génération' };
  }
  return res.json();
}

export async function generateArticle(
  topic: string,
  adminSecret: string,
  saveToDb = false
): Promise<BlogPostDraft> {
  const res = await fetch(`${supabaseUrl}/functions/v1/generate-article`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'X-Admin-Secret': adminSecret,
    },
    body: JSON.stringify({ topic, saveToDb }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur de génération' }));
    throw new Error(err.error ?? 'Erreur de génération');
  }
  const json = await res.json();
  return json.article as BlogPostDraft;
}
