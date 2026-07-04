import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';
import AutoLinker from '../components/AutoLinker';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import { THEMATIC_ROUTES } from '../config/routes';

const HOME_LABEL: Record<string, string> = {
  fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home',
};

const YEAR = new Date().getFullYear();

const LANG_TO_SEGMENT: Record<string, string> = {
  fr: 'cartes', de: 'karten', es: 'tarjetas', it: 'carte', en: 'cards',
};

/* ────────────────────────────────────────────────────────────────────────────
   CONFIG (title / h1 / description / intro / outro)
   ──────────────────────────────────────────────────────────────────────────── */
const THEME_CONFIG: Record<string, Record<string, {
  title: string; h1: string; description: string; intro: string; outro: string;
}>> = {
  best: {
    fr: { title:`Meilleure Carte Crypto ${YEAR} — Comparatif Complet | TopCryptoCards`, h1:`Les Meilleures Cartes Crypto en ${YEAR}`, description:`Comparatif des meilleures cartes crypto en France ${YEAR} : cashback jusqu'à 8%, sans frais, sans staking. Crypto.com, Gnosis Pay, Nexo, MetaMask. Gratuit ✓`, intro:`Choisir la meilleure carte crypto n'est pas une décision à prendre à la légère. Cashback, frais annuels, staking requis, disponibilité en France, régulation : les critères sont nombreux et varient selon votre profil. Ce comparatif rassemble toutes les cartes crypto disponibles en ${YEAR}, classées par fiabilité et pertinence.`, outro:`Pour faire le bon choix, comparez les taux de cashback mais pensez aussi aux conditions : certaines cartes exigent un staking important pour débloquer les meilleurs avantages. Si vous débutez, préférez une carte sans staking et sans frais annuels. Si vous êtes déjà investi en crypto, les cartes premium peuvent offrir jusqu'à 8% de cashback.` },
    de: { title:`Beste Krypto Karte ${YEAR} — Vollständiger Vergleich | TopCryptoCards`, h1:`Die besten Krypto-Karten ${YEAR}`, description:`+15 Krypto-Karten im Vergleich für Deutschland ${YEAR}: bis zu 8% Cashback, keine Jahresgebühr, kein Staking. Crypto.com, Gnosis Pay, MetaMask. Kostenlos ✓`, intro:`Die Wahl der besten Krypto-Karte ist keine einfache Entscheidung. Cashback, Jahresgebühren, Staking-Anforderungen, Verfügbarkeit in Deutschland, Regulierung: die Kriterien sind zahlreich. Dieser Vergleich bringt alle in ${YEAR} verfügbaren Krypto-Karten zusammen, geordnet nach Vertrauenswürdigkeit.`, outro:`Vergleichen Sie Cashback-Sätze, aber berücksichtigen Sie auch die Bedingungen: Einige Karten erfordern erhebliches Staking, um die besten Vorteile freizuschalten. Wenn Sie Anfänger sind, bevorzugen Sie eine Karte ohne Staking und ohne Jahresgebühr.` },
    es: { title:`Mejor Tarjeta Crypto ${YEAR} — Comparativa Completa | TopCryptoCards`, h1:`Las Mejores Tarjetas Crypto en ${YEAR}`, description:`Comparativa completa: +15 tarjetas crypto en España ${YEAR}. Hasta 8% cashback, sin cuota anual, sin staking. Crypto.com, Gnosis Pay, MetaMask. Gratis ✓`, intro:`Elegir la mejor tarjeta crypto no es una decisión fácil. Cashback, comisiones anuales, staking requerido, disponibilidad en España, regulación: los criterios son numerosos. Esta comparativa reúne todas las tarjetas crypto disponibles en ${YEAR}, clasificadas por fiabilidad.`, outro:`Para tomar la decisión correcta, compara las tasas de cashback pero también ten en cuenta las condiciones: algunas tarjetas exigen un staking importante para desbloquear los mejores beneficios. Si eres principiante, elige una tarjeta sin staking y sin cuota anual.` },
    it: { title:`Migliore Carta Crypto ${YEAR} — Confronto Completo | TopCryptoCards`, h1:`Le Migliori Carte Crypto nel ${YEAR}`, description:`+15 carte crypto per l'Italia ${YEAR}: fino all'8% cashback, senza quota annua, senza staking. Crypto.com, Gnosis Pay, MetaMask Card. Confronto gratuito ✓`, intro:`Scegliere la migliore carta crypto non è una decisione semplice. Cashback, costi annuali, staking richiesto, disponibilità in Italia, regolamentazione: i criteri sono numerosi. Questo confronto raccoglie tutte le carte crypto disponibili nel ${YEAR}, classificate per affidabilità.`, outro:`Per fare la scelta giusta, confronta i tassi di cashback ma considera anche le condizioni: alcune carte richiedono uno staking importante per sbloccare i migliori vantaggi. Se sei un principiante, preferisci una carta senza staking e senza costi annuali.` },
    en: { title:`Best Crypto Card ${YEAR} — Full Comparison | TopCryptoCards`, h1:`The Best Crypto Cards in ${YEAR}`, description:`Compare +15 crypto cards in Europe ${YEAR}: up to 8% cashback, no annual fees, no staking required. Crypto.com, Gnosis Pay, MetaMask Card. Free comparison ✓`, intro:`Choosing the best crypto card is not a simple decision. Cashback rates, annual fees, staking requirements, availability, and regulation all vary significantly. This comparison covers all crypto cards available in ${YEAR}, ranked by reliability and value.`, outro:`To make the right choice, compare cashback rates but also consider the conditions: some cards require significant staking to unlock the best benefits. If you're a beginner, opt for a card with no staking and no annual fee.` },
  },
  cashback: {
    fr: { title:`Carte Crypto Cashback ${YEAR} — Jusqu'à 8% en Crypto | TopCryptoCards`, h1:`Cartes Crypto avec le Meilleur Cashback`, description:`Cartes crypto cashback ${YEAR} : de 1% à 8% de récompenses. Crypto.com, Gnosis Pay, Nexo, Brighty comparés. Trouvez la plus rentable pour votre profil. Gratuit ✓`, intro:`Le cashback est l'avantage principal des cartes crypto : chaque achat vous rapporte des cryptomonnaies. Mais les taux varient considérablement, de 0.5% à 8% selon les cartes et les conditions. Ce classement compare les cartes crypto avec le meilleur cashback disponibles en ${YEAR}.`, outro:`Attention aux conditions : un taux de 8% peut nécessiter de bloquer 400 000 CRO en staking. Calculez le retour sur investissement réel avant de vous engager. Pour la plupart des utilisateurs, un cashback de 1 à 3% sans staking est plus rentable à long terme.` },
    de: { title:`Krypto Karte Cashback ${YEAR} — Bis 8% Belohnungen | TopCryptoCards`, h1:`Krypto-Karten mit dem besten Cashback`, description:`Beste Krypto-Karten für Cashback ${YEAR}: von 1% bis 8% Belohnungen. Crypto.com, Gnosis Pay, Nexo, Brighty verglichen. Finden Sie die profitabelste Option ✓`, intro:`Cashback ist der Hauptvorteil von Krypto-Karten: Jeder Kauf bringt Ihnen Kryptowährungen ein. Die Sätze variieren jedoch erheblich, von 0,5% bis 8%. Dieses Ranking vergleicht Krypto-Karten mit dem besten Cashback in ${YEAR}.`, outro:`Achten Sie auf die Bedingungen: Ein Satz von 8% kann erhebliches Staking erfordern. Berechnen Sie den tatsächlichen ROI, bevor Sie sich verpflichten. Für die meisten Nutzer ist ein Cashback von 1-3% ohne Staking langfristig rentabler.` },
    es: { title:`Tarjeta Crypto Cashback ${YEAR} — Hasta 8% en Crypto | TopCryptoCards`, h1:`Tarjetas Crypto con el Mejor Cashback`, description:`Las mejores tarjetas crypto cashback en España ${YEAR}: del 1% al 8% de recompensas. Crypto.com, Gnosis Pay, Nexo, Brighty comparados. Encuentra la más rentable ✓`, intro:`El cashback es la principal ventaja de las tarjetas crypto: cada compra te genera criptomonedas. Pero las tasas varían considerablemente, del 0,5% al 8%. Esta clasificación compara las tarjetas crypto con el mejor cashback disponibles en ${YEAR}.`, outro:`Atención a las condiciones: una tasa del 8% puede requerir bloquear miles de euros en staking. Calcula el ROI real antes de comprometerte. Para la mayoría, un cashback del 1-3% sin staking es más rentable a largo plazo.` },
    it: { title:`Carta Crypto Cashback ${YEAR} — Fino all'8% in Crypto | TopCryptoCards`, h1:`Carte Crypto con il Miglior Cashback`, description:`Migliori carte crypto cashback in Italia ${YEAR}: dall'1% all'8% di ricompense. Crypto.com, Gnosis Pay, Nexo, Brighty confrontati. Trova la più redditizia ✓`, intro:`Il cashback è il principale vantaggio delle carte crypto: ogni acquisto ti fa guadagnare criptovalute. Ma i tassi variano notevolmente, dallo 0,5% all'8%. Questa classifica confronta le carte crypto con il miglior cashback disponibili nel ${YEAR}.`, outro:`Attenzione alle condizioni: un tasso dell'8% può richiedere di bloccare migliaia di euro in staking. Calcola il ROI reale prima di impegnarti. Per la maggior parte degli utenti, un cashback dell'1-3% senza staking è più redditizio a lungo termine.` },
    en: { title:`Crypto Card Cashback ${YEAR} — Up to 8% Rewards | TopCryptoCards`, h1:`Crypto Cards with the Best Cashback`, description:`Best crypto cards for cashback in Europe ${YEAR}: from 1% to 8% rewards. Crypto.com, Gnosis Pay, Nexo, Brighty compared. Find the most profitable option ✓`, intro:`Cashback is the main advantage of crypto cards: every purchase earns you cryptocurrency. But rates vary significantly, from 0.5% to 8%. This ranking compares the best cashback crypto cards available in ${YEAR}.`, outro:`Watch out for conditions: an 8% rate may require staking thousands of euros. Calculate the real ROI before committing. For most users, a 1-3% cashback with no staking is more profitable in the long run.` },
  },
  'no-fees': {
    fr: { title:`Carte Crypto Sans Frais ${YEAR} — Gratuite + Cashback | TopCryptoCards`, h1:`Cartes Crypto Sans Frais Annuels en ${YEAR}`, description:`Meilleures cartes crypto gratuites ${YEAR} : 0€/an, cashback sans abonnement ni staking. MetaMask Card, Gnosis Pay, Brighty comparées. Comparatif gratuit ✓`, intro:`Pourquoi payer un abonnement annuel pour une carte crypto quand des alternatives gratuites offrent d'excellents taux de cashback ? Ce comparatif liste toutes les cartes crypto sans frais annuels disponibles en ${YEAR}, classées par cashback décroissant.`, outro:`Une carte gratuite n'est pas synonyme de carte moins bonne. MetaMask Card, Gnosis Pay ou Brighty offrent de vrais avantages sans aucun abonnement. Comparez les plafonds de retrait et les cryptos acceptées pour choisir la meilleure option gratuite.` },
    de: { title:`Kostenlose Krypto Karte ${YEAR} — Ohne Jahresgebühr | TopCryptoCards`, h1:`Krypto-Karten ohne Jahresgebühr`, description:`Beste kostenlose Krypto-Karten ${YEAR}: 0€/Jahr, Cashback ohne Staking. MetaMask Card, Gnosis Pay, Brighty verglichen. Kein Abo, keine Bindung. Kostenlos ✓`, intro:`Warum eine Jahresgebühr für eine Krypto-Karte zahlen, wenn kostenlose Alternativen hervorragende Cashback-Raten bieten? Dieser Vergleich listet alle kostenlosen Krypto-Karten in ${YEAR}.`, outro:`Eine kostenlose Karte bedeutet nicht schlechtere Qualität. Vergleichen Sie Abhebungslimits und unterstützte Kryptowährungen, um die beste kostenlose Option zu finden.` },
    es: { title:`Tarjeta Crypto Sin Cuota ${YEAR} — Gratis + Cashback | TopCryptoCards`, h1:`Tarjetas Crypto Sin Cuota Anual`, description:`Mejores tarjetas crypto gratuitas en España ${YEAR}: 0€/año, cashback sin staking. MetaMask Card, Gnosis Pay, Brighty comparadas. Sin suscripción. Gratis ✓`, intro:`¿Por qué pagar una cuota anual por una tarjeta crypto cuando hay alternativas gratuitas con excelentes tasas de cashback? Esta comparativa lista todas las tarjetas crypto sin comisiones anuales disponibles en ${YEAR}.`, outro:`Una tarjeta gratuita no significa una tarjeta inferior. Compara los límites de retirada y las criptomonedas aceptadas para encontrar la mejor opción gratuita.` },
    it: { title:`Carta Crypto Senza Costi ${YEAR} — Gratuita + Cashback | TopCryptoCards`, h1:`Carte Crypto Senza Costi Annuali`, description:`Migliori carte crypto gratuite in Italia ${YEAR}: 0€/anno, cashback senza staking. MetaMask Card, Gnosis Pay, Brighty confrontate. Senza abbonamento. Gratuito ✓`, intro:`Perché pagare un abbonamento annuale per una carta crypto quando esistono alternative gratuite con ottimi tassi di cashback? Questo confronto elenca tutte le carte crypto senza costi annuali disponibili nel ${YEAR}.`, outro:`Una carta gratuita non significa qualità inferiore. Confronta i limiti di prelievo e le criptovalute accettate per trovare la migliore opzione gratuita.` },
    en: { title:`Free Crypto Card ${YEAR} — No Fees + Cashback | TopCryptoCards`, h1:`Crypto Cards with No Annual Fees`, description:`Best free crypto cards in Europe ${YEAR}: €0/year, cashback with no staking. MetaMask Card, Gnosis Pay, Brighty compared. No subscription, no commitment. Free ✓`, intro:`Why pay an annual fee for a crypto card when free alternatives offer excellent cashback rates? This comparison lists all no-fee crypto cards available in ${YEAR}, ranked by cashback rate.`, outro:`A free card doesn't mean a worse card. Compare withdrawal limits and supported cryptocurrencies to find the best free option for your needs.` },
  },
  'no-staking': {
    fr: { title:`Carte Crypto Sans Staking ${YEAR} — Cashback Libre | TopCryptoCards`, h1:`Cartes Crypto Sans Staking Requis`, description:`Cartes crypto avec cashback sans staking en ${YEAR} : votre capital reste libre. Gnosis Pay, MetaMask Card, Brighty. Sans frais annuels. Comparatif gratuit ✓`, intro:`Le staking obligatoire est la principale contrainte des cartes crypto premium : il faut immobiliser des milliers d'euros en cryptomonnaies pour débloquer le cashback. Ces cartes offrent un cashback sans aucune obligation de staking.`, outro:`Sans staking, votre capital reste libre. C'est particulièrement avantageux dans un marché volatil : vous n'êtes pas exposé au risque de dépréciation de la crypto stakée. MetaMask Card et Gnosis Pay sont les leaders de cette catégorie.` },
    de: { title:`Krypto Karte Ohne Staking ${YEAR} — Cashback Ohne Auflagen | TopCryptoCards`, h1:`Krypto-Karten Ohne Staking-Pflicht`, description:`Krypto-Karten mit Cashback ohne Staking ${YEAR}: Kapital bleibt frei. Gnosis Pay, MetaMask Card, Brighty — keine Jahresgebühr. Kostenloser Vergleich ✓`, intro:`Pflicht-Staking ist die Haupteinschränkung bei Premium-Krypto-Karten. Diese Karten bieten Cashback ohne jede Staking-Verpflichtung, sodass Ihr Kapital frei bleibt.`, outro:`Ohne Staking bleibt Ihr Kapital frei. Dies ist besonders vorteilhaft auf volatilen Märkten: Sie sind nicht dem Risiko der Abwertung der gestakten Kryptowährung ausgesetzt.` },
    es: { title:`Tarjeta Crypto Sin Staking ${YEAR} — Cashback Libre | TopCryptoCards`, h1:`Tarjetas Crypto Sin Staking Requerido`, description:`Tarjetas crypto con cashback y sin staking en España ${YEAR}: tu capital siempre libre. Gnosis Pay, MetaMask Card, Brighty. Sin cuota anual. Comparativa gratuita ✓`, intro:`El staking obligatorio es la principal restricción de las tarjetas crypto premium. Estas tarjetas ofrecen cashback sin ninguna obligación de staking, manteniendo tu capital libre.`, outro:`Sin staking, tu capital permanece libre. Es especialmente ventajoso en un mercado volátil: no estás expuesto al riesgo de depreciación de la cripto en staking.` },
    it: { title:`Carta Crypto Senza Staking ${YEAR} — Cashback Libero | TopCryptoCards`, h1:`Carte Crypto Senza Staking Richiesto`, description:`Carte crypto con cashback senza staking in Italia ${YEAR}: capitale sempre libero. Gnosis Pay, MetaMask Card, Brighty. Senza quota annua. Confronto gratuito ✓`, intro:`Lo staking obbligatorio è il principale limite delle carte crypto premium. Queste carte offrono cashback senza alcun obbligo di staking, mantenendo il tuo capitale libero.`, outro:`Senza staking, il tuo capitale rimane libero. È particolarmente vantaggioso in un mercato volatile: non sei esposto al rischio di svalutazione della cripto in staking.` },
    en: { title:`Crypto Card No Staking ${YEAR} — Cashback, No Lock-up | TopCryptoCards`, h1:`Crypto Cards Without Staking Requirements`, description:`Crypto cards with cashback and no staking required in ${YEAR}. Keep your capital free. Gnosis Pay, MetaMask Card, Brighty — no annual fees. Free comparison ✓`, intro:`Mandatory staking is the main drawback of premium crypto cards. These cards offer cashback with no staking obligation — your funds stay free and accessible at all times.`, outro:`Without staking, your capital stays free. This is especially advantageous in a volatile market: you're not exposed to the depreciation risk of a staked token. MetaMask Card and Gnosis Pay lead this category.` },
  },
  france: {
    fr: { title:`Carte Crypto France ${YEAR} — Disponibles en France | TopCryptoCards`, h1:`Cartes Crypto Disponibles en France`, description:`Les meilleures cartes crypto disponibles et légales en France en ${YEAR}. Régulation AMF/ACPR vérifiée. Crypto.com, Gnosis Pay, MetaMask Card comparées. Comparatif gratuit ✓`, intro:`Toutes les cartes crypto ne sont pas disponibles en France. Entre les restrictions géographiques, les exigences KYC et les questions de régulation, le choix se réduit. Ce comparatif liste uniquement les cartes accessibles aux résidents français en ${YEAR}.`, outro:`En France, privilégiez les cartes émises par des entités régulées PSAN (Prestataire de Services sur Actifs Numériques) enregistrées auprès de l'AMF. Cela garantit un niveau de protection de vos fonds en cas de faillite de l'émetteur.` },
    de: { title:`Krypto Karte Deutschland ${YEAR} — Verfügbare Karten | TopCryptoCards`, h1:`Krypto-Karten Verfügbar in Deutschland`, description:`Die besten in Deutschland verfügbaren Krypto-Karten ${YEAR}: bis zu 8% Cashback, keine Jahresgebühr. BaFin-Regulierung geprüft. Crypto.com, Gnosis Pay, MetaMask Card. Kostenlos ✓`, intro:`Nicht alle Krypto-Karten sind in Deutschland verfügbar. Dieser Vergleich listet nur die für deutsche Einwohner zugänglichen Karten in ${YEAR}, geordnet nach Vertrauenswürdigkeit.`, outro:`In Deutschland bevorzugen Sie Karten von BaFin-regulierten Unternehmen. Dies gewährleistet ein Mindestmaß an Schutz im Falle einer Insolvenz des Emittenten.` },
    es: { title:`Tarjeta Crypto España ${YEAR} — Disponibles en España | TopCryptoCards`, h1:`Tarjetas Crypto Disponibles en España`, description:`Las mejores tarjetas crypto disponibles en España en ${YEAR}: hasta 8% cashback, sin cuota. Regulación CNMV verificada. Crypto.com, Gnosis Pay, MetaMask Card comparadas. Gratis ✓`, intro:`No todas las tarjetas crypto están disponibles en España. Esta comparativa lista únicamente las accesibles para residentes españoles en ${YEAR}.`, outro:`En España, elige tarjetas de entidades registradas ante la CNMV o el Banco de España. Esto garantiza un nivel mínimo de protección de tus fondos.` },
    it: { title:`Carta Crypto Italia ${YEAR} — Disponibili in Italia | TopCryptoCards`, h1:`Carte Crypto Disponibili in Italia`, description:`Le migliori carte crypto disponibili in Italia nel ${YEAR}: fino all'8% cashback, senza costi. Regolamentazione OAM verificata. Crypto.com, Gnosis Pay, MetaMask Card. Gratuito ✓`, intro:`Non tutte le carte crypto sono disponibili in Italia. Questo confronto elenca solo quelle accessibili ai residenti italiani nel ${YEAR}.`, outro:`In Italia, preferisci carte emesse da entità registrate presso l'OAM (Organismo Agenti e Mediatori). Questo garantisce un livello minimo di protezione dei tuoi fondi.` },
    en: { title:`Crypto Card Europe ${YEAR} — Available in Europe | TopCryptoCards`, h1:`Crypto Cards Available in Europe`, description:`The best crypto cards available in Europe in ${YEAR}: up to 8% cashback, no annual fee. FCA/MiCA regulated options included. Crypto.com, Gnosis Pay, MetaMask Card. Free ✓`, intro:`Not all crypto cards are available across Europe. This comparison lists only cards accessible to European residents in ${YEAR}, with regulatory status verified.`, outro:`In Europe, prioritize cards from MiCA-compliant or FCA/BaFin-regulated entities. This ensures a minimum level of fund protection in the event of issuer insolvency.` },
  },
  virtual: {
    fr: { title:`Carte Crypto Virtuelle ${YEAR} — Paiements en Ligne | TopCryptoCards`, h1:`Cartes Crypto Virtuelles en ${YEAR}`, description:`Les meilleures cartes crypto virtuelles pour payer en ligne en ${YEAR} : activées immédiatement, compatibles Apple Pay et Google Pay. MetaMask Card, Gnosis Pay, Brighty. Gratuit ✓`, intro:`Les cartes crypto virtuelles sont idéales pour les achats en ligne et les paiements contactless via smartphone. Elles sont souvent disponibles immédiatement après inscription, sans attendre une carte physique.`, outro:`La carte virtuelle est souvent le moyen le plus rapide de commencer à dépenser ses cryptos. Disponible en quelques minutes après la validation KYC, elle se connecte directement à Apple Pay ou Google Pay pour des paiements instantanés.` },
    de: { title:`Virtuelle Krypto Karte ${YEAR} — Online-Zahlungen | TopCryptoCards`, h1:`Virtuelle Krypto-Karten ${YEAR}`, description:`Die besten virtuellen Krypto-Karten für Online-Zahlungen ${YEAR}: sofort aktiviert, Apple Pay und Google Pay kompatibel. MetaMask Card, Gnosis Pay, Brighty. Kostenlos ✓`, intro:`Virtuelle Krypto-Karten sind ideal für Online-Einkäufe und kontaktlose Zahlungen per Smartphone. Sie sind oft sofort nach der Registrierung verfügbar.`, outro:`Die virtuelle Karte ist oft der schnellste Weg, Kryptowährungen auszugeben. Verfügbar in wenigen Minuten nach der KYC-Validierung, verbindet sie sich direkt mit Apple Pay oder Google Pay.` },
    es: { title:`Tarjeta Crypto Virtual ${YEAR} — Pagos Online | TopCryptoCards`, h1:`Tarjetas Crypto Virtuales en ${YEAR}`, description:`Las mejores tarjetas crypto virtuales para pagos online en ${YEAR}: activadas de inmediato, compatibles Apple Pay y Google Pay. MetaMask Card, Gnosis Pay, Brighty. Gratis ✓`, intro:`Las tarjetas crypto virtuales son ideales para compras online y pagos contactless mediante smartphone. Suelen estar disponibles inmediatamente tras el registro, sin necesidad de esperar una tarjeta física.`, outro:`La tarjeta virtual es a menudo la forma más rápida de empezar a gastar criptos. Disponible en minutos tras la validación KYC, se conecta directamente a Apple Pay o Google Pay para pagos instantáneos.` },
    it: { title:`Carta Crypto Virtuale ${YEAR} — Pagamenti Online | TopCryptoCards`, h1:`Carte Crypto Virtuali nel ${YEAR}`, description:`Le migliori carte crypto virtuali per pagamenti online nel ${YEAR}: attivate immediatamente, compatibili Apple Pay e Google Pay. MetaMask Card, Gnosis Pay, Brighty. Gratuito ✓`, intro:`Le carte crypto virtuali sono ideali per gli acquisti online e i pagamenti contactless. Spesso sono disponibili immediatamente dopo la registrazione.`, outro:`La carta virtuale è spesso il modo più rapido per iniziare a spendere crypto. Disponibile in pochi minuti dopo la validazione KYC, si collega direttamente ad Apple Pay o Google Pay.` },
    en: { title:`Virtual Crypto Card ${YEAR} — Online Payments | TopCryptoCards`, h1:`Virtual Crypto Cards in ${YEAR}`, description:`The best virtual crypto cards for online payments in ${YEAR}: instantly activated, Apple Pay and Google Pay compatible. MetaMask Card, Gnosis Pay, Brighty. Free ✓`, intro:`Virtual crypto cards are ideal for online shopping and contactless payments via smartphone. They are usually available immediately after registration — no waiting for a physical card.`, outro:`A virtual card is often the fastest way to start spending crypto. Available within minutes of KYC approval, it connects directly to Apple Pay or Google Pay for instant payments anywhere.` },
  },
  beginner: {
    fr: { title:`Carte Crypto Débutant ${YEAR} — Simple, Sans Risque | TopCryptoCards`, h1:`Meilleures Cartes Crypto pour Débutants`, description:`Meilleures cartes crypto pour débutants ${YEAR} : sans staking, sans frais, cashback immédiat. MetaMask Card, Gnosis Pay, Brighty — simples et accessibles. Gratuit ✓`, intro:`Vous découvrez les cartes crypto et vous ne savez pas par où commencer ? Ces cartes ont été sélectionnées pour leur simplicité : aucun staking requis, aucun frais annuel, une interface accessible et un cashback immédiat dès le premier achat.`, outro:`Pour un débutant, le critère le plus important est la simplicité d'utilisation. Commencez par une carte sans staking et sans frais. Une fois que vous êtes à l'aise, vous pourrez explorer les cartes premium avec des taux de cashback plus élevés.` },
    de: { title:`Krypto Karte Einsteiger ${YEAR} — Einfach & Sicher | TopCryptoCards`, h1:`Beste Krypto-Karten für Einsteiger`, description:`Beste Einstiegskarten für Krypto-Anfänger ${YEAR}: kein Staking, keine Gebühren, sofortiges Cashback. MetaMask Card, Gnosis Pay, Brighty — einfach & sicher. Kostenlos ✓`, intro:`Diese Karten wurden für ihre Einfachheit ausgewählt: kein Staking erforderlich, keine Jahresgebühr, sofortiges Cashback ab dem ersten Kauf.`, outro:`Für Einsteiger ist Benutzerfreundlichkeit das wichtigste Kriterium. Beginnen Sie mit einer Karte ohne Staking und ohne Gebühren.` },
    es: { title:`Tarjeta Crypto Principiante ${YEAR} — Sin Riesgo | TopCryptoCards`, h1:`Mejores Tarjetas Crypto para Principiantes`, description:`Mejores tarjetas crypto para principiantes ${YEAR}: sin staking, sin cuota, cashback inmediato. MetaMask Card, Gnosis Pay, Brighty — simples y seguras. Gratis ✓`, intro:`Estas tarjetas han sido seleccionadas por su simplicidad: sin staking requerido, sin cuota anual, cashback inmediato desde la primera compra.`, outro:`Para un principiante, el criterio más importante es la facilidad de uso. Empieza con una tarjeta sin staking y sin comisiones.` },
    it: { title:`Carta Crypto Principiante ${YEAR} — Senza Rischi | TopCryptoCards`, h1:`Migliori Carte Crypto per Principianti`, description:`Migliori carte crypto per principianti ${YEAR}: senza staking, senza costi, cashback immediato. MetaMask Card, Gnosis Pay, Brighty — semplici e sicure. Gratuito ✓`, intro:`Queste carte sono state selezionate per la loro semplicità: nessuno staking richiesto, nessun costo annuale, cashback immediato dal primo acquisto.`, outro:`Per un principiante, il criterio più importante è la facilità d'uso. Inizia con una carta senza staking e senza costi.` },
    en: { title:`Beginner Crypto Card ${YEAR} — Simple & Risk-Free | TopCryptoCards`, h1:`Best Crypto Cards for Beginners`, description:`Best crypto cards for beginners in ${YEAR}: no staking, no fees, instant cashback. MetaMask Card, Gnosis Pay, Brighty — simple and secure. Free comparison ✓`, intro:`New to crypto cards? These cards were selected for their simplicity: no staking required, no annual fee, and instant cashback from your very first purchase.`, outro:`For a beginner, ease of use is the most important criterion. Start with a card that has no staking and no fees. Once you're comfortable, you can explore premium cards with higher cashback rates.` },
  },
  'no-kyc': {
    fr: { title:`Carte Crypto Sans KYC ${YEAR} — KYC Simplifié | TopCryptoCards`, h1:`Cartes Crypto Sans KYC ou KYC Simplifié`, description:`Cartes crypto à inscription simplifiée en ${YEAR}. Gnosis Pay et MetaMask Card — self-custody, sans compte custodial. Payer en crypto sans intermédiaire. Gratuit ✓`, intro:`La plupart des cartes crypto exigent un KYC complet : pièce d'identité, justificatif de domicile, selfie. Mais certaines solutions proposent une inscription simplifiée, notamment les cartes basées sur le self-custody et les wallets Web3 comme MetaMask Card ou Gnosis Pay. Ces cartes fonctionnent directement depuis votre wallet, réduisant les étapes de vérification.`, outro:`Important : aucune carte crypto réglementée en Europe ne permet une utilisation 100% anonyme. Les réglementations MiCA et AML imposent un niveau minimal de vérification. Pour une utilisation légale et sécurisée, choisissez des cartes conformes aux réglementations de votre pays.` },
    de: { title:`Krypto Karte Ohne KYC ${YEAR} — Einfache Anmeldung | TopCryptoCards`, h1:`Krypto-Karten ohne vollständiges KYC`, description:`Krypto-Karten mit vereinfachter Registrierung ${YEAR}: Gnosis Pay und MetaMask Card — Self-Custody, kein Depot-Konto. Krypto zahlen ohne Intermediär. Kostenlos ✓`, intro:`Die meisten Krypto-Karten erfordern ein vollständiges KYC: Ausweis, Adressnachweis, Selfie. Einige Lösungen bieten jedoch eine vereinfachte Anmeldung an, insbesondere Self-Custody- und Web3-Wallet-basierte Karten wie MetaMask Card oder Gnosis Pay, die direkt von Ihrem Wallet aus funktionieren.`, outro:`Wichtig: Keine regulierte Krypto-Karte in Europa erlaubt eine vollständig anonyme Nutzung. MiCA- und AML-Vorschriften erfordern ein Mindestmaß an Verifizierung. Wählen Sie stets Karten, die den lokalen Vorschriften entsprechen.` },
    es: { title:`Tarjeta Crypto Sin KYC ${YEAR} — KYC Simplificado | TopCryptoCards`, h1:`Tarjetas Crypto Sin KYC Completo`, description:`Tarjetas crypto con registro simplificado en ${YEAR}: Gnosis Pay y MetaMask Card — self-custody, sin cuenta custodial. Paga en crypto sin intermediario. Gratis ✓`, intro:`La mayoría de las tarjetas crypto exigen un KYC completo: DNI, justificante de domicilio, selfie. Pero algunas soluciones ofrecen un registro simplificado, especialmente las tarjetas basadas en self-custody y wallets Web3 como MetaMask Card o Gnosis Pay, que funcionan directamente desde tu wallet.`, outro:`Importante: ninguna tarjeta crypto regulada en Europa permite un uso 100% anónimo. Las regulaciones MiCA y AML exigen un nivel mínimo de verificación. Elige tarjetas conformes con las regulaciones locales para un uso legal y seguro.` },
    it: { title:`Carta Crypto Senza KYC ${YEAR} — KYC Semplificato | TopCryptoCards`, h1:`Carte Crypto Senza KYC Completo`, description:`Carte crypto con registrazione semplificata nel ${YEAR}: Gnosis Pay e MetaMask Card — self-custody, senza conto custodiale. Paga in crypto senza intermediari. Gratuito ✓`, intro:`La maggior parte delle carte crypto richiede un KYC completo: documento d'identità, prova di residenza, selfie. Ma alcune soluzioni offrono una registrazione semplificata, in particolare le carte basate su self-custody e wallet Web3 come MetaMask Card o Gnosis Pay, che operano direttamente dal tuo wallet.`, outro:`Importante: nessuna carta crypto regolamentata in Europa consente un utilizzo al 100% anonimo. Le normative MiCA e AML richiedono un livello minimo di verifica. Scegli sempre carte conformi alle normative locali per un utilizzo legale e sicuro.` },
    en: { title:`Crypto Card No KYC ${YEAR} — Easy Registration | TopCryptoCards`, h1:`Crypto Cards Without Full KYC`, description:`Crypto cards with simplified registration in ${YEAR}: Gnosis Pay and MetaMask Card — self-custody, no custodial account. Pay in crypto with no intermediary. Free ✓`, intro:`Most crypto cards require full KYC: ID document, proof of address, selfie. But some solutions offer simplified registration, especially self-custody and Web3 wallet-based cards like MetaMask Card or Gnosis Pay, which operate directly from your wallet and reduce verification steps significantly.`, outro:`Important: no regulated crypto card in Europe allows fully anonymous use. MiCA and AML regulations require a minimum level of verification from all card users. Always choose cards compliant with your local regulations for safe and legal use.` },
  },
  '2026': {
    fr: { title:`Meilleure Carte Crypto 2026 — Comparatif Complet | TopCryptoCards`, h1:`Les Meilleures Cartes Crypto en 2026`, description:`Meilleure carte crypto 2026 : comparatif complet mis à jour. Jusqu'à 8% cashback, 0€/an, sans staking. Crypto.com, Gnosis Pay, MetaMask, Nexo comparés. Gratuit ✓`, intro:`En 2026, le marché des cartes crypto a profondément évolué. L'entrée en vigueur du règlement MiCA en Europe a renforcé les standards de protection des utilisateurs. De nouvelles cartes sont apparues, des offres ont été améliorées. Ce comparatif recense les meilleures options disponibles en 2026, classées par note de confiance et rapport qualité/prix.`, outro:`En 2026, privilégiez les cartes émises par des entités conformes MiCA. La réglementation européenne offre désormais une protection solide : vos fonds sont mieux encadrés, les recours en cas de litige plus clairs. Comparez les taux de cashback mais ne négligez pas la fiabilité de l'émetteur.` },
    de: { title:`Beste Krypto Karte 2026 — Aktueller Vergleich | TopCryptoCards`, h1:`Die Besten Krypto-Karten 2026`, description:`Beste Krypto-Karte 2026: vollständiger aktueller Vergleich. Bis zu 8% Cashback, 0€/Jahr, kein Staking. Crypto.com, Gnosis Pay, MetaMask, Nexo verglichen. Kostenlos ✓`, intro:`2026 hat sich der Krypto-Karten-Markt erheblich weiterentwickelt. Die MiCA-Verordnung in Europa hat die Nutzerstandards gestärkt. Neue Karten sind erschienen, Angebote wurden verbessert. Dieser Vergleich listet die besten verfügbaren Optionen 2026 nach Vertrauenswürdigkeit und Preis-Leistungs-Verhältnis.`, outro:`2026 bevorzugen Sie MiCA-konforme Karten von regulierten Emittenten. Die europäische Regulierung bietet nun soliden Schutz für Ihre Gelder. Vergleichen Sie Cashback-Raten, vernachlässigen Sie aber nicht die Zuverlässigkeit des Emittenten.` },
    es: { title:`Mejor Tarjeta Crypto 2026 — Comparativa Completa | TopCryptoCards`, h1:`Las Mejores Tarjetas Crypto en 2026`, description:`Mejor tarjeta crypto 2026: comparativa completa actualizada. Hasta 8% cashback, 0€/año, sin staking. Crypto.com, Gnosis Pay, MetaMask, Nexo comparados. Gratis ✓`, intro:`En 2026, el mercado de tarjetas crypto ha evolucionado profundamente. La regulación MiCA en Europa ha reforzado los estándares de protección. Nuevas tarjetas han aparecido y las ofertas han mejorado. Esta comparativa recoge las mejores opciones de 2026, clasificadas por puntuación de confianza y relación calidad/precio.`, outro:`En 2026, prioriza tarjetas emitidas por entidades conformes con MiCA. La regulación europea ofrece ahora una protección sólida para tus fondos. Compara las tasas de cashback pero no descuides la fiabilidad del emisor.` },
    it: { title:`Migliore Carta Crypto 2026 — Confronto Completo | TopCryptoCards`, h1:`Le Migliori Carte Crypto nel 2026`, description:`Migliore carta crypto 2026: confronto completo aggiornato. Fino all'8% cashback, 0€/anno, senza staking. Crypto.com, Gnosis Pay, MetaMask, Nexo confrontati. Gratuito ✓`, intro:`Nel 2026, il mercato delle carte crypto si è profondamente evoluto. L'entrata in vigore di MiCA in Europa ha rafforzato gli standard di protezione degli utenti. Nuove carte sono apparse e le offerte sono migliorate. Questo confronto raccoglie le migliori opzioni del 2026, classificate per punteggio di fiducia e rapporto qualità/prezzo.`, outro:`Nel 2026, privilegia carte emesse da entità conformi a MiCA. La regolamentazione europea offre ora una protezione solida per i tuoi fondi. Confronta i tassi di cashback ma non trascurare l'affidabilità dell'emittente.` },
    en: { title:`Best Crypto Card 2026 — Complete Comparison | TopCryptoCards`, h1:`The Best Crypto Cards in 2026`, description:`Best crypto card 2026: full updated comparison. Up to 8% cashback, €0/year, no staking required. Crypto.com, Gnosis Pay, MetaMask Card, Nexo compared. Free ✓`, intro:`In 2026, the crypto card market has evolved significantly. The MiCA regulation across Europe has strengthened user protection standards. New cards have emerged and existing offers have improved. This comparison covers the best options available in 2026, ranked by trust score and overall value for money.`, outro:`In 2026, prioritize MiCA-compliant cards issued by regulated entities. European regulation now provides solid protection for your funds. Compare cashback rates but don't overlook the issuer's reliability and regulatory track record.` },
  },
  travel: {
    fr: { title:`Carte Crypto Voyage ${YEAR} — Sans Frais de Change | TopCryptoCards`, h1:`Meilleures Cartes Crypto pour Voyager en ${YEAR}`, description:`Quelle carte crypto pour voyager en ${YEAR} ? Sans frais de change, cashback à l'étranger, acceptée dans 200+ pays. Crypto.com, Bybit, Nexo comparés. Gratuit ✓`, intro:`Voyager avec une carte crypto offre de nombreux avantages : pas de frais de change excessifs, cashback en crypto sur chaque achat à l'étranger, et acceptation dans plus de 50 millions de points de vente Visa/Mastercard. Ces cartes sont idéales pour les digital nomads et les voyageurs fréquents qui souhaitent maximiser leurs dépenses à l'international.`, outro:`Pour voyager, privilégiez une carte sans frais de change et avec des plafonds de retrait généreux. La Crypto.com Obsidian offre même les lounges d'aéroport gratuitement. Pour les voyageurs occasionnels, Gnosis Pay ou MetaMask Card suffisent sans aucun frais annuel.` },
    de: { title:`Krypto Karte Reise ${YEAR} — Beste Karte für Reisen | TopCryptoCards`, h1:`Beste Krypto-Karten für Reisende ${YEAR}`, description:`Beste Krypto-Karte für Reisen ${YEAR}: keine Wechselgebühren, bis zu 5% Cashback im Ausland, in 200+ Ländern akzeptiert. Crypto.com, Bybit, Nexo verglichen. Kostenlos ✓`, intro:`Mit einer Krypto-Karte zu reisen bietet viele Vorteile: keine übermäßigen Wechselgebühren, Cashback in Krypto bei jedem Auslandskauf und Akzeptanz bei über 50 Millionen Händlern weltweit. Diese Karten sind ideal für digitale Nomaden und Vielreisende, die ihre internationalen Ausgaben maximieren möchten.`, outro:`Für Reisen wählen Sie eine Karte ohne Wechselgebühren und mit großzügigen Abhebungslimits. Die Crypto.com Obsidian bietet sogar kostenlose Flughafen-Lounges. Für Gelegenheitsreisende reichen Gnosis Pay oder MetaMask Card ohne Jahresgebühr vollkommen aus.` },
    es: { title:`Tarjeta Crypto Viaje ${YEAR} — Sin Cambio de Divisa | TopCryptoCards`, h1:`Mejores Tarjetas Crypto para Viajeros en ${YEAR}`, description:`Mejor tarjeta crypto para viajeros ${YEAR}: sin comisiones de cambio, hasta 5% cashback en el extranjero, aceptada en 200+ países. Crypto.com, Bybit, Nexo. Gratis ✓`, intro:`Viajar con una tarjeta crypto ofrece muchas ventajas: sin comisiones de cambio excesivas, cashback en crypto en cada compra en el extranjero y aceptación en más de 50 millones de comercios Visa/Mastercard. Estas tarjetas son ideales para nómadas digitales y viajeros frecuentes que desean maximizar sus gastos internacionales.`, outro:`Para viajar, elige una tarjeta sin comisiones de cambio y con límites de retirada generosos. Crypto.com Obsidian ofrece incluso acceso gratuito a lounges de aeropuerto. Para viajeros ocasionales, Gnosis Pay o MetaMask Card son más que suficientes sin cuota anual.` },
    it: { title:`Carta Crypto Viaggio ${YEAR} — Senza Commissioni | TopCryptoCards`, h1:`Migliori Carte Crypto per Viaggiatori nel ${YEAR}`, description:`Migliore carta crypto per viaggiare nel ${YEAR}: senza commissioni di cambio, fino al 5% cashback all'estero, accettata in 200+ paesi. Crypto.com, Bybit, Nexo. Gratuito ✓`, intro:`Viaggiare con una carta crypto offre molti vantaggi: nessuna commissione di cambio eccessiva, cashback in crypto per ogni acquisto all'estero e accettazione in oltre 50 milioni di punti vendita Visa/Mastercard. Queste carte sono ideali per i nomadi digitali e i viaggiatori frequenti che desiderano massimizzare le spese internazionali.`, outro:`Per viaggiare, scegli una carta senza commissioni di cambio e con limiti di prelievo generosi. Crypto.com Obsidian offre persino l'accesso gratuito alle lounge aeroportuali. Per i viaggiatori occasionali, Gnosis Pay o MetaMask Card sono più che sufficienti senza costi annuali.` },
    en: { title:`Crypto Card for Travel ${YEAR} — No Exchange Fees | TopCryptoCards`, h1:`Best Crypto Cards for Travel in ${YEAR}`, description:`Best crypto card for travel in ${YEAR}: no currency exchange fees, up to 5% cashback abroad, accepted in 200+ countries. Crypto.com, Bybit, Nexo compared. Free ✓`, intro:`Traveling with a crypto card offers many advantages: no excessive currency exchange fees, crypto cashback on every purchase abroad, and acceptance at over 50 million Visa/Mastercard merchants worldwide. These cards are ideal for digital nomads and frequent travelers who want to maximize their international spending.`, outro:`For travel, choose a card with no exchange fees and generous ATM withdrawal limits. Crypto.com Obsidian even includes free airport lounge access. For occasional travelers, Gnosis Pay or MetaMask Card are more than sufficient with no annual fee.` },
  },
  rewards: {
    fr: { title:`Carte Crypto Récompenses ${YEAR} — Cashback & Perks | TopCryptoCards`, h1:`Cartes Crypto avec les Meilleures Récompenses en ${YEAR}`, description:`Cartes crypto avec les meilleures récompenses ${YEAR} : cashback crypto, lounge VIP, Netflix offert, Spotify remboursé. Crypto.com, Nexo, Bybit comparés. Gratuit ✓`, intro:`Les cartes crypto premium offrent bien plus qu'un simple cashback : accès aux lounges d'aéroport, abonnements offerts (Netflix, Spotify), assurance voyage, cashback en crypto sur tous vos achats. Ces récompenses peuvent valoir plusieurs centaines d'euros par an selon votre usage et niveau de staking.`, outro:`Pour maximiser vos récompenses, évaluez les avantages en valeur monétaire réelle. Calculez si la dépréciation potentielle du token staké ne dépasse pas la valeur des avantages annuels. Pour la plupart des utilisateurs, Gnosis Pay et MetaMask Card offrent un excellent rapport récompenses/risque sans staking.` },
    de: { title:`Krypto Karte Prämien ${YEAR} — Cashback & Prämien | TopCryptoCards`, h1:`Krypto-Karten mit den besten Prämien ${YEAR}`, description:`Krypto-Karten mit besten Prämien ${YEAR}: Cashback, VIP-Lounges, Netflix inklusive, Spotify erstattet. Crypto.com, Nexo, Bybit verglichen. Kostenloser Vergleich ✓`, intro:`Premium-Krypto-Karten bieten weit mehr als nur Cashback: Flughafen-Lounge-Zugang, inklusive Abonnements (Netflix, Spotify), Reiseversicherung und Krypto-Cashback auf alle Einkäufe. Diese Prämien können je nach Nutzung und Staking-Niveau mehrere hundert Euro pro Jahr wert sein.`, outro:`Bewerten Sie die Vorteile in echtem Geldwert, bevor Sie sich für ein Staking-Niveau entscheiden. Für die meisten Nutzer bieten Gnosis Pay und MetaMask Card ein hervorragendes Prämien-/Risikoprofil ohne jedes Staking.` },
    es: { title:`Tarjeta Crypto Recompensas ${YEAR} — Cashback & Perks | TopCryptoCards`, h1:`Tarjetas Crypto con las Mejores Recompensas en ${YEAR}`, description:`Tarjetas crypto con las mejores recompensas ${YEAR}: cashback cripto, lounges VIP, Netflix incluido, Spotify reembolsado. Crypto.com, Nexo, Bybit comparados. Gratis ✓`, intro:`Las tarjetas crypto premium ofrecen mucho más que un simple cashback: acceso a lounges de aeropuerto, suscripciones incluidas (Netflix, Spotify), seguro de viaje y cashback en crypto en todas tus compras. Estas recompensas pueden valer varios cientos de euros al año según tu uso y nivel de staking.`, outro:`Evalúa las ventajas en valor monetario real antes de comprometerte con un nivel de staking. Para la mayoría de usuarios, Gnosis Pay y MetaMask Card ofrecen una excelente relación recompensas/riesgo sin staking alguno.` },
    it: { title:`Carta Crypto Premi ${YEAR} — Cashback e Premi | TopCryptoCards`, h1:`Carte Crypto con i Migliori Premi nel ${YEAR}`, description:`Carte crypto con i migliori premi ${YEAR}: cashback cripto, lounge VIP, Netflix incluso, Spotify rimborsato. Crypto.com, Nexo, Bybit confrontati. Gratuito ✓`, intro:`Le carte crypto premium offrono molto più di un semplice cashback: accesso alle lounge aeroportuali, abbonamenti inclusi (Netflix, Spotify), assicurazione viaggio e cashback in crypto su tutti gli acquisti. Questi premi possono valere diverse centinaia di euro all'anno in base all'utilizzo e al livello di staking.`, outro:`Valuta i vantaggi in termini di valore monetario reale prima di impegnarti in uno staking. Per la maggior parte degli utenti, Gnosis Pay e MetaMask Card offrono un ottimo rapporto premi/rischio senza alcuno staking.` },
    en: { title:`Crypto Card Rewards ${YEAR} — Cashback & Perks | TopCryptoCards`, h1:`Crypto Cards with the Best Rewards in ${YEAR}`, description:`Best crypto cards with rewards in ${YEAR}: crypto cashback, VIP airport lounges, Netflix included, Spotify reimbursed. Crypto.com, Nexo, Bybit compared. Free ✓`, intro:`Premium crypto cards offer much more than simple cashback: airport lounge access, included subscriptions (Netflix, Spotify), travel insurance, and crypto cashback on all your purchases. These rewards can be worth several hundred euros per year depending on your usage and staking tier.`, outro:`Evaluate the benefits in real monetary value before committing to a staking tier. For most users, Gnosis Pay and MetaMask Card offer an excellent rewards-to-risk profile with no staking required at all.` },
  },
};

