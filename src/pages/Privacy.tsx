import { Link } from 'react-router-dom';
import { Coins } from 'lucide-react';

function LegalLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
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
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mb-10">{subtitle}</p>}
        {children}
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

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" subtitle="Last updated: May 2026">
      <div className="space-y-10 text-slate-400 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">1. Data Controller</h2>
          <div className="card-surface p-5">
            <p className="text-white font-semibold">[FIRST NAME LAST NAME]</p>
            <p>[STREET NO]</p>
            <p>[POSTCODE] [CITY]</p>
            <p>North Rhine-Westphalia, Germany</p>
            <p className="mt-3">Email: <a href="mailto:hello@cryptocardcompare.io" className="text-cyan-accent hover:underline">hello@cryptocardcompare.io</a></p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">2. What data we collect and why</h2>

          <h3 className="text-base font-semibold text-slate-200 mb-2">2.1 Website access logs</h3>
          <p className="mb-3">When you visit our website, the hosting provider automatically records: IP address (anonymised), date and time of access, requested file URL, referrer URL, browser type, and ISP name.</p>
          <p className="mb-3"><span className="text-slate-300 font-medium">Legal basis:</span> Art. 6(1)(f) GDPR — legitimate interest in providing a secure and functional website.</p>
          <p>Data is deleted automatically after a maximum of 7 days.</p>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">2.2 Email newsletter / notifications</h3>
          <p className="mb-3">If you sign up for email updates, we collect: your email address, date and time of sign-up, and IP address at sign-up (for double opt-in verification).</p>
          <p className="mb-3"><span className="text-slate-300 font-medium">Double opt-in:</span> Your address is only stored after you click the confirmation link in our verification email.</p>
          <p className="mb-3"><span className="text-slate-300 font-medium">Legal basis:</span> Art. 6(1)(a) GDPR — your consent.</p>
          <p><span className="text-slate-300 font-medium">Unsubscribe:</span> You may unsubscribe at any time via the unsubscribe link in any email, or by emailing <a href="mailto:hello@cryptocardcompare.io" className="text-cyan-accent hover:underline">hello@cryptocardcompare.io</a>.</p>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">2.3 Affiliate links and redirects</h3>
          <p>When you click an affiliate link, you are redirected to the card provider's website. The relevant affiliate network may set tracking cookies (only after your consent via the cookie banner). We only record aggregated, non-personal statistics for our own links.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">3. Third-party services</h2>

          <h3 className="text-base font-semibold text-slate-200 mb-2">3.1 Cloudflare</h3>
          <p className="mb-3">We use Cloudflare (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA) as a CDN and security layer. Cloudflare is certified under the EU-US Data Privacy Framework. <a href="https://www.cloudflare.com/privacypolicy/" className="text-cyan-accent hover:underline" target="_blank" rel="noopener noreferrer">Cloudflare Privacy Policy</a></p>
          <p><span className="text-slate-300 font-medium">Legal basis:</span> Art. 6(1)(f) GDPR.</p>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">3.2 Supabase</h3>
          <p className="mb-3">We use Supabase (Supabase Inc., 970 Trestle Glen Rd, Oakland, CA 94610, USA) for back-end infrastructure. Supabase processes data on EU servers (eu-west-1, Ireland). <a href="https://supabase.com/privacy" className="text-cyan-accent hover:underline" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a></p>
          <p><span className="text-slate-300 font-medium">Legal basis:</span> Art. 6(1)(f) GDPR / Art. 28 GDPR (data processing agreement).</p>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">3.3 Affiliate networks</h3>
          <p>Once affiliate partnerships are active, we work with Impact Radius and Awin, which use their own tracking technologies (only after your consent via the cookie banner). Legal basis: Art. 6(1)(a) GDPR.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">4. Cookies</h2>

          <h3 className="text-base font-semibold text-slate-200 mb-3">Strictly necessary cookies (no consent required)</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-bg-border">
                  <th className="text-left py-2 pr-4 text-slate-300 font-semibold">Cookie</th>
                  <th className="text-left py-2 pr-4 text-slate-300 font-semibold">Purpose</th>
                  <th className="text-left py-2 text-slate-300 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-bg-border/50">
                  <td className="py-2 pr-4">Session cookie</td>
                  <td className="py-2 pr-4">Stores comparison selections and filter settings</td>
                  <td className="py-2">Session</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Cookie consent</td>
                  <td className="py-2 pr-4">Remembers your cookie preference</td>
                  <td className="py-2">12 months</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold text-slate-200 mb-3">Optional cookies (consent required)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-bg-border">
                  <th className="text-left py-2 pr-4 text-slate-300 font-semibold">Cookie</th>
                  <th className="text-left py-2 pr-4 text-slate-300 font-semibold">Provider</th>
                  <th className="text-left py-2 pr-4 text-slate-300 font-semibold">Purpose</th>
                  <th className="text-left py-2 text-slate-300 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-bg-border/50">
                  <td className="py-2 pr-4">Affiliate tracking</td>
                  <td className="py-2 pr-4">Impact / Awin</td>
                  <td className="py-2 pr-4">Attribution of clicks to commissions</td>
                  <td className="py-2">30–90 days</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Analytics</td>
                  <td className="py-2 pr-4">Plausible / Matomo</td>
                  <td className="py-2 pr-4">Anonymous usage statistics</td>
                  <td className="py-2">12 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">5. Your rights</h2>
          <ul className="space-y-2">
            <li><span className="text-slate-300 font-medium">Right of access</span> (Art. 15 GDPR)</li>
            <li><span className="text-slate-300 font-medium">Right to rectification</span> (Art. 16 GDPR)</li>
            <li><span className="text-slate-300 font-medium">Right to erasure</span> (Art. 17 GDPR)</li>
            <li><span className="text-slate-300 font-medium">Right to restriction of processing</span> (Art. 18 GDPR)</li>
            <li><span className="text-slate-300 font-medium">Right to data portability</span> (Art. 20 GDPR)</li>
            <li><span className="text-slate-300 font-medium">Right to object</span> (Art. 21 GDPR)</li>
            <li><span className="text-slate-300 font-medium">Right to withdraw consent</span> (Art. 7(3) GDPR)</li>
          </ul>
          <p className="mt-4">To exercise any of these rights: <a href="mailto:hello@cryptocardcompare.io" className="text-cyan-accent hover:underline">hello@cryptocardcompare.io</a></p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">6. Right to lodge a complaint</h2>
          <div className="card-surface p-5">
            <p className="text-slate-300 font-semibold mb-1">Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)</p>
            <p>Kavalleriestraße 2-4, 40213 Düsseldorf, Germany</p>
            <p>Phone: +49 211 38424-0</p>
            <p>Email: <a href="mailto:poststelle@ldi.nrw.de" className="text-cyan-accent hover:underline">poststelle@ldi.nrw.de</a></p>
            <p>Website: <a href="https://www.ldi.nrw.de" className="text-cyan-accent hover:underline" target="_blank" rel="noopener noreferrer">www.ldi.nrw.de</a></p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">7. Data security</h2>
          <p>We use technical and organisational security measures to protect your data. Our website is delivered exclusively over HTTPS (SSL/TLS).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">8. Updates to this policy</h2>
          <p>This policy is current as of May 2026. The current version is always available at <Link to="/privacy" className="text-cyan-accent hover:underline">/privacy</Link>.</p>
        </section>
      </div>
    </LegalLayout>
  );
}
