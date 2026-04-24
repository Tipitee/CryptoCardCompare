import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Check, CreditCard as Edit2, Eye, EyeOff, FileText, Loader2, Plus, Save, Sparkles, Trash2, X } from 'lucide-react';
import type { BlogPost } from '../types/blog';
import { adminUpsertPost, adminDeletePost, adminFetchAllPosts, generateArticle, bulkPreviewBlocks, bulkGenerateOne } from '../lib/supabase';
import type { BulkPreviewBlock, BulkResult } from '../lib/supabase';
import { renderMarkdown, estimateReadTime } from '../utils/markdown';

const ADMIN_KEY = 'ccc_admin_secret';

function getStored(): string {
  return sessionStorage.getItem(ADMIN_KEY) ?? '';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ── Login screen ──────────────────────────────────────────────────────────────
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
            <BookOpen className="w-7 h-7 text-cyan-accent" />
          </div>
          <h1 className="text-xl font-display font-bold text-white">Admin Blog</h1>
          <p className="text-slate-500 text-sm mt-1">CryptoCardCompare</p>
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

// ── Empty form state ──────────────────────────────────────────────────────────
function emptyForm(): Partial<BlogPost> {
  return {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_hero: '',
    tags: [],
    meta_title: '',
    meta_description: '',
    published: false,
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

// ── Main admin panel ──────────────────────────────────────────────────────────
export default function AdminBlog() {
  const [secret, setSecret] = useState(getStored);
  const [authed, setAuthed] = useState(false);

  // Verify stored secret on mount
  useEffect(() => {
    if (!secret) return;
    adminFetchAllPosts(secret)
      .then(() => setAuthed(true))
      .catch(() => { sessionStorage.removeItem(ADMIN_KEY); setSecret(''); });
  }, []);

  if (!authed) {
    return (
      <LoginScreen
        onLogin={s => { setSecret(s); setAuthed(true); }}
      />
    );
  }

  return <AdminPanel secret={secret} onLogout={() => { sessionStorage.removeItem(ADMIN_KEY); setAuthed(false); setSecret(''); }} />;
}

function AdminPanel({ secret, onLogout }: { secret: string; onLogout: () => void }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPost, setEditPost] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [generateTopic, setGenerateTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateModal, setGenerateModal] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [preview, setPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [bulkModal, setBulkModal] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await adminFetchAllPosts(secret);
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditPost(emptyForm());
    setIsNew(true);
    setPreview(false);
    setTagInput('');
  }

  function openEdit(post: BlogPost) {
    setEditPost({ ...post });
    setIsNew(false);
    setPreview(false);
    setTagInput('');
  }

  function closeEdit() {
    setEditPost(null);
    setSaveMsg('');
  }

  function setField<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setEditPost(prev => {
      if (!prev) return prev;
      const next = { ...prev, [key]: value };
      if (key === 'title' && isNew) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (!t || editPost?.tags?.includes(t)) { setTagInput(''); return; }
    setField('tags', [...(editPost?.tags ?? []), t]);
    setTagInput('');
  }

  function removeTag(tag: string) {
    setField('tags', (editPost?.tags ?? []).filter(t => t !== tag));
  }

  async function handleSave(publish?: boolean) {
    if (!editPost?.title || !editPost?.slug) return;
    const post = {
      ...editPost,
      published: publish !== undefined ? publish : (editPost.published ?? false),
    } as Partial<BlogPost> & { slug: string };

    try {
      const saved = await adminUpsertPost(post, secret);
      setPosts(prev => {
        const idx = prev.findIndex(p => p.id === saved.id);
        if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
        return [saved, ...prev];
      });
      setEditPost(saved);
      setIsNew(false);
      setSaveMsg('Sauvegardé !');
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => setSaveMsg(''), 2500);
    } catch (err) {
      setSaveMsg(`Erreur : ${String(err)}`);
    }
  }

  async function handleDelete(id: string) {
    await adminDeletePost(id, secret);
    setPosts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    if (editPost?.id === id) closeEdit();
  }

  async function handleGenerate() {
    if (!generateTopic.trim()) return;
    setGenerating(true);
    try {
      const draft = await generateArticle(generateTopic.trim(), secret, false);
      setEditPost({
        ...emptyForm(),
        title: draft.title,
        slug: draft.slug,
        excerpt: draft.excerpt,
        content: draft.content,
        tags: draft.tags,
        meta_title: draft.meta_title,
        meta_description: draft.meta_description,
        published: false,
      });
      setIsNew(true);
      setGenerateModal(false);
      setGenerateTopic('');
    } catch (err) {
      alert(`Erreur de génération : ${String(err)}`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-bg/95 backdrop-blur border-b border-bg-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-accent" />
              <span className="font-display font-bold text-white">Admin Blog</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 text-sm">{posts.length} articles</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setBulkModal(true)} className="btn-secondary text-sm">
              <FileText className="w-4 h-4" />
              Import en masse
            </button>
            <button onClick={() => setGenerateModal(true)} className="btn-primary text-sm">
              <Sparkles className="w-4 h-4" />
              Générer avec Claude
            </button>
            <button onClick={openNew} className="btn-secondary text-sm">
              <Plus className="w-4 h-4" />
              Nouveau
            </button>
            <button onClick={onLogout} className="btn-ghost text-sm text-slate-500">
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Posts list */}
        <div className={`flex flex-col gap-3 ${editPost ? 'hidden lg:flex lg:w-80 shrink-0' : 'w-full'}`}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-surface p-4 animate-pulse">
                <div className="h-5 bg-bg-elevated rounded w-3/4 mb-2" />
                <div className="h-3 bg-bg-elevated rounded w-1/2" />
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">Aucun article. Créez-en un !</p>
            </div>
          ) : (
            posts.map(post => (
              <button
                key={post.id}
                onClick={() => openEdit(post)}
                className={`card-surface p-4 text-left hover:border-cyan-accent/30 transition-colors ${
                  editPost?.id === post.id ? 'border-cyan-accent/50 bg-cyan-accent/5' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-white text-sm leading-snug line-clamp-2">
                    {post.title}
                  </p>
                  <span
                    className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                      post.published
                        ? 'bg-green-accent/10 text-green-accent'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {post.published ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-3">
                  <span>{formatDate(post.created_at)}</span>
                  <span>{estimateReadTime(post.content)} min</span>
                </p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 3).map(t => (
                      <span key={t} className="text-xs text-slate-500 bg-bg-elevated px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Editor */}
        {editPost && (
          <div className="flex-1 min-w-0">
            <div className="card-surface overflow-hidden">
              {/* Editor header */}
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-bg-border">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreview(false)}
                    className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${!preview ? 'bg-cyan-accent/20 text-cyan-accent' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Edit2 className="w-3.5 h-3.5 inline mr-1.5" />
                    Éditer
                  </button>
                  <button
                    onClick={() => setPreview(true)}
                    className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${preview ? 'bg-cyan-accent/20 text-cyan-accent' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Eye className="w-3.5 h-3.5 inline mr-1.5" />
                    Aperçu
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {saveMsg && (
                    <span className={`text-xs flex items-center gap-1 ${saveMsg.startsWith('Erreur') ? 'text-red-400' : 'text-green-accent'}`}>
                      {!saveMsg.startsWith('Erreur') && <Check className="w-3.5 h-3.5" />}
                      {saveMsg}
                    </span>
                  )}
                  <button
                    onClick={() => handleSave()}
                    className="btn-secondary text-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Brouillon
                  </button>
                  <button
                    onClick={() => handleSave(!editPost.published)}
                    className={`text-sm px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                      editPost.published
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-green-accent/20 text-green-accent hover:bg-green-accent/30 border border-green-accent/30'
                    }`}
                  >
                    {editPost.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {editPost.published ? 'Dépublier' : 'Publier'}
                  </button>
                  {editPost.id && (
                    <button
                      onClick={() => setDeleteConfirm(editPost.id!)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={closeEdit} className="p-2 rounded-lg text-slate-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {preview ? (
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                  <h1 className="text-3xl font-display font-bold text-white mb-2">{editPost.title}</h1>
                  <p className="text-slate-400 mb-6 text-lg">{editPost.excerpt}</p>
                  <div
                    className="prose-crypto"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(editPost.content ?? '') }}
                  />
                </div>
              ) : (
                <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                  {/* Title */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Titre *</label>
                    <input
                      value={editPost.title ?? ''}
                      onChange={e => setField('title', e.target.value)}
                      className="input-field w-full font-display font-bold text-lg"
                      placeholder="Titre de l'article"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Slug (URL) *</label>
                    <input
                      value={editPost.slug ?? ''}
                      onChange={e => setField('slug', slugify(e.target.value))}
                      className="input-field w-full font-mono text-sm text-cyan-accent"
                      placeholder="mon-article"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Extrait</label>
                    <textarea
                      value={editPost.excerpt ?? ''}
                      onChange={e => setField('excerpt', e.target.value)}
                      className="input-field w-full resize-none"
                      rows={2}
                      placeholder="Résumé court (150-160 caractères)"
                    />
                    <p className="text-xs text-slate-600 mt-0.5 text-right">
                      {(editPost.excerpt ?? '').length} / 160
                    </p>
                  </div>

                  {/* Image hero */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">URL image hero (optionnel)</label>
                    <input
                      value={editPost.image_hero ?? ''}
                      onChange={e => setField('image_hero', e.target.value)}
                      className="input-field w-full text-sm"
                      placeholder="https://images.pexels.com/..."
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(editPost.tags ?? []).map(tag => (
                        <span key={tag} className="chip flex items-center gap-1 text-xs">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                        className="input-field flex-1 text-sm"
                        placeholder="Ajouter un tag (Entrée)"
                      />
                      <button onClick={addTag} className="btn-secondary text-sm">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Contenu Markdown *{' '}
                      <span className="text-slate-600">
                        ({estimateReadTime(editPost.content ?? '')} min de lecture estimé)
                      </span>
                    </label>
                    <textarea
                      value={editPost.content ?? ''}
                      onChange={e => setField('content', e.target.value)}
                      className="input-field w-full resize-y font-mono text-sm leading-relaxed"
                      rows={20}
                      placeholder="# Titre&#10;&#10;Votre contenu en Markdown..."
                    />
                  </div>

                  {/* SEO */}
                  <div className="border-t border-bg-border pt-4 space-y-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SEO</p>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Meta title</label>
                      <input
                        value={editPost.meta_title ?? ''}
                        onChange={e => setField('meta_title', e.target.value)}
                        className="input-field w-full text-sm"
                        placeholder="Titre SEO (55-60 caractères)"
                      />
                      <p className="text-xs text-slate-600 mt-0.5 text-right">{(editPost.meta_title ?? '').length} / 60</p>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Meta description</label>
                      <textarea
                        value={editPost.meta_description ?? ''}
                        onChange={e => setField('meta_description', e.target.value)}
                        className="input-field w-full resize-none text-sm"
                        rows={2}
                        placeholder="Description SEO (150-160 caractères)"
                      />
                      <p className="text-xs text-slate-600 mt-0.5 text-right">{(editPost.meta_description ?? '').length} / 160</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Generate modal */}
      {generateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
          <div className="card-surface p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-accent" />
                <h2 className="font-display font-bold text-white">Générer un article avec Claude</h2>
              </div>
              <button onClick={() => setGenerateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Décrivez le sujet de l'article. Claude va générer un contenu professionnel en français
              de 1200 à 1800 mots, structuré et orienté SEO.
            </p>
            <textarea
              value={generateTopic}
              onChange={e => setGenerateTopic(e.target.value)}
              className="input-field w-full resize-none mb-4"
              rows={3}
              placeholder="Ex: Comment choisir sa carte crypto en 2025 quand on est débutant ?"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setGenerateModal(false)} className="btn-ghost">
                Annuler
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating || !generateTopic.trim()}
                className="btn-primary"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Générer l'article
                  </>
                )}
              </button>
            </div>
            {generating && (
              <p className="text-xs text-slate-500 text-center mt-3">
                Claude rédige votre article (~20-40 secondes)...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
          <div className="card-surface p-6 w-full max-w-sm text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-white mb-2">Supprimer l'article ?</h3>
            <p className="text-slate-500 text-sm mb-5">Cette action est irréversible.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-medium text-sm transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk import modal */}
      {bulkModal && (
        <BulkImportModal
          secret={secret}
          onClose={() => setBulkModal(false)}
          onDone={() => { setBulkModal(false); loadPosts(); }}
        />
      )}
    </div>
  );
}

// ── Bulk import modal ─────────────────────────────────────────────────────────
type BulkPhase = 'input' | 'preview' | 'generating' | 'done';

type SeparatorMode = 'number' | 'hr' | 'double-newline' | 'custom';

const SEPARATOR_OPTIONS: { value: SeparatorMode; label: string; hint: string }[] = [
  { value: 'number', label: 'Numéros (1. 2. 3.)', hint: 'Découpe sur chaque ligne commençant par un chiffre suivi d\'un point' },
  { value: 'hr', label: 'Tirets (---)', hint: 'Découpe sur les lignes de tirets ou étoiles (---, ***, ==)' },
  { value: 'double-newline', label: 'Double saut de ligne', hint: 'Découpe sur les paragraphes séparés par une ligne vide' },
  { value: 'custom', label: 'Séparateur personnalisé', hint: 'Entrez le texte exact qui sépare vos articles' },
];

function BulkImportModal({
  secret,
  onClose,
  onDone,
}: {
  secret: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [context, setContext] = useState('');
  const [articlesText, setArticlesText] = useState('');
  const [contextOpen, setContextOpen] = useState(false);
  const [separatorMode, setSeparatorMode] = useState<SeparatorMode>('number');
  const [customSeparator, setCustomSeparator] = useState('');
  const [phase, setPhase] = useState<BulkPhase>('input');
  const [blocks, setBlocks] = useState<BulkPreviewBlock[]>([]);
  const [results, setResults] = useState<BulkResult[]>([]);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [succeeded, setSucceeded] = useState(0);
  const [total, setTotal] = useState(0);

  async function handlePreview() {
    if (!articlesText.trim()) return;
    setLoadingPreview(true);
    setError('');
    try {
      const sep = separatorMode === 'custom' ? customSeparator : separatorMode;
      const data = await bulkPreviewBlocks(articlesText, secret, sep, context.trim() || undefined);
      setBlocks(data.blocks);
      setPhase('preview');
    } catch (err) {
      setError(String(err));
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleGenerate() {
    setPhase('generating');
    setResults([]);
    setError('');
    setSucceeded(0);
    setTotal(blocks.length);

    const ctx = context.trim() || undefined;
    const accumulated: BulkResult[] = [];

    for (let i = 0; i < blocks.length; i++) {
      setGeneratingIndex(i);
      const result = await bulkGenerateOne(blocks[i].fullText, i, secret, ctx);
      accumulated.push(result);
      setResults([...accumulated]);
      if (result.status === 'success') {
        setSucceeded(prev => prev + 1);
      }
    }

    setGeneratingIndex(null);
    setPhase('done');
  }

  const selectedSep = SEPARATOR_OPTIONS.find(o => o.value === separatorMode)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
      <div className="card-surface w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bg-border shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-accent" />
            <h2 className="font-display font-bold text-white">Import en masse</h2>
            {phase === 'preview' && (
              <span className="text-xs text-slate-400 bg-bg-elevated px-2 py-0.5 rounded-full">
                {blocks.length} article{blocks.length > 1 ? 's' : ''} détecté{blocks.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {phase !== 'generating' && (
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* ── Input phase ── */}
          {phase === 'input' && (
            <>
              {/* Zone 1: Global context (collapsible) */}
              <div className="border border-bg-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setContextOpen(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-bg-elevated hover:bg-bg-border/40 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">1</span>
                    <span className="text-sm font-medium text-slate-300">Contexte global & stratégie éditoriale</span>
                    <span className="text-xs text-slate-500">(optionnel)</span>
                    {context.trim() && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                        {context.length} car.
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 text-xs">{contextOpen ? '▲ Réduire' : '▼ Ouvrir'}</span>
                </button>
                {contextOpen && (
                  <div className="p-4 border-t border-bg-border space-y-2">
                    <p className="text-xs text-slate-500">
                      Collez ici votre stratégie éditoriale, les règles d'or, le ton, les consignes SEO globales.
                      Ce texte sera transmis à Claude pour <strong className="text-slate-400">chaque article</strong> — il n'est jamais découpé en blocs.
                    </p>
                    <textarea
                      value={context}
                      onChange={e => setContext(e.target.value)}
                      className="input-field w-full resize-none font-mono text-sm leading-relaxed"
                      rows={8}
                      placeholder={"Plan Éditorial SEO — CryptoCardCompare\n\nStratégie éditoriale\nCe plan est structuré en 4 couches...\n\nRègles d'or pour chaque article\n• Intégrer un lien vers le comparateur...\n• Ajouter un bloc FAQ structuré..."}
                    />
                  </div>
                )}
              </div>

              {/* Zone 2: Articles */}
              <div className="border border-bg-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-bg-elevated flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-accent/20 text-cyan-accent text-xs font-bold flex items-center justify-center">2</span>
                  <span className="text-sm font-medium text-slate-300">Articles à générer</span>
                </div>
                <div className="p-4 border-t border-bg-border space-y-3">
                  <p className="text-xs text-slate-500">
                    Collez uniquement la liste de vos articles (titre, mots-clés, instructions pour chacun).
                    Choisissez ensuite comment ils sont séparés.
                  </p>
                  <textarea
                    value={articlesText}
                    onChange={e => setArticlesText(e.target.value)}
                    className="input-field w-full resize-none font-mono text-sm leading-relaxed"
                    rows={12}
                    placeholder={"1. Meilleure carte crypto en France en 2026 : comparatif complet\nMots-clés : meilleure carte crypto france · carte bancaire crypto 2026\nIntention : Transactionnel\n\n2. Qu'est-ce qu'une carte crypto ? Guide complet pour débutants\nMots-clés : carte crypto explication · comment fonctionne carte crypto\n..."}
                    autoFocus
                  />
                  <p className="text-xs text-slate-600 text-right">{articlesText.length} caractères</p>

                  {/* Separator selector */}
                  <div className="space-y-2">
                    <label className="block text-xs text-slate-500 font-medium">Comment sont séparés vos articles ?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {SEPARATOR_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setSeparatorMode(opt.value)}
                          className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors ${
                            separatorMode === opt.value
                              ? 'border-cyan-accent/50 bg-cyan-accent/10 text-cyan-accent'
                              : 'border-bg-border bg-bg-elevated text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          <span className="font-medium block">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 italic">{selectedSep.hint}</p>
                    {separatorMode === 'custom' && (
                      <input
                        value={customSeparator}
                        onChange={e => setCustomSeparator(e.target.value)}
                        className="input-field w-full text-sm font-mono"
                        placeholder="Ex: === ou ## Article ou -----"
                      />
                    )}
                  </div>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
            </>
          )}

          {/* ── Preview phase ── */}
          {phase === 'preview' && (
            <>
              {context.trim() && (
                <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                  <span className="text-amber-400 text-xs mt-0.5">★</span>
                  <p className="text-xs text-amber-300/80">
                    Contexte global transmis à Claude pour chaque article — <strong>{context.length} caractères</strong> de stratégie éditoriale.
                  </p>
                </div>
              )}
              <p className="text-slate-400 text-sm">
                Vérifiez que les <strong className="text-white">{blocks.length} blocs</strong> détectés correspondent bien à vos articles.
                Chaque bloc sera transmis intégralement à Claude comme instructions.
              </p>
              <div className="space-y-2">
                {blocks.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-bg-elevated rounded-lg border border-bg-border">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-cyan-accent/20 text-cyan-accent text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 line-clamp-2">{b.preview}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{b.length} caractères</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 border border-bg-border rounded-lg p-3 bg-bg-elevated">
                Durée estimée : <strong className="text-slate-300">~{Math.ceil(blocks.length * 0.5)} minute{blocks.length > 2 ? 's' : ''}</strong> pour {blocks.length} articles.
                Les articles seront sauvegardés en <strong className="text-slate-300">brouillon</strong> — vous les publierez un par un.
              </p>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </>
          )}

          {/* ── Generating phase ── */}
          {phase === 'generating' && (
            <div className="py-6">
              <div className="text-center mb-8">
                <Loader2 className="w-10 h-10 text-cyan-accent animate-spin mx-auto mb-3" />
                <p className="font-display font-bold text-white text-lg">
                  Génération en cours...
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  Claude rédige vos articles. Ne fermez pas cette fenêtre.
                </p>
              </div>

              <div className="space-y-2">
                {blocks.map((_, i) => {
                  const isDone = results.some(r => r.index === i);
                  const isCurrent = generatingIndex === i && !isDone;
                  const result = results.find(r => r.index === i);
                  return (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      isDone
                        ? result?.status === 'success'
                          ? 'bg-green-accent/5 border-green-accent/20'
                          : 'bg-red-500/5 border-red-500/20'
                        : isCurrent
                          ? 'bg-cyan-accent/5 border-cyan-accent/20'
                          : 'bg-bg-elevated border-bg-border opacity-40'
                    }`}>
                      <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                        {isDone && result?.status === 'success' && <Check className="w-4 h-4 text-green-accent" />}
                        {isDone && result?.status === 'error' && <X className="w-4 h-4 text-red-400" />}
                        {isCurrent && <Loader2 className="w-4 h-4 text-cyan-accent animate-spin" />}
                        {!isDone && !isCurrent && (
                          <span className="w-4 h-4 rounded-full border border-slate-600" />
                        )}
                      </div>
                      <span className="text-sm text-slate-400">Article {i + 1}</span>
                      {isDone && result?.title && (
                        <span className="text-xs text-slate-500 ml-auto line-clamp-1 max-w-xs">{result.title}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Done phase ── */}
          {phase === 'done' && (
            <>
              <div className="text-center py-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  succeeded === total ? 'bg-green-accent/20' : 'bg-amber-500/20'
                }`}>
                  <Check className={`w-7 h-7 ${succeeded === total ? 'text-green-accent' : 'text-amber-400'}`} />
                </div>
                <p className="font-display font-bold text-white text-lg">
                  {succeeded}/{total} articles générés
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  Tous les articles réussis sont sauvegardés en brouillon.
                </p>
              </div>
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
                    r.status === 'success' ? 'bg-green-accent/5 border-green-accent/20' : 'bg-red-500/5 border-red-500/20'
                  }`}>
                    <div className="shrink-0 mt-0.5">
                      {r.status === 'success'
                        ? <Check className="w-4 h-4 text-green-accent" />
                        : <X className="w-4 h-4 text-red-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">
                        Article {r.index + 1}{r.title ? ` — ${r.title}` : ''}
                      </p>
                      {r.status === 'error' && (
                        <p className="text-xs text-red-400 mt-0.5">{r.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-bg-border shrink-0">
          {phase === 'input' && (
            <>
              <button onClick={onClose} className="btn-ghost text-sm">Annuler</button>
              <button
                onClick={handlePreview}
                disabled={loadingPreview || articlesText.trim().length < 20 || (separatorMode === 'custom' && !customSeparator.trim())}
                className="btn-primary text-sm"
              >
                {loadingPreview
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyse...</>
                  : <><Eye className="w-4 h-4" /> Analyser les blocs</>}
              </button>
            </>
          )}
          {phase === 'preview' && (
            <>
              <button onClick={() => setPhase('input')} className="btn-ghost text-sm">
                Modifier le texte
              </button>
              <button onClick={handleGenerate} className="btn-primary text-sm">
                <Sparkles className="w-4 h-4" />
                Générer {blocks.length} article{blocks.length > 1 ? 's' : ''}
              </button>
            </>
          )}
          {phase === 'generating' && (
            <p className="text-xs text-slate-500 mx-auto">Traitement en cours, veuillez patienter...</p>
          )}
          {phase === 'done' && (
            <>
              <button onClick={onClose} className="btn-ghost text-sm">Fermer</button>
              <button onClick={onDone} className="btn-primary text-sm">
                <Check className="w-4 h-4" />
                Voir les articles
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