/* ────────────────────────────────────────────────────────────────────────────
   THEME_SECTIONS — extra editorial H2 blocks for content depth (SEO)
   Added for priority themes: best / cashback / no-staking / travel / no-fees / rewards / virtual / beginner / 2026
   ──────────────────────────────────────────────────────────────────────────── */
const THEME_SECTIONS: Partial<Record<string, Partial<Record<string, { h2: string; p: string }[]>>>> = {
  best: {
    fr: [
      { h2: `Comment choisir la meilleure carte crypto en ${YEAR} ?`, p: `Pour identifier la meilleure carte crypto, analysez plusieurs critères : taux de cashback maximum, conditions de staking, frais annuels, disponibilité en France et fiabilité de l'émetteur. Une carte proposant 8% de cashback avec 200 000€ de staking en CRO n'est pas rentable pour un utilisateur moyen. Calculez le retour sur investissement réel en tenant compte du capital immobilisé et de la volatilité du token natif.` },
      { h2: `Crypto.com, Nexo, Gnosis Pay : quelle carte vous correspond ?`, p: `Crypto.com s'impose pour les utilisateurs déjà investis en CRO, avec un cashback de 1% à 8% selon le niveau. Nexo séduit par son cashback en BTC sans staking excessif. Gnosis Pay, carte on-chain, offre un cashback en GNO sans KYC strict. Pour les débutants, Brighty ou MetaMask Card sont idéales : gratuites, sans staking obligatoire, avec un cashback de 0,5% à 3%.` },
    ],
    de: [
      { h2: `Wie wählt man die beste Krypto-Karte ${YEAR}?`, p: `Um die beste Krypto-Karte zu finden, analysieren Sie mehrere Faktoren: maximaler Cashback-Satz, Staking-Bedingungen, Jahresgebühren, Verfügbarkeit in Deutschland und Zuverlässigkeit des Emittenten. Eine Karte mit 8% Cashback, die 200.000€ Staking in CRO erfordert, ist für Durchschnittsnutzer nicht rentabel. Berechnen Sie die tatsächliche Rendite unter Berücksichtigung des immobilisierten Kapitals und der Token-Volatilität.` },
      { h2: `Crypto.com, Nexo oder Gnosis Pay: Welche Karte passt zu Ihnen?`, p: `Crypto.com eignet sich für Nutzer, die bereits in CRO investiert sind, mit einem Cashback von 1% bis 8% je nach Stufe. Nexo punktet mit BTC-Cashback ohne übermäßiges Staking. Gnosis Pay, eine On-Chain-Karte, bietet GNO-Cashback ohne strenges KYC. Für Einsteiger sind Brighty oder MetaMask Card ideal: kostenlos, kein Pflicht-Staking, 0,5% bis 3% Cashback.` },
    ],
    es: [
      { h2: `¿Cómo elegir la mejor tarjeta crypto en ${YEAR}?`, p: `Para identificar la mejor tarjeta crypto hay que analizar varios criterios: tasa máxima de cashback, condiciones de staking, comisiones anuales, disponibilidad en España y fiabilidad del emisor. Una tarjeta con 8% de cashback que exige 200.000€ en staking de CRO no es rentable para el usuario medio. Calcula el retorno real teniendo en cuenta el capital bloqueado y la volatilidad del token.` },
      { h2: `Crypto.com, Nexo o Gnosis Pay: ¿cuál te conviene?`, p: `Crypto.com es ideal para usuarios ya invertidos en CRO, con cashback del 1% al 8% según el nivel. Nexo atrae por su cashback en BTC sin staking excesivo. Gnosis Pay, tarjeta on-chain, ofrece cashback en GNO sin KYC estricto. Para principiantes, Brighty o MetaMask Card son perfectas: gratuitas, sin staking obligatorio, con cashback del 0,5% al 3%.` },
    ],
    it: [
      { h2: `Come scegliere la migliore carta crypto nel ${YEAR}?`, p: `Per identificare la migliore carta crypto è necessario analizzare diversi criteri: tasso di cashback massimo, condizioni di staking, commissioni annuali, disponibilità in Italia e affidabilità dell'emittente. Una carta con 8% di cashback che richiede 200.000€ di staking in CRO non è conveniente per l'utente medio. Valuta il rendimento reale considerando il capitale immobilizzato e la volatilità del token.` },
      { h2: `Crypto.com, Nexo o Gnosis Pay: quale carta fa per te?`, p: `Crypto.com è ideale per chi è già investito in CRO, con cashback dall'1% all'8% secondo il livello. Nexo convince con cashback in BTC senza staking eccessivo. Gnosis Pay, carta on-chain, offre cashback in GNO senza KYC rigido. Per i principianti, Brighty o MetaMask Card sono perfette: gratuite, senza staking obbligatorio, con cashback dallo 0,5% al 3%.` },
    ],
    en: [
      { h2: `How to choose the best crypto card in ${YEAR}?`, p: `To identify the best crypto card, analyze several criteria: maximum cashback rate, staking conditions, annual fees, geographic availability and issuer reliability. A card offering 8% cashback requiring €200,000 staked in CRO is not profitable for the average user. Calculate the real return on investment accounting for locked capital and token volatility before committing to any tier.` },
      { h2: `Crypto.com, Nexo or Gnosis Pay: which card suits you?`, p: `Crypto.com suits users already invested in CRO, with cashback from 1% to 8% depending on tier. Nexo wins with BTC cashback without excessive staking. Gnosis Pay, an on-chain card, offers GNO cashback with minimal KYC. For beginners, Brighty or MetaMask Card are ideal: free, no mandatory staking, with 0.5% to 3% cashback on every purchase.` },
    ],
  },
  cashback: {
    fr: [
      { h2: `Comment fonctionne le cashback sur une carte crypto ?`, p: `Le cashback crypto fonctionne comme un programme de fidélité : chaque achat vous rapporte un pourcentage de la somme dépensée, versé en cryptomonnaie. Contrairement au cashback bancaire classique versé en euros, le cashback crypto est soumis à la volatilité du marché. Un cashback de 3% en CRO lors d'un mois baissier peut valoir moins qu'un cashback de 1% en USDC stable. Choisissez la crypto de cashback en fonction de votre stratégie d'investissement.` },
      { h2: `Staking et cashback : quel retour sur investissement réel ?`, p: `Pour débloquer les meilleurs taux de cashback, certaines cartes exigent de staker un montant important de tokens natifs. La carte Crypto.com Obsidian offre 8% de cashback mais nécessite 400 000 CRO stakés (~150 000€). Avec 1 000€ de dépenses mensuelles, le cashback annuel serait de 960€ — insuffisant pour rentabiliser l'immobilisation de 150 000€. Pour la plupart des utilisateurs, les cartes avec 1-3% de cashback sans staking sont bien plus rentables sur le long terme.` },
    ],
    de: [
      { h2: `Wie funktioniert Cashback bei Krypto-Karten?`, p: `Krypto-Cashback funktioniert wie ein Treueprogramm: Jeder Kauf bringt Ihnen einen Prozentsatz des ausgegebenen Betrags in Kryptowährung ein. Im Gegensatz zu herkömmlichem Bankcashback in Euro ist Krypto-Cashback der Marktvolatilität ausgesetzt. 3% Cashback in CRO in einem schwachen Monat kann weniger wert sein als 1% in stabilem USDC. Wählen Sie die Cashback-Kryptowährung entsprechend Ihrer Anlagestrategie.` },
      { h2: `Staking und Cashback: Was ist die tatsächliche Rendite?`, p: `Um die besten Cashback-Raten freizuschalten, erfordern einige Karten das Staken erheblicher nativer Token-Mengen. Die Crypto.com Obsidian bietet 8% Cashback, benötigt aber 400.000 CRO (~150.000€). Bei 1.000€ monatlichen Ausgaben wären das 960€ Jahres-Cashback — zu wenig, um 150.000€ Kapital zu rechtfertigen. Für die meisten Nutzer sind Karten mit 1-3% Cashback ohne Staking deutlich rentabler.` },
    ],
    es: [
      { h2: `¿Cómo funciona el cashback en una tarjeta crypto?`, p: `El cashback crypto funciona como un programa de fidelidad: cada compra te devuelve un porcentaje del importe gastado en criptomoneda. A diferencia del cashback bancario clásico en euros, el cashback crypto está sujeto a la volatilidad del mercado. Un cashback del 3% en CRO en un mes bajista puede valer menos que un 1% en USDC estable. Elige la cripto de cashback según tu estrategia de inversión.` },
      { h2: `Staking y cashback: ¿cuál es el rendimiento real?`, p: `Para desbloquear las mejores tasas de cashback, algunas tarjetas exigen hacer staking de importantes cantidades de tokens nativos. La Crypto.com Obsidian ofrece 8% de cashback pero requiere 400.000 CRO en staking (~150.000€). Con 1.000€ de gastos mensuales, el cashback anual sería de 960€ — insuficiente para rentabilizar 150.000€ inmovilizados. Para la mayoría, las tarjetas con 1-3% sin staking son mucho más rentables.` },
    ],
    it: [
      { h2: `Come funziona il cashback su una carta crypto?`, p: `Il cashback crypto funziona come un programma fedeltà: ogni acquisto ti restituisce una percentuale dell'importo speso in criptovaluta. A differenza del classico cashback bancario in euro, il cashback crypto è soggetto alla volatilità del mercato. Un cashback del 3% in CRO in un mese al ribasso può valere meno dell'1% in USDC stabile. Scegli la cripto di cashback in base alla tua strategia di investimento.` },
      { h2: `Staking e cashback: qual è il rendimento reale?`, p: `Per sbloccare i migliori tassi di cashback, alcune carte richiedono di fare staking di importanti quantità di token nativi. La Crypto.com Obsidian offre 8% di cashback ma richiede 400.000 CRO in staking (~150.000€). Con 1.000€ di spese mensili, il cashback annuale sarebbe di 960€ — insufficiente per giustificare 150.000€ immobilizzati. Per la maggior parte degli utenti, le carte con 1-3% senza staking sono molto più redditizie.` },
    ],
    en: [
      { h2: `How does cashback work on a crypto card?`, p: `Crypto cashback works like a loyalty programme: every purchase earns you a percentage of the amount spent, paid in cryptocurrency. Unlike traditional bank cashback paid in euros, crypto cashback is subject to market volatility. A 3% cashback in CRO during a bearish month may be worth less than 1% in stable USDC. Choose your cashback cryptocurrency based on your investment strategy and risk tolerance.` },
      { h2: `Staking and cashback: what's the real return on investment?`, p: `To unlock the best cashback rates, some cards require staking significant amounts of native tokens. The Crypto.com Obsidian offers 8% cashback but requires 400,000 CRO staked (~€150,000). With €1,000 monthly spending, annual cashback would be €960 — not enough to justify locking €150,000. For most users, cards offering 1-3% cashback with no staking requirement are far more profitable in the long run.` },
    ],
  },
  'no-staking': {
    fr: [
      { h2: `Pourquoi préférer une carte crypto sans staking ?`, p: `Le staking obligatoire présente deux risques majeurs : immobilisation de capital et exposition au risque de change sur la crypto stakée. Si le cours s'effondre pendant la période de lock-up (souvent 180 jours), vous perdez doublement — sur la valeur stakée et sur les opportunités manquées. Une carte sans staking comme Gnosis Pay ou MetaMask Card vous offre un cashback immédiat sans contraintes ni risque de perte supplémentaire.` },
      { h2: `Gnosis Pay, MetaMask Card, Brighty : le comparatif ${YEAR}`, p: `Gnosis Pay est unique : c'est la première carte Visa connectée directement à une wallet on-chain, avec un cashback en GNO sur chaque achat. MetaMask Card offre 1-3% en ETH sur les achats, idéale pour les utilisateurs DeFi. Brighty propose 0,5% à 1,75% de cashback en USDC sans staking, avec un IBAN européen intégré. Ces trois cartes se distinguent par leur transparence totale et l'absence de conditions cachées.` },
    ],
    de: [
      { h2: `Warum eine Krypto-Karte ohne Staking wählen?`, p: `Pflicht-Staking birgt zwei Hauptrisiken: Kapitalimmobilisierung und Wechselkursrisiko bei der gestakten Kryptowährung. Wenn der Kurs während der Lock-up-Periode (oft 180 Tage) einbricht, verlieren Sie doppelt — beim gestakten Wert und durch verpasste Chancen. Eine Karte ohne Staking wie Gnosis Pay oder MetaMask Card bietet sofortigen Cashback ohne diese Einschränkungen und ohne zusätzliches Verlustrisiko.` },
      { h2: `Gnosis Pay, MetaMask Card, Brighty: Vergleich ${YEAR}`, p: `Gnosis Pay ist einzigartig: Die erste Visa-Karte, direkt mit einer On-Chain-Wallet verbunden, mit GNO-Cashback auf jeden Kauf. MetaMask Card bietet 1-3% in ETH, ideal für DeFi-Nutzer. Brighty bietet 0,5% bis 1,75% Cashback in USDC ohne Staking, mit integrierter europäischer IBAN. Diese drei Karten zeichnen sich durch vollständige Transparenz und das Fehlen versteckter Bedingungen aus.` },
    ],
    es: [
      { h2: `¿Por qué preferir una tarjeta crypto sin staking?`, p: `El staking obligatorio presenta dos riesgos principales: inmovilización de capital y exposición al riesgo de cambio de la cripto bloqueada. Si el precio cae durante el período de lock-up (a menudo 180 días), pierdes doblemente — en el valor del staking y en oportunidades perdidas. Una tarjeta sin staking como Gnosis Pay o MetaMask Card te ofrece cashback inmediato sin restricciones ni riesgo adicional de pérdida.` },
      { h2: `Gnosis Pay, MetaMask Card, Brighty: comparativa ${YEAR}`, p: `Gnosis Pay es única: la primera tarjeta Visa conectada directamente a una wallet on-chain, con cashback en GNO en cada compra. MetaMask Card ofrece 1-3% en ETH en las compras, ideal para usuarios DeFi. Brighty propone 0,5% a 1,75% de cashback en USDC sin staking, con IBAN europeo integrado. Estas tres tarjetas destacan por su transparencia total y la ausencia de condiciones ocultas.` },
    ],
    it: [
      { h2: `Perché preferire una carta crypto senza staking?`, p: `Lo staking obbligatorio presenta due rischi principali: immobilizzazione del capitale ed esposizione al rischio di cambio sulla cripto in staking. Se il prezzo crolla durante il periodo di lock-up (spesso 180 giorni), perdi due volte — sul valore dello staking e sulle opportunità mancate. Una carta senza staking come Gnosis Pay o MetaMask Card offre cashback immediato senza vincoli né rischio aggiuntivo.` },
      { h2: `Gnosis Pay, MetaMask Card, Brighty: confronto ${YEAR}`, p: `Gnosis Pay è unica: la prima carta Visa collegata direttamente a un wallet on-chain, con cashback in GNO su ogni acquisto. MetaMask Card offre 1-3% in ETH sugli acquisti, ideale per gli utenti DeFi. Brighty propone dallo 0,5% all'1,75% di cashback in USDC senza staking, con IBAN europeo integrato. Queste tre carte si distinguono per trasparenza totale e assenza di condizioni nascoste.` },
    ],
    en: [
      { h2: `Why choose a crypto card without staking requirements?`, p: `Mandatory staking carries two major risks: capital lockup and exchange rate exposure on the staked cryptocurrency. If the price crashes during the lock-up period (often 180 days), you lose twice — on the staked value and through missed opportunities elsewhere. A no-staking card like Gnosis Pay or MetaMask Card gives you immediate cashback without these constraints and with no additional loss risk.` },
      { h2: `Gnosis Pay, MetaMask Card, Brighty: ${YEAR} comparison`, p: `Gnosis Pay is unique: the first Visa card connected directly to an on-chain wallet, with GNO cashback on every purchase. MetaMask Card offers 1-3% in ETH, ideal for DeFi users. Brighty provides 0.5% to 1.75% cashback in USDC with no staking, plus a built-in European IBAN. All three stand out for full transparency and complete absence of hidden conditions.` },
    ],
  },
  travel: {
    fr: [
      { h2: `Quelle carte crypto choisir pour voyager à l'étranger ?`, p: `Pour les voyages, trois critères sont prioritaires : l'absence de frais de change sur les devises étrangères, des retraits DAB gratuits à l'étranger et une acceptation mondiale via Visa ou Mastercard. Crypto.com offre jusqu'à 400€/mois de retraits gratuits sur les niveaux supérieurs. Bybit et Nexo proposent également des avantages voyage avec cashback en crypto sur tous les achats à l'étranger, quelle que soit la devise locale.` },
      { h2: `Frais de change et retraits DAB avec une carte crypto`, p: `La plupart des cartes crypto facturent 0% de frais sur les achats en devises étrangères — un avantage majeur par rapport aux cartes bancaires classiques (1,5% à 3%). En revanche, les retraits DAB sont souvent plafonnés selon le niveau de la carte. Vérifiez le plafond mensuel gratuit avant de partir : il varie de 200€ (niveaux d'entrée) à illimité (niveaux premium) selon les émetteurs. Au-delà du plafond, des frais de 2% s'appliquent généralement.` },
    ],
    de: [
      { h2: `Welche Krypto-Karte für Auslandsreisen wählen?`, p: `Für Reisen sind drei Kriterien vorrangig: keine Wechselgebühren für Fremdwährungen, kostenlose Geldautomaten-Abhebungen im Ausland und weltweite Akzeptanz über Visa oder Mastercard. Crypto.com bietet bis zu 400€/Monat kostenlose Abhebungen auf höheren Stufen. Bybit und Nexo bieten ebenfalls Reisevorteile mit Krypto-Cashback auf alle Auslandskäufe, unabhängig von der Landeswährung.` },
      { h2: `Wechselgebühren und Geldautomaten-Abhebungen mit Krypto-Karten`, p: `Die meisten Krypto-Karten berechnen 0% Gebühren auf Fremdwährungskäufe — ein großer Vorteil gegenüber herkömmlichen Bankkarten (1,5% bis 3%). Allerdings sind Geldautomaten-Abhebungen oft nach Kartenstufe begrenzt. Prüfen Sie das kostenlose Monatslimit vor der Reise: Es variiert je nach Emittent von 200€ (Einstiegsstufen) bis unbegrenzt (Premium-Stufen). Darüber hinaus fallen in der Regel 2% Gebühren an.` },
    ],
    es: [
      { h2: `¿Qué tarjeta crypto elegir para viajar al extranjero?`, p: `Para los viajes, tres criterios son prioritarios: ausencia de comisiones por divisas extranjeras, retiradas de cajero gratuitas en el extranjero y aceptación mundial a través de Visa o Mastercard. Crypto.com ofrece hasta 400€/mes de retiradas gratuitas en los niveles superiores. Bybit y Nexo también ofrecen ventajas de viaje con cashback en crypto en todas las compras en el extranjero, independientemente de la moneda local.` },
      { h2: `Comisiones de cambio y retiradas de cajero con tarjeta crypto`, p: `La mayoría de las tarjetas crypto cobran 0% de comisiones en compras en divisas extranjeras — una ventaja importante frente a las tarjetas bancarias clásicas (1,5% a 3%). Sin embargo, las retiradas de cajero suelen estar limitadas según el nivel de la tarjeta. Comprueba el límite mensual gratuito antes de viajar: varía de 200€ (niveles de entrada) a ilimitado (niveles premium). Por encima del límite, suelen aplicarse comisiones del 2%.` },
    ],
    it: [
      { h2: `Quale carta crypto scegliere per viaggiare all'estero?`, p: `Per i viaggi, tre criteri sono prioritari: assenza di commissioni su valute straniere, prelievi gratuiti agli ATM all'estero e accettazione mondiale tramite Visa o Mastercard. Crypto.com offre fino a 400€/mese di prelievi gratuiti sui livelli superiori. Bybit e Nexo propongono anche vantaggi viaggio con cashback in crypto su tutti gli acquisti all'estero, indipendentemente dalla valuta locale.` },
      { h2: `Commissioni di cambio e prelievi ATM con carta crypto`, p: `La maggior parte delle carte crypto applica 0% di commissioni sugli acquisti in valuta straniera — un grande vantaggio rispetto alle carte bancarie classiche (1,5% a 3%). Tuttavia, i prelievi ATM sono spesso limitati in base al livello della carta. Verifica il limite mensile gratuito prima di partire: varia da 200€ (livelli base) a illimitato (livelli premium). Oltre il limite, si applicano generalmente commissioni del 2%.` },
    ],
    en: [
      { h2: `Which crypto card to choose for travelling abroad?`, p: `For travel, three criteria are paramount: no foreign exchange fees, free ATM withdrawals abroad and worldwide acceptance via Visa or Mastercard. Crypto.com offers up to €400/month in free withdrawals on higher tiers. Bybit and Nexo also offer compelling travel benefits with crypto cashback on all foreign purchases, regardless of the local currency used.` },
      { h2: `Foreign exchange fees and ATM withdrawals with crypto cards`, p: `Most crypto cards charge 0% fees on foreign currency purchases — a major advantage over traditional bank cards (1.5% to 3% in fees). However, ATM withdrawals are often capped based on card tier. Check your free monthly limit before travelling: it ranges from €200 (entry tiers) to unlimited (premium tiers) depending on the issuer. Beyond the limit, a 2% fee typically applies.` },
    ],
  },
  'no-fees': {
    fr: [
      { h2: `Pourquoi choisir une carte crypto sans frais annuels ?`, p: `Les frais annuels d'une carte crypto peuvent atteindre 180€/an pour les niveaux premium. Avant de payer, calculez si les avantages (cashback, lounges, abonnements) dépassent ce coût. Pour un utilisateur dépensant 500€/mois avec un cashback de 1%, le gain annuel est de 60€ — bien en deçà des 180€ de frais. Les cartes gratuites comme MetaMask Card, Gnosis Pay ou Brighty offrent un excellent point d'entrée sans engagement financier.` },
      { h2: `Cartes crypto gratuites : MetaMask, Gnosis Pay, Brighty — comparatif ${YEAR}`, p: `MetaMask Card est entièrement gratuite (0€/an), disponible sur Visa, avec un cashback de 1% en ETH sur les achats courants — sans staking obligatoire. Gnosis Pay, gratuite également, est unique en tant que carte on-chain native, avec cashback en GNO. Brighty propose une carte USDC gratuite avec IBAN européen intégré et jusqu'à 1,75% de cashback. Ces trois options cumulent les avantages des fintech traditionnelles et de la DeFi.` },
    ],
    de: [
      { h2: `Warum eine Krypto-Karte ohne Jahresgebühren wählen?`, p: `Die Jahresgebühren einer Krypto-Karte können für Premium-Stufen bis zu 180€/Jahr betragen. Bevor Sie zahlen, prüfen Sie, ob die Vorteile (Cashback, Lounges, Abos) diese Kosten übersteigen. Für einen Nutzer mit 500€ Monatsausgaben und 1% Cashback beträgt der Jahresgewinn 60€ — weit unter 180€ Gebühren. Kostenlose Karten wie MetaMask Card, Gnosis Pay oder Brighty bieten einen hervorragenden Einstieg ohne finanzielle Verpflichtung.` },
      { h2: `Kostenlose Krypto-Karten: MetaMask, Gnosis Pay, Brighty — Vergleich ${YEAR}`, p: `MetaMask Card ist völlig kostenlos (0€/Jahr), auf Visa verfügbar, mit 1% Cashback in ETH auf alltägliche Einkäufe — ohne Pflicht-Staking. Gnosis Pay, ebenfalls kostenlos, ist einzigartig als native On-Chain-Karte mit GNO-Cashback. Brighty bietet eine kostenlose USDC-Karte mit integrierter europäischer IBAN und bis zu 1,75% Cashback. Alle drei vereinen die Vorteile traditioneller Fintechs und DeFi.` },
    ],
    es: [
      { h2: `¿Por qué elegir una tarjeta crypto sin comisiones anuales?`, p: `Las comisiones anuales de una tarjeta crypto pueden alcanzar los 180€/año en los niveles premium. Antes de pagar, calcula si las ventajas (cashback, lounges, suscripciones) superan ese coste. Para un usuario que gasta 500€/mes con un cashback del 1%, la ganancia anual es de 60€ — muy por debajo de los 180€ de comisiones. Tarjetas gratuitas como MetaMask Card, Gnosis Pay o Brighty ofrecen un excelente punto de entrada sin compromiso financiero.` },
      { h2: `Tarjetas crypto gratuitas: MetaMask, Gnosis Pay, Brighty — comparativa ${YEAR}`, p: `MetaMask Card es completamente gratuita (0€/año), disponible en Visa, con un cashback del 1% en ETH en compras cotidianas — sin staking obligatorio. Gnosis Pay, también gratuita, es única como tarjeta on-chain nativa, con cashback en GNO. Brighty propone una tarjeta USDC gratuita con IBAN europeo integrado y hasta el 1,75% de cashback. Estas tres opciones combinan las ventajas de las fintech tradicionales y la DeFi.` },
    ],
    it: [
      { h2: `Perché scegliere una carta crypto senza commissioni annuali?`, p: `Le commissioni annuali di una carta crypto possono arrivare a 180€/anno per i livelli premium. Prima di pagare, verifica se i vantaggi (cashback, lounge, abbonamenti) superano questo costo. Per un utente che spende 500€/mese con un cashback dell'1%, il guadagno annuale è di 60€ — ben al di sotto dei 180€ di commissioni. Carte gratuite come MetaMask Card, Gnosis Pay o Brighty offrono un ottimo punto di partenza senza impegno finanziario.` },
      { h2: `Carte crypto gratuite: MetaMask, Gnosis Pay, Brighty — confronto ${YEAR}`, p: `MetaMask Card è completamente gratuita (0€/anno), disponibile su Visa, con cashback dell'1% in ETH sugli acquisti quotidiani — senza staking obbligatorio. Gnosis Pay, anch'essa gratuita, è unica come carta on-chain nativa, con cashback in GNO. Brighty propone una carta USDC gratuita con IBAN europeo integrato e fino all'1,75% di cashback. Queste tre opzioni combinano i vantaggi delle fintech tradizionali e della DeFi.` },
    ],
    en: [
      { h2: `Why choose a crypto card with no annual fees?`, p: `Annual fees on a crypto card can reach €180/year at premium tiers. Before paying, calculate whether the benefits (cashback, lounges, subscriptions) actually exceed that cost. For a user spending €500/month at 1% cashback, the annual gain is €60 — well below €180 in fees. Free cards like MetaMask Card, Gnosis Pay and Brighty offer a great entry point with zero financial commitment.` },
      { h2: `Free crypto cards: MetaMask, Gnosis Pay, Brighty — ${YEAR} comparison`, p: `MetaMask Card is completely free (€0/year), Visa-powered, with 1% ETH cashback on everyday purchases — no staking required. Gnosis Pay, also free, is unique as a native on-chain card with GNO cashback. Brighty offers a free USDC card with a built-in European IBAN and up to 1.75% cashback. All three combine the best of traditional fintech with DeFi transparency.` },
    ],
  },
  rewards: {
    fr: [
      { h2: `Quelles récompenses valent vraiment le coup sur une carte crypto ?`, p: `L'accès aux lounges d'aéroport vaut environ 30-40€ par visite (prix journalier Priority Pass). Si vous prenez 6 vols par an, cela représente 180-240€ d'économies annuelles. Netflix offert représente 167€/an, Spotify 120€/an. En additionnant ces avantages, une carte Crypto.com Jade ou Bybit Voyager peut s'autofinancer même avec des frais annuels modérés — à condition d'utiliser réellement chaque avantage.` },
      { h2: `Crypto.com, Nexo, Bybit : quelles récompenses pour chaque profil ?`, p: `Crypto.com brille pour les grands voyageurs : lounges, remboursement Airbnb (10%), Expedia (10%), Netflix et Spotify. Nexo offre du cashback en BTC ou NEXO sur tous les achats, idéal pour les accumulateurs. Bybit propose des remboursements similaires avec une exigence de staking moindre. Pour les utilisateurs quotidiens sans voyage fréquent, Gnosis Pay et MetaMask Card optimisent le cashback pur sans avantages lifestyle superflus.` },
    ],
    de: [
      { h2: `Welche Prämien lohnen sich wirklich bei einer Krypto-Karte?`, p: `Flughafen-Lounge-Zugang kostet etwa 30-40€ pro Besuch (Priority Pass Tagespreis). Bei 6 Flügen pro Jahr ergibt das 180-240€ jährliche Ersparnisse. Netflix inklusive spart 167€/Jahr, Spotify 120€/Jahr. Addiert man diese Vorteile, kann eine Crypto.com Jade oder Bybit Voyager sich selbst finanzieren — vorausgesetzt, man nutzt wirklich jeden Vorteil.` },
      { h2: `Crypto.com, Nexo, Bybit: Welche Prämien passen zu welchem Profil?`, p: `Crypto.com glänzt für Vielreisende: Lounges, Airbnb-Erstattung (10%), Expedia (10%), Netflix und Spotify. Nexo bietet Cashback in BTC oder NEXO auf alle Einkäufe — ideal zum Akkumulieren. Bybit bietet ähnliche Erstattungen mit geringeren Staking-Anforderungen. Für Alltagsnutzer ohne häufige Reisen optimieren Gnosis Pay und MetaMask Card den reinen Cashback ohne überflüssige Lifestyle-Vorteile.` },
    ],
    es: [
      { h2: `¿Qué recompensas valen realmente la pena en una tarjeta crypto?`, p: `El acceso a los lounges de aeropuerto vale aproximadamente 30-40€ por visita (precio diario Priority Pass). Con 6 vuelos al año, eso representa 180-240€ de ahorro anual. Netflix incluido supone 167€/año, Spotify 120€/año. Sumando estas ventajas, una tarjeta Crypto.com Jade o Bybit Voyager puede autofinanciarse incluso con comisiones anuales moderadas — siempre que realmente uses cada ventaja.` },
      { h2: `Crypto.com, Nexo, Bybit: ¿qué recompensas para cada perfil?`, p: `Crypto.com destaca para grandes viajeros: lounges, reembolso Airbnb (10%), Expedia (10%), Netflix y Spotify. Nexo ofrece cashback en BTC o NEXO en todas las compras, ideal para acumuladores. Bybit propone reembolsos similares con menor exigencia de staking. Para usuarios cotidianos sin viajes frecuentes, Gnosis Pay y MetaMask Card optimizan el cashback puro sin ventajas lifestyle superfluas.` },
    ],
    it: [
      { h2: `Quali premi valgono davvero la pena su una carta crypto?`, p: `L'accesso alle lounge aeroportuali vale circa 30-40€ a visita (prezzo giornaliero Priority Pass). Con 6 voli all'anno, questo rappresenta 180-240€ di risparmio annuale. Netflix incluso vale 167€/anno, Spotify 120€/anno. Sommando questi vantaggi, una Crypto.com Jade o Bybit Voyager può autofinanziarsi anche con commissioni annuali moderate — a patto di utilizzare davvero ogni vantaggio.` },
      { h2: `Crypto.com, Nexo, Bybit: quali premi per ogni profilo?`, p: `Crypto.com eccelle per i grandi viaggiatori: lounge, rimborso Airbnb (10%), Expedia (10%), Netflix e Spotify. Nexo offre cashback in BTC o NEXO su tutti gli acquisti, ideale per gli accumulatori. Bybit propone rimborsi simili con requisiti di staking minori. Per gli utenti quotidiani senza viaggi frequenti, Gnosis Pay e MetaMask Card ottimizzano il cashback puro senza vantaggi lifestyle superflui.` },
    ],
    en: [
      { h2: `Which rewards are actually worth it on a crypto card?`, p: `Airport lounge access is worth around €30-40 per visit (Priority Pass daily rate). With 6 flights a year, that's €180-240 in annual savings. Included Netflix saves €167/year, Spotify €120/year. Tallying these up, a Crypto.com Jade or Bybit Voyager can pay for itself even with moderate annual fees — provided you actually use every benefit on offer.` },
      { h2: `Crypto.com, Nexo, Bybit: which rewards suit which profile?`, p: `Crypto.com shines for frequent travellers: lounges, Airbnb (10%) and Expedia (10%) reimbursements, Netflix and Spotify. Nexo offers BTC or NEXO cashback on all purchases — ideal for accumulators. Bybit provides similar reimbursements with lower staking requirements. For everyday users who don't travel often, Gnosis Pay and MetaMask Card optimise pure cashback without superfluous lifestyle perks.` },
    ],
  },
  virtual: {
    fr: [
      { h2: `Qu'est-ce qu'une carte crypto virtuelle et à quoi sert-elle ?`, p: `Une carte crypto virtuelle fonctionne comme une carte physique, mais existe uniquement sous forme numérique. Vous l'ajoutez à Apple Pay, Google Pay ou Samsung Pay pour payer en ligne et en magasin via NFC. L'avantage principal : activation immédiate (souvent en moins de 5 minutes), aucun délai de livraison et possibilité de générer des numéros uniques pour sécuriser vos achats en ligne contre la fraude.` },
      { h2: `Meilleures cartes crypto virtuelles en ${YEAR} : Crypto.com, Wirex, Brighty`, p: `Crypto.com propose une carte virtuelle Visa activable immédiatement, rechargeable en crypto ou en euro. Wirex offre des cartes virtuelles multi-devises avec cashback en WXT. Brighty fournit une carte USDC virtuelle avec IBAN européen intégré. Pour les achats en ligne uniquement, ces cartes virtuelles sont idéales : zéro frais de port, cashback dès le premier achat et protection totale du numéro de carte physique.` },
    ],
    de: [
      { h2: `Was ist eine virtuelle Krypto-Karte und wofür ist sie nützlich?`, p: `Eine virtuelle Krypto-Karte funktioniert wie eine physische Karte, existiert aber nur digital. Sie fügen sie zu Apple Pay, Google Pay oder Samsung Pay hinzu, um online und im Geschäft per NFC zu zahlen. Der Hauptvorteil: sofortige Aktivierung (oft in weniger als 5 Minuten), keine Lieferzeit und die Möglichkeit, einmalige Nummern für sichere Online-Einkäufe gegen Betrug zu generieren.` },
      { h2: `Beste virtuelle Krypto-Karten ${YEAR}: Crypto.com, Wirex, Brighty`, p: `Crypto.com bietet eine sofort aktivierbare virtuelle Visa-Karte, aufladbar mit Krypto oder Euro. Wirex bietet virtuelle Multi-Währungskarten mit WXT-Cashback. Brighty liefert eine virtuelle USDC-Karte mit integrierter europäischer IBAN. Für reine Online-Einkäufe sind diese virtuellen Karten ideal: kein Versand, Cashback ab dem ersten Kauf und vollständiger Schutz der physischen Kartennummer.` },
    ],
    es: [
      { h2: `¿Qué es una tarjeta crypto virtual y para qué sirve?`, p: `Una tarjeta crypto virtual funciona como una tarjeta física, pero existe únicamente en formato digital. La añades a Apple Pay, Google Pay o Samsung Pay para pagar online y en tiendas mediante NFC. La ventaja principal: activación inmediata (a menudo en menos de 5 minutos), sin espera de envío y posibilidad de generar números únicos para proteger tus compras online contra el fraude.` },
      { h2: `Mejores tarjetas crypto virtuales en ${YEAR}: Crypto.com, Wirex, Brighty`, p: `Crypto.com ofrece una tarjeta Visa virtual activable de inmediato, recargable en cripto o en euros. Wirex propone tarjetas virtuales multidivisa con cashback en WXT. Brighty facilita una tarjeta USDC virtual con IBAN europeo integrado. Para compras online exclusivamente, estas tarjetas virtuales son ideales: sin gastos de envío, cashback desde la primera compra y protección total del número de tarjeta física.` },
    ],
    it: [
      { h2: `Cos'è una carta crypto virtuale e a cosa serve?`, p: `Una carta crypto virtuale funziona come una carta fisica, ma esiste solo in formato digitale. La aggiungi ad Apple Pay, Google Pay o Samsung Pay per pagare online e nei negozi tramite NFC. Il principale vantaggio: attivazione immediata (spesso in meno di 5 minuti), nessuna attesa di consegna e possibilità di generare numeri unici per proteggere gli acquisti online dalle frodi.` },
      { h2: `Migliori carte crypto virtuali nel ${YEAR}: Crypto.com, Wirex, Brighty`, p: `Crypto.com propone una carta Visa virtuale attivabile immediatamente, ricaricabile in crypto o in euro. Wirex offre carte virtuali multi-valuta con cashback in WXT. Brighty fornisce una carta USDC virtuale con IBAN europeo integrato. Per gli acquisti esclusivamente online, queste carte virtuali sono ideali: zero spese di spedizione, cashback dal primo acquisto e protezione totale del numero di carta fisica.` },
    ],
    en: [
      { h2: `What is a virtual crypto card and what is it used for?`, p: `A virtual crypto card works exactly like a physical card but exists only in digital form. You add it to Apple Pay, Google Pay or Samsung Pay to pay online and in stores via NFC. The main advantage: instant activation (often under 5 minutes), no delivery wait, and the ability to generate unique card numbers for online purchases, protecting your real card details from fraud.` },
      { h2: `Best virtual crypto cards in ${YEAR}: Crypto.com, Wirex, Brighty`, p: `Crypto.com offers an instantly activatable virtual Visa card, top-uppable in crypto or euros. Wirex provides multi-currency virtual cards with WXT cashback. Brighty delivers a virtual USDC card with a built-in European IBAN. For online-only purchases, these virtual cards are ideal: no shipping delays, cashback from the first purchase, and full protection for your physical card number.` },
    ],
  },
  beginner: {
    fr: [
      { h2: `Comment commencer avec une carte crypto quand on est débutant ?`, p: `La première étape est de choisir une carte accessible sans staking et sans frais annuels. Ouvrez un compte sur la plateforme, complétez la vérification KYC (identité + domicile), puis rechargez votre carte depuis votre exchange ou directement en euros via virement SEPA. Pour les débutants, évitez les plateformes avec des tokens propriétaires volatils — privilégiez des cartes adossées à des stablecoins (USDC) ou directement à votre solde en euros.` },
      { h2: `Meilleures cartes crypto pour débutants en ${YEAR} : Revolut, Brighty, MetaMask`, p: `Revolut combine banque classique et crypto dans une seule app — idéale pour les débutants qui veulent tester sans s'engager. Brighty est 100% gratuite avec un IBAN européen et un cashback en USDC sans staking. MetaMask Card est parfaite si vous êtes déjà familier avec les wallets Web3. Ces trois options partagent un point commun : inscription rapide en moins de 10 minutes et utilisation immédiate dès le premier jour.` },
    ],
    de: [
      { h2: `Wie startet man als Anfänger mit einer Krypto-Karte?`, p: `Der erste Schritt ist die Wahl einer zugänglichen Karte ohne Staking und ohne Jahresgebühren. Eröffnen Sie ein Konto auf der Plattform, schließen Sie die KYC-Verifizierung ab (Ausweis + Wohnsitz) und laden Sie Ihre Karte von Ihrer Exchange oder direkt in Euro per SEPA-Überweisung auf. Anfänger sollten Plattformen mit volatilen proprietären Token meiden — bevorzugen Sie Karten, die an Stablecoins (USDC) oder direkt an Ihr Euro-Guthaben gebunden sind.` },
      { h2: `Beste Krypto-Karten für Anfänger ${YEAR}: Revolut, Brighty, MetaMask`, p: `Revolut vereint klassisches Banking und Krypto in einer App — ideal für Einsteiger, die es ohne Verpflichtungen testen möchten. Brighty ist 100% kostenlos mit europäischer IBAN und USDC-Cashback ohne Staking. MetaMask Card ist perfekt, wenn Sie bereits mit Web3-Wallets vertraut sind. Alle drei haben eines gemeinsam: schnelle Registrierung in unter 10 Minuten und sofortige Nutzung ab dem ersten Tag.` },
    ],
    es: [
      { h2: `¿Cómo empezar con una tarjeta crypto siendo principiante?`, p: `El primer paso es elegir una tarjeta accesible sin staking y sin comisiones anuales. Abre una cuenta en la plataforma, completa la verificación KYC (identidad + domicilio), y luego recarga tu tarjeta desde tu exchange o directamente en euros mediante transferencia SEPA. Los principiantes deben evitar plataformas con tokens propietarios volátiles — prioriza tarjetas respaldadas por stablecoins (USDC) o directamente por tu saldo en euros.` },
      { h2: `Mejores tarjetas crypto para principiantes en ${YEAR}: Revolut, Brighty, MetaMask`, p: `Revolut combina banca clásica y cripto en una sola app — ideal para principiantes que quieren probar sin comprometerse. Brighty es 100% gratuita con IBAN europeo y cashback en USDC sin staking. MetaMask Card es perfecta si ya estás familiarizado con los wallets Web3. Las tres comparten algo: registro rápido en menos de 10 minutos y uso inmediato desde el primer día.` },
    ],
    it: [
      { h2: `Come iniziare con una carta crypto da principiante?`, p: `Il primo passo è scegliere una carta accessibile senza staking e senza commissioni annuali. Apri un account sulla piattaforma, completa la verifica KYC (identità + residenza), poi ricarica la tua carta dal tuo exchange o direttamente in euro tramite bonifico SEPA. I principianti dovrebbero evitare piattaforme con token proprietari volatili — privilegia carte legate a stablecoin (USDC) o direttamente al tuo saldo in euro.` },
      { h2: `Migliori carte crypto per principianti nel ${YEAR}: Revolut, Brighty, MetaMask`, p: `Revolut combina banca classica e cripto in un'unica app — ideale per i principianti che vogliono provare senza impegnarsi. Brighty è 100% gratuita con IBAN europeo e cashback in USDC senza staking. MetaMask Card è perfetta se sei già familiare con i wallet Web3. Le tre opzioni hanno in comune: registrazione rapida in meno di 10 minuti e utilizzo immediato dal primo giorno.` },
    ],
    en: [
      { h2: `How to get started with a crypto card as a beginner?`, p: `The first step is choosing an accessible card with no staking and no annual fees. Open an account on the platform, complete KYC verification (identity + address), then top up your card from your exchange or directly in euros via SEPA transfer. Beginners should avoid platforms with volatile proprietary tokens — opt for cards backed by stablecoins (USDC) or directly by your euro balance for a smoother experience.` },
      { h2: `Best crypto cards for beginners in ${YEAR}: Revolut, Brighty, MetaMask`, p: `Revolut combines classic banking and crypto in one app — ideal for beginners who want to try without committing. Brighty is 100% free with a European IBAN and USDC cashback with no staking. MetaMask Card is perfect if you're already familiar with Web3 wallets. All three share the same advantage: fast sign-up in under 10 minutes and immediate use from day one.` },
    ],
  },
  '2026': {
    fr: [
      { h2: `Quelles cartes crypto sont incontournables en ${YEAR} ?`, p: `En 2026, le marché des cartes crypto s'est consolidé autour de quelques acteurs solides : Crypto.com reste le leader avec son écosystème complet, Nexo s'impose pour le cashback en BTC sans staking, Gnosis Pay monte en puissance avec sa proposition on-chain unique. Les nouvelles venues comme MetaMask Card et Ether.fi Card attirent les utilisateurs DeFi. La réglementation MiCA en Europe apporte davantage de transparence et de sécurité pour les consommateurs.` },
      { h2: `Tendances cartes crypto 2026 : MiCA, on-chain, stablecoins`, p: `La réglementation MiCA (Markets in Crypto-Assets), pleinement en vigueur depuis 2025, oblige les émetteurs à détenir des réserves et à publier des rapports de conformité. Conséquence : les cartes émises par des acteurs réglementés en Europe (Crypto.com, Nexo, Revolut) sont désormais mieux protégées. La tendance on-chain s'accélère avec des cartes comme Gnosis Pay qui règlent directement depuis votre wallet — sans intermédiaire et avec une transparence totale.` },
    ],
    de: [
      { h2: `Welche Krypto-Karten sind ${YEAR} unverzichtbar?`, p: `2026 hat sich der Krypto-Kartenmarkt um einige starke Akteure konsolidiert: Crypto.com bleibt mit seinem umfassenden Ökosystem führend, Nexo überzeugt für BTC-Cashback ohne Staking, Gnosis Pay gewinnt mit seinem einzigartigen On-Chain-Angebot an Bedeutung. Neulinge wie MetaMask Card und Ether.fi Card ziehen DeFi-Nutzer an. Die MiCA-Regulierung in Europa bringt mehr Transparenz und Sicherheit für Verbraucher.` },
      { h2: `Krypto-Karten Trends 2026: MiCA, On-Chain, Stablecoins`, p: `Die MiCA-Regulierung (Markets in Crypto-Assets), seit 2025 vollständig in Kraft, verpflichtet Emittenten zur Reservehaltung und Compliance-Berichterstattung. Folge: Karten von in Europa regulierten Akteuren (Crypto.com, Nexo, Revolut) sind nun besser geschützt. Der On-Chain-Trend beschleunigt sich mit Karten wie Gnosis Pay, die direkt aus Ihrer Wallet abrechnen — ohne Zwischenhändler und mit vollständiger Transparenz.` },
    ],
    es: [
      { h2: `¿Qué tarjetas crypto son imprescindibles en ${YEAR}?`, p: `En 2026, el mercado de tarjetas crypto se ha consolidado en torno a varios actores sólidos: Crypto.com sigue siendo el líder con su ecosistema completo, Nexo destaca por el cashback en BTC sin staking, Gnosis Pay gana fuerza con su propuesta on-chain única. Las recién llegadas como MetaMask Card y Ether.fi Card atraen a los usuarios DeFi. La regulación MiCA en Europa aporta mayor transparencia y seguridad para los consumidores.` },
      { h2: `Tendencias tarjetas crypto 2026: MiCA, on-chain, stablecoins`, p: `La regulación MiCA (Markets in Crypto-Assets), plenamente en vigor desde 2025, obliga a los emisores a mantener reservas y publicar informes de cumplimiento. Consecuencia: las tarjetas emitidas por actores regulados en Europa (Crypto.com, Nexo, Revolut) están ahora mejor protegidas. La tendencia on-chain se acelera con tarjetas como Gnosis Pay que liquidan directamente desde tu wallet — sin intermediarios y con total transparencia.` },
    ],
    it: [
      { h2: `Quali carte crypto sono imprescindibili nel ${YEAR}?`, p: `Nel 2026, il mercato delle carte crypto si è consolidato attorno ad alcuni attori solidi: Crypto.com rimane il leader con il suo ecosistema completo, Nexo si impone per il cashback in BTC senza staking, Gnosis Pay guadagna terreno con la sua proposta on-chain unica. Le new entry come MetaMask Card e Ether.fi Card attraggono gli utenti DeFi. La regolamentazione MiCA in Europa porta maggiore trasparenza e sicurezza per i consumatori.` },
      { h2: `Tendenze carte crypto 2026: MiCA, on-chain, stablecoin`, p: `La regolamentazione MiCA (Markets in Crypto-Assets), pienamente in vigore dal 2025, obbliga gli emittenti a detenere riserve e a pubblicare rapporti di conformità. Conseguenza: le carte emesse da attori regolamentati in Europa (Crypto.com, Nexo, Revolut) sono ora meglio tutelate. La tendenza on-chain accelera con carte come Gnosis Pay che regolano direttamente dal tuo wallet — senza intermediari e con totale trasparenza.` },
    ],
    en: [
      { h2: `Which crypto cards are essential in ${YEAR}?`, p: `In 2026, the crypto card market has consolidated around a few strong players: Crypto.com remains the leader with its complete ecosystem, Nexo stands out for BTC cashback with no staking, Gnosis Pay is rising with its unique on-chain proposition. Newcomers like MetaMask Card and Ether.fi Card are attracting DeFi users. MiCA regulation in Europe brings greater transparency and consumer protection to the sector.` },
      { h2: `Crypto card trends 2026: MiCA, on-chain, stablecoins`, p: `The MiCA (Markets in Crypto-Assets) regulation, fully in force since 2025, requires issuers to hold reserves and publish compliance reports. Result: cards issued by Europe-regulated players (Crypto.com, Nexo, Revolut) now carry stronger consumer protections. The on-chain trend is accelerating with cards like Gnosis Pay, which settle directly from your wallet — no intermediary, full transparency.` },
    ],
  },
  france: {
    fr: [
      { h2: `Quelles cartes crypto sont vraiment disponibles en France ?`, p: `Toutes les cartes crypto ne sont pas disponibles en France. Certaines, comme la Coinbase Card, fonctionnent dans l'UE mais avec des restrictions. Les cartes disponibles en France et les plus fiables sont : Crypto.com Visa, Nexo Card, Bybit Card, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty, Deblock et Revolut. Vérifiez toujours la disponibilité sur le site officiel, car les règles de conformité peuvent évoluer. Depuis MiCA (2025), les émetteurs régulés en UE doivent afficher clairement leur couverture géographique.` },
      { h2: `Réglementation MiCA et cartes crypto en France : ce que vous devez savoir`, p: `Le règlement MiCA (Markets in Crypto-Assets), en vigueur depuis décembre 2024, impose des normes strictes aux émetteurs de cartes crypto opérant en France et dans l'UE : réserves prouvables, rapports de transparence, protection des fonds clients. Résultat concret : les émetteurs régulés comme Crypto.com, Nexo ou Revolut offrent désormais une protection comparable aux banques classiques. Pour les utilisateurs français, cela signifie plus de sécurité et des recours clarifiés en cas de litige. Privilégiez toujours une carte émise par un acteur disposant d'un agrément AMF, ACPR ou équivalent MiCA.` },
    ],
    de: [
      { h2: `Welche Krypto-Karten sind in Deutschland wirklich verfügbar?`, p: `Nicht alle Krypto-Karten sind in Deutschland verfügbar. Einige, wie die Coinbase Card, funktionieren in der EU, aber mit Einschränkungen. Die in Deutschland verfügbaren und zuverlässigsten Karten sind: Crypto.com Visa, Nexo Card, Bybit Card, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty und Revolut. Überprüfen Sie immer die Verfügbarkeit auf der offiziellen Website, da sich Compliance-Regeln ändern können. Seit MiCA (2025) müssen EU-regulierte Emittenten ihre geografische Abdeckung klar ausweisen.` },
      { h2: `MiCA-Regulierung und Krypto-Karten in Deutschland: Was Sie wissen müssen`, p: `Die MiCA-Verordnung (Markets in Crypto-Assets), seit Dezember 2024 in Kraft, verpflichtet Krypto-Karten-Emittenten in Deutschland und der EU zu strengen Standards: nachweisliche Reserven, Transparenzberichte, Kundenvermögensschutz. Konkrete Folge: Regulierte Emittenten wie Crypto.com, Nexo oder Revolut bieten nun einen Schutz vergleichbar mit klassischen Banken. Bevorzugen Sie stets eine Karte eines Anbieters mit MiCA- oder nationaler Lizenz (BaFin).` },
    ],
    es: [
      { h2: `¿Qué tarjetas crypto están realmente disponibles en España?`, p: `No todas las tarjetas crypto están disponibles en España. Algunas, como la Coinbase Card, funcionan en la UE pero con restricciones. Las más fiables disponibles en España son: Crypto.com Visa, Nexo Card, Bybit Card, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty y Revolut. Verifica siempre la disponibilidad en el sitio oficial, ya que las reglas de cumplimiento pueden cambiar. Desde MiCA (2025), los emisores regulados en la UE deben indicar claramente su cobertura geográfica.` },
      { h2: `Regulación MiCA y tarjetas crypto en España: lo que debes saber`, p: `El reglamento MiCA (Markets in Crypto-Assets), en vigor desde diciembre de 2024, impone estándares estrictos a los emisores de tarjetas crypto en España y la UE: reservas demostrables, informes de transparencia, protección de fondos de clientes. Resultado concreto: los emisores regulados como Crypto.com, Nexo o Revolut ofrecen ahora una protección comparable a la banca tradicional. Prioriza siempre una tarjeta emitida por un proveedor con licencia MiCA o equivalente (CNMV).` },
    ],
    it: [
      { h2: `Quali carte crypto sono davvero disponibili in Italia?`, p: `Non tutte le carte crypto sono disponibili in Italia. Alcune, come la Coinbase Card, funzionano nell'UE ma con restrizioni. Le più affidabili disponibili in Italia sono: Crypto.com Visa, Nexo Card, Bybit Card, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty e Revolut. Verifica sempre la disponibilità sul sito ufficiale, poiché le regole di conformità possono cambiare. Dal MiCA (2025), gli emittenti regolamentati nell'UE devono indicare chiaramente la loro copertura geografica.` },
      { h2: `Regolamentazione MiCA e carte crypto in Italia: cosa devi sapere`, p: `Il regolamento MiCA (Markets in Crypto-Assets), in vigore da dicembre 2024, impone standard severi agli emittenti di carte crypto in Italia e nell'UE: riserve dimostrabili, rapporti di trasparenza, protezione dei fondi dei clienti. Risultato concreto: gli emittenti regolamentati come Crypto.com, Nexo o Revolut offrono ora una protezione paragonabile alle banche tradizionali. Preferisci sempre una carta emessa da un provider con licenza MiCA o equivalente (OAM).` },
    ],
    en: [
      { h2: `Which crypto cards are truly available in Europe?`, p: `Not all crypto cards are available across Europe. Some, like the Coinbase Card, operate in the EU but with restrictions. The most reliable cards available across the EU are: Crypto.com Visa, Nexo Card, Bybit Card, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty, and Revolut. Always verify availability on the official website, as compliance rules can change. Since MiCA (2025), EU-regulated issuers must clearly state their geographic coverage.` },
      { h2: `MiCA regulation and crypto cards in Europe: what you need to know`, p: `The MiCA (Markets in Crypto-Assets) regulation, in force since December 2024, imposes strict standards on crypto card issuers operating in the EU: provable reserves, transparency reports, client fund protection. Concrete result: regulated issuers like Crypto.com, Nexo, and Revolut now offer protection comparable to traditional banks. Always prioritise a card issued by a provider holding a MiCA licence or national equivalent.` },
    ],
  },
  'no-kyc': {
    fr: [
      { h2: `Cartes crypto sans KYC : ce que cela signifie vraiment`, p: `Le terme "sans KYC" est souvent mal compris. Aucune carte Visa ou Mastercard n'est légalement utilisable sans identification — MiCA et la directive AMLD5 l'exigent. Ce que l'on appelle "cartes sans KYC" sont en réalité des cartes à custody réduit : Gnosis Pay règle directement depuis votre Gnosis Safe (wallet self-custody), MetaMask Card fonctionne sans compte custodial centralisé. Le KYC reste requis pour l'émission de la carte, mais votre crypto ne transite pas par un intermédiaire centralisé.` },
      { h2: `Gnosis Pay et MetaMask Card : les cartes crypto les plus proches du modèle sans intermédiaire`, p: `Gnosis Pay est la carte on-chain la plus avancée : chaque paiement est signé depuis votre Gnosis Safe et réglé en xDAI directement sur la blockchain. Aucun compte custodial, aucun intermédiaire entre votre wallet et le terminal de paiement. MetaMask Card suit le même principe : votre crypto reste dans votre wallet jusqu'au moment du paiement, sans que la plateforme en soit gardien. Ces deux cartes représentent l'avant-garde de la souveraineté financière crypto en ${YEAR}.` },
    ],
    de: [
      { h2: `Krypto-Karten ohne KYC: Was das wirklich bedeutet`, p: `Der Begriff "ohne KYC" wird oft missverstanden. Keine Visa- oder Mastercard-Karte ist ohne Identifizierung legal nutzbar — MiCA und AMLD5 schreiben das vor. Was als "KYC-freie Karten" bezeichnet wird, sind Karten mit reduzierter Verwahrung: Gnosis Pay rechnet direkt aus Ihrem Gnosis Safe (Self-Custody-Wallet) ab, MetaMask Card funktioniert ohne zentrales Depot-Konto. KYC ist für die Kartenausgabe weiterhin erforderlich, aber Ihre Krypto geht nicht durch einen zentralisierten Mittelsmann.` },
      { h2: `Gnosis Pay und MetaMask Card: Die fortschrittlichsten Krypto-Karten ohne Intermediär`, p: `Gnosis Pay ist die fortschrittlichste On-Chain-Karte: Jede Zahlung wird aus Ihrem Gnosis Safe signiert und in xDAI direkt auf der Blockchain abgerechnet. Kein Depot-Konto, kein Mittelsmann zwischen Ihrer Wallet und dem Zahlungsterminal. MetaMask Card folgt demselben Prinzip: Ihre Krypto bleibt in Ihrer Wallet bis zum Zahlungsmoment, ohne dass die Plattform Verwahrstelle ist. Diese zwei Karten repräsentieren die Avantgarde der Krypto-Finanzsouveränität in ${YEAR}.` },
    ],
    es: [
      { h2: `Tarjetas crypto sin KYC: lo que realmente significa`, p: `El término "sin KYC" se entiende mal con frecuencia. Ninguna tarjeta Visa o Mastercard es legalmente utilizable sin identificación — MiCA y AMLD5 lo exigen. Lo que se llama "tarjetas sin KYC" son en realidad tarjetas con custodia reducida: Gnosis Pay liquida directamente desde tu Gnosis Safe (wallet de autocustodia), MetaMask Card funciona sin cuenta custodial centralizada. El KYC sigue siendo necesario para la emisión de la tarjeta, pero tus criptos no pasan por un intermediario centralizado.` },
      { h2: `Gnosis Pay y MetaMask Card: las tarjetas crypto más cercanas al modelo sin intermediario`, p: `Gnosis Pay es la tarjeta on-chain más avanzada: cada pago se firma desde tu Gnosis Safe y se liquida en xDAI directamente en la blockchain. Sin cuenta custodial, sin intermediario entre tu wallet y el terminal de pago. MetaMask Card sigue el mismo principio: tu cripto permanece en tu wallet hasta el momento del pago, sin que la plataforma sea su custodio. Estas dos tarjetas representan la vanguardia de la soberanía financiera crypto en ${YEAR}.` },
    ],
    it: [
      { h2: `Carte crypto senza KYC: cosa significa davvero`, p: `Il termine "senza KYC" è spesso frainteso. Nessuna carta Visa o Mastercard è legalmente utilizzabile senza identificazione — MiCA e AMLD5 lo richiedono. Quelle che vengono chiamate "carte senza KYC" sono in realtà carte a custodia ridotta: Gnosis Pay regola direttamente dal tuo Gnosis Safe (wallet self-custody), MetaMask Card funziona senza conto custodiale centralizzato. Il KYC rimane necessario per l'emissione della carta, ma le tue criptovalute non transitano attraverso un intermediario centralizzato.` },
      { h2: `Gnosis Pay e MetaMask Card: le carte crypto più vicine al modello senza intermediari`, p: `Gnosis Pay è la carta on-chain più avanzata: ogni pagamento viene firmato dal tuo Gnosis Safe e regolato in xDAI direttamente sulla blockchain. Nessun conto custodiale, nessun intermediario tra il tuo wallet e il terminale di pagamento. MetaMask Card segue lo stesso principio: la tua cripto rimane nel tuo wallet fino al momento del pagamento, senza che la piattaforma ne sia custode. Queste due carte rappresentano l'avanguardia della sovranità finanziaria crypto nel ${YEAR}.` },
    ],
    en: [
      { h2: `No-KYC crypto cards: what it really means`, p: `The term "no-KYC" is frequently misunderstood. No Visa or Mastercard can legally operate without identification — MiCA and AMLD5 require it. What are called "no-KYC cards" are actually reduced-custody cards: Gnosis Pay settles directly from your Gnosis Safe (self-custody wallet), MetaMask Card works without a centralised custodial account. KYC is still required to issue the card, but your crypto doesn't pass through a centralised intermediary.` },
      { h2: `Gnosis Pay and MetaMask Card: the closest crypto cards to the no-intermediary model`, p: `Gnosis Pay is the most advanced on-chain card: every payment is signed from your Gnosis Safe and settled in xDAI directly on the blockchain. No custodial account, no intermediary between your wallet and the payment terminal. MetaMask Card follows the same principle: your crypto stays in your wallet until the moment of payment, with the platform never acting as custodian. These two cards represent the frontier of crypto financial sovereignty in ${YEAR}.` },
    ],
  },
};

