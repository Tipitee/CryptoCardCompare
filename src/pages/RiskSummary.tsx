import { Link } from 'react-router-dom';
import { Coins, AlertTriangle } from 'lucide-react';

export default function RiskSummary() {
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
        <h1 className="text-3xl font-bold text-white mb-2">Crypto risk summary</h1>
        <p className="text-slate-500 text-sm mb-8">Estimated reading time: 2 minutes</p>

        {/* Language switcher for this page */}
        <div className="flex gap-2 mb-10">
          <a href="#eu" className="px-3 py-1.5 text-xs rounded-lg bg-bg-elevated border border-bg-border text-slate-300 hover:border-cyan-accent/50 hover:text-white transition-colors">EU / DE / FR / ES / IT</a>
          <a href="#uk" className="px-3 py-1.5 text-xs rounded-lg bg-bg-elevated border border-bg-border text-slate-300 hover:border-cyan-accent/50 hover:text-white transition-colors">UK (FCA)</a>
        </div>

        {/* EU Version */}
        <div id="eu" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🇪🇺</span>
            <h2 className="text-2xl font-bold text-white">Version EU / Allemagne</h2>
          </div>

          <div className="flex items-start gap-3 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-10">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 font-semibold text-sm mb-1">Avertissement sur les risques (MiCA / UE)</p>
              <p className="text-amber-200/80 text-sm leading-relaxed">Les crypto-actifs sont des produits hautement spéculatifs. Leur valeur peut fluctuer considérablement et vous pourriez perdre la totalité du capital investi. Les crypto-actifs ne bénéficient généralement pas des protections offertes aux produits financiers réglementés.</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-400 text-sm leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Vous pouvez perdre la totalité de votre investissement</h3>
              <p className="mb-3">Les crypto-actifs sont extrêmement volatils. La valeur des tokens peut chuter brutalement et rapidement. Les performances passées ne préjugent pas des performances futures.</p>
              <p>Cela s'applique également aux crypto-actifs que vous percevez en cashback sur une carte crypto. Si vous recevez des récompenses en tokens (CRO, GNO, BNB, PLU ou autres), la valeur de ces tokens peut diminuer significativement avant que vous puissiez les utiliser ou les convertir. Le rendement réel peut être bien inférieur au taux de cashback affiché.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Vous n'êtes généralement pas protégé par les garanties bancaires</h3>
              <p className="mb-3">Les produits crypto ne bénéficient pas de la protection des dépôts offerte par les banques réglementées dans l'UE. Le système européen de garantie des dépôts (directive 2014/49/UE, jusqu'à 100 000 €) ne couvre pas les crypto-actifs.</p>
              <p className="mb-3">Certains émetteurs détiennent une licence d'établissement de monnaie électronique (EME) dans l'UE, ce qui soumet les fonds en monnaie fiduciaire à des règles de protection. Ces protections ne s'étendent toutefois pas aux crypto-actifs détenus ou reçus en récompense.</p>
              <div className="card-surface p-4 text-xs">
                <span className="text-slate-300 font-semibold">En Allemagne : </span>La BaFin supervise les prestataires de services financiers. Sous MiCA (Règlement (UE) 2023/1114, applicable depuis décembre 2024), les prestataires de services sur crypto-actifs (CASP) doivent être agréés. Registre public : <a href="https://www.bafin.de" className="text-cyan-accent hover:underline" target="_blank" rel="noopener noreferrer">www.bafin.de</a>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Vous pourriez ne pas pouvoir vendre ou convertir quand vous le souhaitez</h3>
              <p className="mb-3">Certains tokens utilisés pour les récompenses des cartes crypto présentent un faible volume d'échange ou une liquidité limitée. Il se peut que vous rencontriez des délais, des coûts ou des conditions défavorables lors de la conversion.</p>
              <p>Les cartes nécessitant un staking bloquent votre capital pendant une durée déterminée — vous ne pouvez pas retirer ces fonds sans perdre l'accès à votre niveau de récompenses.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Les produits crypto sont complexes</h3>
              <p>Les cartes crypto combinent une carte de paiement (régulée comme monnaie électronique), un crypto-actif (partiellement réglementé sous MiCA), un programme de récompenses (dont les conditions peuvent changer), et dans certains cas un mécanisme de staking (avec risque lié au prix du token). Ne souscrivez pas à un produit que vous ne comprenez pas entièrement.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Ne mettez pas tous vos œufs dans le même panier</h3>
              <p>Si vous choisissez d'utiliser une carte crypto, n'engagez que des fonds dont vous pouvez vous permettre la perte totale. Les autorités financières européennes recommandent généralement de ne pas investir dans des crypto-actifs une part significative de votre épargne.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Ce site ne constitue pas un conseil financier</h3>
              <p>Crypto Card Compare est une publication éditoriale indépendante. Nos contenus ne constituent pas un conseil financier personnalisé. Nous ne sommes pas agréés par la BaFin ou toute autre autorité de régulation financière. Si vous avez besoin d'aide, consultez un conseiller financier agréé.</p>
            </section>
          </div>
        </div>

        <hr className="border-bg-border mb-16" />

        {/* UK Version */}
        <div id="uk">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🇬🇧</span>
            <h2 className="text-2xl font-bold text-white">UK Version (FCA)</h2>
          </div>

          <div className="flex items-start gap-3 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-10">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 font-semibold text-sm mb-1">FCA Risk warning</p>
              <p className="text-amber-200/80 text-sm leading-relaxed">Don't invest unless you're prepared to lose all the money you invest. Crypto is a high-risk investment and you are unlikely to be protected if something goes wrong.</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-400 text-sm leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold text-white mb-3">You could lose all the money you invest</h3>
              <p className="mb-3">Cryptoassets are highly volatile. The value of crypto tokens can fall sharply, and you may lose all of the money you put in. Past performance does not predict future returns.</p>
              <p>This applies equally to cryptoassets you receive as cashback or rewards on a crypto card. If you receive cashback in a token like CRO, BNB, GNO, or PLU, the value of that token can fall before you spend or convert it. Your real return may be significantly lower than the headline cashback rate suggests.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">You are unlikely to get your money back if something goes wrong</h3>
              <p className="mb-3">Most crypto products are not regulated in the UK in the same way that banks and traditional financial products are. The Financial Services Compensation Scheme (FSCS) does not protect cryptoasset investments. The Financial Ombudsman Service may not be able to help you if you have a complaint.</p>
              <p>Some crypto card issuers in the UK hold an FCA registration as an electronic money institution (EMI). This regulates the e-money side of the product, providing safeguarding of fiat balances. It does <span className="font-semibold text-slate-300">not</span> regulate the cryptoasset cashback or staking elements. Always check what specific protections apply.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">You may not be able to sell or convert when you want to</h3>
              <p className="mb-3">Some crypto card cashback is paid in tokens that have low trading volume or limited liquidity. You may face delays, costs, or unfavourable rates when converting tokens to fiat.</p>
              <p>Cards that require staking lock your capital for a fixed period — you cannot withdraw early without losing the cashback tier you staked for.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Crypto products are complex</h3>
              <p>Crypto cards combine a payment card (regulated as e-money), a cryptoasset (largely unregulated), a cashback or rewards programme (with terms that change), and in some cases a staking arrangement (with token price risk). Don't apply for a product you don't fully understand.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Don't put all your eggs in one basket</h3>
              <p>If you choose to spend on a crypto card or hold cryptoasset cashback, only commit money you can afford to lose entirely. The Financial Conduct Authority recommends holding no more than 10% of your investable assets in cryptoassets.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">This site is not financial advice</h3>
              <p>Crypto Card Compare is an editorial publication. Our content describes how crypto cards work and compares their features, but it is not personal financial advice and does not take into account your individual circumstances. We are not authorised by the FCA to give regulated financial advice. If you need help deciding whether a crypto card is right for you, speak to a qualified financial adviser.</p>
            </section>
          </div>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
