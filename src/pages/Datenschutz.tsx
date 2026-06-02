import { Link } from 'react-router-dom';
import { Coins } from 'lucide-react';

function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
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
        {children}
      </main>

      <footer className="border-t border-bg-border py-6">
        <div className="container-app flex flex-wrap gap-4 text-xs text-slate-500 justify-between items-center">
          <span>© {new Date().getFullYear()} TopCryptoCards. Keine Finanzberatung.</span>
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

export default function Datenschutz() {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <p className="text-slate-500 text-sm mb-10">Stand: Mai 2026</p>

      <div className="space-y-10 text-slate-400 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">1. Verantwortlicher</h2>
          <div className="card-surface p-5">
            <p className="text-white font-semibold">[VORNAME NACHNAME]</p>
            <p>[STRASSE NR]</p>
            <p>[PLZ] [STADT]</p>
            <p>Nordrhein-Westfalen, Deutschland</p>
            <p className="mt-3">E-Mail: <a href="mailto:hello@cryptocardcompare.io" className="text-cyan-accent hover:underline">hello@cryptocardcompare.io</a></p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">2. Welche Daten wir erheben und warum</h2>

          <h3 className="text-base font-semibold text-slate-200 mb-2">2.1 Beim Besuch der Website (Server-Logs)</h3>
          <p className="mb-3">Beim Aufruf unserer Website werden durch den Hosting-Dienstleister automatisch folgende Daten in sogenannten Server-Logfiles gespeichert:</p>
          <ul className="list-disc list-inside space-y-1 mb-3 ml-2">
            <li>IP-Adresse des anfragenden Rechners (anonymisiert)</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Name und URL der abgerufenen Datei</li>
            <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
            <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners</li>
            <li>Name Ihres Access-Providers</li>
          </ul>
          <p className="mb-3"><span className="text-slate-300 font-medium">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der sicheren und fehlerfreien Bereitstellung der Website).</p>
          <p>Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und nach spätestens 7 Tagen automatisch gelöscht.</p>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">2.2 Newsletter / E-Mail-Benachrichtigungen</h3>
          <p className="mb-3">Wenn Sie sich anmelden, erheben wir: Ihre E-Mail-Adresse, Datum und Uhrzeit der Anmeldung, sowie die IP-Adresse zum Zeitpunkt der Anmeldung (für das Double-Opt-In-Verfahren).</p>
          <p className="mb-3"><span className="text-slate-300 font-medium">Double-Opt-In:</span> Nach Ihrer Anmeldung erhalten Sie eine Bestätigungs-E-Mail. Erst nach dem Klick auf den Bestätigungslink wird Ihre Adresse gespeichert.</p>
          <p className="mb-3"><span className="text-slate-300 font-medium">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).</p>
          <p><span className="text-slate-300 font-medium">Abmeldung:</span> Sie können den Dienst jederzeit abbestellen, entweder über den Abmeldelink in jeder E-Mail oder per E-Mail an <a href="mailto:hello@cryptocardcompare.io" className="text-cyan-accent hover:underline">hello@cryptocardcompare.io</a>.</p>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">2.3 Affiliate-Links und Weiterleitungen</h3>
          <p>Wenn Sie auf einen Affiliate-Link klicken, werden Sie zu der Website des Kartenanbieters weitergeleitet. Dabei können Tracking-Cookies des jeweiligen Affiliate-Netzwerks gesetzt werden (nur nach ausdrücklicher Zustimmung über das Cookie-Banner). Wir selbst speichern ausschließlich aggregierte, nicht personenbezogene Statistikdaten.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">3. Eingesetzte Drittanbieter und Dienste</h2>

          <h3 className="text-base font-semibold text-slate-200 mb-2">3.1 Cloudflare (CDN und Sicherheit)</h3>
          <p className="mb-3">Unsere Website nutzt Cloudflare (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA) als Content Delivery Network. Cloudflare hat sich im Rahmen des EU-US Data Privacy Framework zertifiziert. Datenschutzerklärung: <a href="https://www.cloudflare.com/privacypolicy/" className="text-cyan-accent hover:underline" target="_blank" rel="noopener noreferrer">cloudflare.com/privacypolicy</a></p>
          <p><span className="text-slate-300 font-medium">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. f DSGVO.</p>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">3.2 Supabase (Backend-Infrastruktur)</h3>
          <p className="mb-3">Wir nutzen Supabase (Supabase Inc., 970 Trestle Glen Rd, Oakland, CA 94610, USA). Supabase verarbeitet Daten auf Servern in der EU (eu-west-1, Irland). Datenschutzerklärung: <a href="https://supabase.com/privacy" className="text-cyan-accent hover:underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a></p>
          <p><span className="text-slate-300 font-medium">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. f DSGVO / Art. 28 DSGVO (Auftragsverarbeitung).</p>

          <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">3.3 Affiliate-Netzwerke</h3>
          <p>Sobald Affiliate-Partnerschaften aktiv sind, arbeiten wir mit Impact Radius und Awin zusammen (nur nach Ihrer Einwilligung über das Cookie-Banner).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">4. Cookies</h2>

          <h3 className="text-base font-semibold text-slate-200 mb-3">Technisch notwendige Cookies (keine Einwilligung erforderlich)</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-bg-border">
                  <th className="text-left py-2 pr-4 text-slate-300 font-semibold">Cookie</th>
                  <th className="text-left py-2 pr-4 text-slate-300 font-semibold">Zweck</th>
                  <th className="text-left py-2 text-slate-300 font-semibold">Speicherdauer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-bg-border/50">
                  <td className="py-2 pr-4">Session-Cookie</td>
                  <td className="py-2 pr-4">Speicherung von Vergleichsauswahl und Filtereinstellungen</td>
                  <td className="py-2">Sitzung</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Cookie-Einwilligungs-Cookie</td>
                  <td className="py-2 pr-4">Speichert Ihre Cookie-Entscheidung</td>
                  <td className="py-2">12 Monate</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold text-slate-200 mb-3">Optionale Cookies (nur mit Ihrer Einwilligung)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-bg-border">
                  <th className="text-left py-2 pr-4 text-slate-300 font-semibold">Cookie</th>
                  <th className="text-left py-2 pr-4 text-slate-300 font-semibold">Anbieter</th>
                  <th className="text-left py-2 pr-4 text-slate-300 font-semibold">Zweck</th>
                  <th className="text-left py-2 text-slate-300 font-semibold">Speicherdauer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-bg-border/50">
                  <td className="py-2 pr-4">Affiliate-Tracking</td>
                  <td className="py-2 pr-4">Impact / Awin</td>
                  <td className="py-2 pr-4">Zuordnung von Klicks zu Provisionen</td>
                  <td className="py-2">30–90 Tage</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Analytics</td>
                  <td className="py-2 pr-4">Plausible/Matomo</td>
                  <td className="py-2 pr-4">Anonyme Nutzungsstatistiken</td>
                  <td className="py-2">12 Monate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">5. Ihre Rechte</h2>
          <ul className="space-y-2">
            <li><span className="text-slate-300 font-medium">Auskunftsrecht</span> (Art. 15 DSGVO)</li>
            <li><span className="text-slate-300 font-medium">Recht auf Berichtigung</span> (Art. 16 DSGVO)</li>
            <li><span className="text-slate-300 font-medium">Recht auf Löschung</span> (Art. 17 DSGVO)</li>
            <li><span className="text-slate-300 font-medium">Recht auf Einschränkung der Verarbeitung</span> (Art. 18 DSGVO)</li>
            <li><span className="text-slate-300 font-medium">Recht auf Datenübertragbarkeit</span> (Art. 20 DSGVO)</li>
            <li><span className="text-slate-300 font-medium">Widerspruchsrecht</span> (Art. 21 DSGVO)</li>
            <li><span className="text-slate-300 font-medium">Recht auf Widerruf der Einwilligung</span> (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <p className="mt-4">Zur Ausübung Ihrer Rechte: <a href="mailto:hello@cryptocardcompare.io" className="text-cyan-accent hover:underline">hello@cryptocardcompare.io</a></p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">6. Beschwerderecht bei der Aufsichtsbehörde</h2>
          <div className="card-surface p-5">
            <p className="text-slate-300 font-semibold mb-1">Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)</p>
            <p>Kavalleriestraße 2-4</p>
            <p>40213 Düsseldorf</p>
            <p>Telefon: 0211 38424-0</p>
            <p>E-Mail: <a href="mailto:poststelle@ldi.nrw.de" className="text-cyan-accent hover:underline">poststelle@ldi.nrw.de</a></p>
            <p>Website: <a href="https://www.ldi.nrw.de" className="text-cyan-accent hover:underline" target="_blank" rel="noopener noreferrer">www.ldi.nrw.de</a></p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">7. Datensicherheit</h2>
          <p>Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein. Unsere Website wird ausschließlich über HTTPS (SSL/TLS) ausgeliefert.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">8. Aktualität dieser Datenschutzerklärung</h2>
          <p>Diese Datenschutzerklärung hat den Stand Mai 2026. Die jeweils aktuelle Version ist unter <Link to="/datenschutz" className="text-cyan-accent hover:underline">/datenschutz</Link> abrufbar.</p>
        </section>
      </div>
    </LegalLayout>
  );
}