/* ────────────────────────────────────────────────────────────────────────────
   FAQ (5 Q&As per theme per language)
   ──────────────────────────────────────────────────────────────────────────── */
const THEME_FAQ: Record<string, Record<string, { q: string; a: string }[]>> = {
  best: {
    fr: [
      { q:`Quelle est la meilleure carte crypto en ${YEAR} ?`, a:`En ${YEAR}, les meilleures cartes crypto sont Crypto.com Obsidian (8% cashback), Gnosis Pay (2% sans staking) et MetaMask Card (1% avec self-custody). Le meilleur choix dépend de votre profil.` },
      { q:'Les cartes crypto sont-elles sûres ?', a:"Oui, à condition de choisir une carte émise par un émetteur régulé enregistré auprès de l'AMF en France ou des régulateurs équivalents en Europe." },
      { q:'Peut-on utiliser une carte crypto partout dans le monde ?', a:'Oui, les cartes crypto Visa et Mastercard sont acceptées partout dans le monde où ces réseaux sont présents, soit plus de 50 millions de points de vente.' },
      { q:'Le cashback des cartes crypto est-il imposable en France ?', a:'En France, le cashback en cryptomonnaie constitue un revenu imposable. Les gains issus de la revente sont soumis à la flat tax de 30%.' },
      { q:'Faut-il faire du staking pour obtenir un cashback ?', a:"Non, plusieurs cartes offrent du cashback sans staking obligatoire : Gnosis Pay, MetaMask Card, Brighty. Les cartes avec staking offrent des taux plus élevés mais nécessitent d'immobiliser des fonds." },
    ],
    de: [
      { q:`Welche ist die beste Krypto-Karte ${YEAR}?`, a:`In ${YEAR} sind die besten Krypto-Karten: Crypto.com Obsidian (8% Cashback), Gnosis Pay (2% ohne Staking) und MetaMask Card (1% mit Self-Custody).` },
      { q:'Sind Krypto-Karten sicher?', a:'Ja, wenn Sie eine Karte wählen, die von einem BaFin-regulierten Emittenten ausgegeben wird.' },
      { q:'Kann man eine Krypto-Karte überall verwenden?', a:'Ja, Krypto-Karten von Visa und Mastercard werden weltweit akzeptiert, an über 50 Millionen Verkaufsstellen.' },
      { q:'Ist Krypto-Cashback in Deutschland steuerpflichtig?', a:'In Deutschland gelten Krypto-Gewinne als steuerpflichtiges Einkommen, wenn die Haltefrist unter einem Jahr liegt.' },
      { q:'Benötigt man Staking für Cashback?', a:'Nein, mehrere Karten bieten Cashback ohne obligatorisches Staking: Gnosis Pay, MetaMask Card, Brighty.' },
    ],
    es: [
      { q:`¿Cuál es la mejor tarjeta crypto en ${YEAR}?`, a:`En ${YEAR}, las mejores tarjetas crypto son: Crypto.com Obsidian (8% cashback), Gnosis Pay (2% sin staking) y MetaMask Card (1% con self-custody).` },
      { q:'¿Son seguras las tarjetas crypto?', a:'Sí, siempre que elijas una tarjeta emitida por un emisor regulado por la CNMV o equivalente europeo.' },
      { q:'¿Se puede usar una tarjeta crypto en todo el mundo?', a:'Sí, las tarjetas crypto Visa y Mastercard son aceptadas en todo el mundo en más de 50 millones de puntos de venta.' },
      { q:'¿El cashback crypto es imponible en España?', a:'En España, el cashback en criptomonedas es un ingreso imponible que tributa como ganancia patrimonial en el IRPF.' },
      { q:'¿Hay que hacer staking para obtener cashback?', a:'No, varias tarjetas ofrecen cashback sin staking obligatorio: Gnosis Pay, MetaMask Card, Brighty.' },
    ],
    it: [
      { q:`Qual è la migliore carta crypto nel ${YEAR}?`, a:`Nel ${YEAR}, le migliori carte crypto sono: Crypto.com Obsidian (8% cashback), Gnosis Pay (2% senza staking) e MetaMask Card (1% con self-custody).` },
      { q:'Le carte crypto sono sicure?', a:"Sì, a condizione di scegliere una carta emessa da un emittente regolamentato (OAM in Italia o equivalente europeo)." },
      { q:'Si può usare una carta crypto ovunque?', a:'Sì, le carte crypto Visa e Mastercard sono accettate in tutto il mondo in oltre 50 milioni di punti vendita.' },
      { q:'Il cashback crypto è tassabile in Italia?', a:"In Italia, il cashback in criptovalute è un reddito imponibile soggetto all'imposta del 26%." },
      { q:'È necessario fare staking per ottenere cashback?', a:'No, diverse carte offrono cashback senza staking obbligatorio: Gnosis Pay, MetaMask Card, Brighty.' },
    ],
    en: [
      { q:`What is the best crypto card in ${YEAR}?`, a:`In ${YEAR}, the best crypto cards are: Crypto.com Obsidian (8% cashback), Gnosis Pay (2% with no staking), and MetaMask Card (1% with self-custody).` },
      { q:'Are crypto cards safe?', a:'Yes, as long as you choose a card issued by a regulated emitter (FCA, BaFin, or MiCA-compliant). Avoid unregulated issuers.' },
      { q:'Can you use a crypto card everywhere?', a:'Yes, Visa and Mastercard crypto cards are accepted worldwide at over 50 million points of sale.' },
      { q:'Is crypto cashback taxable?', a:'In most European countries, crypto cashback is considered taxable income, typically taxed at 20-30%.' },
      { q:'Do you need to stake to get cashback?', a:'No, several cards offer cashback without mandatory staking: Gnosis Pay, MetaMask Card, Brighty.' },
    ],
  },
  cashback: {
    fr: [
      { q:'Quelle carte crypto offre le cashback le plus élevé ?', a:"Crypto.com Obsidian offre jusqu'à 8% mais nécessite 400 000 CRO en staking. Gnosis Pay offre 2% sans staking, souvent plus rentable." },
      { q:'Le cashback est-il payé en crypto ou en euros ?', a:'Le cashback est généralement versé en cryptomonnaie native de la plateforme (CRO, etc.) ou en stablecoin.' },
      { q:'Comment calculer la rentabilité réelle du cashback ?', a:"Si vous dépensez 1000€/mois et stakez 5000€ pour 3% cashback, vous gagnez 360€/an mais risquez une dépréciation sur les 5000€ stakés." },
      { q:'Peut-on combiner plusieurs cartes crypto ?', a:'Oui, certains utilisateurs combinent une carte premium et une carte gratuite pour maximiser le cashback.' },
      { q:"Y a-t-il un plafond de cashback ?", a:"Oui, la plupart des cartes imposent un plafond mensuel ou annuel. Certaines limitent le cashback à 50€/mois." },
    ],
    de: [
      { q:'Welche Krypto-Karte bietet das höchste Cashback?', a:'Crypto.com Obsidian bietet bis zu 8%, erfordert aber erhebliches Staking. Gnosis Pay bietet 2% ohne Staking.' },
      { q:'Wird Cashback in Krypto oder Euro ausgezahlt?', a:'In der Regel in der nativen Plattform-Kryptowährung oder in Stablecoin.' },
      { q:'Wie berechnet man die Cashback-Rentabilität?', a:'Teilen Sie Ihre Staking-Kosten durch Ihre Kartenausgaben, um den echten ROI zu berechnen.' },
      { q:'Kann man mehrere Krypto-Karten kombinieren?', a:'Ja, viele Nutzer kombinieren eine Premium- mit einer kostenlosen Karte.' },
      { q:'Gibt es eine Cashback-Obergrenze?', a:'Ja, meist 50€/Monat oder begrenzt auf die ersten 1000€ Ausgaben.' },
    ],
    es: [
      { q:'¿Qué tarjeta crypto ofrece el mayor cashback?', a:'Crypto.com Obsidian ofrece hasta un 8%, pero requiere staking. Gnosis Pay ofrece un 2% sin staking.' },
      { q:'¿El cashback se paga en crypto o en euros?', a:'Generalmente en la criptomoneda nativa de la plataforma o en stablecoin.' },
      { q:'¿Cómo calcular la rentabilidad real del cashback?', a:'Compara tus gastos de staking con el cashback anual para calcular el ROI real.' },
      { q:'¿Se pueden combinar varias tarjetas crypto?', a:'Sí, muchos usuarios combinan una tarjeta premium y una gratuita.' },
      { q:'¿Hay un límite de cashback?', a:'Sí, generalmente 50€/mes o limitado a los primeros 1.000€ de gastos.' },
    ],
    it: [
      { q:'Quale carta crypto offre il cashback più alto?', a:"Crypto.com Obsidian offre fino all'8% ma richiede staking. Gnosis Pay offre il 2% senza staking." },
      { q:'Il cashback viene pagato in crypto o in euro?', a:'Generalmente nella criptovaluta nativa della piattaforma o in stablecoin.' },
      { q:'Come calcolare la redditività reale del cashback?', a:"Confronta i costi di staking con il cashback annuale per calcolare il ROI reale." },
      { q:'Si possono combinare più carte crypto?', a:'Sì, molti utenti combinano una carta premium con una gratuita.' },
      { q:"C'è un limite al cashback?", a:'Sì, di solito 50€/mese o limitato ai primi 1.000€ di spesa.' },
    ],
    en: [
      { q:'Which crypto card offers the highest cashback?', a:'Crypto.com Obsidian offers up to 8% but requires significant staking. Gnosis Pay offers 2% with no staking.' },
      { q:'Is crypto cashback paid in crypto or fiat?', a:"Generally in the platform's native cryptocurrency or in stablecoin." },
      { q:'How do you calculate real cashback profitability?', a:'Compare your annual staking cost against your annual cashback earnings to find the real ROI.' },
      { q:'Can you combine multiple crypto cards?', a:'Yes, many users combine a premium card with a no-fee card to maximize cashback.' },
      { q:'Is there a cashback cap?', a:'Yes, most cards cap cashback at €50/month or limit it to the first €1,000 in spending.' },
    ],
  },
  'no-fees': {
    fr: [
      { q:'Existe-t-il des cartes crypto vraiment gratuites ?', a:"Oui : MetaMask Card, Gnosis Pay, Brighty. Pas de frais d'émission ni d'abonnement." },
      { q:'Une carte crypto gratuite est-elle moins bonne ?', a:"Non. Certaines cartes gratuites offrent de meilleurs cashback que des cartes payantes." },
      { q:"Y a-t-il des frais cachés sur les cartes 'gratuites' ?", a:"Les frais cachés courants : frais de change (FX), frais ATM au-delà d'un plafond, frais d'inactivité." },
      { q:"Peut-on retirer des espèces gratuitement ?", a:"La plupart offrent 200-400€ de retraits gratuits/mois. Au-delà, 1-2% de frais." },
      { q:"Les cartes gratuites ont-elles les mêmes limites de paiement ?", a:"Généralement entre 2000€ et 10 000€ de plafond quotidien pour les cartes gratuites." },
    ],
    de: [
      { q:'Gibt es wirklich kostenlose Krypto-Karten?', a:'Ja: MetaMask Card, Gnosis Pay, Brighty. Keine Ausgabe- oder Abonnementgebühren.' },
      { q:'Ist eine kostenlose Krypto-Karte schlechter?', a:'Nein. Einige kostenlose Karten bieten bessere Cashback-Sätze als kostenpflichtige.' },
      { q:"Gibt es versteckte Gebühren bei 'kostenlosen' Karten?", a:'Häufig: Wechselgebühren (FX), Geldautomatengebühren über dem Limit, Inaktivitätsgebühren.' },
      { q:'Kann man kostenlos Bargeld abheben?', a:'Meist 200-400€/Monat kostenlos. Darüber 1-2% Gebühren.' },
      { q:'Haben kostenlose Karten dieselben Zahlungslimits?', a:'In der Regel 2.000€-10.000€ Tageslimit.' },
    ],
    es: [
      { q:'¿Existen tarjetas crypto realmente gratuitas?', a:'Sí: MetaMask Card, Gnosis Pay, Brighty. Sin cuotas ni suscripciones.' },
      { q:'¿Una tarjeta gratuita es peor?', a:'No. Algunas ofrecen mejor cashback que tarjetas de pago.' },
      { q:"¿Hay comisiones ocultas en las tarjetas 'gratuitas'?", a:'Las habituales: cambio de divisa (FX), comisiones en cajeros por encima del límite, comisiones por inactividad.' },
      { q:'¿Se puede retirar efectivo gratis?', a:'Normalmente 200-400€/mes gratis. Después, 1-2% de comisión.' },
      { q:'¿Las tarjetas gratuitas tienen los mismos límites?', a:'Generalmente entre 2.000€ y 10.000€ de límite diario.' },
    ],
    it: [
      { q:'Esistono carte crypto veramente gratuite?', a:'Sì: MetaMask Card, Gnosis Pay, Brighty. Nessuna commissione di emissione o abbonamento.' },
      { q:'Una carta gratuita è peggiore?', a:'No. Alcune carte gratuite offrono cashback migliore di quelle a pagamento.' },
      { q:"Ci sono costi nascosti nelle carte 'gratuite'?", a:'I più comuni: commissioni di cambio (FX), commissioni bancomat oltre il limite, commissioni di inattività.' },
      { q:'Si può prelevare contante gratuitamente?', a:"Di solito 200-400€/mese gratuiti. Oltre, commissioni dell'1-2%." },
      { q:'Le carte gratuite hanno gli stessi limiti di pagamento?', a:'Generalmente tra 2.000€ e 10.000€ di limite giornaliero.' },
    ],
    en: [
      { q:'Are there truly free crypto cards?', a:'Yes: MetaMask Card, Gnosis Pay, Brighty. No issuance or subscription fees.' },
      { q:'Is a free crypto card worse?', a:'No. Some free cards offer better cashback than paid ones.' },
      { q:"Are there hidden fees on 'free' cards?", a:'Common ones: FX conversion fees, ATM fees beyond the monthly cap, inactivity fees.' },
      { q:'Can you withdraw cash for free?', a:'Most offer €200-€400/month free. Beyond that, 1-2% fees apply.' },
      { q:'Do free cards have the same payment limits?', a:'Typically €2,000-€10,000 daily limit for free cards.' },
    ],
  },
  'no-staking': {
    fr: [
      { q:"Qu'est-ce que le staking pour une carte crypto ?", a:"Bloquer une quantité de crypto pour débloquer des avantages (cashback plus élevé, etc.). Ce capital est immobilisé." },
      { q:'Pourquoi éviter le staking ?', a:"Le staking expose votre capital à la volatilité. Sans staking, votre capital reste disponible." },
      { q:'Les cartes sans staking ont-elles un bon cashback ?', a:"Oui : Gnosis Pay (2%), MetaMask Card (1%), Brighty (jusqu'à 4%)." },
      { q:'Différence entre staking et dépôt minimum ?', a:"Le staking bloque des cryptos sur la blockchain (risque de perte). Un dépôt minimum est différent : vos fonds restent généralement disponibles." },
      { q:'Peut-on passer à une carte avec staking ultérieurement ?', a:"Oui, la plupart des plateformes permettent d'évoluer plus tard." },
    ],
    de: [
      { q:'Was ist Staking bei einer Krypto-Karte?', a:'Sperren einer Kryptomenge, um Vorteile wie höheres Cashback freizuschalten.' },
      { q:'Warum Staking vermeiden?', a:'Staking setzt Ihr Kapital der Volatilität aus. Ohne Staking bleibt das Kapital frei.' },
      { q:'Haben Karten ohne Staking gutes Cashback?', a:'Ja: Gnosis Pay (2%), MetaMask Card (1%), Brighty (bis 4%).' },
      { q:'Unterschied zwischen Staking und Mindesteinlage?', a:'Staking sperrt Kryptos auf der Blockchain. Eine Mindesteinlage ist meist frei verfügbar.' },
      { q:'Kann man später auf eine Staking-Karte wechseln?', a:'Ja, die meisten Plattformen ermöglichen einen späteren Wechsel.' },
    ],
    es: [
      { q:'¿Qué es el staking en una tarjeta crypto?', a:'Bloquear criptos para desbloquear ventajas como mayor cashback.' },
      { q:'¿Por qué evitar el staking?', a:'El staking expone tu capital a la volatilidad. Sin staking, tu capital permanece libre.' },
      { q:'¿Las tarjetas sin staking tienen buen cashback?', a:'Sí: Gnosis Pay (2%), MetaMask Card (1%), Brighty (hasta 4%).' },
      { q:'¿Diferencia entre staking y depósito mínimo?', a:'El staking bloquea criptos en la blockchain. Un depósito mínimo suele estar disponible.' },
      { q:'¿Se puede cambiar a una tarjeta con staking más adelante?', a:'Sí, la mayoría de plataformas lo permiten.' },
    ],
    it: [
      { q:"Cos'è lo staking per una carta crypto?", a:'Bloccare criptovalute per sbloccare vantaggi come un cashback più alto.' },
      { q:'Perché evitare lo staking?', a:'Lo staking espone il capitale alla volatilità. Senza staking, il capitale rimane libero.' },
      { q:'Le carte senza staking hanno un buon cashback?', a:'Sì: Gnosis Pay (2%), MetaMask Card (1%), Brighty (fino al 4%).' },
      { q:"Differenza tra staking e deposito minimo?", a:'Lo staking blocca le cripto sulla blockchain. Un deposito minimo è generalmente disponibile.' },
      { q:'Si può passare a una carta con staking in seguito?', a:'Sì, la maggior parte delle piattaforme lo consente.' },
    ],
    en: [
      { q:'What is staking for a crypto card?', a:'Locking a cryptocurrency amount to unlock benefits like higher cashback.' },
      { q:'Why avoid staking?', a:"Staking exposes your capital to volatility. Without it, your capital stays free." },
      { q:'Do no-staking cards have good cashback?', a:'Yes: Gnosis Pay (2%), MetaMask Card (1%), Brighty (up to 4%).' },
      { q:"What's the difference between staking and a minimum deposit?", a:'Staking locks crypto on the blockchain (with loss risk). A minimum deposit is usually accessible.' },
      { q:'Can you switch to a staking card later?', a:'Yes, most platforms allow you to upgrade later.' },
    ],
  },
  france: {
    fr: [
      { q:'Quelles cartes crypto sont disponibles en France ?', a:"Les principales : Crypto.com, Gnosis Pay, MetaMask Card, Brighty, Bleap et Wirex." },
      { q:'Les cartes crypto sont-elles légales en France ?', a:"Oui. Les émetteurs doivent être enregistrés comme PSAN auprès de l'AMF." },
      { q:'Faut-il déclarer sa carte crypto aux impôts en France ?', a:"Oui, les comptes crypto à l'étranger se déclarent (formulaire 3916-bis). Flat tax 30% sur les plus-values." },
      { q:'Peut-on payer ses impôts avec une carte crypto ?', a:"Non, les impôts français ne peuvent pas être payés en crypto directement." },
      { q:'Quelle carte a le meilleur support en français ?', a:"Crypto.com dispose d'un support en français. Gnosis Pay et MetaMask Card ont un support principalement en anglais." },
    ],
    de: [
      { q:'Welche Krypto-Karten sind in Deutschland erhältlich?', a:'Die wichtigsten: Crypto.com, Gnosis Pay, MetaMask Card, Brighty und Wirex.' },
      { q:'Sind Krypto-Karten in Deutschland legal?', a:'Ja, Emittenten müssen BaFin-reguliert oder MiCA-konform sein.' },
      { q:'Muss man eine Krypto-Karte beim Finanzamt melden?', a:'Ausländische Krypto-Konten können meldepflichtig sein. Krypto-Gewinne sind steuerpflichtig.' },
      { q:'Kann man in Deutschland überall mit einer Krypto-Karte bezahlen?', a:'Ja, über 95% der deutschen Händler akzeptieren Visa oder Mastercard.' },
      { q:'Hat die BaFin Einschränkungen für Krypto-Karten?', a:'Nein, MiCA-konforme Produkte sind in der gesamten EU reguliert.' },
    ],
    es: [
      { q:'¿Qué tarjetas crypto están disponibles en España?', a:'Las principales: Crypto.com, Gnosis Pay, MetaMask Card, Brighty y Wirex.' },
      { q:'¿Son legales las tarjetas crypto en España?', a:'Sí, los emisores deben estar registrados ante la CNMV o el Banco de España.' },
      { q:'¿Hay que declarar una tarjeta crypto a Hacienda?', a:'Sí, mediante el modelo 720. Las plusvalías tributan en el IRPF.' },
      { q:'¿Se puede pagar en todos los comercios en España?', a:'Sí, más del 95% aceptan Visa o Mastercard.' },
      { q:'¿Cuál es la mejor tarjeta para residentes en España?', a:'Gnosis Pay y Crypto.com son las más populares con disponibilidad confirmada en España.' },
    ],
    it: [
      { q:'Quali carte crypto sono disponibili in Italia?', a:"Le principali: Crypto.com, Gnosis Pay, MetaMask Card, Brighty e Wirex." },
      { q:'Le carte crypto sono legali in Italia?', a:"Sì, gli emittenti devono essere registrati presso l'OAM o essere conformi a MiCA." },
      { q:"Bisogna dichiarare una carta crypto all'Agenzia delle Entrate?", a:"Sì, nel quadro RW. Le plusvalenze sono soggette all'imposta del 26%." },
      { q:'Si può pagare ovunque in Italia?', a:'Sì, oltre il 95% dei commercianti accetta Visa o Mastercard.' },
      { q:'Qual è la migliore carta per i residenti italiani?', a:"Gnosis Pay e Crypto.com sono le più popolari con disponibilità confermata in Italia." },
    ],
    en: [
      { q:'Which crypto cards are available in Europe?', a:"Main options: Crypto.com, Gnosis Pay, MetaMask Card, Brighty, and Wirex." },
      { q:'Are crypto cards legal in Europe?', a:'Yes, MiCA now provides a unified regulatory framework across the EU.' },
      { q:'Do you need to declare a crypto card to tax authorities?', a:'In most countries, yes. Foreign crypto accounts must be declared and gains are taxable.' },
      { q:'Can you use a crypto card everywhere in Europe?', a:'Yes, Visa and Mastercard are accepted at over 95% of merchants across Europe.' },
      { q:'What is the best crypto card for European residents?', a:"Gnosis Pay and Crypto.com are the most popular with confirmed EU-wide availability." },
    ],
  },
  virtual: {
    fr: [
      { q:"Qu'est-ce qu'une carte crypto virtuelle ?", a:"Une carte de paiement numérique liée à votre wallet crypto, utilisable en ligne et via Apple Pay/Google Pay, sans support physique." },
      { q:'Comment obtenir une carte crypto virtuelle ?', a:"Téléchargez l'app, complétez le KYC, et la carte est disponible en quelques minutes." },
      { q:"Peut-on retirer de l'argent avec une carte virtuelle ?", a:"Non, les cartes purement virtuelles ne permettent pas de retraits ATM." },
      { q:'Une carte virtuelle est-elle aussi sécurisée ?', a:"Oui, souvent plus : elle ne peut pas être skimmée. Certaines génèrent un nouveau numéro par transaction." },
      { q:'Les cartes virtuelles sont-elles compatibles Apple Pay ?', a:"Oui, la plupart sont compatibles Apple Pay et Google Pay." },
    ],
    de: [
      { q:'Was ist eine virtuelle Krypto-Karte?', a:'Eine digitale Zahlungskarte, die mit Ihrem Krypto-Wallet verknüpft ist und für Online-Zahlungen und Apple/Google Pay verwendet werden kann.' },
      { q:'Wie bekommt man eine virtuelle Krypto-Karte?', a:'App herunterladen, KYC abschließen, und die Karte ist in Minuten verfügbar.' },
      { q:'Kann man mit einer virtuellen Karte Bargeld abheben?', a:'Nein, virtuelle Karten erlauben keine ATM-Abhebungen.' },
      { q:'Ist eine virtuelle Karte sicher?', a:'Ja, oft sicherer, da sie nicht geskimmt werden kann.' },
      { q:'Sind virtuelle Karten mit Apple Pay kompatibel?', a:'Ja, die meisten sind mit Apple Pay und Google Pay kompatibel.' },
    ],
    es: [
      { q:'¿Qué es una tarjeta crypto virtual?', a:'Una tarjeta de pago digital vinculada a tu wallet crypto, utilizable online y via Apple/Google Pay.' },
      { q:'¿Cómo obtener una tarjeta crypto virtual?', a:'Descarga la app, completa el KYC, y la tarjeta estará disponible en minutos.' },
      { q:'¿Se puede retirar efectivo con una tarjeta virtual?', a:'No, las tarjetas puramente virtuales no permiten retiros en cajeros.' },
      { q:'¿Es segura una tarjeta virtual?', a:'Sí, a menudo más segura ya que no puede ser skimmeada.' },
      { q:'¿Son compatibles con Apple Pay?', a:'Sí, la mayoría son compatibles con Apple Pay y Google Pay.' },
    ],
    it: [
      { q:"Cos'è una carta crypto virtuale?", a:"Una carta di pagamento digitale collegata al tuo wallet crypto, utilizzabile online e tramite Apple/Google Pay." },
      { q:'Come ottenere una carta crypto virtuale?', a:"Scarica l'app, completa il KYC, e la carta è disponibile in pochi minuti." },
      { q:'Si può prelevare contante con una carta virtuale?', a:'No, le carte puramente virtuali non consentono prelievi ATM.' },
      { q:'Una carta virtuale è sicura?', a:'Sì, spesso più sicura poiché non può essere clonata fisicamente.' },
      { q:'Le carte virtuali sono compatibili con Apple Pay?', a:'Sì, la maggior parte è compatibile con Apple Pay e Google Pay.' },
    ],
    en: [
      { q:'What is a virtual crypto card?', a:'A digital payment card linked to your crypto wallet, usable for online payments and via Apple Pay/Google Pay.' },
      { q:'How do you get a virtual crypto card?', a:'Download the app, complete KYC, and the virtual card is available within minutes.' },
      { q:'Can you withdraw cash with a virtual card?', a:'No, purely virtual cards do not support ATM withdrawals.' },
      { q:'Is a virtual card secure?', a:'Yes, often more secure as it cannot be physically skimmed.' },
      { q:'Are virtual cards compatible with Apple Pay?', a:'Yes, most virtual crypto cards support Apple Pay and Google Pay.' },
    ],
  },
  beginner: {
    fr: [
      { q:'Par quelle carte commencer quand on est débutant ?', a:"Gnosis Pay ou MetaMask Card : pas de staking, pas de frais, interface simple, cashback immédiat." },
      { q:'Faut-il comprendre la crypto pour utiliser une carte crypto ?', a:"Non, elles fonctionnent comme une carte bancaire normale. Vous rechargez depuis un exchange et payez partout." },
      { q:"Quel est le risque principal pour un débutant ?", a:"La volatilité : si la crypto sur la carte baisse, vous perdez du pouvoir d'achat. Utilisez des stablecoins (USDC)." },
      { q:"Combien faut-il déposer minimum ?", a:"La plupart n'imposent pas de minimum. Commencez avec 50-100€ pour tester." },
      { q:"Comment recharger une carte crypto ?", a:"Depuis l'app, transférez des cryptos depuis votre exchange. La conversion en euros est automatique." },
    ],
    de: [
      { q:'Welche Karte ist für Einsteiger am besten?', a:'Gnosis Pay oder MetaMask Card: kein Staking, keine Gebühren, einfache Oberfläche, sofortiges Cashback.' },
      { q:'Muss man Krypto verstehen?', a:'Nein, diese Karten funktionieren wie normale Bankkarten.' },
      { q:'Was ist das Hauptrisiko für Einsteiger?', a:'Volatilität. Verwenden Sie Stablecoins (USDC), um das Risiko zu minimieren.' },
      { q:'Wie viel Mindesteinlage ist nötig?', a:'Die meisten Karten haben keine Mindesteinlage. Beginnen Sie mit 50-100€.' },
      { q:'Wie lädt man eine Krypto-Karte auf?', a:'Über die App von Ihrer Exchange überweisen. Die Umrechnung erfolgt automatisch.' },
    ],
    es: [
      { q:'¿Por qué tarjeta empezar como principiante?', a:'Gnosis Pay o MetaMask Card: sin staking, sin comisiones, cashback inmediato.' },
      { q:'¿Hay que entender de cripto?', a:'No, funcionan como una tarjeta bancaria normal.' },
      { q:'¿Cuál es el principal riesgo para principiantes?', a:'La volatilidad. Usa stablecoins (USDC) para minimizar el riesgo.' },
      { q:'¿Cuánto hay que depositar mínimo?', a:'La mayoría no tiene depósito mínimo. Empieza con 50-100€.' },
      { q:'¿Cómo se recarga una tarjeta crypto?', a:'Desde la app, transfiere desde tu exchange. La conversión es automática.' },
    ],
    it: [
      { q:'Da quale carta iniziare per un principiante?', a:'Gnosis Pay o MetaMask Card: nessuno staking, nessun costo, cashback immediato.' },
      { q:'Bisogna capire le crypto?', a:'No, funzionano come una normale carta bancaria.' },
      { q:"Qual è il rischio principale per un principiante?", a:"La volatilità. Usa stablecoin (USDC) per minimizzare il rischio." },
      { q:"Quanto deposito minimo è necessario?", a:'La maggior parte non richiede un minimo. Inizia con 50-100€.' },
      { q:'Come si ricarica una carta crypto?', a:"Dall'app, trasferisci dal tuo exchange. La conversione avviene automaticamente." },
    ],
    en: [
      { q:'Which crypto card should a beginner start with?', a:'Gnosis Pay or MetaMask Card: no staking, no fees, instant cashback.' },
      { q:'Do you need to understand crypto?', a:'No, they work just like a regular bank card.' },
      { q:'What is the main risk for beginners?', a:'Volatility. Use stablecoins (USDC) to minimize this risk.' },
      { q:'How much do you need to deposit to start?', a:'Most have no minimum. Start with €50-€100 to test.' },
      { q:'How do you top up a crypto card?', a:"From the app, transfer from your exchange. The conversion to euros is automatic." },
    ],
  },
  'no-kyc': {
    fr: [
      { q:"Existe-t-il vraiment des cartes crypto sans KYC ?", a:"Pas au sens strict : aucune carte crypto réglementée en Europe ne permet un usage totalement anonyme. Mais des cartes comme MetaMask Card ou Gnosis Pay proposent un KYC minimal via votre wallet Web3." },
      { q:"Qu'est-ce que le KYC pour une carte crypto ?", a:"Know Your Customer : la vérification obligatoire de l'identité (pièce d'identité, adresse). Requis par les réglementations AML en Europe pour lutter contre le blanchiment." },
      { q:"Pourquoi certaines cartes ont-elles moins de KYC ?", a:"Les cartes basées sur des wallets self-custody (MetaMask, Gnosis) décentralisent la garde des fonds, ce qui permet un processus KYC simplifié tout en restant conforme aux lois." },
      { q:"Peut-on payer anonymement avec une carte crypto ?", a:"Non en Europe. MiCA et les directives AML imposent une identification minimale. En revanche, vos données crypto ne sont pas exposées aux commerçants lors du paiement." },
      { q:"Quelle est la carte crypto avec le moins de KYC en 2026 ?", a:"MetaMask Card et Gnosis Pay sont les plus légères en termes de processus d'inscription grâce à leur architecture décentralisée et leur modèle self-custody." },
    ],
    de: [
      { q:'Gibt es wirklich Krypto-Karten ohne KYC?', a:'Im strengen Sinne nicht: Keine regulierte Krypto-Karte in Europa erlaubt völlig anonyme Nutzung. Karten wie MetaMask Card oder Gnosis Pay bieten jedoch ein minimales KYC über Ihr Web3-Wallet.' },
      { q:'Was ist KYC bei Krypto-Karten?', a:'Know Your Customer: die obligatorische Identitätsprüfung (Ausweis, Adresse). In Europa durch AML-Vorschriften zur Geldwäschebekämpfung vorgeschrieben.' },
      { q:'Warum haben manche Karten weniger KYC?', a:'Self-Custody-Wallet-basierte Karten (MetaMask, Gnosis) dezentralisieren die Fondsverwaltung, was einen vereinfachten KYC-Prozess bei gleichzeitiger Regelkonformität ermöglicht.' },
      { q:'Kann man anonym mit einer Krypto-Karte zahlen?', a:'Nein in Europa. MiCA und AML-Richtlinien erfordern eine Mindestidentifikation. Ihre Krypto-Daten werden jedoch beim Bezahlen nicht an Händler weitergegeben.' },
      { q:'Welche Krypto-Karte hat 2026 das wenigste KYC?', a:'MetaMask Card und Gnosis Pay sind am einfachsten in der Registrierung dank ihrer dezentralen Architektur und dem Self-Custody-Modell.' },
    ],
    es: [
      { q:'¿Existen realmente tarjetas crypto sin KYC?', a:'No en sentido estricto: ninguna tarjeta crypto regulada en Europa permite un uso totalmente anónimo. Pero tarjetas como MetaMask Card o Gnosis Pay ofrecen un KYC mínimo vía wallet Web3.' },
      { q:'¿Qué es el KYC para una tarjeta crypto?', a:'Know Your Customer: la verificación obligatoria de identidad (DNI, dirección). Requerido por las normativas AML en Europa para combatir el blanqueo de capitales.' },
      { q:'¿Por qué algunas tarjetas tienen menos KYC?', a:'Las tarjetas basadas en wallets self-custody (MetaMask, Gnosis) descentralizan la custodia de fondos, permitiendo un proceso KYC simplificado mientras se mantiene la conformidad legal.' },
      { q:'¿Se puede pagar de forma anónima con una tarjeta crypto?', a:'No en Europa. MiCA y las directivas AML imponen una identificación mínima. Sin embargo, tus datos crypto no se exponen a los comerciantes al pagar.' },
      { q:'¿Qué tarjeta crypto tiene menos KYC en 2026?', a:'MetaMask Card y Gnosis Pay son las más ligeras en proceso de registro gracias a su arquitectura descentralizada y modelo self-custody.' },
    ],
    it: [
      { q:'Esistono davvero carte crypto senza KYC?', a:'Non nel senso stretto: nessuna carta crypto regolamentata in Europa consente un utilizzo completamente anonimo. Ma carte come MetaMask Card o Gnosis Pay offrono un KYC minimo tramite wallet Web3.' },
      { q:"Cos'è il KYC per una carta crypto?", a:"Know Your Customer: la verifica obbligatoria dell'identità (documento, indirizzo). Richiesto dalle normative AML in Europa per combattere il riciclaggio di denaro." },
      { q:'Perché alcune carte hanno meno KYC?', a:'Le carte basate su wallet self-custody (MetaMask, Gnosis) decentralizzano la custodia dei fondi, consentendo un processo KYC semplificato pur rimanendo conformi.' },
      { q:'Si può pagare in modo anonimo con una carta crypto?', a:'No in Europa. MiCA e le direttive AML impongono un\'identificazione minima. I tuoi dati crypto non vengono però esposti ai commercianti durante i pagamenti.' },
      { q:'Quale carta crypto ha meno KYC nel 2026?', a:'MetaMask Card e Gnosis Pay hanno il processo di registrazione più leggero grazie alla loro architettura decentralizzata e al modello self-custody.' },
    ],
    en: [
      { q:'Do no-KYC crypto cards really exist?', a:'Not strictly: no regulated crypto card in Europe allows fully anonymous use. But cards like MetaMask Card or Gnosis Pay offer minimal KYC through your Web3 wallet.' },
      { q:'What is KYC for crypto cards?', a:'Know Your Customer: mandatory identity verification (ID document, address). Required by AML regulations across Europe to combat money laundering.' },
      { q:'Why do some cards require less KYC?', a:'Self-custody wallet-based cards (MetaMask, Gnosis) decentralize fund custody, enabling a simplified KYC process while remaining fully compliant with regulations.' },
      { q:'Can you pay anonymously with a crypto card?', a:'Not in Europe. MiCA and AML directives require minimum identification. However, your crypto data is not exposed to merchants when you pay.' },
      { q:'Which crypto card has the least KYC in 2026?', a:'MetaMask Card and Gnosis Pay have the lightest registration process thanks to their decentralized architecture and self-custody model.' },
    ],
  },
  '2026': {
    fr: [
      { q:`Quelle est la meilleure carte crypto en 2026 ?`, a:`En 2026, Gnosis Pay et MetaMask Card se distinguent pour le quotidien (zéro staking, zéro frais). Pour le cashback maximum, Crypto.com Obsidian reste la référence malgré un staking élevé.` },
      { q:`Les cartes crypto sont-elles sûres en 2026 ?`, a:`Oui, grâce à MiCA en vigueur dans toute l'UE depuis 2025. Les émetteurs sont régulés, vos fonds mieux protégés qu'auparavant.` },
      { q:`Y a-t-il de nouvelles cartes crypto en 2026 ?`, a:`Oui, plusieurs nouveaux acteurs sont entrés sur le marché suite à l'adoption de MiCA. Notre comparatif est mis à jour régulièrement pour refléter les dernières offres.` },
      { q:`Le cashback des cartes crypto est-il imposable en 2026 ?`, a:`En France, les gains crypto sont soumis à la flat tax de 30% (PFU). Consultez un expert-comptable pour votre situation personnelle.` },
      { q:`Quelle carte crypto choisir pour la France en 2026 ?`, a:`Gnosis Pay et Crypto.com sont confirmées disponibles en France. Privilégiez une carte émise par un PSAN enregistré auprès de l'AMF pour une protection maximale.` },
    ],
    de: [
      { q:`Was ist die beste Krypto-Karte 2026?`, a:`2026 zeichnen sich Gnosis Pay und MetaMask Card für den Alltag aus (kein Staking, keine Gebühren). Für maximales Cashback bleibt Crypto.com Obsidian die Referenz.` },
      { q:`Sind Krypto-Karten 2026 sicher?`, a:`Ja, dank MiCA, das seit 2025 EU-weit gilt. Emittenten sind reguliert, Ihre Gelder besser geschützt als je zuvor.` },
      { q:`Gibt es 2026 neue Krypto-Karten?`, a:`Ja, mehrere neue Akteure sind nach der MiCA-Einführung in den Markt eingetreten. Unser Vergleich wird regelmäßig mit den neuesten Angeboten aktualisiert.` },
      { q:`Ist Krypto-Cashback 2026 steuerpflichtig?`, a:`In Deutschland unterliegen Krypto-Gewinne der Einkommensteuer. Konsultieren Sie einen Steuerberater für Ihre persönliche Situation.` },
      { q:`Welche Krypto-Karte für Deutschland 2026?`, a:`Gnosis Pay und Crypto.com sind in Deutschland verfügbar. Wählen Sie eine BaFin-regulierte Option für maximalen Schutz.` },
    ],
    es: [
      { q:`¿Cuál es la mejor tarjeta crypto en 2026?`, a:`En 2026, Gnosis Pay y MetaMask Card destacan para el uso diario (sin staking, sin comisiones). Para el máximo cashback, Crypto.com Obsidian sigue siendo la referencia.` },
      { q:`¿Son seguras las tarjetas crypto en 2026?`, a:`Sí, gracias a MiCA vigente en toda la UE desde 2025. Los emisores están regulados y tus fondos mejor protegidos que nunca.` },
      { q:`¿Hay nuevas tarjetas crypto en 2026?`, a:`Sí, varios nuevos actores han entrado al mercado tras la adopción de MiCA. Nuestra comparativa se actualiza regularmente con las últimas ofertas.` },
      { q:`¿El cashback crypto es imponible en 2026?`, a:`En España, las ganancias crypto tributan en el IRPF. Consulta un asesor fiscal para tu situación personal.` },
      { q:`¿Qué tarjeta crypto elegir para España en 2026?`, a:`Gnosis Pay y Crypto.com están disponibles en España. Elige una opción regulada por el Banco de España o la CNMV para máxima protección.` },
    ],
    it: [
      { q:`Qual è la migliore carta crypto nel 2026?`, a:`Nel 2026, Gnosis Pay e MetaMask Card si distinguono per l'uso quotidiano (zero staking, zero costi). Per il massimo cashback, Crypto.com Obsidian rimane il riferimento.` },
      { q:`Le carte crypto sono sicure nel 2026?`, a:`Sì, grazie a MiCA in vigore in tutta l'UE dal 2025. Gli emittenti sono regolamentati e i tuoi fondi meglio protetti che mai.` },
      { q:`Ci sono nuove carte crypto nel 2026?`, a:`Sì, diversi nuovi attori sono entrati nel mercato dopo l'adozione di MiCA. Il nostro confronto viene aggiornato regolarmente con le ultime offerte.` },
      { q:`Il cashback crypto è tassabile nel 2026?`, a:`In Italia, i guadagni crypto sono soggetti a imposta sostitutiva del 26%. Consulta un commercialista per la tua situazione personale.` },
      { q:`Quale carta crypto scegliere per l'Italia nel 2026?`, a:`Gnosis Pay e Crypto.com sono disponibili in Italia. Scegli un'opzione registrata presso l'OAM per la massima protezione.` },
    ],
    en: [
      { q:`What is the best crypto card in 2026?`, a:`In 2026, Gnosis Pay and MetaMask Card stand out for everyday use (zero staking, zero fees). For maximum cashback, Crypto.com Obsidian remains the benchmark despite high staking requirements.` },
      { q:`Are crypto cards safe in 2026?`, a:`Yes, thanks to MiCA regulation across the EU since 2025. Issuers are regulated and your funds are better protected than ever before.` },
      { q:`Are there new crypto cards in 2026?`, a:`Yes, several new players have entered the market following MiCA adoption. Our comparison is updated regularly to reflect the latest offers.` },
      { q:`Is crypto cashback taxable in 2026?`, a:`In most EU countries, crypto gains are taxable. Rates vary by country — consult a tax advisor for your specific situation.` },
      { q:`Which crypto card to choose in Europe for 2026?`, a:`Gnosis Pay and Crypto.com are confirmed available across the EU. Prioritize MiCA-compliant options from regulated entities for maximum fund protection.` },
    ],
  },
  travel: {
    fr: [
      { q:'Les cartes crypto ont-elles des frais de change à l\'étranger ?', a:'La plupart des cartes crypto n\'appliquent pas de frais de change sur les dépenses en devises étrangères, contrairement aux cartes bancaires classiques (1-3% de frais).' },
      { q:'Peut-on retirer des espèces à l\'étranger avec une carte crypto ?', a:'Oui, la plupart offrent des retraits ATM gratuits dans une limite mensuelle (200-400€). Au-delà, des frais de 1-2% s\'appliquent.' },
      { q:'Une carte crypto est-elle acceptée partout dans le monde ?', a:'Oui, les cartes Visa et Mastercard sont acceptées dans plus de 200 pays et territoires, soit plus de 50 millions de points de vente.' },
      { q:'Faut-il prévenir sa banque crypto avant de voyager ?', a:'Non, contrairement aux banques traditionnelles, les cartes crypto n\'ont généralement pas besoin d\'être notifiées avant un voyage à l\'étranger.' },
      { q:'Quelle carte crypto est la meilleure pour voyager ?', a:'Crypto.com offre les meilleurs avantages voyage (lounges, assurance). Pour un budget réduit, MetaMask Card ou Gnosis Pay sont idéales sans frais annuels.' },
    ],
    de: [
      { q:'Haben Krypto-Karten Wechselgebühren im Ausland?', a:'Die meisten Krypto-Karten erheben keine Wechselgebühren auf Fremdwährungsausgaben, im Gegensatz zu klassischen Bankkarten (1-3% Gebühren).' },
      { q:'Kann man im Ausland Bargeld mit einer Krypto-Karte abheben?', a:'Ja, die meisten bieten kostenlose Geldautomaten-Abhebungen bis zu einem monatlichen Limit (200-400€). Danach fallen 1-2% Gebühren an.' },
      { q:'Wird eine Krypto-Karte weltweit akzeptiert?', a:'Ja, Visa- und Mastercard-Karten werden in über 200 Ländern und Territorien bei über 50 Millionen Händlern akzeptiert.' },
      { q:'Muss man seine Krypto-Bank vor Reisen informieren?', a:'Nein, im Gegensatz zu traditionellen Banken müssen Krypto-Karten in der Regel nicht vor einer Reise benachrichtigt werden.' },
      { q:'Welche Krypto-Karte ist die beste für Reisende?', a:'Crypto.com bietet die besten Reisevorteile (Lounges, Versicherung). Für ein kleineres Budget: MetaMask Card oder Gnosis Pay ohne Jahresgebühr.' },
    ],
    es: [
      { q:'¿Las tarjetas crypto tienen comisiones de cambio en el extranjero?', a:'La mayoría de las tarjetas crypto no aplican comisiones de cambio en gastos en divisas extranjeras, a diferencia de las tarjetas bancarias clásicas (1-3% de comisión).' },
      { q:'¿Se puede retirar efectivo en el extranjero con una tarjeta crypto?', a:'Sí, la mayoría ofrecen retiros en cajeros gratuitos hasta un límite mensual (200-400€). Después se aplica un 1-2% de comisión.' },
      { q:'¿Una tarjeta crypto está aceptada en todo el mundo?', a:'Sí, las tarjetas Visa y Mastercard están aceptadas en más de 200 países y territorios y más de 50 millones de comercios.' },
      { q:'¿Hay que avisar antes de viajar al extranjero?', a:'No, a diferencia de los bancos tradicionales, las tarjetas crypto generalmente no necesitan ser notificadas antes de un viaje.' },
      { q:'¿Cuál es la mejor tarjeta crypto para viajar?', a:'Crypto.com ofrece las mejores ventajas de viaje (lounges, seguro). Para un presupuesto reducido, MetaMask Card o Gnosis Pay sin cuota anual.' },
    ],
    it: [
      { q:'Le carte crypto hanno commissioni di cambio all\'estero?', a:'La maggior parte delle carte crypto non applica commissioni di cambio sulle spese in valuta estera, al contrario delle carte bancarie classiche (1-3% di commissione).' },
      { q:'Si può prelevare contante all\'estero con una carta crypto?', a:'Sì, la maggior parte offre prelievi ATM gratuiti fino a un limite mensile (200-400€). Oltre, si applica l\'1-2% di commissione.' },
      { q:'Una carta crypto è accettata in tutto il mondo?', a:'Sì, le carte Visa e Mastercard sono accettate in oltre 200 paesi e territori e più di 50 milioni di punti vendita.' },
      { q:'Bisogna avvisare prima di viaggiare all\'estero?', a:'No, a differenza delle banche tradizionali, le carte crypto generalmente non necessitano di notifica prima di un viaggio.' },
      { q:'Quale carta crypto è la migliore per i viaggiatori?', a:'Crypto.com offre i migliori vantaggi di viaggio (lounge, assicurazione). Per un budget ridotto, MetaMask Card o Gnosis Pay senza costi annuali.' },
    ],
    en: [
      { q:'Do crypto cards charge currency exchange fees abroad?', a:'Most crypto cards don\'t charge currency conversion fees on foreign currency spending, unlike traditional bank cards (1-3% fees).' },
      { q:'Can you withdraw cash abroad with a crypto card?', a:'Yes, most offer free ATM withdrawals up to a monthly limit (€200-€400). Beyond that, 1-2% fees apply.' },
      { q:'Is a crypto card accepted worldwide?', a:'Yes, Visa and Mastercard cards are accepted in over 200 countries and territories at more than 50 million merchants.' },
      { q:'Do you need to notify your issuer before traveling?', a:'No, unlike traditional banks, crypto cards generally don\'t need to be notified before international travel.' },
      { q:'Which crypto card is best for travelers?', a:'Crypto.com offers the best travel perks (lounges, insurance). For a tighter budget, MetaMask Card or Gnosis Pay with no annual fee.' },
    ],
  },
  rewards: {
    fr: [
      { q:'Quels sont les avantages rewards des cartes crypto premium ?', a:'Les principales récompenses : cashback en crypto (1-8%), accès lounges aéroport, remboursement Netflix/Spotify, assurance voyage, et cashback supplémentaire sur certaines plateformes.' },
      { q:'Les avantages rewards en valent-ils vraiment la peine ?', a:'Cela dépend : pour un utilisateur actif dépensant 2 000€/mois, un cashback de 2% = 480€/an. Comparez avec le coût du staking requis.' },
      { q:'Peut-on cumuler plusieurs récompenses sur une carte crypto ?', a:'Oui, certaines cartes cumulent cashback + lounge + remboursements d\'abonnements. Crypto.com Obsidian est le champion de cette catégorie.' },
      { q:'Les récompenses crypto sont-elles imposables ?', a:'En France, les récompenses en crypto sont des revenus imposables. La revente est soumise à la flat tax de 30%.' },
      { q:'Comment maximiser ses récompenses avec une carte crypto ?', a:'Utilisez la carte pour toutes vos dépenses courantes, profitez des remboursements d\'abonnements et choisissez un niveau de staking adapté à votre profil.' },
    ],
    de: [
      { q:'Welche Prämienvorteile bieten Premium-Krypto-Karten?', a:'Die wichtigsten Prämien: Cashback in Krypto (1-8%), Flughafen-Lounge-Zugang, Netflix/Spotify-Erstattung, Reiseversicherung und Plattform-Cashback.' },
      { q:'Lohnen sich Prämienvorteile wirklich?', a:'Das hängt ab: Für einen aktiven Nutzer mit 2.000€/Monat Ausgaben bedeutet 2% Cashback = 480€/Jahr. Vergleichen Sie mit den Staking-Kosten.' },
      { q:'Kann man mehrere Prämien auf einer Krypto-Karte kumulieren?', a:'Ja, einige Karten kombinieren Cashback + Lounge + Abonnement-Erstattungen. Crypto.com Obsidian ist der Champion in dieser Kategorie.' },
      { q:'Sind Krypto-Prämien steuerpflichtig?', a:'In Deutschland unterliegen Krypto-Prämien der Einkommensteuer. Gewinne aus dem Verkauf sind ebenfalls steuerpflichtig.' },
      { q:'Wie maximiert man Prämien mit einer Krypto-Karte?', a:'Nutzen Sie die Karte für alle laufenden Ausgaben, nutzen Sie Abonnement-Erstattungen und wählen Sie ein für Ihr Profil geeignetes Staking-Niveau.' },
    ],
    es: [
      { q:'¿Qué ventajas de recompensas ofrecen las tarjetas crypto premium?', a:'Las principales recompensas: cashback en crypto (1-8%), acceso a lounges de aeropuerto, reembolso de Netflix/Spotify, seguro de viaje.' },
      { q:'¿Realmente merecen la pena las recompensas?', a:'Depende: para un usuario activo que gasta 2.000€/mes, un 2% de cashback = 480€/año. Compara con el coste del staking requerido.' },
      { q:'¿Se pueden acumular varias recompensas en una tarjeta crypto?', a:'Sí, algunas tarjetas combinan cashback + lounge + reembolsos de suscripciones. Crypto.com Obsidian lidera esta categoría.' },
      { q:'¿Son imponibles las recompensas crypto?', a:'En España, las recompensas en crypto son ingresos imponibles sujetos al IRPF según el tipo marginal correspondiente.' },
      { q:'¿Cómo maximizar las recompensas con una tarjeta crypto?', a:'Usa la tarjeta para todos tus gastos habituales, aprovecha los reembolsos de suscripciones y elige el nivel de staking adecuado a tu perfil.' },
    ],
    it: [
      { q:'Quali vantaggi di premi offrono le carte crypto premium?', a:'I principali premi: cashback in crypto (1-8%), accesso alle lounge aeroportuali, rimborso Netflix/Spotify, assicurazione viaggio.' },
      { q:'I vantaggi dei premi valgono davvero la pena?', a:'Dipende: per un utente attivo che spende 2.000€/mese, il 2% di cashback = 480€/anno. Confronta con il costo dello staking richiesto.' },
      { q:'Si possono cumulare più premi su una carta crypto?', a:'Sì, alcune carte combinano cashback + lounge + rimborsi abbonamenti. Crypto.com Obsidian è il campione in questa categoria.' },
      { q:'I premi crypto sono soggetti a tassazione?', a:'In Italia, i premi in crypto sono redditi imponibili soggetti all\'imposta sostitutiva del 26%.' },
      { q:'Come massimizzare i premi con una carta crypto?', a:'Usa la carta per tutte le spese correnti, approfitta dei rimborsi degli abbonamenti e scegli un livello di staking adatto al tuo profilo.' },
    ],
    en: [
      { q:'What rewards benefits do premium crypto cards offer?', a:'Main rewards: crypto cashback (1-8%), airport lounge access, Netflix/Spotify reimbursement, travel insurance, and platform-specific cashback bonuses.' },
      { q:'Are rewards benefits really worth it?', a:'It depends: for an active user spending €2,000/month, 2% cashback = €480/year. Compare this with the cost of required staking.' },
      { q:'Can you stack multiple rewards on a crypto card?', a:'Yes, some cards combine cashback + lounge access + subscription reimbursements. Crypto.com Obsidian leads this category.' },
      { q:'Are crypto rewards taxable?', a:'In most EU countries, crypto rewards are taxable income. Gains from selling are subject to capital gains tax — rates vary by country.' },
      { q:'How do you maximize rewards with a crypto card?', a:'Use the card for all everyday spending, take advantage of subscription reimbursements, and choose a staking tier suited to your spending profile.' },
    ],
  },
};

