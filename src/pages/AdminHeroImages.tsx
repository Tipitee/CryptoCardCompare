import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw, Info, Globe } from 'lucide-react';
import type { BlogPost } from '../types/blog';
import { adminFetchAllPosts } from '../lib/supabase';

const ADMIN_KEY = 'ccc_admin_secret';

function getStored(): string {
  return sessionStorage.getItem(ADMIN_KEY) ?? '';
}

function LoginScreen({ onLogin }: { onLogin: (secret: string) => void }) {
  const [value, setValue] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminFetchAllPosts(value);
      sessionStorage.setItem(ADMIN_KEY, value);
      onLogin(value);
    } catch {
      setError('Mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="card-surface p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-7 h-7 text-cyan-accent" />
          </div>
          <h1 className="text-xl font-display font-bold text-white">Générer Images Hero</h1>
          <p className="text-slate-500 text-sm mt-1">CryptoCardCompare Admin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Mot de passe admin</label>
            <input
              type="password"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="input-field w-full"
              placeholder="••••••••"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading || !value} className="btn-primary w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connexion'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}

type GenerationStatus = 'idle' | 'generating' | 'regenerating' | 'success' | 'error';

interface DetectedCard {
  id: string;
  name: string;
  issuer: string;
  colorPrimary: string | null;
  colorSecondary: string | null;
  badge: string | null;
}

interface ArticleWithStatus extends BlogPost {
  generationStatus: GenerationStatus;
  errorMessage?: string;
  hasImage: boolean;
  detectedCard?: DetectedCard | null;
}

/** A group of articles sharing the same topic_key (or a single article without one). */
interface ArticleGroup {
  topicKey: string;
  /** Index of the representative in the flat posts array (FR preferred). */
  repIndex: number;
  representative: ArticleWithStatus;
  langs: string[];
  hasImage: boolean;
  allHaveImages: boolean;
}

const LANG_ORDER = ['fr', 'de', 'es', 'it', 'en'];

function buildGroups(posts: ArticleWithStatus[]): ArticleGroup[] {
  const map = new Map<string, { indices: number[]; articles: ArticleWithStatus[] }>();
  posts.forEach((p, i) => {
    // Articles without topic_key: show all langs as solo items
    const key = p.topic_key || `__solo__${p.id}`;
    if (!key) return;
    if (!map.has(key)) map.set(key, { indices: [], articles: [] });
    map.get(key)!.indices.push(i);
    map.get(key)!.articles.push(p);
  });

  return Array.from(map.entries()).map(([topicKey, { indices, articles }]) => {
    // Prefer FR as representative
    const frLocal = articles.findIndex(a => a.lang === 'fr');
    const localRep = frLocal >= 0 ? frLocal : 0;
    const repIndex = indices[localRep];
    const representative = articles[localRep];
    const langs = articles.map(a => a.lang).sort(
      (a, b) => LANG_ORDER.indexOf(a) - LANG_ORDER.indexOf(b)
    );
    return {
      topicKey,
      repIndex,
      representative,
      langs,
      hasImage: articles.some(a => a.hasImage || !!a.image_hero),
      allHaveImages: articles.every(a => a.hasImage || !!a.image_hero),
    };
  });
}

export default function AdminHeroImages() {
  const [secret, setSecret] = useState(getStored);
  const [authed, setAuthed] = useState(false);
  const [posts, setPosts] = useState<ArticleWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [regeneratingAll, setRegeneratingAll] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);

  // Ref so batch loops always read the latest posts state without stale closure
  const postsRef = useRef<ArticleWithStatus[]>([]);
  postsRef.current = posts;

  useEffect(() => {
    if (!secret) return;
    adminFetchAllPosts(secret)
      .then(data => {
        setPosts(data.map(p => ({
          ...p,
          generationStatus: 'idle' as const,
          hasImage: !!p.image_hero,
        })));
        setAuthed(true);
      })
      .catch(() => {
        sessionStorage.removeItem(ADMIN_KEY);
        setSecret('');
      })
      .finally(() => setLoading(false));
  }, [secret]);

  // Derived groups (re-computed whenever posts change)
  const groups = useMemo(() => buildGroups(posts), [posts]);

  async function generateHeroImage(repIndex: number, forceRegenerate = false) {
    const post = postsRef.current[repIndex];
    if (!post) return;

    setPosts(prev => {
      const next = [...prev];
      next[repIndex] = { ...next[repIndex], generationStatus: forceRegenerate ? 'regenerating' : 'generating' };
      return next;
    });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-hero-image`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'X-Admin-Secret': secret,
          },
          body: JSON.stringify({
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            tags: post.tags,
            forceRegenerate,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur inconnue' }));
        throw new Error(err.error ?? 'Erreur de génération');
      }

      const data = await res.json();
      if (!data.imageUrl) {
        throw new Error('Aucune image reçue du serveur');
      }

      const generatedTopicKey = post.topic_key;

      setPosts(prev => {
        const next = [...prev];
        // Update the representative post
        next[repIndex] = {
          ...next[repIndex],
          generationStatus: 'success',
          image_hero: data.imageUrl,
          hasImage: true,
          detectedCard: data.detectedCard || null,
        };
        // Propagate image URL to all language variants with the same topic_key
        if (generatedTopicKey) {
          next.forEach((p, i) => {
            if (i !== repIndex && p.topic_key === generatedTopicKey) {
              next[i] = { ...next[i], image_hero: data.imageUrl, hasImage: true };
            }
          });
        }
        return next;
      });
    } catch (err) {
      setPosts(prev => {
        const next = [...prev];
        next[repIndex] = {
          ...next[repIndex],
          generationStatus: 'error',
          errorMessage: err instanceof Error ? err.message : String(err),
        };
        return next;
      });
    }
  }

  function buildCurrentGroups(): ArticleGroup[] {
    return buildGroups(postsRef.current);
  }

  async function generateAllImages() {
    setGeneratingAll(true);
    setConfirmAll(false);

    const currentGroups = buildCurrentGroups();
    for (const group of currentGroups) {
      if (!group.hasImage && postsRef.current[group.repIndex]?.generationStatus === 'idle') {
        await generateHeroImage(group.repIndex, false);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    setGeneratingAll(false);
  }

  async function regenerateAllImages() {
    setRegeneratingAll(true);
    setConfirmRegenerate(false);

    const currentGroups = buildCurrentGroups();
    for (const group of currentGroups) {
      if (group.hasImage && postsRef.current[group.repIndex]?.generationStatus === 'idle') {
        await generateHeroImage(group.repIndex, true);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    setRegeneratingAll(false);
  }

  if (!authed) {
    return <LoginScreen onLogin={s => setSecret(s)} />;
  }

  const totalGroups = groups.length;
  const groupsWithImage = groups.filter(g => g.hasImage).length;
  const groupsWithout = groups.filter(g => !g.hasImage).length;
  const completed = posts.filter(p => p.generationStatus === 'success').length;
  const withErrors = posts.filter(p => p.generationStatus === 'error').length;

  const canGenerateNew = !generatingAll && !regeneratingAll && groupsWithout > 0;
  const canReplaceAll = !generatingAll && !regeneratingAll && groupsWithImage > 0;

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-bg/95 backdrop-blur border-b border-bg-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin/blog" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan-accent" />
              <span className="font-display font-bold text-white">Générer Images Hero</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 text-sm">{groupsWithImage}/{totalGroups} groupes avec image</span>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="btn-ghost text-sm text-slate-500"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Info banner */}
        <div className="mb-8 p-4 bg-cyan-accent/10 border border-cyan-accent/30 rounded-xl flex gap-3 items-start">
          <Info className="w-4 h-4 text-cyan-accent mt-0.5 shrink-0" />
          <p className="text-sm text-slate-300">
            Les articles sont <span className="font-semibold text-cyan-accent">regroupés par sujet</span> — générer une image pour un groupe la partage automatiquement avec toutes les langues (FR · DE · ES · IT · EN). Chaque génération prend environ 15–30 secondes via <span className="font-semibold text-cyan-accent">Together AI</span> (FLUX).
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="card-surface p-4">
            <p className="text-slate-500 text-xs uppercase mb-1">Groupes / sujets</p>
            <p className="text-3xl font-bold text-white">{totalGroups}</p>
          </div>
          <div className="card-surface p-4">
            <p className="text-slate-500 text-xs uppercase mb-1">Avec image</p>
            <p className="text-3xl font-bold text-cyan-accent">{groupsWithImage}</p>
          </div>
          <div className="card-surface p-4">
            <p className="text-slate-500 text-xs uppercase mb-1">Générées (session)</p>
            <p className="text-3xl font-bold text-green-accent">{completed}</p>
          </div>
          <div className="card-surface p-4">
            <p className="text-slate-500 text-xs uppercase mb-1">Erreurs</p>
            <p className="text-3xl font-bold text-red-400">{withErrors}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setConfirmAll(true)}
            disabled={!canGenerateNew}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {generatingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                Générer nouvelles images ({groupsWithout} groupes)
              </>
            )}
          </button>
          <button
            onClick={() => setConfirmRegenerate(true)}
            disabled={!canReplaceAll}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {regeneratingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Régénération en cours...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Remplacer toutes les images ({groupsWithImage} groupes)
              </>
            )}
          </button>
        </div>

        {/* Confirmation modals */}
        {confirmAll && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
            <div className="card-surface p-6 w-full max-w-sm text-center">
              <ImageIcon className="w-10 h-10 text-cyan-accent mx-auto mb-3" />
              <h3 className="font-display font-bold text-white mb-2">Générer nouvelles images ?</h3>
              <p className="text-slate-500 text-sm mb-5">
                Cela générera une image pour les <strong className="text-white">{groupsWithout} groupes</strong> sans image. L'image sera partagée entre toutes les langues du groupe. Cela peut prendre plusieurs minutes.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmAll(false)} className="btn-secondary">Annuler</button>
                <button onClick={generateAllImages} className="btn-primary">Confirmer</button>
              </div>
            </div>
          </div>
        )}

        {confirmRegenerate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
            <div className="card-surface p-6 w-full max-w-sm text-center">
              <RefreshCw className="w-10 h-10 text-cyan-accent mx-auto mb-3" />
              <h3 className="font-display font-bold text-white mb-2">Remplacer toutes les images ?</h3>
              <p className="text-slate-500 text-sm mb-5">
                Cela régénérera les <strong className="text-white">{groupsWithImage} groupes</strong> avec des variantes différentes. La nouvelle image sera partagée entre toutes les langues. Cela peut prendre plusieurs minutes.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmRegenerate(false)} className="btn-secondary">Annuler</button>
                <button onClick={regenerateAllImages} className="btn-primary">Confirmer</button>
              </div>
            </div>
          </div>
        )}

        {/* Articles list (grouped) */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-surface p-4 animate-pulse">
                <div className="h-5 bg-bg-elevated rounded w-1/2 mb-2" />
                <div className="h-3 bg-bg-elevated rounded w-3/4" />
              </div>
            ))
          ) : (
            groups.map((group) => {
              const rep = group.representative;
              const repPost = posts[group.repIndex];
              const status = repPost?.generationStatus ?? 'idle';
              const imageUrl = repPost?.image_hero || rep.image_hero;
              const isGrouped = !group.topicKey.startsWith('__solo__');

              return (
                <div
                  key={group.topicKey}
                  className={`card-surface p-4 transition-all duration-200 ${
                    status === 'success'
                      ? 'border-green-accent/40 bg-green-accent/5'
                      : status === 'error'
                      ? 'border-red-500/40 bg-red-500/5'
                      : ''
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">
                            {rep.title}
                          </h3>
                          {/* Language badges */}
                          {isGrouped ? (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Globe className="w-3 h-3 text-cyan-accent/60" />
                              {group.langs.map(l => (
                                <span
                                  key={l}
                                  className="text-xs px-1.5 py-0.5 rounded border border-cyan-accent/30 text-cyan-accent/80 bg-cyan-accent/5 uppercase"
                                >
                                  {l}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full border border-bg-border text-slate-500 whitespace-nowrap">
                              {rep.lang}
                            </span>
                          )}
                          {repPost?.detectedCard && (
                            <div
                              className="px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap flex-shrink-0"
                              style={{
                                backgroundColor: repPost.detectedCard.colorPrimary || '#00D4FF',
                                color: repPost.detectedCard.colorSecondary || '#0A0E1A',
                              }}
                              title={`Carte détectée: ${repPost.detectedCard.name}`}
                            >
                              {repPost.detectedCard.name}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{rep.excerpt}</p>
                        {repPost?.detectedCard && (
                          <p className="text-xs text-cyan-accent/80 mb-2">
                            Intégration: {repPost.detectedCard.issuer}
                          </p>
                        )}
                        {repPost?.errorMessage && (
                          <p className="text-xs text-red-400 font-medium">{repPost.errorMessage}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 justify-start sm:justify-end flex-shrink-0 flex-wrap">
                        {status === 'idle' && !group.hasImage && (
                          <button
                            onClick={() => generateHeroImage(group.repIndex, false)}
                            className="btn-primary text-sm whitespace-nowrap"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Générer
                          </button>
                        )}
                        {status === 'idle' && group.hasImage && (
                          <button
                            onClick={() => generateHeroImage(group.repIndex, true)}
                            className="btn-secondary text-sm whitespace-nowrap"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Remplacer
                          </button>
                        )}
                        {(status === 'generating' || status === 'regenerating') && (
                          <div className="flex items-center gap-2 text-slate-400 text-xs whitespace-nowrap">
                            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                            <span>{status === 'regenerating' ? 'Remplacement...' : 'Génération...'}</span>
                          </div>
                        )}
                        {status === 'success' && (
                          <div className="flex items-center gap-2 text-green-accent text-xs whitespace-nowrap">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span>Propagé {isGrouped ? `(${group.langs.length} langues)` : ''}</span>
                          </div>
                        )}
                        {status === 'error' && (
                          <button
                            onClick={() => generateHeroImage(group.repIndex, false)}
                            className="flex items-center gap-2 text-red-400 text-xs whitespace-nowrap hover:text-red-300 transition-colors"
                          >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>Réessayer</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {imageUrl && (
                      <div className="w-full h-32 rounded-lg overflow-hidden bg-bg-elevated">
                        <img
                          src={imageUrl}
                          alt={rep.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
