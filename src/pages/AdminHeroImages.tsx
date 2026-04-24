import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import type { BlogPost } from '../types/blog';
import { adminFetchAllPosts } from '../lib/supabase';

const ADMIN_KEY = 'ccc_admin_secret';

function getStored(): string {
  return sessionStorage.getItem(ADMIN_KEY) ?? '';
}

function LoginScreen({ onLogin }: { onLogin: (secret: string) => void }) {
  const [value, setValue] = useState('');
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

export default function AdminHeroImages() {
  const [secret, setSecret] = useState(getStored);
  const [authed, setAuthed] = useState(false);
  const [posts, setPosts] = useState<ArticleWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [regeneratingAll, setRegeneratingAll] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);

  useEffect(() => {
    if (!secret) return;
    adminFetchAllPosts(secret)
      .then(data => {
        setPosts(data.map(p => ({
          ...p,
          generationStatus: 'idle' as const,
          hasImage: !!p.image_hero
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
    const post = posts[index];
    if (!post) return;

    setPosts(prev => {
      const next = [...prev];
      next[index].generationStatus = forceRegenerate ? 'regenerating' : 'generating';
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
        next[index].generationStatus = 'success';
        next[index].image_hero = data.imageUrl;
        next[index].updated_at = new Date().toISOString();
        next[index].hasImage = true;
        next[index].detectedCard = data.detectedCard || null;
        return next;
      });
    } catch (err) {
      setPosts(prev => {
        const next = [...prev];
        next[index].generationStatus = 'error';
        next[index].errorMessage = err instanceof Error ? err.message : String(err);
        return next;
      });
    }
  }

  async function generateAllImages() {
    setGeneratingAll(true);
    setConfirmAll(false);

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].generationStatus === 'idle') {
        await generateHeroImage(i, false);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    setGeneratingAll(false);
  }

  async function regenerateAllImages() {
    setRegeneratingAll(true);
    setConfirmRegenerate(false);

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].hasImage) {
        await generateHeroImage(i, true);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    setRegeneratingAll(false);
  }

  if (!authed) {
    return (
      <LoginScreen
        onLogin={s => {
          setSecret(s);
        }}
      />
    );
  }

  const completed = posts.filter(p => p.generationStatus === 'success').length;
  const withErrors = posts.filter(p => p.generationStatus === 'error').length;

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-bg/95 backdrop-blur border-b border-bg-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan-accent" />
              <span className="font-display font-bold text-white">Générer Images Hero</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 text-sm">{completed}/{posts.length} générées</span>
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
        <div className="mb-8 p-4 bg-cyan-accent/10 border border-cyan-accent/30 rounded-xl">
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-cyan-accent">Configuration Hugging Face :</span> Vous avez besoin d'un token API Hugging Face pour générer des images.
            <a href="https://github.com/yourusername/project/blob/main/HUGGING_FACE_SETUP.md" className="text-cyan-accent hover:underline ml-1" target="_blank" rel="noopener noreferrer">
              Consultez le guide de configuration
            </a>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card-surface p-4">
            <p className="text-slate-500 text-xs uppercase mb-1">Total articles</p>
            <p className="text-3xl font-bold text-white">{posts.length}</p>
          </div>
          <div className="card-surface p-4">
            <p className="text-slate-500 text-xs uppercase mb-1">Générées</p>
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
            disabled={generatingAll || regeneratingAll || completed === posts.length}
            className="btn-primary"
          >
            {generatingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                Générer nouvelles images
              </>
            )}
          </button>
          <button
            onClick={() => setConfirmRegenerate(true)}
            disabled={generatingAll || regeneratingAll || completed === 0}
            className="btn-secondary"
          >
            {regeneratingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Régénération en cours...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Remplacer toutes les images
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
                Cela générera une image hero pour les {posts.filter(p => p.generationStatus === 'idle').length} articles restants.
                Cela peut prendre plusieurs minutes.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setConfirmAll(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  onClick={generateAllImages}
                  className="btn-primary"
                >
                  Confirmer
                </button>
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
                Cela régénérera les {posts.filter(p => p.hasImage).length} images existantes avec des variantes différentes.
                Cela peut prendre plusieurs minutes.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setConfirmRegenerate(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  onClick={regenerateAllImages}
                  className="btn-primary"
                >
                  Confirmer
                </button>
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
                  post.generationStatus !== 'idle'
                    ? post.generationStatus === 'success'
                      ? 'border-green-accent/40 bg-green-accent/5'
                      : 'border-red-500/40 bg-red-500/5'
                    : ''
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        {post.detectedCard && (
                          <div
                            className="px-2 py-0.5 rounded text-xs font-medium text-white whitespace-nowrap flex-shrink-0"
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
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
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
                          title="Générer une image hero pour cet article"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Générer
                        </button>
                      )}
                      {post.generationStatus === 'idle' && post.hasImage && (
                        <button
                          onClick={() => generateHeroImage(idx, true)}
                          className="btn-secondary text-sm whitespace-nowrap"
                          title="Remplacer l'image hero existante"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Remplacer
                        </button>
                      )}
                      {post.generationStatus === 'generating' && (
                        <div className="flex items-center gap-2 text-slate-400 text-xs whitespace-nowrap">
                          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                          <span>Génération...</span>
                        </div>
                      )}
                      {post.generationStatus === 'regenerating' && (
                        <div className="flex items-center gap-2 text-slate-400 text-xs whitespace-nowrap">
                          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                          <span>Remplacement...</span>
                        </div>
                      )}
                      {post.generationStatus === 'success' && (
                        <div className="flex items-center gap-2 text-green-accent text-xs whitespace-nowrap">
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                          <span>Succès</span>
                        </div>
                      )}
                      {post.generationStatus === 'error' && (
                        <div className="flex items-center gap-2 text-red-400 text-xs whitespace-nowrap">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <span>Erreur</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {post.image_hero && (
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-bg-elevated">
                      <img
                        src={post.image_hero}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
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