/* ────────────────────────────────────────────────────────────────────────────
   FILTERS / SORT / LIMIT
   ──────────────────────────────────────────────────────────────────────────── */
const THEME_FILTERS: Record<string, (card: any) => boolean> = {
  best:         () => true,
  cashback:     (c) => (c.cashback_premium || c.cashback_base || 0) > 0,
  'no-fees':    (c) => (c.annual_fees || 0) === 0,
  'no-staking': (c) => (c.staking_required || 0) === 0,
  france:       () => true,
  virtual:      (c) => c.virtual_only === true,
  beginner:     (c) => (c.annual_fees || 0) === 0 && (c.staking_required || 0) === 0,
  'no-kyc':     (c) => Array.isArray(c.extras) && c.extras.some((e: string) => ['self_custody','hybrid_custody','web3_native','defi_native','exodus_wallet'].includes(e)),
  '2026':       () => true,
  travel:       () => true,
  rewards:      (c) => (c.cashback_premium || c.cashback_base || 0) > 0,
};
const THEME_SORT: Record<string, (a: any, b: any) => number> = {
  best:         (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  cashback:     (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  'no-fees':    (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  'no-staking': (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  france:       (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  virtual:      (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  beginner:     (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  'no-kyc':     (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  '2026':       (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  travel:       (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  rewards:      (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
};
const THEME_LIMIT: Record<string, number> = { best: 15 };

/* ────────────────────────────────────────────────────────────────────────────
   THEMATIC SLUGS (for hreflang)
   ──────────────────────────────────────────────────────────────────────────── */
const THEMATIC_SLUGS: Record<string, Record<string, string>> = {
  best:         { fr: 'meilleure-carte-crypto', de: 'beste-krypto-karte', es: 'mejor-tarjeta-cripto', it: 'migliore-carta-cripto', en: 'best-crypto-card' },
  cashback:     { fr: 'carte-crypto-cashback', de: 'krypto-karte-cashback', es: 'tarjeta-cripto-cashback', it: 'carta-cripto-cashback', en: 'crypto-card-cashback' },
  'no-fees':    { fr: 'carte-crypto-sans-frais', de: 'krypto-karte-ohne-jahresgebuehr', es: 'tarjeta-cripto-sin-comisiones', it: 'carta-cripto-senza-commissioni', en: 'crypto-card-no-fees' },
  'no-staking': { fr: 'carte-crypto-sans-staking', de: 'krypto-karte-ohne-staking', es: 'tarjeta-cripto-sin-staking', it: 'carta-cripto-senza-staking', en: 'crypto-card-no-staking' },
  france:       { fr: 'cartes-crypto-france', de: 'krypto-karten-deutschland', es: 'tarjetas-crypto-espana', it: 'carte-crypto-italia', en: 'crypto-cards-europe' },
  virtual:      { fr: 'carte-crypto-virtuelle', de: 'virtuelle-krypto-karte', es: 'tarjeta-crypto-virtual', it: 'carta-crypto-virtuale', en: 'virtual-crypto-card' },
  beginner:     { fr: 'cartes-crypto-debutant', de: 'krypto-karten-einsteiger', es: 'tarjetas-crypto-principiante', it: 'carte-crypto-principiante', en: 'beginner-crypto-cards' },
  'no-kyc':     { fr: 'carte-crypto-sans-kyc', de: 'krypto-karte-ohne-kyc', es: 'tarjeta-crypto-sin-kyc', it: 'carta-cripto-senza-kyc', en: 'crypto-card-no-kyc' },
  '2026':       { fr: 'carte-crypto-2026', de: 'krypto-karte-2026', es: 'tarjeta-cripto-2026', it: 'carta-cripto-2026', en: 'best-crypto-card-2026' },
  travel:       { fr: 'carte-crypto-voyage', de: 'krypto-karte-reise', es: 'tarjeta-cripto-viaje', it: 'carta-cripto-viaggio', en: 'crypto-card-travel' },
  rewards:      { fr: 'carte-crypto-recompenses', de: 'krypto-karte-praemien', es: 'tarjeta-cripto-recompensas', it: 'carta-cripto-premi', en: 'crypto-card-rewards' },
};

/* ────────────────────────────────────────────────────────────────────────────
   RELATED THEMES (maillage cross-thématique)
   ──────────────────────────────────────────────────────────────────────────── */
const RELATED_THEMES: Record<string, string[]> = {
  best:         ['cashback', 'no-fees', 'no-staking', 'rewards'],
  cashback:     ['rewards', 'travel', 'no-staking', 'best'],
  'no-fees':    ['cashback', 'beginner', 'no-staking', 'best'],
  'no-staking': ['no-fees', 'cashback', 'beginner', 'rewards'],
  france:       ['best', 'cashback', 'no-fees', 'virtual'],
  virtual:      ['no-fees', 'best', 'cashback', 'beginner'],
  beginner:     ['no-fees', 'no-staking', 'best', 'no-kyc'],
  'no-kyc':     ['no-staking', 'beginner', 'no-fees', 'virtual'],
  '2026':       ['best', 'cashback', 'rewards', 'travel'],
  travel:       ['cashback', 'rewards', 'no-fees', '2026'],
  rewards:      ['cashback', 'travel', '2026', 'best'],
};
const THEME_EMOJI: Record<string, string> = {
  best: '⭐', cashback: '💰', 'no-fees': '🆓', 'no-staking': '🔓',
  france: '🇪🇺', virtual: '📱', beginner: '🎯', 'no-kyc': '🔐',
  '2026': '🚀', travel: '✈️', rewards: '🎁',
};
const THEME_LABEL: Record<string, Record<string, string>> = {
  best:         { fr:'Meilleure carte', de:'Beste Karte', es:'Mejor tarjeta', it:'Migliore carta', en:'Best card' },
  cashback:     { fr:'Cashback', de:'Cashback', es:'Cashback', it:'Cashback', en:'Cashback' },
  'no-fees':    { fr:'Sans frais', de:'Ohne Gebühren', es:'Sin comisiones', it:'Senza costi', en:'No fees' },
  'no-staking': { fr:'Sans staking', de:'Ohne Staking', es:'Sin staking', it:'Senza staking', en:'No staking' },
  france:       { fr:'Disponible en France', de:'In Deutschland', es:'En España', it:'In Italia', en:'Available in EU' },
  virtual:      { fr:'Carte virtuelle', de:'Virtuelle Karte', es:'Tarjeta virtual', it:'Carta virtuale', en:'Virtual card' },
  beginner:     { fr:'Pour débutants', de:'Für Einsteiger', es:'Para principiantes', it:'Per principianti', en:'For beginners' },
  'no-kyc':     { fr:'Sans KYC', de:'Ohne KYC', es:'Sin KYC', it:'Senza KYC', en:'No KYC' },
  '2026':       { fr:'Meilleures 2026', de:'Beste 2026', es:'Mejores 2026', it:'Migliori 2026', en:'Best 2026' },
  travel:       { fr:'Voyage', de:'Reisen', es:'Viaje', it:'Viaggio', en:'Travel' },
  rewards:      { fr:'Récompenses', de:'Prämien', es:'Recompensas', it:'Premi', en:'Rewards' },
};
const RELATED_TITLE: Record<string, string> = {
  fr: 'Voir aussi', de: 'Siehe auch', es: 'Ver también', it: 'Vedi anche', en: 'See also',
};

const THEME_BLOG_LINKS: Record<string, Record<string, { slug: string; title: string }[]>> = {
  best: {
    fr: [{ slug: 'carte-crypto-top-10-2026',                      title: 'Top 10 cartes crypto en 2026' }],
    de: [{ slug: 'kryptokarte-mit-cashback-die-besten-angebote',  title: 'Beste Krypto-Karten: die besten Angebote' }],
    es: [{ slug: 'tarjeta-crypto-con-cashback-las-mejores-ofertas-en', title: 'Las mejores tarjetas crypto con cashback' }],
    it: [{ slug: 'carta-crypto-con-cashback-le-migliori-offerte-nel',  title: 'Le migliori carte crypto con cashback' }],
    en: [{ slug: 'crypto-card-with-cashback-the-best-offers-in',  title: 'Best crypto cards: the top offers' }],
  },
  cashback: {
    fr: [{ slug: 'carte-crypto-cashback-2026-classement',         title: 'Classement cartes crypto cashback 2026' }],
    de: [{ slug: 'cashback-vergleich-welche-kryptokarte-verdient-2025-am', title: 'Cashback-Vergleich: welche Krypto-Karte verdient am meisten?' }],
    es: [{ slug: 'comparativa-de-cashback-que-tarjeta-cripto-gana-mas-en', title: 'Comparativa cashback: ¿qué tarjeta cripto gana más?' }],
    it: [{ slug: 'confronto-cashback-quale-carta-crypto-guadagna-di-piu-nel', title: 'Confronto cashback: quale carta crypto guadagna di più?' }],
    en: [{ slug: 'cashback-comparison-which-crypto-card-earns-the-most-in', title: 'Cashback comparison: which crypto card earns the most?' }],
  },
  'no-fees': {
    fr: [{ slug: 'cartes-crypto-sans-frais',                      title: 'Les meilleures cartes crypto sans frais' }],
    de: [{ slug: 'kryptokarte-ohne-jahresgebuhren-unsere-auswahl', title: 'Krypto-Karte ohne Jahresgebühren: unsere Auswahl' }],
    es: [{ slug: 'tarjeta-crypto-sin-cuotas-anuales-nuestra-seleccion', title: 'Tarjeta crypto sin cuotas anuales: nuestra selección' }],
    it: [{ slug: 'carta-crypto-senza-commissioni-annuali-la-nostra-selezione', title: 'Carta crypto senza commissioni: la nostra selezione' }],
    en: [{ slug: 'the-best-zero-fee-crypto-cards-in-2025',        title: 'The best zero-fee crypto cards' }],
  },
  'no-staking': {
    fr: [{ slug: 'meilleure-carte-crypto-sans-staking-2026',      title: 'Meilleure carte crypto sans staking 2026' }],
    de: [{ slug: 'beste-krypto-karte-ohne-staking-2026',          title: 'Beste Krypto-Karte ohne Staking 2026' }],
    es: [{ slug: 'mejor-tarjeta-crypto-sin-staking-2026',         title: 'Mejor tarjeta crypto sin staking 2026' }],
    it: [{ slug: 'migliore-carta-crypto-senza-staking-2026',      title: 'Migliore carta crypto senza staking 2026' }],
    en: [{ slug: 'best-crypto-card-no-staking-2026',              title: 'Best crypto card without staking 2026' }],
  },
  france: {
    fr: [{ slug: 'carte-crypto-france-disponible',                title: 'Cartes crypto disponibles en France' }],
    de: [{ slug: 'die-besten-gebuhrenfreien-kryptokarten-2025',   title: 'Die besten Krypto-Karten in Deutschland' }],
    es: [{ slug: 'las-mejores-tarjetas-cripto-sin-comisiones-en', title: 'Las mejores tarjetas crypto en España' }],
    it: [{ slug: 'le-migliori-carte-crypto-senza-commissioni-nel', title: 'Le migliori carte crypto in Italia' }],
    en: [{ slug: 'best-crypto-card-in-france-in-2025-complete',   title: 'Best crypto cards available in Europe' }],
  },
  travel: {
    fr: [{ slug: 'carte-crypto-voyage-guide-complet',     title: 'Guide complet : payer en crypto à l\'étranger' }],
    de: [{ slug: 'krypto-karte-reise-kompletter-guide',   title: 'Krypto-Karte auf Reisen: der komplette Guide' }],
    es: [{ slug: 'tarjeta-crypto-viaje-guia-completa',    title: 'Guía completa: pagar con crypto en el extranjero' }],
    it: [{ slug: 'carta-crypto-viaggio-guida-completa',   title: 'Guida completa: pagare in crypto all\'estero' }],
    en: [{ slug: 'crypto-card-travel-complete-guide',     title: 'Complete guide: paying with crypto abroad' }],
  },
  rewards: {
    fr: [{ slug: 'carte-crypto-recompenses-avantages-guide', title: 'Cartes crypto : cashback, lounges, Netflix et Spotify' }],
    de: [{ slug: 'krypto-karte-praemien-vorteile-guide',     title: 'Krypto-Karten: Cashback, Lounges, Netflix & Spotify' }],
    es: [{ slug: 'tarjeta-crypto-recompensas-ventajas-guia', title: 'Tarjetas crypto: cashback, lounges, Netflix y Spotify' }],
    it: [{ slug: 'carta-crypto-premi-vantaggi-guida',        title: 'Carte crypto: cashback, lounge, Netflix e Spotify' }],
    en: [{ slug: 'crypto-card-rewards-benefits-guide',       title: 'Crypto cards: cashback, lounges, Netflix & Spotify' }],
  },
  virtual: {
    fr: [{ slug: 'carte-crypto-virtuelle-guide-complet',       title: 'Cartes crypto virtuelles : le guide complet 2025' }],
    de: [{ slug: 'virtuelle-krypto-karte-leitfaden',           title: 'Virtuelle Krypto-Karten: Der vollständige Leitfaden 2025' }],
    es: [{ slug: 'tarjeta-crypto-virtual-guia-completa',       title: 'Tarjetas crypto virtuales: guía completa 2025' }],
    it: [{ slug: 'carta-crypto-virtuale-guida-completa',       title: 'Carte crypto virtuali: la guida completa 2025' }],
    en: [{ slug: 'virtual-crypto-card-complete-guide',         title: 'Virtual Crypto Cards: The Complete Guide 2025' }],
  },
  beginner: {
    fr: [{ slug: 'cartes-crypto-guide-debutant',               title: 'Guide débutant : comment choisir sa première carte crypto' }],
    de: [{ slug: 'krypto-karten-leitfaden-einsteiger',         title: 'Einsteiger-Leitfaden: Wie wählt man seine erste Krypto-Karte?' }],
    es: [{ slug: 'tarjetas-crypto-guia-principiante',          title: 'Guía para principiantes: cómo elegir tu primera tarjeta crypto' }],
    it: [{ slug: 'carte-crypto-guida-principiante',            title: 'Guida per principianti: come scegliere la prima carta crypto' }],
    en: [{ slug: 'beginners-guide-crypto-cards',               title: 'Beginner\'s Guide to Crypto Cards: How to Choose Your First One' }],
  },
  'no-kyc': {
    fr: [{ slug: 'carte-crypto-sans-kyc-guide',                title: 'Cartes crypto sans KYC en 2025 : ce qu\'il faut savoir' }],
    de: [{ slug: 'krypto-karte-ohne-kyc-guide',                title: 'Krypto-Karten ohne KYC 2025: Was Sie wissen müssen' }],
    es: [{ slug: 'tarjeta-crypto-sin-kyc-guia',                title: 'Tarjetas crypto sin KYC en 2025: lo que debes saber' }],
    it: [{ slug: 'carta-cripto-senza-kyc-guida',               title: 'Carte crypto senza KYC nel 2025: quello che devi sapere' }],
    en: [{ slug: 'crypto-card-no-kyc-guide',                   title: 'Crypto Cards Without KYC in 2025: What You Need to Know' }],
  },
  '2026': {
    fr: [{ slug: 'meilleures-cartes-crypto-2026',              title: 'Meilleures cartes crypto en 2026 : le classement complet' }],
    de: [{ slug: 'beste-krypto-karten-2026',                   title: 'Beste Krypto-Karten 2026: Das vollständige Ranking' }],
    es: [{ slug: 'mejores-tarjetas-cripto-2026',               title: 'Mejores tarjetas crypto en 2026: el ranking completo' }],
    it: [{ slug: 'migliori-carte-cripto-2026',                 title: 'Migliori carte crypto nel 2026: il ranking completo' }],
    en: [{ slug: 'best-crypto-cards-2026',                     title: 'Best Crypto Cards in 2026: The Complete Ranking' }],
  },
};

const READ_MORE_TITLE: Record<string, string> = {
  fr: 'Lire aussi', de: 'Mehr lesen', es: 'Leer también', it: 'Leggi anche', en: 'Read more',
};

interface ThematicPageProps { theme: string; }

export default function ThematicPage({ theme }: ThematicPageProps) {
  const { lang = 'fr' } = useParams<{ lang: string }>();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from('cards')
      .select('id, name, issuer, cashback_base, cashback_premium, annual_fees, staking_required, virtual_only, card_network, markets, trust_score, real_card_image')
      .then(({ data, error }) => {
        if (error) console.error('ThematicPage error:', error);
        setCards(data || []);
        setLoading(false);
      });
  }, []);

  const config    = THEME_CONFIG[theme]?.[lang] || THEME_CONFIG[theme]?.['en'];
  const faqs      = THEME_FAQ[theme]?.[lang]    || THEME_FAQ[theme]?.['en'] || [];
  const filterFn  = THEME_FILTERS[theme] || (() => true);
  const sortFn    = THEME_SORT[theme]   || (() => 0);

  const filteredCards = useMemo(() => {
    const marketFilter = (c: any) => !Array.isArray(c.markets) || c.markets.includes(lang);
    const sorted = [...cards].filter(c => filterFn(c) && marketFilter(c)).sort(sortFn);
    const limit = THEME_LIMIT[theme];
    return limit ? sorted.slice(0, limit) : sorted;
  }, [cards, theme, lang]);

  const segment = LANG_TO_SEGMENT[lang] || 'cards';
  const brandsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
  const SEE_TIERS_LABEL: Record<string, string> = { fr: 'Voir toutes les cartes', de: 'Alle Karten', es: 'Ver tarjetas', it: 'Vedi carte', en: 'See all cards' };

  // ── SEO ───────────────────────────────────────────────────────────────────────
  useSeoMeta({
    title: config?.title || 'TopCryptoCards',
    description: config?.description || '',
    lang,
  });

  /* Hreflang */
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const langs = ['fr', 'de', 'es', 'it', 'en'];
    const slugs = THEMATIC_SLUGS[theme];
    if (!slugs) return;
    document.querySelectorAll('link[data-hreflang-thematic]').forEach(el => el.remove());
    langs.forEach(l => {
      const slug = slugs[l];
      if (!slug) return;
      const el = document.createElement('link');
      el.setAttribute('rel', 'alternate');
      el.setAttribute('hreflang', l);
      el.setAttribute('href', `${BASE}/${l}/${slug}`);
      el.setAttribute('data-hreflang-thematic', 'true');
      document.head.appendChild(el);
    });
    const xDefault = document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', `${BASE}/fr/${slugs['fr']}`);
    xDefault.setAttribute('data-hreflang-thematic', 'true');
    document.head.appendChild(xDefault);
    return () => { document.querySelectorAll('link[data-hreflang-thematic]').forEach(el => el.remove()); };
  }, [theme, lang]);

  /* Schema.org */
  useEffect(() => {
    if (!config) return;
    document.getElementById('schema-itemlist')?.remove();
    document.getElementById('schema-faqpage')?.remove();

    if (filteredCards.length > 0) {
      const el = document.createElement('script');
      el.id = 'schema-itemlist'; el.type = 'application/ld+json';
      el.textContent = JSON.stringify({
        '@context': 'https://schema.org', '@type': 'ItemList',
        name: config.h1, description: config.description, url: window.location.href,
        inLanguage: lang,
        numberOfItems: filteredCards.length,
        itemListElement: filteredCards.slice(0, 10).map((card: any, i: number) => ({
          '@type': 'ListItem', position: i + 1, name: card.name,
          url: `${window.location.origin}/${lang}/${segment}/${card.id}`,
        })),
      });
      document.head.appendChild(el);
    }

    if (faqs.length > 0) {
      const el = document.createElement('script');
      el.id = 'schema-faqpage'; el.type = 'application/ld+json';
      el.textContent = JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      });
      document.head.appendChild(el);
    }

    return () => {
      document.getElementById('schema-itemlist')?.remove();
      document.getElementById('schema-faqpage')?.remove();
    };
  }, [config, filteredCards, faqs, lang, segment]);

  if (!config) return null;

  const L = {
    free:              { fr:'Gratuit', de:'Kostenlos', es:'Gratis', it:'Gratuito', en:'Free' },
    updated:           { fr:'Mis à jour', de:'Aktualisiert', es:'Actualizado', it:'Aggiornato', en:'Updated' },
    cards:             { fr:'cartes', de:'Karten', es:'tarjetas', it:'carte', en:'cards' },
    faq:               { fr:'Questions fréquentes', de:'Häufige Fragen', es:'Preguntas frecuentes', it:'Domande frequenti', en:'Frequently Asked Questions' },
    crypto_guide_title:{ fr:'Guide des Cryptomonnaies', de:'Kryptowährungs-Guide', es:'Guía de Criptomonedas', it:'Guida alle Criptovalute', en:'Cryptocurrency Guide' },
    crypto_guide_desc: { fr:'Bitcoin, Ethereum, XRP… tout comprendre en 10 fiches', de:'Bitcoin, Ethereum, XRP… 10 Krypto-Guides', es:'Bitcoin, Ethereum, XRP… 10 guías completas', it:'Bitcoin, Ethereum, XRP… 10 guide complete', en:'Bitcoin, Ethereum, XRP… 10 in-depth guides' },
    no_stake:          { fr:'Sans staking', de:'Kein Staking', es:'Sin staking', it:'Senza staking', en:'No staking' },
    virtual:           { fr:'Virtuelle', de:'Virtuell', es:'Virtual', it:'Virtuale', en:'Virtual' },
    annual_suffix:     { fr:'€/an', de:'€/Jahr', es:'€/año', it:'€/anno', en:'€/year' },
  };
  const t = (key: keyof typeof L): string => (L[key] as Record<string, string>)[lang] || (L[key] as Record<string, string>)['en'] || '';

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Breadcrumb items={[
        { label: HOME_LABEL[lang] || 'Home', href: `/${lang}` },
        { label: config.h1 },
      ]} />
      <h1 className="text-3xl font-bold text-white mb-3 mt-4">{config.h1}</h1>
      <p className="text-slate-400 text-sm mb-4">
        {t('updated')}{' '}
        {new Date().toLocaleDateString(
          lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : lang === 'it' ? 'it-IT' : 'en-GB',
          { year: 'numeric', month: 'long' }
        )}
        {' · '}
        <span className="text-cyan-400">{loading ? '…' : filteredCards.length}</span>{' '}{t('cards')}
      </p>
      <div className="mb-8 max-w-3xl bg-cyan-500/5 border border-cyan-500/20 rounded-xl px-5 py-4">
        <p className="text-slate-300 leading-relaxed">{config.intro}</p>
      </div>

      {/* Card grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-surface p-4 rounded-xl h-48 animate-pulse bg-slate-800/50" />
          ))}
        </div>
      ) : filteredCards.length === 0 ? (
        <p className="text-slate-400 mb-10">{{ fr: 'Aucune carte trouvée pour ce critère.', de: 'Keine Karte für dieses Kriterium gefunden.', es: 'Ninguna tarjeta encontrada.', it: 'Nessuna carta trovata.', en: 'No cards found for this criterion.' }[lang] ?? 'No cards found.'}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredCards.map((card: any, idx: number) => (
            <div key={card.id} className="flex flex-col">
              <Link
                to={`/${lang}/${segment}/${card.id}`}
                className="card-surface p-4 rounded-xl hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 border border-transparent transition-all block relative flex-1 group/card"
              >
                {/* Top badges row */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 z-10">
                  {idx < 3 && (
                    <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full">
                      #{idx + 1}
                    </span>
                  )}
                  {idx >= 3 && <span />}
                  {card.trust_score != null && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      card.trust_score >= 8 ? 'bg-emerald-500/15 text-emerald-400' :
                      card.trust_score >= 6 ? 'bg-yellow-500/15 text-yellow-400' :
                                              'bg-red-500/15 text-red-400'
                    }`}>
                      ★ {card.trust_score.toFixed(1)}
                    </span>
                  )}
                </div>

                {card.real_card_image && (
                  <div style={{ borderRadius:'12px', overflow:'hidden', marginBottom:'12px', width:'100%', aspectRatio:'1.586' }}>
                    <img src={card.real_card_image} alt={card.name}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }}
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="text-white font-semibold text-base group-hover/card:text-cyan-400 transition-colors">{card.name}</h2>
                  {card.card_network && (
                    <span className="text-[10px] font-medium text-slate-500 shrink-0 mt-0.5 border border-slate-700 rounded px-1.5 py-0.5">
                      {card.card_network}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mb-3">{card.issuer}</p>

                <div className="flex flex-wrap gap-2 text-xs">
                  {(card.cashback_premium || card.cashback_base) ? (
                    <span className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-400 font-medium px-2 py-0.5 rounded-full">
                      💰 {card.cashback_premium || card.cashback_base}%
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                    {(card.annual_fees || 0) > 0 ? `${card.annual_fees} ${t('annual_suffix')}` : `🆓 ${t('free')}`}
                  </span>
                  {(card.staking_required || 0) === 0 && (
                    <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                      🔓 {t('no_stake')}
                    </span>
                  )}
                  {card.virtual_only && (
                    <span className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">
                      📱 {t('virtual')}
                    </span>
                  )}
                </div>
              </Link>
              {card.brand_id && (
                <Link
                  to={`/${lang}/${brandsSlug}/${card.brand_id}`}
                  className="mt-1.5 text-center text-xs text-slate-500 hover:text-cyan-accent transition-colors py-1"
                >
                  {SEE_TIERS_LABEL[lang] || 'See all tiers'} →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Editorial depth sections (THEME_SECTIONS) */}
      {(() => {
        const sections = THEME_SECTIONS[theme]?.[lang] ?? THEME_SECTIONS[theme]?.['en'];
        if (!sections || sections.length === 0) return null;

        // Related themes to cross-link inline at the bottom of sections
        const RELATED_THEMES: Partial<Record<string, string[]>> = {
          best: ['cashback', 'no-staking', 'no-fees'],
          cashback: ['best', 'no-staking', 'rewards'],
          'no-staking': ['no-fees', 'cashback', 'virtual'],
          travel: ['best', 'rewards', 'no-fees'],
          'no-fees': ['no-staking', 'cashback', 'beginner'],
          rewards: ['cashback', 'travel', 'best'],
          virtual: ['no-staking', 'no-fees', 'beginner'],
          beginner: ['no-fees', 'no-staking', 'virtual'],
          '2026': ['best', 'cashback', 'no-staking'],
        };
        const RELATED_PREFIX: Record<string, string> = {
          fr: 'À explorer aussi :',
          de: 'Auch interessant:',
          es: 'También te puede interesar:',
          it: 'Da esplorare anche:',
          en: 'Also worth exploring:',
        };

        const relatedThemes = RELATED_THEMES[theme] ?? [];
        const relatedLinks = relatedThemes
          .filter(t => t !== theme && THEMATIC_ROUTES[t]?.[lang as keyof (typeof THEMATIC_ROUTES)[string]])
          .slice(0, 3);

        return (
          <div className="max-w-3xl space-y-6 mb-10">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-lg font-semibold text-white mb-2">{s.h2}</h2>
                <p className="text-slate-400 leading-relaxed text-sm">
                  <AutoLinker text={s.p} lang={lang} />
                </p>
              </div>
            ))}
            {relatedLinks.length > 0 && (
              <p className="text-slate-500 text-sm leading-relaxed">
                {RELATED_PREFIX[lang] ?? RELATED_PREFIX.en}{' '}
                {relatedLinks.map((t, i) => {
                  const slug = THEMATIC_ROUTES[t]?.[lang as keyof (typeof THEMATIC_ROUTES)[string]];
                  const label = THEME_CONFIG[t]?.[lang]?.h1 ?? t;
                  return (
                    <span key={t}>
                      {i > 0 && ', '}
                      <Link to={`/${lang}/${slug}`} className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
                        {label}
                      </Link>
                    </span>
                  );
                })}
                {'.'}
              </p>
            )}
          </div>
        );
      })()}

      {/* Outro */}
      <div className="mb-10 max-w-3xl bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4 flex gap-3">
        <span className="text-cyan-500/60 text-xl shrink-0 mt-0.5">💡</span>
        <p className="text-slate-300 leading-relaxed italic">{config.outro}</p>
      </div>

      {/* Internal link: crypto guide hub */}
      <div className="mb-12">
        <Link
          to={`/${lang}/cryptos`}
          className="inline-flex items-center gap-3 px-5 py-4 rounded-xl bg-bg-card border border-bg-border hover:border-cyan-accent/40 transition-all group max-w-md"
        >
          <span className="text-2xl">₿</span>
          <div>
            <div className="font-semibold text-white group-hover:text-cyan-accent transition-colors text-sm">
              {t('crypto_guide_title')}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {t('crypto_guide_desc')}
            </div>
          </div>
          <span className="ml-auto text-cyan-accent/50 group-hover:text-cyan-accent transition-colors text-lg">→</span>
        </Link>
      </div>

      {/* Related themes */}
      {(RELATED_THEMES[theme] || []).length > 0 && (
        <div className="mb-12">
          <h2 className="text-base font-semibold text-slate-400 mb-3">
            {RELATED_TITLE[lang] || RELATED_TITLE['en']}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(RELATED_THEMES[theme] || []).map((t2) => {
              const slug = THEMATIC_SLUGS[t2]?.[lang];
              const label = THEME_LABEL[t2]?.[lang] || THEME_LABEL[t2]?.['en'];
              if (!slug || !label) return null;
              return (
                <Link
                  key={t2}
                  to={`/${lang}/${slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all"
                >
                  <span>{THEME_EMOJI[t2]}</span>
                  {label}
                </Link>
              );
            })}
            {/* Simulator + Compare + ReviewList */}
            {(() => {
              const rt = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS] ?? ROUTE_TRANSLATIONS.en;
              const SIMULATOR_LABEL: Record<string, string> = { fr: 'Simulateur de gains', de: 'Gewinn-Simulator', es: 'Simulador de ganancias', it: 'Simulatore di guadagni', en: 'Earnings simulator' };
              const COMPARE_LABEL: Record<string, string> = { fr: 'Comparer les cartes', de: 'Karten vergleichen', es: 'Comparar tarjetas', it: 'Confronta le carte', en: 'Compare cards' };
              const REVIEWS_LABEL: Record<string, string> = { fr: 'Tous les avis', de: 'Alle Bewertungen', es: 'Todas las reseñas', it: 'Tutte le recensioni', en: 'All reviews' };
              return (
                <>
                  <Link to={`/${lang}/${rt.simulator ?? 'simulator'}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all">
                    <span>🧮</span>{SIMULATOR_LABEL[lang] ?? SIMULATOR_LABEL.en}
                  </Link>
                  <Link to={`/${lang}/${rt.compare ?? 'compare'}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all">
                    <span>⚖️</span>{COMPARE_LABEL[lang] ?? COMPARE_LABEL.en}
                  </Link>
                  <Link to={`/${lang}/${rt.reviews ?? 'reviews'}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all">
                    <span>⭐</span>{REVIEWS_LABEL[lang] ?? REVIEWS_LABEL.en}
                  </Link>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Blog articles (Lire aussi) */}
      {(THEME_BLOG_LINKS[theme]?.[lang] || THEME_BLOG_LINKS[theme]?.['en'] || []).length > 0 && (
        <div className="mb-12">
          <h2 className="text-base font-semibold text-slate-400 mb-3">
            {READ_MORE_TITLE[lang] || READ_MORE_TITLE['en']}
          </h2>
          <div className="flex flex-col gap-2">
            {(THEME_BLOG_LINKS[theme]?.[lang] || THEME_BLOG_LINKS[theme]?.['en'] || []).map((article) => (
              <Link
                key={article.slug}
                to={`/${lang}/blog/${article.slug}`}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all"
              >
                <span className="text-cyan-accent/60">📄</span>
                {article.title}
                <span className="ml-auto text-cyan-accent/40 hover:text-cyan-accent transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">{t('faq')}</h2>
          <div className="space-y-3 max-w-3xl">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden">
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-white font-medium text-sm">{faq.q}</span>
                  <span className="text-cyan-400 text-lg shrink-0">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-slate-300 text-sm leading-relaxed border-t border-slate-700/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}