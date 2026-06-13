import { Link } from 'react-router-dom';
import { FileText, Image as ImageIcon, ArrowLeft } from 'lucide-react';

export default function BlogAdminHub() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-white mb-1">Blog Admin</h1>
          <p className="text-slate-500 text-sm">CryptoCardCompare</p>
        </div>

        <Link
          to="/admin/blog"
          className="flex items-center gap-4 card-surface p-5 hover:border-cyan-accent/40 transition-colors group"
        >
          <div className="w-11 h-11 rounded-xl bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-accent/20 transition-colors">
            <FileText className="w-5 h-5 text-cyan-accent" />
          </div>
          <div>
            <p className="font-semibold text-white">Admin articles</p>
            <p className="text-xs text-slate-500">Gérer et publier les articles du blog</p>
          </div>
        </Link>

        <Link
          to="/admin/generate-hero-images"
          className="flex items-center gap-4 card-surface p-5 hover:border-cyan-accent/40 transition-colors group"
        >
          <div className="w-11 h-11 rounded-xl bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-accent/20 transition-colors">
            <ImageIcon className="w-5 h-5 text-cyan-accent" />
          </div>
          <div>
            <p className="font-semibold text-white">Admin images</p>
            <p className="text-xs text-slate-500">Générer les images hero via Together AI</p>
          </div>
        </Link>

        <div className="text-center pt-4">
          <Link to="/fr/blog" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </div>
    </div>
  );
}
