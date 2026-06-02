import { Link } from 'react-router-dom';
import { Coins, ExternalLink } from 'lucide-react';

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="border-b border-bg-border bg-bg/80 backdrop-blur-lg">
        <div className="container-app h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-accent to-green-accent flex items-center justify-center shadow-glow">
              <Coins className="w-5 h-5 text-bg" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              TopCrypto<span className="text-cyan-accent">Cards</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container-app py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-2">Affiliate Disclosure</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: May 2026</p>

        <div className="space-y-10 text-slate-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Our commercial relationships</h2>
            <p className="mb-4">Crypto Card Compare earns affiliate commission from some of the cards listed on this site. When you sign up for a card via a link marked with <code className="px-1.5 py-0.5 rounded bg-bg-elevated text-cyan-accent text-xs">/go/</code> in the URL, we may receive a payment from the card issuer or its affiliate network. The amount varies by provider and is typically a fixed fee per verified sign-up.</p>
            <p className="mb-4"><span className="text-slate-300 font-medium">Cards we currently have an affiliate relationship with</span> are linked via <code className="px-1.5 py-0.5 rounded bg-bg-elevated text-cyan-accent text-xs">/go/&lt;card-slug&gt;/</code>.</p>
            <p><span className="text-slate-300 font-medium">Cards we do not have an affiliate relationship with</span> are linked directly to the issuer's website. These include (as of May 2026): Coinbase, Binance, Gemini, MetaMask, EtherFi, and several others. They appear on this site because they are relevant to users — not because we earn from them.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">What affiliate relationships do NOT affect</h2>
            <div className="space-y-3">
              <div className="card-surface p-4">
                <p className="text-slate-300 font-semibold mb-1">Rankings</p>
                <p>Cards are ranked by our published methodology (realistic cashback, fees, regional availability). No card receives a ranking boost because we earn from it.</p>
              </div>
              <div className="card-surface p-4">
                <p className="text-slate-300 font-semibold mb-1">Inclusion</p>
                <p>Cards without affiliate relationships are included and reviewed equally.</p>
              </div>
              <div className="card-surface p-4">
                <p className="text-slate-300 font-semibold mb-1">Editorial assessments</p>
                <p>Weaknesses, restrictions, and limitations are reported regardless of commercial relationship.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">How to identify affiliate links</h2>
            <p className="mb-3">All affiliate outbound links route through <code className="px-1.5 py-0.5 rounded bg-bg-elevated text-cyan-accent text-xs">/go/&lt;card-name&gt;/</code>. All direct (non-affiliate) links go directly to the issuer's URL. You can verify this by hovering over any "Visit site" button.</p>
            <p>In the HTML, affiliate links carry <code className="px-1.5 py-0.5 rounded bg-bg-elevated text-cyan-accent text-xs">rel="sponsored"</code> as per Google's recommended convention for transparent disclosure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Affiliate networks we work with</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span><span className="text-slate-300">Impact Radius</span> — Impact Tech, Inc., Santa Barbara, CA, USA</span>
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span><span className="text-slate-300">Awin</span> — Awin AG, Eichhornstraße 3, 10785 Berlin, Germany</span>
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Direct arrangements with individual card providers</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">The price you pay is never affected</h2>
            <div className="card-surface p-5 border-green-accent/20 bg-green-accent/5">
              <p className="text-slate-300">Using our affiliate links <span className="font-semibold text-white">never increases the price you pay</span> or changes the terms of any card. The commission is paid by the card issuer, not by you.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Questions</h2>
            <p>If you have any questions about our commercial relationships, email <a href="mailto:hello@cryptocardcompare.io" className="text-cyan-accent hover:underline">hello@cryptocardcompare.io</a>.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-bg-border py-6">
        <div className="container-app flex flex-wrap gap-4 text-xs text-slate-500 justify-between items-center">
          <span>© {new Date().getFullYear()} TopCryptoCards. No financial advice.</span>
          <div className="flex gap-4">
            <Link to="/impressum" className="hover:text-slate-300 transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-slate-300 transition-colors">Datenschutz</Link>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/affiliate-disclosure" className="hover:text-slate-300 transition-colors">Affiliate Disclosure</Link>
            <Link to="/risk-summary" className="hover:text-slate-300 transition-colors">Risk Summary</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
