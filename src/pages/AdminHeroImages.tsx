import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw, Info } from 'lucide-react';
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
  promptUsed?: string;
  functionVersion?: string;
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

  async function generateHeroImage(index: number, forceRegenerate = false) {
    const post = postsRef.current[index];
    if (!post) return;

    setPosts(prev => {
      const next = [...prev];
      next[index] = { ...next[index], generationStatus: forceRegenerate ? 'regenerating' : 'generating' };
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

      setPosts(prev => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          generationStatus: 'success',
          image_hero: data.imageUrl,
          updated_at: new Date().toISOString(),
          hasImage: true,
          detectedCard: data.detectedCard || null,
          promptUsed: data.promptUsed || null,
          functionVersion: data.version || null,
        };
        return next;
      });
    } catch (err) {
      setPosts(prev => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          generationStatus: 'error',
          errorMessage: err instanceof Error ? err.message : String(err),
        };
        return next;
      });
    }
  }

  async function generateAllImages() {
    setGeneratingAll(true);
    setConfirmAll(false);

    for (let i = 0; i < postsRef.current.length; i++) {
      const post = postsRef.current[i];
      if (!post.hasImage && post.generationStatus === 'idle') {
        await generateHeroImage(i, false);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    setGeneratingAll(false);
  }

  async function regenerateAllImages() {
    setRegeneratingAll(true);
    setConfirmRegenerate(false);

    for (let i = 0; i < postsRef.current.length; i++) {
      const post = postsRef.current[i];
      if (post.hasImage && post.generationStatus === 'idle') {
        await generateHeroImage(i, true);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    setRegeneratingAll(false);
  }

  if (!authed) {
    return <LoginScreen onLogin={s => setSecret(s)} />;
  }

  const withImagesAtLoad = posts.filter(p => p.hasImage).length;
  const withoutImages = posts.filter(p => !p.hasImage).length;
  const completed = posts.filter(p => p.generationStatus === 'success').length;
  const withErrors = posts.filter(p => p.generationStatus === 'error').length;

  const canGenerateNew = !generatingAll && !regeneratingAll && withoutImages > 0;
  const canReplaceAll = !generatingAll && !regeneratingAll && withImagesAtLoad > 0;

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
            <span className="text-slate-500 text-sm">{withImagesAtLoad + completed}/{posts.length} avec image</span>
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
            Les images sont générées via <span className="font-semibold text-cyan-accent">Together AI</span> (modèle FLUX) en fonction du titre, de l'extrait et des tags de chaque article. Chaque génération prend environ 15–30 secondes.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="card-surface p-4">
            <p className="text-slate-500 text-xs uppercase mb-1">Total articles</p>
            <p className="text-3xl font-bold text-white">{posts.length}</p>
          </div>
          <div className="card-surface p-4">
            <p className="text-slate-500 text-xs uppercase mb-1">Avec image</p>
            <p className="text-3xl font-bold text-cyan-accent">{withImagesAtLoad}</p>
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
                Générer nouvelles images ({withoutImages})
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
                Remplacer toutes les images ({withImagesAtLoad})
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
                Cela générera une image hero pour les {withoutImages} articles sans image. Cela peut prendre plusieurs minutes.
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
                Cela régénérera les {withImagesAtLoad} images existantes avec des variantes différentes. Cela peut prendre plusieurs minutes.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmRegenerate(false)} className="btn-secondary">Annuler</button>
                <button onClick={regenerateAllImages} className="btn-primary">Confirmer</button>
              </div>
            </div>
          </div>
        )}

        {/* Articles list */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-surface p-4 animate-pulse">
                <div className="h-5 bg-bg-elevated rounded w-1/2 mb-2" />
                <div className="h-3 bg-bg-elevated rounded w-3/4" />
              </div>
            ))
          ) : (
            posts.map((post, idx) => (
              <div
                key={post.id}
                className={`card-surface p-4 transition-all duration-200 ${
                  post.generationStatus === 'success'
                    ? 'border-green-accent/40 bg-green-accent/5'
                    : post.generationStatus === 'error'
                    ? 'border-red-500/40 bg-red-500/5'
                    : ''
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-full border border-bg-border text-slate-500 whitespace-nowrap">
                          {post.lang}
                        </span>
                        {post.detectedCard && (
                          <div
                            className="px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap flex-shrink-0"
                            style={{
                              backgroundColor: post.detectedCard.colorPrimary || '#00D4FF',
                              color: post.detectedCard.colorSecondary || '#0A0E1A',
                            }}
                            title={`Carte détectée: ${post.detectedCard.name}`}
                          >
                            {post.detectedCard.name}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">{post.excerpt}</p>
                      {post.detectedCard && (
                        <p className="text-xs text-cyan-accent/80 mb-2">
                          Intégration: {post.detectedCard.issuer}
                        </p>
                      )}
                      {post.errorMessage && (
                        <p className="text-xs text-red-400 font-medium">{post.errorMessage}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 justify-start sm:justify-end flex-shrink-0 flex-wrap">
                      {post.generationStatus === 'idle' && !post.hasImage && (
                        <button
                          onClick={() => generateHeroImage(idx, false)}
                          className="btn-primary text-sm whitespace-nowrap"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Générer
                        </button>
                      )}
                      {post.generationStatus === 'idle' && post.hasImage && (
                        <button
                          onClick={() => generateHeroImage(idx, true)}
                          className="btn-secondary text-sm whitespace-nowrap"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Remplacer
                        </button>
                      )}
                      {(post.generationStatus === 'generating' || post.generationStatus === 'regenerating') && (
                        <div className="flex items-center gap-2 text-slate-400 text-xs whitespace-nowrap">
                          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                          <span>{post.generationStatus === 'regenerating' ? 'Remplacement...' : 'Génération...'}</span>
                        </div>
                      )}
                      {post.generationStatus === 'success' && (
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <div className="flex items-center gap-1.5 text-green-accent text-xs whitespace-nowrap">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            <span>Succès</span>
                          </div>
                          <button
                            onClick={() => generateHeroImage(idx, true)}
                            className="btn-ghost text-xs text-slate-400 hover:text-slate-200 whitespace-nowrap py-1 px-2"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Regénérer
                          </button>
                        </div>
                      )}
                      {post.generationStatus === 'error' && (
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <button
                            onClick={() => generateHeroImage(idx, post.hasImage)}
                            className="flex items-center gap-1.5 text-red-400 text-xs whitespace-nowrap hover:text-red-300 transition-colors"
                          >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Réessayer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {post.image_hero && (
                    <div className="w-full rounded-lg overflow-hidden bg-bg-elevated">
                      <div className="h-32 relative">
                        <img
                          src={post.image_hero}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {post.promptUsed && (
                        <div className="px-3 py-2 bg-bg-elevated border-t border-bg-border space-y-1">
                          {post.functionVersion && (
                            <p className="text-xs">
                              <span className="text-slate-600 font-medium mr-1">Version :</span>
                              <span className="text-cyan-accent/70 font-mono">{post.functionVersion}</span>
                            </p>
                          )}
                          <p className="text-xs text-slate-500 font-mono leading-relaxed">
                            <span className="text-slate-600 font-sans font-medium mr-1">Prompt :</span>
                            {post.promptUsed}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
