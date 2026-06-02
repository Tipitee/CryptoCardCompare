import { Link } from 'react-router-dom';
import { Coins } from 'lucide-react';

export default function Impressum() {
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
        <div className="prose prose-invert prose-sm max-w-none">
          {/* German version */}
          <h1 className="text-3xl font-bold text-white mb-8">Impressum</h1>

          <p className="text-slate-400 text-sm mb-6">Angaben gemäß § 5 TMG</p>

          <div className="card-surface p-6 mb-8">
            <p className="text-white font-semibold">[VORNAME NACHNAME]</p>
            <p className="text-slate-400">[STRASSE NR]</p>
            <p className="text-slate-400">[PLZ] [STADT]</p>
            <p className="text-slate-400">Nordrhein-Westfalen, Deutschland</p>
            <p className="text-slate-400 mt-4">
              <span className="text-slate-300 font-medium">Kontakt:</span><br />
              E-Mail: <a href="mailto:hello@cryptocardcompare.io" className="text-cyan-accent hover:underline">hello@cryptocardcompare.io</a>
            </p>
          </div>

          <div className="card-surface p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className="text-white font-semibold">[VORNAME NACHNAME]</p>
            <p className="text-slate-400">[STRASSE NR]</p>
            <p className="text-slate-400">[PLZ] [STADT]</p>
          </div>

          <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
            <div>
              <h2 className="text-base font-semibold text-white mb-2">Hinweis zur redaktionellen Tätigkeit</h2>
              <p>Diese Website ist ein redaktionelles Informationsangebot. Sie vergleicht Krypto-Debitkarten anhand öffentlich zugänglicher Informationen. Die Inhalte stellen keine Anlage-, Finanz- oder Rechtsberatung dar.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white mb-2">Haftung für Inhalte</h2>
              <p>Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werde ich diese Inhalte umgehend entfernen.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white mb-2">Haftung für Links</h2>
              <p>Mein Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werde ich derartige Links umgehend entfernen.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white mb-2">Urheberrecht</h2>
              <p>Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white mb-2">Affiliate-Hinweis</h2>
              <p>Diese Website enthält Affiliate-Links. Wenn Sie sich über einen unserer Links für eine Karte anmelden, erhalten wir möglicherweise eine Provision vom jeweiligen Anbieter. Dies beeinflusst weder unsere Bewertungen noch die Reihenfolge der aufgeführten Karten. Näheres finden Sie in unserer <Link to="/affiliate-disclosure" className="text-cyan-accent hover:underline">Affiliate-Richtlinie</Link>.</p>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-bg-border my-12" />

          {/* English version */}
          <h1 className="text-3xl font-bold text-white mb-8">Legal Notice <span className="text-slate-400 font-normal text-xl">(Impressum)</span></h1>

          <p className="text-slate-400 text-sm mb-6">In accordance with § 5 TMG (German Telemedia Act)</p>

          <div className="card-surface p-6 mb-8">
            <p className="text-white font-semibold">[FIRST NAME LAST NAME]</p>
            <p className="text-slate-400">[STREET NO]</p>
            <p className="text-slate-400">[POSTCODE] [CITY]</p>
            <p className="text-slate-400">North Rhine-Westphalia, Germany</p>
            <p className="text-slate-400 mt-4">
              <span className="text-slate-300 font-medium">Contact:</span><br />
              Email: <a href="mailto:hello@cryptocardcompare.io" className="text-cyan-accent hover:underline">hello@cryptocardcompare.io</a>
            </p>
          </div>

          <div className="card-surface p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-3">Person responsible for editorial content (§ 55 para. 2 RStV)</h2>
            <p className="text-white font-semibold">[FIRST NAME LAST NAME]</p>
            <p className="text-slate-400">[STREET NO]</p>
            <p className="text-slate-400">[POSTCODE] [CITY]</p>
          </div>

          <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
            <div>
              <h2 className="text-base font-semibold text-white mb-2">Editorial disclaimer</h2>
              <p>This website is an independent editorial publication. It compares crypto debit cards based on publicly available information. Nothing on this site constitutes investment, financial, or legal advice.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white mb-2">Liability for content</h2>
              <p>As a service provider, I am responsible for my own content on this website in accordance with § 7 para. 1 TMG under general law. According to §§ 8 to 10 TMG, however, I am not obliged to monitor transmitted or stored third-party information or to investigate circumstances indicating illegal activity. Obligations to remove or block the use of information under general law remain unaffected. Liability in this regard is only possible from the point in time at which a concrete infringement of the law becomes known.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white mb-2">Liability for links</h2>
              <p>This site contains links to external third-party websites over whose content I have no influence. I therefore cannot accept any liability for these external contents. The respective provider or operator of the linked pages is always responsible for their content. Linked pages were checked for possible legal violations at the time of linking. No illegal content was apparent at the time of linking.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white mb-2">Copyright</h2>
              <p>The content and works created by the site operator on these pages are subject to German copyright law. Duplication, processing, distribution and any form of commercialisation beyond the scope of copyright law require the written consent of the respective author or creator.</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white mb-2">Affiliate disclosure</h2>
              <p>This website contains affiliate links. If you sign up for a card via one of our links, we may receive a commission from the card provider. This does not affect our editorial assessments or card rankings. See our <Link to="/affiliate-disclosure" className="text-cyan-accent hover:underline">Affiliate Disclosure</Link> for full details.</p>
            </div>
          </div>
        </div>
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
