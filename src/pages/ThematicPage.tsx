import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';
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
    fr: { title:`Meilleure Carte Crypto ${YEAR} — Comparatif | TopCryptoCards`, h1:`Les Meilleures Cartes Crypto en ${YEAR}`, description:`Comparatif des meilleures cartes crypto en France ${YEAR} : cashback jusqu'à 8%, sans frais, sans staking. Crypto.com, Gnosis Pay, Nexo, MetaMask. Gratuit ✓`, intro:`Une carte crypto est une carte Visa ou Mastercard liée à un portefeuille numérique, permettant de dépenser des cryptomonnaies au quotidien et de recevoir des récompenses en crypto sur chaque achat. Cashback, frais annuels, staking requis, disponibilité en France, régulation : les critères sont nombreux et varient selon votre profil. Ce comparatif rassemble toutes les cartes crypto disponibles en ${YEAR}, classées par fiabilité et pertinence.`, outro:`Pour faire le bon choix, comparez les taux de cashback mais pensez aussi aux conditions : certaines cartes exigent un staking important pour débloquer les meilleurs avantages. Si vous débutez, préférez une carte sans staking et sans frais annuels. Si vous êtes déjà investi en crypto, les cartes premium peuvent offrir jusqu'à 8% de cashback.` },
    de: { title:`Beste Krypto-Karte ${YEAR} — Vergleich | TopCryptoCards`, h1:`Die besten Krypto-Karten ${YEAR}`, description:`+15 Krypto-Karten im Vergleich für Deutschland ${YEAR}: bis zu 8% Cashback, keine Jahresgebühr, kein Staking. Crypto.com, Gnosis Pay, MetaMask. Kostenlos ✓`, intro:`Eine Krypto-Karte ist eine Visa- oder Mastercard, die mit einer digitalen Wallet verbunden ist und es ermöglicht, Kryptowährungen im Alltag auszugeben und auf jeden Einkauf Krypto-Prämien zu erhalten. Cashback, Jahresgebühren, Staking-Anforderungen, Verfügbarkeit in Deutschland, Regulierung: die Kriterien sind zahlreich. Dieser Vergleich bringt alle in ${YEAR} verfügbaren Krypto-Karten zusammen, geordnet nach Vertrauenswürdigkeit.`, outro:`Vergleichen Sie Cashback-Sätze, aber berücksichtigen Sie auch die Bedingungen: Einige Karten erfordern erhebliches Staking, um die besten Vorteile freizuschalten. Wenn Sie Anfänger sind, bevorzugen Sie eine Karte ohne Staking und ohne Jahresgebühr.` },
    es: { title:`Mejor Tarjeta Crypto ${YEAR} — Comparativa | TopCryptoCards`, h1:`Las Mejores Tarjetas Crypto en ${YEAR}`, description:`Comparativa completa: +15 tarjetas crypto en España ${YEAR}. Hasta 8% cashback, sin cuota anual, sin staking. Crypto.com, Gnosis Pay, MetaMask. Gratis ✓`, intro:`Una tarjeta crypto es una Visa o Mastercard vinculada a un monedero digital, que permite gastar criptomonedas en el día a día y recibir recompensas en cripto en cada compra. Cashback, comisiones anuales, staking requerido, disponibilidad en España, regulación: los criterios son numerosos. Esta comparativa reúne todas las tarjetas crypto disponibles en ${YEAR}, clasificadas por fiabilidad.`, outro:`Para tomar la decisión correcta, compara las tasas de cashback pero también ten en cuenta las condiciones: algunas tarjetas exigen un staking importante para desbloquear los mejores beneficios. Si eres principiante, elige una tarjeta sin staking y sin cuota anual.` },
    it: { title:`Migliore Carta Crypto ${YEAR} — Confronto | TopCryptoCards`, h1:`Le Migliori Carte Crypto nel ${YEAR}`, description:`+15 carte crypto per l'Italia ${YEAR}: fino all'8% cashback, senza quota annua, senza staking. Crypto.com, Gnosis Pay, MetaMask Card. Confronto gratuito ✓`, intro:`Una carta crypto è una Visa o Mastercard collegata a un portafoglio digitale, che permette di spendere criptovalute nella vita quotidiana e ricevere premi in crypto su ogni acquisto. Cashback, costi annuali, staking richiesto, disponibilità in Italia, regolamentazione: i criteri sono numerosi. Questo confronto raccoglie tutte le carte crypto disponibili nel ${YEAR}, classificate per affidabilità.`, outro:`Per fare la scelta giusta, confronta i tassi di cashback ma considera anche le condizioni: alcune carte richiedono uno staking importante per sbloccare i migliori vantaggi. Se sei un principiante, preferisci una carta senza staking e senza costi annuali.` },
    en: { title:`Best Crypto Card ${YEAR} — Full Comparison | TopCryptoCards`, h1:`The Best Crypto Cards in ${YEAR}`, description:`Compare +15 crypto cards in Europe ${YEAR}: up to 8% cashback, no annual fees, no staking required. Crypto.com, Gnosis Pay, MetaMask Card. Free comparison ✓`, intro:`A crypto card is a Visa or Mastercard linked to a digital wallet, enabling you to spend cryptocurrency in everyday life and earn crypto rewards on every purchase. Cashback rates, annual fees, staking requirements, availability, and regulation all vary significantly. This comparison covers all crypto cards available in ${YEAR}, ranked by reliability and value.`, outro:`To make the right choice, compare cashback rates but also consider the conditions: some cards require significant staking to unlock the best benefits. If you're a beginner, opt for a card with no staking and no annual fee.` },
  },
  cashback: {
    fr: { title:`Carte Crypto Cashback ${YEAR} — Jusqu'à 8% | TopCryptoCards`, h1:`Cartes Crypto avec le Meilleur Cashback`, description:`Cartes crypto cashback ${YEAR} : de 1% à 8% de récompenses. Crypto.com, Gnosis Pay, Nexo, Brighty comparés. Trouvez la plus rentable pour votre profil. Gratuit ✓`, intro:`Le cashback est l'avantage principal des cartes crypto : chaque achat vous rapporte des cryptomonnaies. Mais les taux varient considérablement, de 0.5% à 8% selon les cartes et les conditions. Ce classement compare les cartes crypto avec le meilleur cashback disponibles en ${YEAR}.`, outro:`Attention aux conditions : un taux de 8% peut nécessiter de bloquer 400 000 CRO en staking. Calculez le retour sur investissement réel avant de vous engager. Pour la plupart des utilisateurs, un cashback de 1 à 3% sans staking est plus rentable à long terme.` },
    de: { title:`Krypto Karte Cashback ${YEAR} — Bis 8% | TopCryptoCards`, h1:`Krypto-Karten mit dem besten Cashback`, description:`Beste Krypto-Karten für Cashback ${YEAR}: von 1% bis 8% Belohnungen. Crypto.com, Gnosis Pay, Nexo, Brighty verglichen. Finden Sie die profitabelste Option ✓`, intro:`Cashback ist der Hauptvorteil von Krypto-Karten: Jeder Kauf bringt Ihnen Kryptowährungen ein. Die Sätze variieren jedoch erheblich, von 0,5% bis 8%. Dieses Ranking vergleicht Krypto-Karten mit dem besten Cashback in ${YEAR}.`, outro:`Achten Sie auf die Bedingungen: Ein Satz von 8% kann erhebliches Staking erfordern. Berechnen Sie den tatsächlichen ROI, bevor Sie sich verpflichten. Für die meisten Nutzer ist ein Cashback von 1-3% ohne Staking langfristig rentabler.` },
    es: { title:`Tarjeta Crypto Cashback ${YEAR} — Hasta 8% | TopCryptoCards`, h1:`Tarjetas Crypto con el Mejor Cashback`, description:`Las mejores tarjetas crypto cashback en España ${YEAR}: del 1% al 8% de recompensas. Crypto.com, Gnosis Pay, Nexo, Brighty comparados. Encuentra la más rentable ✓`, intro:`El cashback es la principal ventaja de las tarjetas crypto: cada compra te genera criptomonedas. Pero las tasas varían considerablemente, del 0,5% al 8%. Esta clasificación compara las tarjetas crypto con el mejor cashback disponibles en ${YEAR}.`, outro:`Atención a las condiciones: una tasa del 8% puede requerir bloquear miles de euros en staking. Calcula el ROI real antes de comprometerte. Para la mayoría, un cashback del 1-3% sin staking es más rentable a largo plazo.` },
    it: { title:`Carta Crypto Cashback ${YEAR} — Fino all'8% | TopCryptoCards`, h1:`Carte Crypto con il Miglior Cashback`, description:`Migliori carte crypto cashback in Italia ${YEAR}: dall'1% all'8% di ricompense. Crypto.com, Gnosis Pay, Nexo, Brighty confrontati. Trova la più redditizia ✓`, intro:`Il cashback è il principale vantaggio delle carte crypto: ogni acquisto ti fa guadagnare criptovalute. Ma i tassi variano notevolmente, dallo 0,5% all'8%. Questa classifica confronta le carte crypto con il miglior cashback disponibili nel ${YEAR}.`, outro:`Attenzione alle condizioni: un tasso dell'8% può richiedere di bloccare migliaia di euro in staking. Calcola il ROI reale prima di impegnarti. Per la maggior parte degli utenti, un cashback dell'1-3% senza staking è più redditizio a lungo termine.` },
    en: { title:`Crypto Card Cashback ${YEAR} — Up to 8% | TopCryptoCards`, h1:`Crypto Cards with the Best Cashback`, description:`Best crypto cards for cashback in Europe ${YEAR}: from 1% to 8% rewards. Crypto.com, Gnosis Pay, Nexo, Brighty compared. Find the most profitable option ✓`, intro:`Cashback is the main advantage of crypto cards: every purchase earns you cryptocurrency. But rates vary significantly, from 0.5% to 8%. This ranking compares the best cashback crypto cards available in ${YEAR}.`, outro:`Watch out for conditions: an 8% rate may require staking thousands of euros. Calculate the real ROI before committing. For most users, a 1-3% cashback with no staking is more profitable in the long run.` },
  },
  'no-fees': {
    fr: { title:`Carte Crypto Sans Frais ${YEAR} — Cashback | TopCryptoCards`, h1:`Cartes Crypto Sans Frais Annuels en ${YEAR}`, description:`Meilleures cartes crypto gratuites ${YEAR} : 0€/an, cashback sans abonnement ni staking. MetaMask Card, Gnosis Pay, Brighty comparées. Comparatif gratuit ✓`, intro:`Une carte crypto sans frais annuels est une carte Visa ou Mastercard à 0€/an offrant du cashback en cryptomonnaies sans abonnement ni staking obligatoire. Pourquoi payer un abonnement annuel pour une carte crypto quand des alternatives gratuites offrent d'excellents taux de cashback ? Ce comparatif liste toutes les cartes crypto sans frais annuels disponibles en ${YEAR}, classées par cashback décroissant.`, outro:`Une carte gratuite n'est pas synonyme de carte moins bonne. MetaMask Card, Gnosis Pay ou Brighty offrent de vrais avantages sans aucun abonnement. Comparez les plafonds de retrait et les cryptos acceptées pour choisir la meilleure option gratuite.` },
    de: { title:`Kostenlose Krypto Karte ${YEAR} — Gratis | TopCryptoCards`, h1:`Krypto-Karten ohne Jahresgebühr`, description:`Beste kostenlose Krypto-Karten ${YEAR}: 0€/Jahr, Cashback ohne Staking. MetaMask Card, Gnosis Pay, Brighty verglichen. Kein Abo, keine Bindung. Kostenlos ✓`, intro:`Eine kostenlose Krypto-Karte ist eine Visa- oder Mastercard mit 0€/Jahr, die Krypto-Cashback ohne Jahresgebühr und ohne Staking-Pflicht bietet. Warum eine Jahresgebühr für eine Krypto-Karte zahlen, wenn kostenlose Alternativen hervorragende Cashback-Raten bieten? Dieser Vergleich listet alle kostenlosen Krypto-Karten in ${YEAR}.`, outro:`Eine kostenlose Karte bedeutet nicht schlechtere Qualität. Vergleichen Sie Abhebungslimits und unterstützte Kryptowährungen, um die beste kostenlose Option zu finden.` },
    es: { title:`Tarjeta Crypto Sin Cuota ${YEAR} — Cashback | TopCryptoCards`, h1:`Tarjetas Crypto Sin Cuota Anual`, description:`Mejores tarjetas crypto gratuitas en España ${YEAR}: 0€/año, cashback sin staking. MetaMask Card, Gnosis Pay, Brighty comparadas. Sin suscripción. Gratis ✓`, intro:`Una tarjeta crypto sin cuota anual es una Visa o Mastercard a 0€/año que ofrece cashback en criptomonedas sin suscripción ni staking obligatorio. ¿Por qué pagar una cuota anual por una tarjeta crypto cuando hay alternativas gratuitas con excelentes tasas de cashback? Esta comparativa lista todas las tarjetas crypto sin comisiones anuales disponibles en ${YEAR}.`, outro:`Una tarjeta gratuita no significa una tarjeta inferior. Compara los límites de retirada y las criptomonedas aceptadas para encontrar la mejor opción gratuita.` },
    it: { title:`Carta Crypto Senza Costi ${YEAR} — Cashback | TopCryptoCards`, h1:`Carte Crypto Senza Costi Annuali`, description:`Migliori carte crypto gratuite in Italia ${YEAR}: 0€/anno, cashback senza staking. MetaMask Card, Gnosis Pay, Brighty confrontate. Senza abbonamento. Gratuito ✓`, intro:`Una carta crypto senza costi annuali è una Visa o Mastercard a 0€/anno che offre cashback in criptovalute senza abbonamento né staking obbligatorio. Perché pagare un abbonamento annuale per una carta crypto quando esistono alternative gratuite con ottimi tassi di cashback? Questo confronto elenca tutte le carte crypto senza costi annuali disponibili nel ${YEAR}.`, outro:`Una carta gratuita non significa qualità inferiore. Confronta i limiti di prelievo e le criptovalute accettate per trovare la migliore opzione gratuita.` },
    en: { title:`Free Crypto Card ${YEAR} — No Fees + Cashback | TopCryptoCards`, h1:`Crypto Cards with No Annual Fees`, description:`Best free crypto cards in Europe ${YEAR}: €0/year, cashback with no staking. MetaMask Card, Gnosis Pay, Brighty compared. No subscription, no commitment. Free ✓`, intro:`A no-fee crypto card is a Visa or Mastercard with a €0/year subscription that offers crypto cashback with no annual fee and no staking requirement. Why pay an annual fee for a crypto card when free alternatives offer excellent cashback rates? This comparison lists all no-fee crypto cards available in ${YEAR}, ranked by cashback rate.`, outro:`A free card doesn't mean a worse card. Compare withdrawal limits and supported cryptocurrencies to find the best free option for your needs.` },
  },
  'no-staking': {
    fr: { title:`Carte Crypto Sans Staking ${YEAR} — Cashback | TopCryptoCards`, h1:`Cartes Crypto Sans Staking Requis`, description:`Cartes crypto avec cashback sans staking en ${YEAR} : votre capital reste libre. Gnosis Pay, MetaMask Card, Brighty. Sans frais annuels. Comparatif gratuit ✓`, intro:`Le staking obligatoire est la principale contrainte des cartes crypto premium : il faut immobiliser des milliers d'euros en cryptomonnaies pour débloquer le cashback. Ces cartes offrent un cashback sans aucune obligation de staking.`, outro:`Sans staking, votre capital reste libre. C'est particulièrement avantageux dans un marché volatil : vous n'êtes pas exposé au risque de dépréciation de la crypto stakée. MetaMask Card et Gnosis Pay sont les leaders de cette catégorie.` },
    de: { title:`Krypto Karte Ohne Staking ${YEAR} — Cashback | TopCryptoCards`, h1:`Krypto-Karten Ohne Staking-Pflicht`, description:`Krypto-Karten mit Cashback ohne Staking ${YEAR}: Kapital bleibt frei. Gnosis Pay, MetaMask Card, Brighty — keine Jahresgebühr. Kostenloser Vergleich ✓`, intro:`Pflicht-Staking ist die Haupteinschränkung bei Premium-Krypto-Karten. Diese Karten bieten Cashback ohne jede Staking-Verpflichtung, sodass Ihr Kapital frei bleibt.`, outro:`Ohne Staking bleibt Ihr Kapital frei. Dies ist besonders vorteilhaft auf volatilen Märkten: Sie sind nicht dem Risiko der Abwertung der gestakten Kryptowährung ausgesetzt.` },
    es: { title:`Tarjeta Crypto Sin Staking ${YEAR} — Cashback | TopCryptoCards`, h1:`Tarjetas Crypto Sin Staking Requerido`, description:`Tarjetas crypto con cashback y sin staking en España ${YEAR}: tu capital siempre libre. Gnosis Pay, MetaMask Card, Brighty. Sin cuota anual. Comparativa gratuita ✓`, intro:`El staking obligatorio es la principal restricción de las tarjetas crypto premium. Estas tarjetas ofrecen cashback sin ninguna obligación de staking, manteniendo tu capital libre.`, outro:`Sin staking, tu capital permanece libre. Es especialmente ventajoso en un mercado volátil: no estás expuesto al riesgo de depreciación de la cripto en staking.` },
    it: { title:`Carta Crypto Senza Staking ${YEAR} — Cashback | TopCryptoCards`, h1:`Carte Crypto Senza Staking Richiesto`, description:`Carte crypto con cashback senza staking in Italia ${YEAR}: capitale sempre libero. Gnosis Pay, MetaMask Card, Brighty. Senza quota annua. Confronto gratuito ✓`, intro:`Lo staking obbligatorio è il principale limite delle carte crypto premium. Queste carte offrono cashback senza alcun obbligo di staking, mantenendo il tuo capitale libero.`, outro:`Senza staking, il tuo capitale rimane libero. È particolarmente vantaggioso in un mercato volatile: non sei esposto al rischio di svalutazione della cripto in staking.` },
    en: { title:`Crypto Card No Staking ${YEAR} — No Lock-up | TopCryptoCards`, h1:`Crypto Cards Without Staking Requirements`, description:`Crypto cards with cashback and no staking required in ${YEAR}. Keep your capital free. Gnosis Pay, MetaMask Card, Brighty — no annual fees. Free comparison ✓`, intro:`Mandatory staking is the main drawback of premium crypto cards. These cards offer cashback with no staking obligation — your funds stay free and accessible at all times.`, outro:`Without staking, your capital stays free. This is especially advantageous in a volatile market: you're not exposed to the depreciation risk of a staked token. MetaMask Card and Gnosis Pay lead this category.` },
  },
  france: {
    fr: { title:`Carte Crypto France ${YEAR} — Comparatif | TopCryptoCards`, h1:`Cartes Crypto Disponibles en France`, description:`Les meilleures cartes crypto disponibles et légales en France en ${YEAR}. Régulation AMF/ACPR vérifiée. Crypto.com, Gnosis Pay, MetaMask Card comparées. Comparatif gratuit ✓`, intro:`Les cartes crypto disponibles en France sont des cartes Visa ou Mastercard émises par des acteurs régulés (PSAN/AMF ou conformes MiCA), utilisables par les résidents français pour dépenser leurs cryptomonnaies au quotidien. Toutes les cartes crypto ne sont pas disponibles en France. Entre les restrictions géographiques, les exigences KYC et les questions de régulation, le choix se réduit. Ce comparatif liste uniquement les cartes accessibles aux résidents français en ${YEAR}.`, outro:`En France, privilégiez les cartes émises par des entités régulées PSAN (Prestataire de Services sur Actifs Numériques) enregistrées auprès de l'AMF. Cela garantit un niveau de protection de vos fonds en cas de faillite de l'émetteur.` },
    de: { title:`Krypto Karte Deutschland ${YEAR} — Vergleich | TopCryptoCards`, h1:`Krypto-Karten Verfügbar in Deutschland`, description:`Die besten in Deutschland verfügbaren Krypto-Karten ${YEAR}: bis zu 8% Cashback, keine Jahresgebühr. BaFin-Regulierung geprüft. Crypto.com, Gnosis Pay, MetaMask Card. Kostenlos ✓`, intro:`Für Deutschland zugelassene Krypto-Karten sind Visa- oder Mastercard-Karten von regulierten Anbietern (BaFin oder MiCA-konform), die deutschen Einwohnern ermöglichen, ihre Kryptowährungen täglich zu verwenden. Nicht alle Krypto-Karten sind in Deutschland verfügbar. Dieser Vergleich listet nur die für deutsche Einwohner zugänglichen Karten in ${YEAR}, geordnet nach Vertrauenswürdigkeit.`, outro:`In Deutschland bevorzugen Sie Karten von BaFin-regulierten Unternehmen. Dies gewährleistet ein Mindestmaß an Schutz im Falle einer Insolvenz des Emittenten.` },
    es: { title:`Tarjeta Crypto España ${YEAR} — Comparativa | TopCryptoCards`, h1:`Tarjetas Crypto Disponibles en España`, description:`Las mejores tarjetas crypto disponibles en España en ${YEAR}: hasta 8% cashback, sin cuota. Regulación CNMV verificada. Crypto.com, Gnosis Pay, MetaMask Card comparadas. Gratis ✓`, intro:`Las tarjetas crypto disponibles en España son tarjetas Visa o Mastercard emitidas por entidades reguladas (CNMV o conformes con MiCA), utilizables por los residentes españoles para gastar sus criptomonedas en el día a día. No todas las tarjetas crypto están disponibles en España. Esta comparativa lista únicamente las accesibles para residentes españoles en ${YEAR}.`, outro:`En España, elige tarjetas de entidades registradas ante la CNMV o el Banco de España. Esto garantiza un nivel mínimo de protección de tus fondos.` },
    it: { title:`Carta Crypto Italia ${YEAR} — Confronto | TopCryptoCards`, h1:`Carte Crypto Disponibili in Italia`, description:`Le migliori carte crypto disponibili in Italia nel ${YEAR}: fino all'8% cashback, senza costi. Regolamentazione OAM verificata. Crypto.com, Gnosis Pay, MetaMask Card. Gratuito ✓`, intro:`Le carte crypto disponibili in Italia sono carte Visa o Mastercard emesse da soggetti regolamentati (OAM o conformi a MiCA), utilizzabili dai residenti italiani per spendere le proprie criptovalute quotidianamente. Non tutte le carte crypto sono disponibili in Italia. Questo confronto elenca solo quelle accessibili ai residenti italiani nel ${YEAR}.`, outro:`In Italia, preferisci carte emesse da entità registrate presso l'OAM (Organismo Agenti e Mediatori). Questo garantisce un livello minimo di protezione dei tuoi fondi.` },
    en: { title:`Crypto Card Europe ${YEAR} — Available | TopCryptoCards`, h1:`Crypto Cards Available in Europe`, description:`The best crypto cards available in Europe in ${YEAR}: up to 8% cashback, no annual fee. FCA/MiCA regulated options included. Crypto.com, Gnosis Pay, MetaMask Card. Free ✓`, intro:`Crypto cards available in Europe are Visa or Mastercard payment cards issued by regulated entities (MiCA-compliant or nationally licensed), enabling European residents to spend their cryptocurrency in everyday life. Not all crypto cards are available across Europe. This comparison lists only cards accessible to European residents in ${YEAR}, with regulatory status verified.`, outro:`In Europe, prioritize cards from MiCA-compliant or FCA/BaFin-regulated entities. This ensures a minimum level of fund protection in the event of issuer insolvency.` },
  },
  virtual: {
    fr: { title:`Carte Crypto Virtuelle ${YEAR} — Paiements | TopCryptoCards`, h1:`Cartes Crypto Virtuelles en ${YEAR}`, description:`Les meilleures cartes crypto virtuelles pour payer en ligne en ${YEAR} : activées immédiatement, compatibles Apple Pay et Google Pay. MetaMask Card, Gnosis Pay, Brighty. Gratuit ✓`, intro:`Une carte crypto virtuelle est une carte Visa ou Mastercard dématérialisée, disponible immédiatement après la validation KYC, compatible Apple Pay et Google Pay pour payer en ligne et en sans contact sans attendre une carte physique. Les cartes crypto virtuelles sont idéales pour les achats en ligne et les paiements contactless via smartphone. Elles sont souvent disponibles immédiatement après inscription, sans attendre une carte physique.`, outro:`La carte virtuelle est souvent le moyen le plus rapide de commencer à dépenser ses cryptos. Disponible en quelques minutes après la validation KYC, elle se connecte directement à Apple Pay ou Google Pay pour des paiements instantanés.` },
    de: { title:`Virtuelle Krypto Karte ${YEAR} — Online | TopCryptoCards`, h1:`Virtuelle Krypto-Karten ${YEAR}`, description:`Die besten virtuellen Krypto-Karten für Online-Zahlungen ${YEAR}: sofort aktiviert, Apple Pay und Google Pay kompatibel. MetaMask Card, Gnosis Pay, Brighty. Kostenlos ✓`, intro:`Eine virtuelle Krypto-Karte ist eine digitale Visa- oder Mastercard, die sofort nach der KYC-Validierung verfügbar ist und mit Apple Pay und Google Pay kompatibel ist — ohne auf eine physische Karte warten zu müssen. Virtuelle Krypto-Karten sind ideal für Online-Einkäufe und kontaktlose Zahlungen per Smartphone. Sie sind oft sofort nach der Registrierung verfügbar.`, outro:`Die virtuelle Karte ist oft der schnellste Weg, Kryptowährungen auszugeben. Verfügbar in wenigen Minuten nach der KYC-Validierung, verbindet sie sich direkt mit Apple Pay oder Google Pay.` },
    es: { title:`Tarjeta Crypto Virtual ${YEAR} — Pagos Online | TopCryptoCards`, h1:`Tarjetas Crypto Virtuales en ${YEAR}`, description:`Las mejores tarjetas crypto virtuales para pagos online en ${YEAR}: activadas de inmediato, compatibles Apple Pay y Google Pay. MetaMask Card, Gnosis Pay, Brighty. Gratis ✓`, intro:`Una tarjeta crypto virtual es una Visa o Mastercard digital, disponible inmediatamente tras la validación KYC, compatible con Apple Pay y Google Pay para pagar online y sin contacto sin esperar una tarjeta física. Las tarjetas crypto virtuales son ideales para compras online y pagos contactless mediante smartphone. Suelen estar disponibles inmediatamente tras el registro, sin necesidad de esperar una tarjeta física.`, outro:`La tarjeta virtual es a menudo la forma más rápida de empezar a gastar criptos. Disponible en minutos tras la validación KYC, se conecta directamente a Apple Pay o Google Pay para pagos instantáneos.` },
    it: { title:`Carta Crypto Virtuale ${YEAR} — Pagamenti | TopCryptoCards`, h1:`Carte Crypto Virtuali nel ${YEAR}`, description:`Le migliori carte crypto virtuali per pagamenti online nel ${YEAR}: attivate immediatamente, compatibili Apple Pay e Google Pay. MetaMask Card, Gnosis Pay, Brighty. Gratuito ✓`, intro:`Una carta crypto virtuale è una Visa o Mastercard digitale, disponibile immediatamente dopo la validazione KYC, compatibile con Apple Pay e Google Pay per pagare online e in contactless senza aspettare una carta fisica. Le carte crypto virtuali sono ideali per gli acquisti online e i pagamenti contactless. Spesso sono disponibili immediatamente dopo la registrazione.`, outro:`La carta virtuale è spesso il modo più rapido per iniziare a spendere crypto. Disponibile in pochi minuti dopo la validazione KYC, si collega direttamente ad Apple Pay o Google Pay.` },
    en: { title:`Virtual Crypto Card ${YEAR} — Online Payments | TopCryptoCards`, h1:`Virtual Crypto Cards in ${YEAR}`, description:`The best virtual crypto cards for online payments in ${YEAR}: instantly activated, Apple Pay and Google Pay compatible. MetaMask Card, Gnosis Pay, Brighty. Free ✓`, intro:`A virtual crypto card is a digital Visa or Mastercard, available immediately after KYC approval, compatible with Apple Pay and Google Pay for online and contactless payments — no physical card required. Virtual crypto cards are ideal for online shopping and contactless payments via smartphone. They are usually available immediately after registration — no waiting for a physical card.`, outro:`A virtual card is often the fastest way to start spending crypto. Available within minutes of KYC approval, it connects directly to Apple Pay or Google Pay for instant payments anywhere.` },
  },
  beginner: {
    fr: { title:`Carte Crypto Débutant ${YEAR} — Sans Risque | TopCryptoCards`, h1:`Meilleures Cartes Crypto pour Débutants`, description:`Meilleures cartes crypto pour débutants ${YEAR} : sans staking, sans frais, cashback immédiat. MetaMask Card, Gnosis Pay, Brighty — simples et accessibles. Gratuit ✓`, intro:`Une carte crypto pour débutants est une carte Visa ou Mastercard sans staking requis, sans frais annuels et avec une inscription rapide, conçue pour commencer à dépenser des cryptomonnaies sans connaissances techniques. Ces cartes ont été sélectionnées pour leur simplicité : aucun staking requis, aucun frais annuel, une interface accessible et un cashback immédiat dès le premier achat.`, outro:`Pour un débutant, le critère le plus important est la simplicité d'utilisation. Commencez par une carte sans staking et sans frais. Une fois que vous êtes à l'aise, vous pourrez explorer les cartes premium avec des taux de cashback plus élevés.` },
    de: { title:`Krypto Karte Einsteiger ${YEAR} — Einfach | TopCryptoCards`, h1:`Beste Krypto-Karten für Einsteiger`, description:`Beste Einstiegskarten für Krypto-Anfänger ${YEAR}: kein Staking, keine Gebühren, sofortiges Cashback. MetaMask Card, Gnosis Pay, Brighty — einfach & sicher. Kostenlos ✓`, intro:`Eine Krypto-Einsteigerkarte ist eine Visa- oder Mastercard ohne Staking-Anforderungen, ohne Jahresgebühr und mit schneller Anmeldung — ideal für den Einstieg in Kryptowährungen ohne technische Vorkenntnisse. Diese Karten wurden für ihre Einfachheit ausgewählt: kein Staking erforderlich, keine Jahresgebühr, sofortiges Cashback ab dem ersten Kauf.`, outro:`Für Einsteiger ist Benutzerfreundlichkeit das wichtigste Kriterium. Beginnen Sie mit einer Karte ohne Staking und ohne Gebühren.` },
    es: { title:`Tarjeta Crypto Principiante ${YEAR} — Guía | TopCryptoCards`, h1:`Mejores Tarjetas Crypto para Principiantes`, description:`Mejores tarjetas crypto para principiantes ${YEAR}: sin staking, sin cuota, cashback inmediato. MetaMask Card, Gnosis Pay, Brighty — simples y seguras. Gratis ✓`, intro:`Una tarjeta crypto para principiantes es una Visa o Mastercard sin staking requerido, sin cuota anual y con registro rápido, diseñada para empezar a gastar criptomonedas sin conocimientos técnicos. Estas tarjetas han sido seleccionadas por su simplicidad: sin staking requerido, sin cuota anual, cashback inmediato desde la primera compra.`, outro:`Para un principiante, el criterio más importante es la facilidad de uso. Empieza con una tarjeta sin staking y sin comisiones.` },
    it: { title:`Carta Crypto Principiante ${YEAR} — Guida | TopCryptoCards`, h1:`Migliori Carte Crypto per Principianti`, description:`Migliori carte crypto per principianti ${YEAR}: senza staking, senza costi, cashback immediato. MetaMask Card, Gnosis Pay, Brighty — semplici e sicure. Gratuito ✓`, intro:`Una carta crypto per principianti è una Visa o Mastercard senza staking richiesto, senza costi annuali e con registrazione rapida, pensata per iniziare a spendere criptovalute senza competenze tecniche. Queste carte sono state selezionate per la loro semplicità: nessuno staking richiesto, nessun costo annuale, cashback immediato dal primo acquisto.`, outro:`Per un principiante, il criterio più importante è la facilità d'uso. Inizia con una carta senza staking e senza costi.` },
    en: { title:`Beginner Crypto Card ${YEAR} — Risk-Free | TopCryptoCards`, h1:`Best Crypto Cards for Beginners`, description:`Best crypto cards for beginners in ${YEAR}: no staking, no fees, instant cashback. MetaMask Card, Gnosis Pay, Brighty — simple and secure. Free comparison ✓`, intro:`A beginner crypto card is a Visa or Mastercard with no staking requirement, no annual fee, and a fast sign-up process — designed for spending cryptocurrency without any technical knowledge. These cards were selected for their simplicity: no staking required, no annual fee, and instant cashback from your very first purchase.`, outro:`For a beginner, ease of use is the most important criterion. Start with a card that has no staking and no fees. Once you're comfortable, you can explore premium cards with higher cashback rates.` },
  },
  'no-kyc': {
    fr: { title:`Carte Crypto Sans KYC ${YEAR} — KYC Simplifié | TopCryptoCards`, h1:`Cartes Crypto Sans KYC ou KYC Simplifié`, description:`Cartes crypto à inscription simplifiée en ${YEAR}. Gnosis Pay et MetaMask Card — self-custody, sans compte custodial. Payer en crypto sans intermédiaire. Gratuit ✓`, intro:`La plupart des cartes crypto exigent un KYC complet : pièce d'identité, justificatif de domicile, selfie. Mais certaines solutions proposent une inscription simplifiée, notamment les cartes basées sur le self-custody et les wallets Web3 comme MetaMask Card ou Gnosis Pay. Ces cartes fonctionnent directement depuis votre wallet, réduisant les étapes de vérification.`, outro:`Important : aucune carte crypto réglementée en Europe ne permet une utilisation 100% anonyme. Les réglementations MiCA et AML imposent un niveau minimal de vérification. Pour une utilisation légale et sécurisée, choisissez des cartes conformes aux réglementations de votre pays.` },
    de: { title:`Krypto Karte Ohne KYC ${YEAR} — Einfach | TopCryptoCards`, h1:`Krypto-Karten ohne vollständiges KYC`, description:`Krypto-Karten mit vereinfachter Registrierung ${YEAR}: Gnosis Pay und MetaMask Card — Self-Custody, kein Depot-Konto. Krypto zahlen ohne Intermediär. Kostenlos ✓`, intro:`Die meisten Krypto-Karten erfordern ein vollständiges KYC: Ausweis, Adressnachweis, Selfie. Einige Lösungen bieten jedoch eine vereinfachte Anmeldung an, insbesondere Self-Custody- und Web3-Wallet-basierte Karten wie MetaMask Card oder Gnosis Pay, die direkt von Ihrem Wallet aus funktionieren.`, outro:`Wichtig: Keine regulierte Krypto-Karte in Europa erlaubt eine vollständig anonyme Nutzung. MiCA- und AML-Vorschriften erfordern ein Mindestmaß an Verifizierung. Wählen Sie stets Karten, die den lokalen Vorschriften entsprechen.` },
    es: { title:`Tarjeta Crypto Sin KYC ${YEAR} — Registro | TopCryptoCards`, h1:`Tarjetas Crypto Sin KYC Completo`, description:`Tarjetas crypto con registro simplificado en ${YEAR}: Gnosis Pay y MetaMask Card — self-custody, sin cuenta custodial. Paga en crypto sin intermediario. Gratis ✓`, intro:`La mayoría de las tarjetas crypto exigen un KYC completo: DNI, justificante de domicilio, selfie. Pero algunas soluciones ofrecen un registro simplificado, especialmente las tarjetas basadas en self-custody y wallets Web3 como MetaMask Card o Gnosis Pay, que funcionan directamente desde tu wallet.`, outro:`Importante: ninguna tarjeta crypto regulada en Europa permite un uso 100% anónimo. Las regulaciones MiCA y AML exigen un nivel mínimo de verificación. Elige tarjetas conformes con las regulaciones locales para un uso legal y seguro.` },
    it: { title:`Carta Crypto Senza KYC ${YEAR} — Registrazione | TopCryptoCards`, h1:`Carte Crypto Senza KYC Completo`, description:`Carte crypto con registrazione semplificata nel ${YEAR}: Gnosis Pay e MetaMask Card — self-custody, senza conto custodiale. Paga in crypto senza intermediari. Gratuito ✓`, intro:`La maggior parte delle carte crypto richiede un KYC completo: documento d'identità, prova di residenza, selfie. Ma alcune soluzioni offrono una registrazione semplificata, in particolare le carte basate su self-custody e wallet Web3 come MetaMask Card o Gnosis Pay, che operano direttamente dal tuo wallet.`, outro:`Importante: nessuna carta crypto regolamentata in Europa consente un utilizzo al 100% anonimo. Le normative MiCA e AML richiedono un livello minimo di verifica. Scegli sempre carte conformi alle normative locali per un utilizzo legale e sicuro.` },
    en: { title:`Crypto Card No KYC ${YEAR} — Easy Registration | TopCryptoCards`, h1:`Crypto Cards Without Full KYC`, description:`Crypto cards with simplified registration in ${YEAR}: Gnosis Pay and MetaMask Card — self-custody, no custodial account. Pay in crypto with no intermediary. Free ✓`, intro:`Most crypto cards require full KYC: ID document, proof of address, selfie. But some solutions offer simplified registration, especially self-custody and Web3 wallet-based cards like MetaMask Card or Gnosis Pay, which operate directly from your wallet and reduce verification steps significantly.`, outro:`Important: no regulated crypto card in Europe allows fully anonymous use. MiCA and AML regulations require a minimum level of verification from all card users. Always choose cards compliant with your local regulations for safe and legal use.` },
  },
  '2026': {
    fr: { title:`Meilleure Carte Crypto 2026 — Comparatif | TopCryptoCards`, h1:`Les Meilleures Cartes Crypto en 2026`, description:`Meilleure carte crypto 2026 : comparatif complet mis à jour. Jusqu'à 8% cashback, 0€/an, sans staking. Crypto.com, Gnosis Pay, MetaMask, Nexo comparés. Gratuit ✓`, intro:`Les meilleures cartes crypto 2026 sont des cartes Visa ou Mastercard conformes MiCA, offrant jusqu'à 8% de cashback en cryptomonnaies et disponibles dans toute l'Union Européenne. En 2026, le marché des cartes crypto a profondément évolué. L'entrée en vigueur du règlement MiCA en Europe a renforcé les standards de protection des utilisateurs. De nouvelles cartes sont apparues, des offres ont été améliorées. Ce comparatif recense les meilleures options disponibles en 2026, classées par note de confiance et rapport qualité/prix.`, outro:`En 2026, privilégiez les cartes émises par des entités conformes MiCA. La réglementation européenne offre désormais une protection solide : vos fonds sont mieux encadrés, les recours en cas de litige plus clairs. Comparez les taux de cashback mais ne négligez pas la fiabilité de l'émetteur.` },
    de: { title:`Beste Krypto-Karte 2026 — Vergleich | TopCryptoCards`, h1:`Die Besten Krypto-Karten 2026`, description:`Beste Krypto-Karte 2026: vollständiger aktueller Vergleich. Bis zu 8% Cashback, 0€/Jahr, kein Staking. Crypto.com, Gnosis Pay, MetaMask, Nexo verglichen. Kostenlos ✓`, intro:`Die besten Krypto-Karten 2026 sind MiCA-konforme Visa- oder Mastercard-Karten, die bis zu 8% Krypto-Cashback bieten und in der gesamten Europäischen Union verfügbar sind. 2026 hat sich der Krypto-Karten-Markt erheblich weiterentwickelt. Die MiCA-Verordnung in Europa hat die Nutzerstandards gestärkt. Neue Karten sind erschienen, Angebote wurden verbessert. Dieser Vergleich listet die besten verfügbaren Optionen 2026 nach Vertrauenswürdigkeit und Preis-Leistungs-Verhältnis.`, outro:`2026 bevorzugen Sie MiCA-konforme Karten von regulierten Emittenten. Die europäische Regulierung bietet nun soliden Schutz für Ihre Gelder. Vergleichen Sie Cashback-Raten, vernachlässigen Sie aber nicht die Zuverlässigkeit des Emittenten.` },
    es: { title:`Mejor Tarjeta Crypto 2026 — Comparativa | TopCryptoCards`, h1:`Las Mejores Tarjetas Crypto en 2026`, description:`Mejor tarjeta crypto 2026: comparativa completa actualizada. Hasta 8% cashback, 0€/año, sin staking. Crypto.com, Gnosis Pay, MetaMask, Nexo comparados. Gratis ✓`, intro:`Las mejores tarjetas crypto 2026 son tarjetas Visa o Mastercard conformes con MiCA, que ofrecen hasta un 8% de cashback en criptomonedas y están disponibles en toda la Unión Europea. En 2026, el mercado de tarjetas crypto ha evolucionado profundamente. La regulación MiCA en Europa ha reforzado los estándares de protección. Nuevas tarjetas han aparecido y las ofertas han mejorado. Esta comparativa recoge las mejores opciones de 2026, clasificadas por puntuación de confianza y relación calidad/precio.`, outro:`En 2026, prioriza tarjetas emitidas por entidades conformes con MiCA. La regulación europea ofrece ahora una protección sólida para tus fondos. Compara las tasas de cashback pero no descuides la fiabilidad del emisor.` },
    it: { title:`Migliore Carta Crypto 2026 — Confronto | TopCryptoCards`, h1:`Le Migliori Carte Crypto nel 2026`, description:`Migliore carta crypto 2026: confronto completo aggiornato. Fino all'8% cashback, 0€/anno, senza staking. Crypto.com, Gnosis Pay, MetaMask, Nexo confrontati. Gratuito ✓`, intro:`Le migliori carte crypto 2026 sono carte Visa o Mastercard conformi a MiCA, che offrono fino all'8% di cashback in criptovalute e sono disponibili in tutta l'Unione Europea. Nel 2026, il mercato delle carte crypto si è profondamente evoluto. L'entrata in vigore di MiCA in Europa ha rafforzato gli standard di protezione degli utenti. Nuove carte sono apparse e le offerte sono migliorate. Questo confronto raccoglie le migliori opzioni del 2026, classificate per punteggio di fiducia e rapporto qualità/prezzo.`, outro:`Nel 2026, privilegia carte emesse da entità conformi a MiCA. La regolamentazione europea offre ora una protezione solida per i tuoi fondi. Confronta i tassi di cashback ma non trascurare l'affidabilità dell'emittente.` },
    en: { title:`Best Crypto Card 2026 — Complete Comparison | TopCryptoCards`, h1:`The Best Crypto Cards in 2026`, description:`Best crypto card 2026: full updated comparison. Up to 8% cashback, €0/year, no staking required. Crypto.com, Gnosis Pay, MetaMask Card, Nexo compared. Free ✓`, intro:`The best crypto cards in 2026 are MiCA-compliant Visa or Mastercard payment cards offering up to 8% crypto cashback, available across the European Union. In 2026, the crypto card market has evolved significantly. The MiCA regulation across Europe has strengthened user protection standards. New cards have emerged and existing offers have improved. This comparison covers the best options available in 2026, ranked by trust score and overall value for money.`, outro:`In 2026, prioritize MiCA-compliant cards issued by regulated entities. European regulation now provides solid protection for your funds. Compare cashback rates but don't overlook the issuer's reliability and regulatory track record.` },
  },
  travel: {
    fr: { title:`Carte Crypto Voyage ${YEAR} — Sans Frais | TopCryptoCards`, h1:`Meilleures Cartes Crypto pour Voyager en ${YEAR}`, description:`Quelle carte crypto pour voyager en ${YEAR} ? Sans frais de change, cashback à l'étranger, acceptée dans 200+ pays. Crypto.com, Bybit, Nexo comparés. Gratuit ✓`, intro:`Une carte crypto de voyage est une carte Visa ou Mastercard sans frais de change, acceptée dans plus de 200 pays, permettant de régler en crypto à l'étranger et d'obtenir du cashback en cryptomonnaies sur chaque achat international. Voyager avec une carte crypto offre de nombreux avantages : pas de frais de change excessifs, cashback en crypto sur chaque achat à l'étranger, et acceptation dans plus de 50 millions de points de vente Visa/Mastercard. Ces cartes sont idéales pour les digital nomads et les voyageurs fréquents qui souhaitent maximiser leurs dépenses à l'international.`, outro:`Pour voyager, privilégiez une carte sans frais de change et avec des plafonds de retrait généreux. La Crypto.com Obsidian offre même les lounges d'aéroport gratuitement. Pour les voyageurs occasionnels, Gnosis Pay ou MetaMask Card suffisent sans aucun frais annuel.` },
    de: { title:`Krypto Karte Reise ${YEAR} — Ohne Gebühren | TopCryptoCards`, h1:`Beste Krypto-Karten für Reisende ${YEAR}`, description:`Beste Krypto-Karte für Reisen ${YEAR}: keine Wechselgebühren, bis zu 5% Cashback im Ausland, in 200+ Ländern akzeptiert. Crypto.com, Bybit, Nexo verglichen. Kostenlos ✓`, intro:`Eine Reise-Krypto-Karte ist eine Visa- oder Mastercard ohne Wechselgebühren, in über 200 Ländern akzeptiert, die das Bezahlen mit Krypto im Ausland und Krypto-Cashback auf jeden internationalen Kauf ermöglicht. Mit einer Krypto-Karte zu reisen bietet viele Vorteile: keine übermäßigen Wechselgebühren, Cashback in Krypto bei jedem Auslandskauf und Akzeptanz bei über 50 Millionen Händlern weltweit. Diese Karten sind ideal für digitale Nomaden und Vielreisende, die ihre internationalen Ausgaben maximieren möchten.`, outro:`Für Reisen wählen Sie eine Karte ohne Wechselgebühren und mit großzügigen Abhebungslimits. Die Crypto.com Obsidian bietet sogar kostenlose Flughafen-Lounges. Für Gelegenheitsreisende reichen Gnosis Pay oder MetaMask Card ohne Jahresgebühr vollkommen aus.` },
    es: { title:`Tarjeta Crypto Viaje ${YEAR} — Sin Comisiones | TopCryptoCards`, h1:`Mejores Tarjetas Crypto para Viajeros en ${YEAR}`, description:`Mejor tarjeta crypto para viajeros ${YEAR}: sin comisiones de cambio, hasta 5% cashback en el extranjero, aceptada en 200+ países. Crypto.com, Bybit, Nexo. Gratis ✓`, intro:`Una tarjeta crypto de viaje es una Visa o Mastercard sin comisiones de cambio, aceptada en más de 200 países, que permite pagar en cripto en el extranjero y obtener cashback en criptomonedas en cada compra internacional. Viajar con una tarjeta crypto ofrece muchas ventajas: sin comisiones de cambio excesivas, cashback en crypto en cada compra en el extranjero y aceptación en más de 50 millones de comercios Visa/Mastercard. Estas tarjetas son ideales para nómadas digitales y viajeros frecuentes que desean maximizar sus gastos internacionales.`, outro:`Para viajar, elige una tarjeta sin comisiones de cambio y con límites de retirada generosos. Crypto.com Obsidian ofrece incluso acceso gratuito a lounges de aeropuerto. Para viajeros ocasionales, Gnosis Pay o MetaMask Card son más que suficientes sin cuota anual.` },
    it: { title:`Carta Crypto Viaggio ${YEAR} — Senza Costi | TopCryptoCards`, h1:`Migliori Carte Crypto per Viaggiatori nel ${YEAR}`, description:`Migliore carta crypto per viaggiare nel ${YEAR}: senza commissioni di cambio, fino al 5% cashback all'estero, accettata in 200+ paesi. Crypto.com, Bybit, Nexo. Gratuito ✓`, intro:`Una carta crypto da viaggio è una Visa o Mastercard senza commissioni di cambio, accettata in oltre 200 paesi, che permette di pagare in crypto all'estero e di ottenere cashback in criptovalute su ogni acquisto internazionale. Viaggiare con una carta crypto offre molti vantaggi: nessuna commissione di cambio eccessiva, cashback in crypto per ogni acquisto all'estero e accettazione in oltre 50 milioni di punti vendita Visa/Mastercard. Queste carte sono ideali per i nomadi digitali e i viaggiatori frequenti che desiderano massimizzare le spese internazionali.`, outro:`Per viaggiare, scegli una carta senza commissioni di cambio e con limiti di prelievo generosi. Crypto.com Obsidian offre persino l'accesso gratuito alle lounge aeroportuali. Per i viaggiatori occasionali, Gnosis Pay o MetaMask Card sono più che sufficienti senza costi annuali.` },
    en: { title:`Crypto Card for Travel ${YEAR} — No Fees | TopCryptoCards`, h1:`Best Crypto Cards for Travel in ${YEAR}`, description:`Best crypto card for travel in ${YEAR}: no currency exchange fees, up to 5% cashback abroad, accepted in 200+ countries. Crypto.com, Bybit, Nexo compared. Free ✓`, intro:`A travel crypto card is a Visa or Mastercard with no currency exchange fees, accepted in 200+ countries, enabling you to pay with crypto abroad and earn cryptocurrency cashback on every international purchase. Traveling with a crypto card offers many advantages: no excessive currency exchange fees, crypto cashback on every purchase abroad, and acceptance at over 50 million Visa/Mastercard merchants worldwide. These cards are ideal for digital nomads and frequent travelers who want to maximize their international spending.`, outro:`For travel, choose a card with no exchange fees and generous ATM withdrawal limits. Crypto.com Obsidian even includes free airport lounge access. For occasional travelers, Gnosis Pay or MetaMask Card are more than sufficient with no annual fee.` },
  },
  rewards: {
    fr: { title:`Carte Crypto Récompenses ${YEAR} — Cashback | TopCryptoCards`, h1:`Cartes Crypto avec les Meilleures Récompenses en ${YEAR}`, description:`Cartes crypto avec les meilleures récompenses ${YEAR} : cashback crypto, lounge VIP, Netflix offert, Spotify remboursé. Crypto.com, Nexo, Bybit comparés. Gratuit ✓`, intro:`Une carte crypto récompenses est une carte Visa ou Mastercard offrant des avantages premium sur chaque achat : cashback en cryptomonnaies, accès aux lounges d'aéroport, abonnements offerts (Netflix, Spotify) et assurance voyage. Les cartes crypto premium offrent bien plus qu'un simple cashback : accès aux lounges d'aéroport, abonnements offerts (Netflix, Spotify), assurance voyage, cashback en crypto sur tous vos achats. Ces récompenses peuvent valoir plusieurs centaines d'euros par an selon votre usage et niveau de staking.`, outro:`Pour maximiser vos récompenses, évaluez les avantages en valeur monétaire réelle. Calculez si la dépréciation potentielle du token staké ne dépasse pas la valeur des avantages annuels. Pour la plupart des utilisateurs, Gnosis Pay et MetaMask Card offrent un excellent rapport récompenses/risque sans staking.` },
    de: { title:`Krypto Karte Prämien ${YEAR} — Cashback | TopCryptoCards`, h1:`Krypto-Karten mit den besten Prämien ${YEAR}`, description:`Krypto-Karten mit besten Prämien ${YEAR}: Cashback, VIP-Lounges, Netflix inklusive, Spotify erstattet. Crypto.com, Nexo, Bybit verglichen. Kostenloser Vergleich ✓`, intro:`Eine Krypto-Prämien-Karte ist eine Visa- oder Mastercard mit Premium-Vorteilen auf jeden Einkauf: Krypto-Cashback, Flughafen-Lounge-Zugang, inklusive Abonnements (Netflix, Spotify) und Reiseversicherung. Premium-Krypto-Karten bieten weit mehr als nur Cashback: Flughafen-Lounge-Zugang, inklusive Abonnements (Netflix, Spotify), Reiseversicherung und Krypto-Cashback auf alle Einkäufe. Diese Prämien können je nach Nutzung und Staking-Niveau mehrere hundert Euro pro Jahr wert sein.`, outro:`Bewerten Sie die Vorteile in echtem Geldwert, bevor Sie sich für ein Staking-Niveau entscheiden. Für die meisten Nutzer bieten Gnosis Pay und MetaMask Card ein hervorragendes Prämien-/Risikoprofil ohne jedes Staking.` },
    es: { title:`Tarjeta Crypto Recompensas ${YEAR} — Cashback | TopCryptoCards`, h1:`Tarjetas Crypto con las Mejores Recompensas en ${YEAR}`, description:`Tarjetas crypto con las mejores recompensas ${YEAR}: cashback cripto, lounges VIP, Netflix incluido, Spotify reembolsado. Crypto.com, Nexo, Bybit comparados. Gratis ✓`, intro:`Una tarjeta crypto de recompensas es una Visa o Mastercard con ventajas premium en cada compra: cashback en criptomonedas, acceso a lounges de aeropuerto, suscripciones incluidas (Netflix, Spotify) y seguro de viaje. Las tarjetas crypto premium ofrecen mucho más que un simple cashback: acceso a lounges de aeropuerto, suscripciones incluidas (Netflix, Spotify), seguro de viaje y cashback en crypto en todas tus compras. Estas recompensas pueden valer varios cientos de euros al año según tu uso y nivel de staking.`, outro:`Evalúa las ventajas en valor monetario real antes de comprometerte con un nivel de staking. Para la mayoría de usuarios, Gnosis Pay y MetaMask Card ofrecen una excelente relación recompensas/riesgo sin staking alguno.` },
    it: { title:`Carta Crypto Premi ${YEAR} — Cashback e Premi | TopCryptoCards`, h1:`Carte Crypto con i Migliori Premi nel ${YEAR}`, description:`Carte crypto con i migliori premi ${YEAR}: cashback cripto, lounge VIP, Netflix incluso, Spotify rimborsato. Crypto.com, Nexo, Bybit confrontati. Gratuito ✓`, intro:`Una carta crypto ricompense è una Visa o Mastercard con vantaggi premium su ogni acquisto: cashback in criptovalute, accesso alle lounge aeroportuali, abbonamenti inclusi (Netflix, Spotify) e assicurazione viaggio. Le carte crypto premium offrono molto più di un semplice cashback: accesso alle lounge aeroportuali, abbonamenti inclusi (Netflix, Spotify), assicurazione viaggio e cashback in crypto su tutti gli acquisti. Questi premi possono valere diverse centinaia di euro all'anno in base all'utilizzo e al livello di staking.`, outro:`Valuta i vantaggi in termini di valore monetario reale prima di impegnarti in uno staking. Per la maggior parte degli utenti, Gnosis Pay e MetaMask Card offrono un ottimo rapporto premi/rischio senza alcuno staking.` },
    en: { title:`Crypto Card Rewards ${YEAR} — Cashback & Perks | TopCryptoCards`, h1:`Crypto Cards with the Best Rewards in ${YEAR}`, description:`Best crypto cards with rewards in ${YEAR}: crypto cashback, VIP airport lounges, Netflix included, Spotify reimbursed. Crypto.com, Nexo, Bybit compared. Free ✓`, intro:`A crypto rewards card is a Visa or Mastercard with premium perks on every purchase: cryptocurrency cashback, airport lounge access, included subscriptions (Netflix, Spotify), and travel insurance. Premium crypto cards offer much more than simple cashback: airport lounge access, included subscriptions (Netflix, Spotify), travel insurance, and crypto cashback on all your purchases. These rewards can be worth several hundred euros per year depending on your usage and staking tier.`, outro:`Evaluate the benefits in real monetary value before committing to a staking tier. For most users, Gnosis Pay and MetaMask Card offer an excellent rewards-to-risk profile with no staking required at all.` },
  },
  physical: {
    fr: { title:`Carte Crypto Physique ${YEAR} — Comparatif | TopCryptoCards`, h1:`Meilleures Cartes Crypto Physiques en ${YEAR}`, description:`Meilleures cartes crypto physiques ${YEAR} : livraison gratuite, retraits DAB, Visa/Mastercard acceptées partout. Crypto.com, Revolut, Nexo, Bybit comparées. Comparatif gratuit ✓`, intro:`Une carte crypto physique s'utilise comme n'importe quelle carte bancaire : paiements en magasin, retraits DAB, paiements sans contact dans la rue. À la différence d'une carte virtuelle, elle vous permet d'accéder à votre solde crypto dans tous les commerces physiques et de retirer des espèces n'importe où dans le monde. La plupart des cartes crypto physiques incluent également une version virtuelle — vous bénéficiez des deux usages avec un seul compte.`, outro:`Pour choisir votre carte crypto physique, évaluez d'abord vos besoins réels : fréquence des retraits DAB, pays d'utilisation et staking éventuel. Crypto.com et Bybit offrent les meilleures conditions pour les retraits à l'étranger. Nexo et Revolut sont idéales pour un usage quotidien en Europe sans staking. Toutes les cartes physiques listées ici sont des cartes Visa ou Mastercard, acceptées dans plus de 200 pays.` },
    de: { title:`Physische Krypto Karte ${YEAR} — Vergleich | TopCryptoCards`, h1:`Beste Physische Krypto-Karten ${YEAR}`, description:`Beste physische Krypto-Karten ${YEAR}: kostenlose Lieferung, Geldautomaten-Abhebungen, Visa/Mastercard überall akzeptiert. Crypto.com, Revolut, Nexo, Bybit verglichen. Kostenlos ✓`, intro:`Eine physische Krypto-Karte funktioniert wie jede Bankkarte: Zahlungen im Geschäft, Geldautomaten-Abhebungen, kontaktlose Zahlungen unterwegs. Im Gegensatz zu einer virtuellen Karte ermöglicht sie Ihnen den Zugriff auf Ihr Krypto-Guthaben bei allen physischen Händlern und Bargeldabhebungen weltweit. Die meisten physischen Krypto-Karten enthalten auch eine virtuelle Version — Sie profitieren von beiden Verwendungen mit nur einem Konto.`, outro:`Bewerten Sie zunächst Ihre tatsächlichen Bedürfnisse: Häufigkeit der Geldautomaten-Abhebungen, Nutzungsland und mögliches Staking. Crypto.com und Bybit bieten die besten Konditionen für internationale Abhebungen. Nexo und Revolut sind ideal für den täglichen Einsatz in Deutschland ohne Staking-Verpflichtung. Alle hier aufgeführten physischen Karten sind Visa- oder Mastercard-Karten, die in über 200 Ländern akzeptiert werden.` },
    es: { title:`Tarjeta Crypto Física ${YEAR} — Comparativa | TopCryptoCards`, h1:`Mejores Tarjetas Crypto Físicas en ${YEAR}`, description:`Mejores tarjetas crypto físicas en España ${YEAR}: entrega gratuita, retiradas en cajero, Visa/Mastercard aceptadas en todo el mundo. Crypto.com, Revolut, Nexo, Bybit. Gratis ✓`, intro:`Una tarjeta crypto física funciona como cualquier tarjeta bancaria: pagos en tienda, retiradas en cajero automático, pagos sin contacto en la calle. A diferencia de una tarjeta virtual, te permite acceder a tu saldo crypto en todos los comercios físicos y retirar efectivo en cualquier parte del mundo. La mayoría de las tarjetas crypto físicas incluyen también una versión virtual — disfrutas de ambos usos con una sola cuenta.`, outro:`Para elegir tu tarjeta crypto física, evalúa primero tus necesidades reales: frecuencia de retiradas en cajero, países de uso y posible staking. Crypto.com y Bybit ofrecen las mejores condiciones para retiradas en el extranjero. Nexo y Revolut son ideales para un uso cotidiano en España sin staking. Todas las tarjetas físicas listadas son Visa o Mastercard, aceptadas en más de 200 países.` },
    it: { title:`Carta Crypto Fisica ${YEAR} — Confronto | TopCryptoCards`, h1:`Migliori Carte Crypto Fisiche nel ${YEAR}`, description:`Migliori carte crypto fisiche in Italia ${YEAR}: consegna gratuita, prelievi ATM, Visa/Mastercard accettate ovunque. Crypto.com, Revolut, Nexo, Bybit confrontati. Gratuito ✓`, intro:`Una carta crypto fisica funziona come qualsiasi carta bancaria: pagamenti in negozio, prelievi ATM, pagamenti contactless per strada. A differenza di una carta virtuale, ti permette di accedere al tuo saldo crypto in tutti i negozi fisici e di prelevare contante ovunque nel mondo. La maggior parte delle carte crypto fisiche include anche una versione virtuale — benefici di entrambi gli usi con un unico account.`, outro:`Per scegliere la tua carta crypto fisica, valuta prima le tue esigenze reali: frequenza dei prelievi ATM, paesi di utilizzo e possibile staking. Crypto.com e Bybit offrono le migliori condizioni per i prelievi all'estero. Nexo e Revolut sono ideali per un utilizzo quotidiano in Italia senza staking. Tutte le carte fisiche elencate sono Visa o Mastercard, accettate in oltre 200 paesi.` },
    en: { title:`Physical Crypto Card ${YEAR} — Comparison | TopCryptoCards`, h1:`Best Physical Crypto Cards in ${YEAR}`, description:`Best physical crypto cards in Europe ${YEAR}: free delivery, ATM withdrawals, Visa/Mastercard accepted worldwide. Crypto.com, Revolut, Nexo, Bybit compared. Free ✓`, intro:`A physical crypto card works just like any bank card: in-store payments, ATM withdrawals, contactless payments anywhere. Unlike a virtual card, it lets you access your crypto balance at all physical merchants and withdraw cash anywhere in the world. Most physical crypto cards also include a virtual version — giving you both options with a single account.`, outro:`When choosing a physical crypto card, first assess your real needs: frequency of ATM withdrawals, countries of use, and any staking requirements. Crypto.com and Bybit offer the best conditions for international withdrawals. Nexo and Revolut are ideal for everyday use in Europe with no staking obligation. All physical cards listed here are Visa or Mastercard, accepted in over 200 countries.` },
  },
  belgium: {
    fr: { title:`Carte Crypto Belgique ${YEAR} — Comparatif | TopCryptoCards`, h1:`Cartes Crypto Disponibles en Belgique en ${YEAR}`, description:`Meilleures cartes crypto en Belgique ${YEAR} : FSMA/MiCA vérifiée. Crypto.com, Gnosis Pay, Revolut, MetaMask Card comparées. Mêmes conditions qu'en France. Gratuit ✓`, intro:`Une carte crypto disponible en Belgique est une carte Visa ou Mastercard émise par un acteur régulé (FSMA ou conforme MiCA), utilisable par les résidents belges pour dépenser leurs cryptomonnaies au quotidien. En tant que siège de l'Union Européenne, la Belgique bénéficie d'un accès complet aux cartes crypto régulées MiCA disponibles dans l'EEE — avec les mêmes conditions de cashback et les mêmes frais qu'en France.`, outro:`En Belgique, la FSMA (Financial Services and Markets Authority) supervise les prestataires de services sur crypto-actifs. Avec le règlement MiCA, toutes les cartes listées bénéficient d'un passeport EEE, garantissant un niveau de protection identique pour les résidents belges.` },
    de: { title:`Krypto Karte Belgien ${YEAR} — Vergleich | TopCryptoCards`, h1:`Krypto-Karten Verfügbar in Belgien ${YEAR}`, description:`Beste Krypto-Karten für Belgien ${YEAR}: FSMA/MiCA-reguliert, bis zu 8% Cashback. Crypto.com, Gnosis Pay, Revolut, MetaMask Card verglichen. Kostenlos ✓`, intro:`Eine in Belgien verfügbare Krypto-Karte ist eine Visa- oder Mastercard eines FSMA-regulierten oder MiCA-konformen Anbieters, mit der belgische Einwohner Kryptowährungen im Alltag ausgeben können. Als Sitz der EU profitiert Belgien vom selben vollständigen Zugang zu MiCA-konformen Krypto-Karten wie andere EWR-Länder.`, outro:`In Belgien überwacht die FSMA (Financial Services and Markets Authority) Anbieter von Krypto-Asset-Dienstleistungen. Mit MiCA-Passporting haben alle hier aufgeführten Karten einen gültigen EWR-Pass, der belgischen Einwohnern denselben Schutz wie in anderen EU-Ländern garantiert.` },
    es: { title:`Tarjeta Crypto Bélgica ${YEAR} — Comparativa | TopCryptoCards`, h1:`Tarjetas Crypto Disponibles en Bélgica en ${YEAR}`, description:`Mejores tarjetas crypto en Bélgica ${YEAR}: reguladas FSMA/MiCA, hasta 8% cashback. Crypto.com, Gnosis Pay, Revolut, MetaMask Card comparadas. Gratis ✓`, intro:`Una tarjeta crypto disponible en Bélgica es una Visa o Mastercard emitida por un proveedor regulado por la FSMA o conforme con MiCA, que los residentes belgas pueden usar para gastar criptomonedas. Como sede de la Unión Europea, Bélgica tiene acceso completo a las tarjetas crypto reguladas por MiCA disponibles en el EEE.`, outro:`En Bélgica, la FSMA (Financial Services and Markets Authority) supervisa los proveedores de servicios de criptoactivos. Con el pasaporte MiCA, todas las tarjetas listadas garantizan a los residentes belgas el mismo nivel de protección que en otros países de la UE.` },
    it: { title:`Carta Crypto Belgio ${YEAR} — Confronto | TopCryptoCards`, h1:`Carte Crypto Disponibili in Belgio nel ${YEAR}`, description:`Migliori carte crypto in Belgio ${YEAR}: regolamentate FSMA/MiCA, fino all'8% cashback. Crypto.com, Gnosis Pay, Revolut, MetaMask Card. Gratuito ✓`, intro:`Una carta crypto disponibile in Belgio è una Visa o Mastercard emessa da un fornitore regolamentato dalla FSMA o conforme a MiCA, utilizzabile dai residenti belgi per spendere criptovalute. In quanto sede dell'Unione Europea, il Belgio beneficia dell'accesso completo alle carte crypto regolamentate MiCA disponibili nel SEE.`, outro:`In Belgio, la FSMA (Financial Services and Markets Authority) supervisiona i fornitori di servizi su cripto-asset. Con il passaporto MiCA, tutte le carte qui elencate garantiscono ai residenti belgi lo stesso livello di protezione degli altri paesi UE.` },
    en: { title:`Crypto Card Belgium ${YEAR} — Available Cards | TopCryptoCards`, h1:`Crypto Cards Available in Belgium in ${YEAR}`, description:`Best crypto cards for Belgium ${YEAR}: FSMA/MiCA regulated, up to 8% cashback. Crypto.com, Gnosis Pay, Revolut, MetaMask Card compared. Same conditions as France. Free ✓`, intro:`A crypto card available in Belgium is a Visa or Mastercard issued by an FSMA-regulated or MiCA-compliant provider, enabling Belgian residents to spend their cryptocurrency in everyday life. As the seat of the European Union, Belgium has full access to MiCA-regulated crypto cards available across the EEA — with the same cashback rates and fees as other EU residents.`, outro:`In Belgium, the FSMA (Financial Services and Markets Authority) oversees crypto-asset service providers. With MiCA passporting, all cards listed here carry a valid EEA pass, ensuring Belgian residents receive the same level of protection as in other EU countries.` },
  },
  austria: {
    fr: { title:`Carte Crypto Autriche ${YEAR} — Comparatif | TopCryptoCards`, h1:`Cartes Crypto Disponibles en Autriche en ${YEAR}`, description:`Meilleures cartes crypto en Autriche ${YEAR} : FMA/MiCA vérifiée. Bitpanda, Crypto.com, Gnosis Pay, MetaMask Card comparées. Imposition forfaitaire 27,5%. Gratuit ✓`, intro:`Une carte crypto disponible en Autriche est une carte Visa ou Mastercard émise par un acteur régulé FMA ou conforme MiCA, utilisable par les résidents autrichiens pour dépenser leurs cryptomonnaies au quotidien. L'Autriche se distingue par la présence de Bitpanda, plateforme crypto native viennoise parmi les plus régulées d'Europe (licence FMA + BaFin + AMF). Le taux d'imposition autrichien sur les cryptomonnaies est fixe à 27,5%.`, outro:`En Autriche, la FMA (Finanzmarktaufsicht) supervise les prestataires de services sur crypto-actifs. Bitpanda, basée à Vienne, est l'acteur le plus réglementé du marché autrichien. Avec le règlement MiCA, les cartes émises par des entités européennes bénéficient d'un passeport EEE valable pour les résidents autrichiens.` },
    de: { title:`Krypto Karte Österreich ${YEAR} — Vergleich | TopCryptoCards`, h1:`Krypto-Karten Verfügbar in Österreich ${YEAR}`, description:`Beste Krypto-Karten für Österreich ${YEAR}: FMA/MiCA-reguliert, bis zu 8% Cashback. Bitpanda, Crypto.com, Gnosis Pay, MetaMask Card verglichen. 27,5% Pauschalsteuer. Kostenlos ✓`, intro:`Eine in Österreich verfügbare Krypto-Karte ist eine Visa- oder Mastercard eines FMA-regulierten oder MiCA-konformen Anbieters, mit der österreichische Einwohner Kryptowährungen im Alltag ausgeben können. Österreich ist die Heimat von Bitpanda, der bestlizenzierten Krypto-Plattform Europas mit FMA-, BaFin- und AMF-Lizenz, Hauptsitz in Wien. Der österreichische Pauschalsteuersatz auf Krypto-Erträge beträgt 27,5%.`, outro:`In Österreich überwacht die FMA (Finanzmarktaufsicht) Anbieter von Krypto-Dienstleistungen. Bitpanda mit Sitz in Wien ist der am stärksten regulierte Akteur auf dem österreichischen Markt. Mit MiCA-Passporting haben alle hier aufgeführten Karten einen gültigen EWR-Pass für österreichische Einwohner.` },
    es: { title:`Tarjeta Crypto Austria ${YEAR} — Comparativa | TopCryptoCards`, h1:`Tarjetas Crypto Disponibles en Austria en ${YEAR}`, description:`Mejores tarjetas crypto en Austria ${YEAR}: reguladas FMA/MiCA, hasta 8% cashback. Bitpanda, Crypto.com, Gnosis Pay, MetaMask Card comparadas. Fiscalidad 27,5%. Gratis ✓`, intro:`Una tarjeta crypto disponible en Austria es una Visa o Mastercard emitida por un proveedor regulado por la FMA o conforme con MiCA, que los residentes austriacos pueden usar para gastar criptomonedas. Austria destaca por ser el hogar de Bitpanda, la plataforma crypto europea más regulada, con sede en Viena y licencias FMA, BaFin y AMF. El tipo impositivo austriaco sobre las criptomonedas es fijo al 27,5%.`, outro:`En Austria, la FMA (Finanzmarktaufsicht) supervisa los proveedores de servicios de criptoactivos. Bitpanda, con sede en Viena, es el actor más regulado del mercado austriaco. Con el pasaporte MiCA, todas las tarjetas listadas garantizan a los residentes austriacos el mismo nivel de protección que en otros países de la UE.` },
    it: { title:`Carta Crypto Austria ${YEAR} — Confronto | TopCryptoCards`, h1:`Carte Crypto Disponibili in Austria nel ${YEAR}`, description:`Migliori carte crypto in Austria ${YEAR}: regolamentate FMA/MiCA, fino all'8% cashback. Bitpanda, Crypto.com, Gnosis Pay, MetaMask Card confrontate. Tassazione 27,5%. Gratuito ✓`, intro:`Una carta crypto disponibile in Austria è una Visa o Mastercard emessa da un fornitore regolamentato dalla FMA o conforme a MiCA, utilizzabile dai residenti austriaci per spendere criptovalute. L'Austria si distingue per essere la sede di Bitpanda, la piattaforma crypto europea più regolamentata, con sede a Vienna e licenze FMA, BaFin e AMF. L'aliquota fiscale austriaca sulle criptovalute è fissa al 27,5%.`, outro:`In Austria, la FMA (Finanzmarktaufsicht) supervisiona i fornitori di servizi su cripto-asset. Bitpanda, con sede a Vienna, è l'attore più regolamentato del mercato austriaco. Con il passaporto MiCA, tutte le carte qui elencate garantiscono ai residenti austriaci lo stesso livello di protezione degli altri paesi UE.` },
    en: { title:`Crypto Card Austria ${YEAR} — Available Cards | TopCryptoCards`, h1:`Crypto Cards Available in Austria in ${YEAR}`, description:`Best crypto cards for Austria ${YEAR}: FMA/MiCA regulated, up to 8% cashback. Bitpanda, Crypto.com, Gnosis Pay, MetaMask Card compared. Flat 27.5% tax rate. Free ✓`, intro:`A crypto card available in Austria is a Visa or Mastercard issued by an FMA-regulated or MiCA-compliant provider, enabling Austrian residents to spend their cryptocurrency in everyday life. Austria stands out as the home of Bitpanda, Europe's most regulated crypto platform, headquartered in Vienna with FMA, BaFin, and AMF licenses. The Austrian tax rate on cryptocurrency gains is a flat 27.5%.`, outro:`In Austria, the FMA (Finanzmarktaufsicht) oversees crypto-asset service providers. Bitpanda, headquartered in Vienna, is the most regulated player on the Austrian market. With MiCA passporting, all cards listed here carry a valid EEA pass, ensuring Austrian residents receive the same level of protection as in other EU countries.` },
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
      { h2: `Les 5 critères qui font réellement la différence`, p: `Au-delà du taux de cashback affiché, cinq critères séparent les bonnes cartes des mauvaises en ${YEAR}. Premièrement, la crypto dans laquelle est versé le cashback : un cashback en BTC (Nexo) est intrinsèquement plus stable qu'un cashback en token propriétaire volatile. Deuxièmement, la disponibilité réelle en France ou dans votre pays de résidence. Troisièmement, la qualité du support client (délais, langues, canaux disponibles). Quatrièmement, la solidité financière de l'émetteur et sa conformité MiCA. Cinquièmement, les plafonds de retrait ATM et les frais de change à l'étranger — des critères souvent négligés qui peuvent coûter cher au quotidien.` },
      { h2: `Classement par profil : quelle carte pour quel utilisateur ?`, p: `Il n'existe pas une seule "meilleure" carte — tout dépend de votre situation. Pour le grand voyageur : Crypto.com Jade ou Bybit avec lounge d'aéroport et 0% de frais de change. Pour l'investisseur crypto DeFi : Gnosis Pay ou MetaMask Card, with cashback accumulé directement dans votre wallet sans intermédiaire. Pour l'utilisateur quotidien sans staking : Brighty, Nexo ou MetaMask Card, gratuites et sans conditions. Pour celui qui maximise le cashback à tout prix : Crypto.com Obsidian (8%), à condition d'accepter d'immobiliser 400 000 CRO. Comparez votre profil à chaque offre avant de vous engager.` },
      { h2: `Notre méthodologie : comment nous sélectionnons et notons les cartes crypto`, p: `Chaque carte crypto présente sur TopCryptoCards a été évaluée selon six critères pondérés : fiabilité de l'émetteur (30%), taux de cashback réel (20%), frais totaux (20%), disponibilité géographique (15%), expérience utilisateur (10%) et conformité réglementaire (5%). Nous mettons à jour ce classement chaque trimestre pour refléter les évolutions tarifaires, les nouveaux acteurs et les changements réglementaires. Seules les cartes effectivement disponibles et testées par notre équipe sont incluses.` },
    ],
    de: [
      { h2: `Wie wählt man die beste Krypto-Karte ${YEAR}?`, p: `Um die beste Krypto-Karte zu finden, analysieren Sie mehrere Faktoren: maximaler Cashback-Satz, Staking-Bedingungen, Jahresgebühren, Verfügbarkeit in Deutschland und Zuverlässigkeit des Emittenten. Eine Karte mit 8% Cashback, die 200.000€ Staking in CRO erfordert, ist für Durchschnittsnutzer nicht rentabel. Berechnen Sie die tatsächliche Rendite unter Berücksichtigung des immobilisierten Kapitals und der Token-Volatilität.` },
      { h2: `Crypto.com, Nexo oder Gnosis Pay: Welche Karte passt zu Ihnen?`, p: `Crypto.com eignet sich für Nutzer, die bereits in CRO investiert sind, mit einem Cashback von 1% bis 8% je nach Stufe. Nexo punktet mit BTC-Cashback ohne übermäßiges Staking. Gnosis Pay, eine On-Chain-Karte, bietet GNO-Cashback ohne strenges KYC. Für Einsteiger sind Brighty oder MetaMask Card ideal: kostenlos, kein Pflicht-Staking, 0,5% bis 3% Cashback.` },
      { h2: `Die 5 Kriterien, die wirklich den Unterschied machen`, p: `Über den beworbenen Cashback-Satz hinaus trennen fünf Kriterien gute von schlechten Karten in ${YEAR}. Erstens: die Kryptowährung, in der der Cashback ausgezahlt wird — BTC-Cashback (Nexo) ist intrinsisch stabiler als ein volatiler proprietärer Token. Zweitens: die tatsächliche Verfügbarkeit in Deutschland. Drittens: Qualität des Kundendienstes. Viertens: Finanzstärke des Emittenten und MiCA-Konformität. Fünftens: ATM-Abhebungslimits und Wechselgebühren im Ausland — oft vernachlässigte Kriterien, die im Alltag teuer werden können.` },
      { h2: `Ranking nach Profil: welche Karte für welchen Nutzer?`, p: `Es gibt nicht "die eine" beste Karte — es hängt von Ihrer Situation ab. Für Vielreisende: Crypto.com Jade oder Bybit mit Lounge-Zugang und 0% Wechselgebühren. Für DeFi-Krypto-Investoren: Gnosis Pay oder MetaMask Card, Cashback direkt im Wallet ohne Intermediär. Für Alltagsnutzer ohne Staking: Brighty, Nexo oder MetaMask Card, kostenlos und ohne Bedingungen. Für maximalen Cashback: Crypto.com Obsidian (8%), sofern Sie 400.000 CRO immobilisieren können.` },
      { h2: `Unsere Methodik: Wie wir Krypto-Karten auswählen und bewerten`, p: `Jede auf TopCryptoCards gelistete Krypto-Karte wurde nach sechs gewichteten Kriterien bewertet: Emittenten-Zuverlässigkeit (30%), tatsächliche Cashback-Rate (20%), Gesamtgebühren (20%), geografische Verfügbarkeit (15%), Nutzererfahrung (10%) und regulatorische Konformität (5%). Wir aktualisieren dieses Ranking vierteljährlich, um Preisänderungen, neue Marktteilnehmer und regulatorische Entwicklungen widerzuspiegeln. Nur tatsächlich verfügbare und von unserem Team getestete Karten werden aufgenommen.` },
    ],
    es: [
      { h2: `¿Cómo elegir la mejor tarjeta crypto en ${YEAR}?`, p: `Para identificar la mejor tarjeta crypto hay que analizar varios criterios: tasa máxima de cashback, condiciones de staking, comisiones anuales, disponibilidad en España y fiabilidad del emisor. Una tarjeta con 8% de cashback que exige 200.000€ en staking de CRO no es rentable para el usuario medio. Calcula el retorno real teniendo en cuenta el capital bloqueado y la volatilidad del token.` },
      { h2: `Crypto.com, Nexo o Gnosis Pay: ¿cuál te conviene?`, p: `Crypto.com es ideal para usuarios ya invertidos en CRO, con cashback del 1% al 8% según el nivel. Nexo atrae por su cashback en BTC sin staking excesivo. Gnosis Pay, tarjeta on-chain, ofrece cashback en GNO sin KYC estricto. Para principiantes, Brighty o MetaMask Card son perfectas: gratuitas, sin staking obligatorio, con cashback del 0,5% al 3%.` },
      { h2: `Los 5 criterios que realmente marcan la diferencia`, p: `Más allá de la tasa de cashback anunciada, cinco criterios separan las buenas tarjetas de las malas en ${YEAR}. Primero: la criptomoneda en la que se abona el cashback — BTC (Nexo) es intrínsecamente más estable que un token propietario volátil. Segundo: la disponibilidad real en España. Tercero: la calidad del servicio de atención al cliente. Cuarto: la solidez financiera del emisor y su conformidad con MiCA. Quinto: los límites de retirada en cajero y las comisiones de cambio en el extranjero — criterios a menudo ignorados que pueden ser costosos en el día a día.` },
      { h2: `Ranking por perfil: ¿qué tarjeta para qué usuario?`, p: `No existe "la mejor" tarjeta única — todo depende de tu situación. Para el gran viajero: Crypto.com Jade o Bybit con acceso a lounges y 0% de comisiones de cambio. Para el inversor DeFi: Gnosis Pay o MetaMask Card, cashback acumulado directamente en tu wallet. Para el usuario cotidiano sin staking: Brighty, Nexo o MetaMask Card, gratuitas y sin condiciones. Para maximizar el cashback a toda costa: Crypto.com Obsidian (8%), asumiendo inmovilizar 400.000 CRO.` },
      { h2: `Nuestra metodología: cómo seleccionamos y puntuamos las tarjetas crypto`, p: `Cada tarjeta crypto presente en TopCryptoCards ha sido evaluada según seis criterios ponderados: fiabilidad del emisor (30%), tasa de cashback real (20%), comisiones totales (20%), disponibilidad geográfica (15%), experiencia de usuario (10%) y conformidad regulatoria (5%). Actualizamos este ranking trimestralmente para reflejar cambios tarifarios, nuevos actores y cambios regulatorios. Solo se incluyen tarjetas efectivamente disponibles y probadas por nuestro equipo.` },
    ],
    it: [
      { h2: `Come scegliere la migliore carta crypto nel ${YEAR}?`, p: `Per identificare la migliore carta crypto è necessario analizzare diversi criteri: tasso di cashback massimo, condizioni di staking, commissioni annuali, disponibilità in Italia e affidabilità dell'emittente. Una carta con 8% di cashback che richiede 200.000€ di staking in CRO non è conveniente per l'utente medio. Valuta il rendimento reale considerando il capitale immobilizzato e la volatilità del token.` },
      { h2: `Crypto.com, Nexo o Gnosis Pay: quale carta fa per te?`, p: `Crypto.com è ideale per chi è già investito in CRO, con cashback dall'1% all'8% secondo il livello. Nexo convince con cashback in BTC senza staking eccessivo. Gnosis Pay, carta on-chain, offre cashback in GNO senza KYC rigido. Per i principianti, Brighty o MetaMask Card sono perfette: gratuite, senza staking obbligatorio, con cashback dallo 0,5% al 3%.` },
      { h2: `I 5 criteri che fanno davvero la differenza`, p: `Oltre al tasso di cashback pubblicizzato, cinque criteri separano le carte buone da quelle cattive nel ${YEAR}. Primo: la criptovaluta in cui viene erogato il cashback — il BTC (Nexo) è intrinsecamente più stabile di un token proprietario volatile. Secondo: la disponibilità reale in Italia. Terzo: la qualità del servizio clienti. Quarto: la solidità finanziaria dell'emittente e la conformità MiCA. Quinto: i limiti di prelievo ATM e le commissioni di cambio all'estero — criteri spesso trascurati che possono costare caro quotidianamente.` },
      { h2: `Ranking per profilo: quale carta per quale utente?`, p: `Non esiste "la migliore" carta unica — dipende dalla tua situazione. Per il grande viaggiatore: Crypto.com Jade o Bybit con accesso lounge e 0% commissioni di cambio. Per l'investitore DeFi: Gnosis Pay o MetaMask Card, cashback accumulato direttamente nel wallet. Per l'utente quotidiano senza staking: Brighty, Nexo o MetaMask Card, gratuite e senza condizioni. Per massimizzare il cashback: Crypto.com Obsidian (8%), a patto di immobilizzare 400.000 CRO.` },
      { h2: `La nostra metodologia: come selezioniamo e valutiamo le carte crypto`, p: `Ogni carta crypto presente su TopCryptoCards è stata valutata secondo sei criteri ponderati: affidabilità dell'emittente (30%), tasso di cashback reale (20%), commissioni totali (20%), disponibilità geografica (15%), esperienza utente (10%) e conformità regolamentare (5%). Aggiorniamo questo ranking ogni trimestre per riflettere i cambiamenti tariffari, i nuovi attori e le evoluzioni normative. Sono incluse solo le carte effettivamente disponibili e testate dal nostro team.` },
    ],
    en: [
      { h2: `How to choose the best crypto card in ${YEAR}?`, p: `To identify the best crypto card, analyze several criteria: maximum cashback rate, staking conditions, annual fees, geographic availability and issuer reliability. A card offering 8% cashback requiring €200,000 staked in CRO is not profitable for the average user. Calculate the real return on investment accounting for locked capital and token volatility before committing to any tier.` },
      { h2: `Crypto.com, Nexo or Gnosis Pay: which card suits you?`, p: `Crypto.com suits users already invested in CRO, with cashback from 1% to 8% depending on tier. Nexo wins with BTC cashback without excessive staking. Gnosis Pay, an on-chain card, offers GNO cashback with minimal KYC. For beginners, Brighty or MetaMask Card are ideal: free, no mandatory staking, with 0.5% to 3% cashback on every purchase.` },
      { h2: `The 5 criteria that actually make the difference`, p: `Beyond the advertised cashback rate, five criteria separate good cards from bad ones in ${YEAR}. First: the cryptocurrency in which cashback is paid — BTC cashback (Nexo) is intrinsically more stable than a volatile proprietary token. Second: actual availability in your country. Third: customer support quality. Fourth: issuer financial strength and MiCA compliance. Fifth: ATM withdrawal limits and foreign exchange fees — often overlooked criteria that can be costly in everyday use.` },
      { h2: `Ranking by profile: which card for which user?`, p: `There is no single "best" card — it depends entirely on your situation. For frequent travellers: Crypto.com Jade or Bybit with airport lounge access and 0% exchange fees. For DeFi crypto investors: Gnosis Pay or MetaMask Card, with cashback accumulated directly in your wallet. For everyday users without staking: Brighty, Nexo or MetaMask Card — free and unconditional. For those maximising cashback above all else: Crypto.com Obsidian (8%), provided you can lock 400,000 CRO.` },
      { h2: `Our methodology: how we select and rate crypto cards`, p: `Every crypto card listed on TopCryptoCards has been evaluated against six weighted criteria: issuer reliability (30%), real cashback rate (20%), total fees (20%), geographic availability (15%), user experience (10%), and regulatory compliance (5%). We update this ranking every quarter to reflect pricing changes, new market entrants, and regulatory developments. Only cards that are genuinely available and tested by our team are included in the comparison.` },
    ],
  },
  cashback: {
    fr: [
      { h2: `Comment fonctionne le cashback sur une carte crypto ?`, p: `Le cashback crypto fonctionne comme un programme de fidélité : chaque achat vous rapporte un pourcentage de la somme dépensée, versé en cryptomonnaie. Contrairement au cashback bancaire classique versé en euros, le cashback crypto est soumis à la volatilité du marché. Un cashback de 3% en CRO lors d'un mois baissier peut valoir moins qu'un cashback de 1% en USDC stable. Choisissez la crypto de cashback en fonction de votre stratégie d'investissement.` },
      { h2: `Staking et cashback : quel retour sur investissement réel ?`, p: `Pour débloquer les meilleurs taux de cashback, certaines cartes exigent de staker un montant important de tokens natifs. La carte Crypto.com Obsidian offre 8% de cashback mais nécessite 400 000 CRO stakés (~150 000€). Avec 1 000€ de dépenses mensuelles, le cashback annuel serait de 960€ — insuffisant pour rentabiliser l'immobilisation de 150 000€. Pour la plupart des utilisateurs, les cartes avec 1-3% de cashback sans staking sont bien plus rentables sur le long terme.` },
      { h2: `Cashback en BTC, ETH ou token propriétaire : quelle différence ?`, p: `Le choix de la crypto dans laquelle est versé votre cashback a un impact direct sur sa valeur future. Un cashback en BTC ou ETH profite de l'appréciation historique de ces actifs — si Bitcoin monte de 50% dans l'année, votre cashback de 1% vaut effectivement 1,5% en euros. En revanche, un cashback en CRO, BIT ou NEXO est soumis à la performance du token propre de la plateforme, plus volatile. Nexo permet de choisir entre BTC et NEXO. Gnosis Pay verse en GNO. MetaMask Card en ETH. Identifiez dans quelle crypto vous souhaitez vous constituer une épargne avant de choisir.` },
      { h2: `Maximiser son cashback : les bonnes pratiques`, p: `Pour maximiser votre cashback crypto, plusieurs stratégies s'imposent. Concentrez vos dépenses courantes sur une seule carte pour atteindre les éventuels plafonds de cashback mensuel (certaines cartes limitent à 50 ou 100€/mois de cashback). Utilisez votre carte crypto pour les abonnements récurrents (Netflix, Spotify, courses en ligne) — des achats qui se cumulent mois après mois. Vérifiez si votre carte offre un cashback majoré sur certaines catégories (restaurants, voyages). Enfin, conservez votre cashback plutôt que de le revendre immédiatement — laissez-le se valoriser sur la durée si vous êtes bullish sur la crypto associée.` },
      { h2: `Comparatif cashback par carte : résumé ${YEAR}`, p: `Meilleurs taux de cashback en ${YEAR} : Crypto.com Obsidian 8% (400K CRO stakés), Crypto.com Jade 3% (50K CRO), Nexo Card 2% (en BTC ou NEXO, sans staking), Gnosis Pay 2% (en GNO, on-chain), Bitpanda 2% (en BEST), MetaMask Card 1-3% (en ETH, selon volume), Brighty 1,75% (en USDC, sans staking), Revolut 1% (en crypto au choix). Les cartes sans staking les plus rentables pour un usage courant restent Nexo et Gnosis Pay. Pour les gros volumes de dépenses, les cartes Crypto.com à 3-8% deviennent compétitives malgré le staking requis.` },
    ],
    de: [
      { h2: `Wie funktioniert Cashback bei Krypto-Karten?`, p: `Krypto-Cashback funktioniert wie ein Treueprogramm: Jeder Kauf bringt Ihnen einen Prozentsatz des ausgegebenen Betrags in Kryptowährung ein. Im Gegensatz zu herkömmlichem Bankcashback in Euro ist Krypto-Cashback der Marktvolatilität ausgesetzt. 3% Cashback in CRO in einem schwachen Monat kann weniger wert sein als 1% in stabilem USDC. Wählen Sie die Cashback-Kryptowährung entsprechend Ihrer Anlagestrategie.` },
      { h2: `Staking und Cashback: Was ist die tatsächliche Rendite?`, p: `Um die besten Cashback-Raten freizuschalten, erfordern einige Karten das Staken erheblicher nativer Token-Mengen. Die Crypto.com Obsidian bietet 8% Cashback, benötigt aber 400.000 CRO (~150.000€). Bei 1.000€ monatlichen Ausgaben wären das 960€ Jahres-Cashback — zu wenig, um 150.000€ Kapital zu rechtfertigen. Für die meisten Nutzer sind Karten mit 1-3% Cashback ohne Staking deutlich rentabler.` },
      { h2: `Cashback in BTC, ETH oder proprietärem Token: Was ist der Unterschied?`, p: `Die Wahl der Kryptowährung, in der Ihr Cashback ausgezahlt wird, hat direkten Einfluss auf seinen zukünftigen Wert. BTC- oder ETH-Cashback profitiert von der historischen Wertsteigerung dieser Assets — steigt Bitcoin um 50%, ist Ihr 1%-Cashback effektiv 1,5% in Euro wert. CRO-, BIT- oder NEXO-Cashback hingegen hängt von der Plattform-Token-Performance ab. Nexo erlaubt die Wahl zwischen BTC und NEXO. Gnosis Pay zahlt in GNO, MetaMask Card in ETH. Entscheiden Sie, in welcher Krypto Sie sparen möchten, bevor Sie sich festlegen.` },
      { h2: `Cashback maximieren: Die besten Praktiken`, p: `Um Ihren Krypto-Cashback zu maximieren, konzentrieren Sie laufende Ausgaben auf eine Karte, um eventuelle monatliche Cashback-Limits auszuschöpfen. Nutzen Sie Ihre Krypto-Karte für wiederkehrende Abonnements (Streaming, Online-Einkäufe) — Käufe, die sich Monat für Monat summieren. Prüfen Sie, ob Ihre Karte erhöhtes Cashback für bestimmte Kategorien bietet. Behalten Sie Ihr Cashback, statt es sofort zu verkaufen — lassen Sie es sich über die Zeit aufwerten, wenn Sie bullish auf die damit verbundene Krypto sind.` },
      { h2: `Cashback-Vergleich nach Karte: Übersichtstabelle ${YEAR}`, p: `Beste Cashback-Raten in ${YEAR}: Crypto.com Obsidian 8% (400K CRO im Staking), Crypto.com Jade 3% (50K CRO), Nexo Card 2% (in BTC oder NEXO, kein Staking), Gnosis Pay 2% (in GNO, on-chain), Bitpanda 2% (in BEST), MetaMask Card 1-3% (in ETH, je nach Volumen), Brighty 1,75% (in USDC, kein Staking), Revolut 1% (in Wunschkrypto). Die rentabelsten staking-freien Karten für den Alltag bleiben Nexo und Gnosis Pay. Für hohe Ausgabenvolumina werden Crypto.com-Karten trotz Staking wettbewerbsfähig.` },
    ],
    es: [
      { h2: `¿Cómo funciona el cashback en una tarjeta crypto?`, p: `El cashback crypto funciona como un programa de fidelidad: cada compra te devuelve un porcentaje del importe gastado en criptomoneda. A diferencia del cashback bancario clásico en euros, el cashback crypto está sujeto a la volatilidad del mercado. Un cashback del 3% en CRO en un mes bajista puede valer menos que un 1% en USDC estable. Elige la cripto de cashback según tu estrategia de inversión.` },
      { h2: `Staking y cashback: ¿cuál es el rendimiento real?`, p: `Para desbloquear las mejores tasas de cashback, algunas tarjetas exigen hacer staking de importantes cantidades de tokens nativos. La Crypto.com Obsidian ofrece 8% de cashback pero requiere 400.000 CRO en staking (~150.000€). Con 1.000€ de gastos mensuales, el cashback anual sería de 960€ — insuficiente para rentabilizar 150.000€ inmovilizados. Para la mayoría, las tarjetas con 1-3% sin staking son mucho más rentables.` },
      { h2: `Cashback en BTC, ETH o token propio: ¿qué diferencia hay?`, p: `La elección de la criptomoneda en la que recibes el cashback tiene un impacto directo en su valor futuro. El cashback en BTC o ETH se beneficia de la apreciación histórica de estos activos. El cashback en CRO, BIT o NEXO depende del rendimiento del token propio de la plataforma, más volátil. Nexo permite elegir entre BTC y NEXO. Gnosis Pay abona en GNO, MetaMask Card en ETH. Identifica en qué cripto quieres ahorrar antes de elegir.` },
      { h2: `Maximizar el cashback: las mejores prácticas`, p: `Para maximizar tu cashback crypto, concentra los gastos corrientes en una sola tarjeta para alcanzar los posibles límites mensuales. Usa tu tarjeta crypto para suscripciones recurrentes (streaming, compras online) — gastos que se acumulan mes a mes. Comprueba si tu tarjeta ofrece cashback mayor en ciertas categorías. Conserva el cashback en lugar de venderlo inmediatamente — deja que se revalorice si eres alcista en la cripto asociada.` },
      { h2: `Comparativa de cashback por tarjeta: tabla resumen ${YEAR}`, p: `Mejores tasas de cashback en ${YEAR}: Crypto.com Obsidian 8% (400K CRO en staking), Crypto.com Jade 3% (50K CRO), Nexo Card 2% (en BTC o NEXO, sin staking), Gnosis Pay 2% (en GNO, on-chain), Bitpanda 2% (en BEST), MetaMask Card 1-3% (en ETH, según volumen), Brighty 1,75% (en USDC, sin staking), Revolut 1% (en cripto a elegir). Las tarjetas sin staking más rentables para uso cotidiano siguen siendo Nexo y Gnosis Pay. Para grandes volúmenes de gasto, las tarjetas Crypto.com se vuelven competitivas pese al staking.` },
    ],
    it: [
      { h2: `Come funziona il cashback su una carta crypto?`, p: `Il cashback crypto funziona come un programma fedeltà: ogni acquisto ti restituisce una percentuale dell'importo speso in criptovaluta. A differenza del classico cashback bancario in euro, il cashback crypto è soggetto alla volatilità del mercato. Un cashback del 3% in CRO in un mese al ribasso può valere meno dell'1% in USDC stabile. Scegli la cripto di cashback in base alla tua strategia di investimento.` },
      { h2: `Staking e cashback: qual è il rendimento reale?`, p: `Per sbloccare i migliori tassi di cashback, alcune carte richiedono di fare staking di importanti quantità di token nativi. La Crypto.com Obsidian offre 8% di cashback ma richiede 400.000 CRO in staking (~150.000€). Con 1.000€ di spese mensili, il cashback annuale sarebbe di 960€ — insufficiente per giustificare 150.000€ immobilizzati. Per la maggior parte degli utenti, le carte con 1-3% senza staking sono molto più redditizie.` },
      { h2: `Cashback in BTC, ETH o token proprietario: qual è la differenza?`, p: `La scelta della criptovaluta in cui viene erogato il cashback ha un impatto diretto sul suo valore futuro. Il cashback in BTC o ETH beneficia dell'apprezzamento storico di questi asset. Il cashback in CRO, BIT o NEXO dipende dalla performance del token della piattaforma, più volatile. Nexo permette di scegliere tra BTC e NEXO. Gnosis Pay eroga in GNO, MetaMask Card in ETH. Identifica in quale cripto vuoi risparmiare prima di scegliere.` },
      { h2: `Massimizzare il cashback: le buone pratiche`, p: `Per massimizzare il cashback crypto, concentra le spese correnti su un'unica carta per raggiungere gli eventuali limiti mensili. Usa la carta crypto per gli abbonamenti ricorrenti (streaming, acquisti online) — spese che si accumulano mese dopo mese. Verifica se la carta offre cashback maggiorato su certe categorie. Conserva il cashback invece di venderlo subito — lascialo rivalutare nel tempo se sei rialzista sulla cripto associata.` },
      { h2: `Confronto cashback per carta: tabella riassuntiva ${YEAR}`, p: `Migliori tassi di cashback nel ${YEAR}: Crypto.com Obsidian 8% (400K CRO in staking), Crypto.com Jade 3% (50K CRO), Nexo Card 2% (in BTC o NEXO, senza staking), Gnosis Pay 2% (in GNO, on-chain), Bitpanda 2% (in BEST), MetaMask Card 1-3% (in ETH, secondo il volume), Brighty 1,75% (in USDC, senza staking), Revolut 1% (in cripto a scelta). Le carte senza staking più redditizie per uso quotidiano rimangono Nexo e Gnosis Pay. Per grandi volumi di spesa, le carte Crypto.com diventano competitive nonostante lo staking.` },
    ],
    en: [
      { h2: `How does cashback work on a crypto card?`, p: `Crypto cashback works like a loyalty programme: every purchase earns you a percentage of the amount spent, paid in cryptocurrency. Unlike traditional bank cashback paid in euros, crypto cashback is subject to market volatility. A 3% cashback in CRO during a bearish month may be worth less than 1% in stable USDC. Choose your cashback cryptocurrency based on your investment strategy and risk tolerance.` },
      { h2: `Staking and cashback: what's the real return on investment?`, p: `To unlock the best cashback rates, some cards require staking significant amounts of native tokens. The Crypto.com Obsidian offers 8% cashback but requires 400,000 CRO staked (~€150,000). With €1,000 monthly spending, annual cashback would be €960 — not enough to justify locking €150,000. For most users, cards offering 1-3% cashback with no staking requirement are far more profitable in the long run.` },
      { h2: `Cashback in BTC, ETH or proprietary token: what's the difference?`, p: `The cryptocurrency in which your cashback is paid has a direct impact on its future value. BTC or ETH cashback benefits from the historical appreciation of these assets — if Bitcoin rises 50% in a year, your 1% cashback is effectively worth 1.5% in euros. CRO, BIT or NEXO cashback depends on the platform's own token performance, which is more volatile. Nexo lets you choose between BTC and NEXO. Gnosis Pay pays in GNO, MetaMask Card in ETH. Decide which crypto you want to accumulate before choosing your card.` },
      { h2: `Maximising your cashback: best practices`, p: `To maximise your crypto cashback, concentrate your regular spending on a single card to reach any monthly cashback caps. Use your crypto card for recurring subscriptions (streaming, online shopping) — purchases that accumulate month after month. Check whether your card offers boosted cashback in specific categories. Keep your cashback rather than selling it immediately — let it appreciate over time if you're bullish on the associated cryptocurrency.` },
      { h2: `Cashback comparison by card: summary table ${YEAR}`, p: `Best cashback rates in ${YEAR}: Crypto.com Obsidian 8% (400K CRO staked), Crypto.com Jade 3% (50K CRO), Nexo Card 2% (in BTC or NEXO, no staking), Gnosis Pay 2% (in GNO, on-chain), Bitpanda 2% (in BEST), MetaMask Card 1-3% (in ETH, volume-based), Brighty 1.75% (in USDC, no staking), Revolut 1% (in crypto of choice). The most profitable no-staking cards for everyday use remain Nexo and Gnosis Pay. For high spending volumes, Crypto.com cards at 3-8% become competitive despite the staking requirement.` },
    ],
  },
  'no-staking': {
    fr: [
      { h2: `Pourquoi préférer une carte crypto sans staking ?`, p: `Le staking obligatoire présente deux risques majeurs : immobilisation de capital et exposition au risque de change sur la crypto stakée. Si le cours s'effondre pendant la période de lock-up (souvent 180 jours), vous perdez doublement — sur la valeur stakée et sur les opportunités manquées. Une carte sans staking comme Gnosis Pay ou MetaMask Card vous offre un cashback immédiat sans contraintes ni risque de perte supplémentaire.` },
      { h2: `Gnosis Pay, MetaMask Card, Brighty : le comparatif ${YEAR}`, p: `Gnosis Pay est unique : c'est la première carte Visa connectée directement à une wallet on-chain, avec un cashback en GNO sur chaque achat. MetaMask Card offre 1-3% en ETH sur les achats, idéale pour les utilisateurs DeFi. Brighty propose 0,5% à 1,75% de cashback en USDC sans staking, avec un IBAN européen intégré. Ces trois cartes se distinguent par leur transparence totale et l'absence de conditions cachées.` },
      { h2: `Rendement réel : cartes sans staking vs cartes avec staking`, p: `La comparaison chiffrée est souvent plus favorable aux cartes sans staking qu'on ne le croit. Exemple : Gnosis Pay offre 2% de cashback en GNO sans staking. Crypto.com Ruby Steel offre 2% en CRO mais exige 350 CRO stakés (~210€ au cours actuel). Sur 500€/mois de dépenses, Gnosis Pay génère 120€/an en GNO, sans immobilisation. Crypto.com génère les mêmes 120€ en CRO, mais avec 210€ de capital bloqué exposé à la volatilité du CRO. Si le CRO baisse de 30%, la valeur stakée fond — rendant la carte a posteriori moins rentable.` },
      { h2: `Cartes sans staking et DeFi : la convergence de ${YEAR}`, p: `En ${YEAR}, les cartes crypto sans staking se rapprochent de la DeFi : Gnosis Pay règle en xDAI on-chain, MetaMask Card débite directement depuis votre wallet Ethereum, Ether.fi Card est adossée à des ETH en staking liquide (vous stakez mais gardez le contrôle). Cette convergence permet de cumuler les avantages du Web3 (self-custody, transparence, rendement DeFi) avec la commodité d'une carte Visa utilisable partout. Pour un utilisateur DeFi, c'est la solution la plus cohérente avec son écosystème existant.` },
      { h2: `FAQ : toutes les questions sur les cartes crypto sans staking`, p: `Peut-on obtenir plus de 2% de cashback sans staking ? En ${YEAR}, 2% reste le plafond des cartes sans staking (Gnosis Pay, Nexo). Une carte sans staking est-elle moins performante ? Non — l'absence de staking est un avantage en soi : votre capital reste liquide et accessible à tout moment. Gnosis Pay est-elle vraiment on-chain ? Oui — chaque transaction est réglée directement sur la Gnosis Chain, visible publiquement sur l'explorateur. Peut-on perdre sa mise avec une carte sans staking ? Non, le risque de perte est limité à la volatilité du cashback reçu (en GNO, ETH ou USDC).` },
    ],
    de: [
      { h2: `Warum eine Krypto-Karte ohne Staking wählen?`, p: `Pflicht-Staking birgt zwei Hauptrisiken: Kapitalimmobilisierung und Wechselkursrisiko bei der gestakten Kryptowährung. Wenn der Kurs während der Lock-up-Periode (oft 180 Tage) einbricht, verlieren Sie doppelt — beim gestakten Wert und durch verpasste Chancen. Eine Karte ohne Staking wie Gnosis Pay oder MetaMask Card bietet sofortigen Cashback ohne diese Einschränkungen und ohne zusätzliches Verlustrisiko.` },
      { h2: `Gnosis Pay, MetaMask Card, Brighty: Vergleich ${YEAR}`, p: `Gnosis Pay ist einzigartig: Die erste Visa-Karte, direkt mit einer On-Chain-Wallet verbunden, mit GNO-Cashback auf jeden Kauf. MetaMask Card bietet 1-3% in ETH, ideal für DeFi-Nutzer. Brighty bietet 0,5% bis 1,75% Cashback in USDC ohne Staking, mit integrierter europäischer IBAN. Diese drei Karten zeichnen sich durch vollständige Transparenz und das Fehlen versteckter Bedingungen aus.` },
      { h2: `Tatsächliche Rendite: Karten ohne Staking vs. mit Staking`, p: `Der Zahlenvergleich fällt oft zugunsten der staking-freien Karten aus. Beispiel: Gnosis Pay bietet 2% Cashback in GNO ohne Staking. Crypto.com Ruby Steel bietet ebenfalls 2% in CRO, erfordert aber 350 CRO im Staking (~210€). Bei 500€ monatlichen Ausgaben generiert Gnosis Pay 120€/Jahr in GNO ohne Kapitalbindung. Crypto.com erzielt denselben Betrag in CRO, bindet aber 210€ Kapital mit CRO-Volatilitätsrisiko. Fällt CRO um 30%, schrumpft der Staking-Wert und verschlechtert die Rentabilität.` },
      { h2: `Karten ohne Staking und DeFi: die Konvergenz in ${YEAR}`, p: `In ${YEAR} nähern sich staking-freie Karten der DeFi an: Gnosis Pay rechnet on-chain in xDAI ab, MetaMask Card belastet direkt Ihre Ethereum-Wallet, Ether.fi Card ist an Liquid-Staking-ETH gebunden. Diese Konvergenz erlaubt es, Web3-Vorteile (Self-Custody, Transparenz, DeFi-Rendite) mit der Bequemlichkeit einer weltweit akzeptierten Visa-Karte zu kombinieren — die logische Wahl für bestehende DeFi-Nutzer.` },
      { h2: `FAQ: Häufige Fragen zu Krypto-Karten ohne Staking`, p: `Kann man ohne Staking mehr als 2% Cashback erhalten? In ${YEAR} bleibt 2% die Obergrenze für staking-freie Karten (Gnosis Pay, Nexo). Ist eine Karte ohne Staking schlechter? Nein — kein Staking ist ein Vorteil an sich: Ihr Kapital bleibt jederzeit liquide und verfügbar. Ist Gnosis Pay wirklich on-chain? Ja — jede Transaktion wird direkt auf der Gnosis Chain abgerechnet und ist im Explorer öffentlich einsehbar. Kann ich mit einer staking-freien Karte Geld verlieren? Das Verlustrisiko beschränkt sich auf die Volatilität des erhaltenen Cashbacks (GNO, ETH oder USDC).` },
    ],
    es: [
      { h2: `¿Por qué preferir una tarjeta crypto sin staking?`, p: `El staking obligatorio presenta dos riesgos principales: inmovilización de capital y exposición al riesgo de cambio de la cripto bloqueada. Si el precio cae durante el período de lock-up (a menudo 180 días), pierdes doblemente — en el valor del staking y en oportunidades perdidas. Una tarjeta sin staking como Gnosis Pay o MetaMask Card te ofrece cashback inmediato sin restricciones ni riesgo adicional de pérdida.` },
      { h2: `Gnosis Pay, MetaMask Card, Brighty: comparativa ${YEAR}`, p: `Gnosis Pay es única: la primera tarjeta Visa conectada directamente a una wallet on-chain, con cashback en GNO en cada compra. MetaMask Card ofrece 1-3% en ETH en las compras, ideal para usuarios DeFi. Brighty propone 0,5% a 1,75% de cashback en USDC sin staking, con IBAN europeo integrado. Estas tres tarjetas destacan por su transparencia total y la ausencia de condiciones ocultas.` },
      { h2: `Rendimiento real: tarjetas sin staking vs tarjetas con staking`, p: `La comparativa numérica suele favorecer a las tarjetas sin staking más de lo que se cree. Ejemplo: Gnosis Pay ofrece un 2% de cashback en GNO sin staking. Crypto.com Ruby Steel ofrece un 2% en CRO pero exige 350 CRO en staking (~210€). Con 500€/mes de gastos, Gnosis Pay genera 120€/año en GNO sin inmovilizar capital. Crypto.com genera lo mismo en CRO, pero con 210€ bloqueados expuestos a la volatilidad del CRO. Si el CRO cae un 30%, el valor en staking se reduce, empeorando la rentabilidad.` },
      { h2: `Tarjetas sin staking y DeFi: la convergencia de ${YEAR}`, p: `En ${YEAR}, las tarjetas sin staking se acercan a la DeFi: Gnosis Pay liquida en xDAI on-chain, MetaMask Card debita directamente desde tu wallet Ethereum, Ether.fi Card está respaldada por ETH en liquid staking. Esta convergencia permite combinar las ventajas del Web3 (autocustodia, transparencia, rendimiento DeFi) con la comodidad de una tarjeta Visa aceptada en todo el mundo — la elección más coherente para usuarios DeFi existentes.` },
      { h2: `FAQ: preguntas frecuentes sobre tarjetas crypto sin staking`, p: `¿Se puede obtener más del 2% de cashback sin staking? En ${YEAR}, el 2% es el techo para tarjetas sin staking (Gnosis Pay, Nexo). ¿Una tarjeta sin staking es inferior? No — la ausencia de staking es una ventaja en sí misma: tu capital permanece líquido y accesible en todo momento. ¿Gnosis Pay es realmente on-chain? Sí — cada transacción se liquida directamente en la Gnosis Chain, visible públicamente en el explorador. ¿Puedo perder dinero con una tarjeta sin staking? El riesgo de pérdida se limita a la volatilidad del cashback recibido (GNO, ETH o USDC).` },
    ],
    it: [
      { h2: `Perché preferire una carta crypto senza staking?`, p: `Lo staking obbligatorio presenta due rischi principali: immobilizzazione del capitale ed esposizione al rischio di cambio sulla cripto in staking. Se il prezzo crolla durante il periodo di lock-up (spesso 180 giorni), perdi due volte — sul valore dello staking e sulle opportunità mancate. Una carta senza staking come Gnosis Pay o MetaMask Card offre cashback immediato senza vincoli né rischio aggiuntivo.` },
      { h2: `Gnosis Pay, MetaMask Card, Brighty: confronto ${YEAR}`, p: `Gnosis Pay è unica: la prima carta Visa collegata direttamente a un wallet on-chain, con cashback in GNO su ogni acquisto. MetaMask Card offre 1-3% in ETH sugli acquisti, ideale per gli utenti DeFi. Brighty propone dallo 0,5% all'1,75% di cashback in USDC senza staking, con IBAN europeo integrato. Queste tre carte si distinguono per trasparenza totale e assenza di condizioni nascoste.` },
      { h2: `Rendimento reale: carte senza staking vs carte con staking`, p: `Il confronto numerico spesso favorisce le carte senza staking più di quanto si pensi. Esempio: Gnosis Pay offre il 2% di cashback in GNO senza staking. Crypto.com Ruby Steel offre il 2% in CRO ma richiede 350 CRO in staking (~210€). Con 500€/mese di spese, Gnosis Pay genera 120€/anno in GNO senza immobilizzare capitale. Crypto.com genera lo stesso importo in CRO, ma con 210€ bloccati esposti alla volatilità del CRO. Se il CRO scende del 30%, il valore in staking si riduce, peggiorando la redditività.` },
      { h2: `Carte senza staking e DeFi: la convergenza del ${YEAR}`, p: `Nel ${YEAR}, le carte senza staking si avvicinano alla DeFi: Gnosis Pay regola in xDAI on-chain, MetaMask Card addebita direttamente dal tuo wallet Ethereum, Ether.fi Card è ancorata a ETH in liquid staking. Questa convergenza permette di combinare i vantaggi del Web3 (self-custody, trasparenza, rendimento DeFi) con la comodità di una carta Visa accettata ovunque — la scelta più coerente per gli utenti DeFi esistenti.` },
      { h2: `FAQ: domande frequenti sulle carte crypto senza staking`, p: `Si può ottenere più del 2% di cashback senza staking? Nel ${YEAR}, il 2% è il massimo per le carte senza staking (Gnosis Pay, Nexo). Una carta senza staking è peggiore? No — l'assenza di staking è un vantaggio in sé: il tuo capitale rimane liquido e disponibile in qualsiasi momento. Gnosis Pay è davvero on-chain? Sì — ogni transazione viene regolata direttamente sulla Gnosis Chain, visibile pubblicamente nell'explorer. Posso perdere denaro con una carta senza staking? Il rischio di perdita è limitato alla volatilità del cashback ricevuto (GNO, ETH o USDC).` },
    ],
    en: [
      { h2: `Why choose a crypto card without staking requirements?`, p: `Mandatory staking carries two major risks: capital lockup and exchange rate exposure on the staked cryptocurrency. If the price crashes during the lock-up period (often 180 days), you lose twice — on the staked value and through missed opportunities elsewhere. A no-staking card like Gnosis Pay or MetaMask Card gives you immediate cashback without these constraints and with no additional loss risk.` },
      { h2: `Gnosis Pay, MetaMask Card, Brighty: ${YEAR} comparison`, p: `Gnosis Pay is unique: the first Visa card connected directly to an on-chain wallet, with GNO cashback on every purchase. MetaMask Card offers 1-3% in ETH, ideal for DeFi users. Brighty provides 0.5% to 1.75% cashback in USDC with no staking, plus a built-in European IBAN. All three stand out for full transparency and complete absence of hidden conditions.` },
      { h2: `Real returns: no-staking cards vs staking cards`, p: `The numbers often favour no-staking cards more than most people expect. Example: Gnosis Pay offers 2% cashback in GNO with no staking. Crypto.com Ruby Steel also offers 2% in CRO but requires 350 CRO staked (~€210). At €500/month spending, Gnosis Pay generates €120/year in GNO with zero capital locked. Crypto.com generates the same amount in CRO, but with €210 tied up and exposed to CRO volatility. If CRO drops 30%, the staked value shrinks — making the card retroactively less profitable.` },
      { h2: `No-staking cards and DeFi: the ${YEAR} convergence`, p: `In ${YEAR}, no-staking crypto cards are converging with DeFi: Gnosis Pay settles on-chain in xDAI, MetaMask Card debits directly from your Ethereum wallet, Ether.fi Card is backed by liquid-staked ETH. This convergence lets you combine Web3 advantages (self-custody, transparency, DeFi yield) with the convenience of a Visa card accepted worldwide — the most coherent choice for existing DeFi users.` },
      { h2: `FAQ: common questions about no-staking crypto cards`, p: `Can you get more than 2% cashback without staking? In ${YEAR}, 2% is the ceiling for no-staking cards (Gnosis Pay, Nexo). Is a no-staking card worse? No — no staking is an advantage in itself: your capital stays liquid and accessible at all times. Is Gnosis Pay truly on-chain? Yes — every transaction settles directly on the Gnosis Chain, publicly visible in the explorer. Can I lose money with a no-staking card? The loss risk is limited to the volatility of the cashback received (GNO, ETH, or USDC).` },
    ],
  },
  travel: {
    fr: [
      { h2: `Quelle carte crypto choisir pour voyager à l'étranger ?`, p: `Pour les voyages, trois critères sont prioritaires : l'absence de frais de change sur les devises étrangères, des retraits DAB gratuits à l'étranger et une acceptation mondiale via Visa ou Mastercard. Crypto.com offre jusqu'à 400€/mois de retraits gratuits sur les niveaux supérieurs. Bybit et Nexo proposent également des avantages voyage avec cashback en crypto sur tous les achats à l'étranger, quelle que soit la devise locale.` },
      { h2: `Frais de change et retraits DAB avec une carte crypto`, p: `La plupart des cartes crypto facturent 0% de frais sur les achats en devises étrangères — un avantage majeur par rapport aux cartes bancaires classiques (1,5% à 3%). En revanche, les retraits DAB sont souvent plafonnés selon le niveau de la carte. Vérifiez le plafond mensuel gratuit avant de partir : il varie de 200€ (niveaux d'entrée) à illimité (niveaux premium) selon les émetteurs. Au-delà du plafond, des frais de 2% s'appliquent généralement.` },
      { h2: `Assurances voyage et avantages premium des cartes crypto`, p: `Les cartes crypto des niveaux supérieurs incluent souvent des assurances voyage intégrées : Crypto.com Jade, Indigo et Obsidian couvrent les annulations de vol, les retards de bagages et les urgences médicales jusqu'à 10 millions de dollars. Bybit Voyager et Nexo offrent des protections similaires. Ces assurances peuvent remplacer votre assurance voyage annuelle classique (60 à 150€/an) — un avantage souvent sous-estimé. Vérifiez les conditions de couverture (activation de la carte, montant minimum de transaction) dans les CGU avant de partir.` },
      { h2: `Quelle carte pour quel type de voyage ?`, p: `Le choix optimal dépend de votre profil de voyageur. Pour les voyageurs fréquents (10+ vols/an), Crypto.com Jade ou Indigo maximisent la valeur avec les lounges Priority Pass, le remboursement Airbnb et Expedia, et les assurances voyage complètes. Pour les voyageurs occasionnels, Bybit ou Nexo offrent un bon cashback sur les achats en devises étrangères sans exiger un staking trop important. Pour les backpackers et voyageurs long terme, Brighty ou MetaMask Card sont idéales : gratuites, sans frais FX, utilisables sur Visa partout dans le monde, avec cashback dès le premier achat.` },
      { h2: `Conseils pratiques pour utiliser votre carte crypto en voyage`, p: `Avant de partir : activez votre carte et effectuez un premier paiement en France pour vérifier son bon fonctionnement. Notez le plafond mensuel de retrait DAB gratuit de votre carte. En voyage : payez toujours en devise locale (refusez la conversion DCC proposée par le commerçant — elle coûte 3 à 5% de plus). Conservez une carte bancaire classique en secours. En cas de problème : le support Crypto.com et Nexo est disponible 24h/24 via live chat. MetaMask Card dispose d'un support communautaire Discord réactif. Prévoyez toujours un petit montant en cash local pour les situations d'urgence.` },
    ],
    de: [
      { h2: `Welche Krypto-Karte für Auslandsreisen wählen?`, p: `Für Reisen sind drei Kriterien vorrangig: keine Wechselgebühren für Fremdwährungen, kostenlose Geldautomaten-Abhebungen im Ausland und weltweite Akzeptanz über Visa oder Mastercard. Crypto.com bietet bis zu 400€/Monat kostenlose Abhebungen auf höheren Stufen. Bybit und Nexo bieten ebenfalls Reisevorteile mit Krypto-Cashback auf alle Auslandskäufe, unabhängig von der Landeswährung.` },
      { h2: `Wechselgebühren und Geldautomaten-Abhebungen mit Krypto-Karten`, p: `Die meisten Krypto-Karten berechnen 0% Gebühren auf Fremdwährungskäufe — ein großer Vorteil gegenüber herkömmlichen Bankkarten (1,5% bis 3%). Allerdings sind Geldautomaten-Abhebungen oft nach Kartenstufe begrenzt. Prüfen Sie das kostenlose Monatslimit vor der Reise: Es variiert je nach Emittent von 200€ (Einstiegsstufen) bis unbegrenzt (Premium-Stufen). Darüber hinaus fallen in der Regel 2% Gebühren an.` },
      { h2: `Reiseversicherungen und Premium-Vorteile von Krypto-Karten`, p: `Krypto-Karten der höheren Stufen enthalten oft integrierte Reiseversicherungen: Crypto.com Jade, Indigo und Obsidian decken Flugannullierungen, Gepäckverspätungen und medizinische Notfälle bis zu 10 Millionen Dollar ab. Bybit Voyager und Nexo bieten ähnlichen Schutz. Diese Versicherungen können Ihre klassische Jahresreiseversicherung (60-150€/Jahr) ersetzen — ein oft unterschätzter Vorteil. Prüfen Sie die Deckungsbedingungen (Kartenaktivierung, Mindesttransaktionsbetrag) in den AGB vor Ihrer Reise.` },
      { h2: `Welche Karte für welchen Reisetyp?`, p: `Die optimale Wahl hängt von Ihrem Reiseprofil ab. Für Vielreisende (10+ Flüge/Jahr) maximieren Crypto.com Jade oder Indigo den Wert mit Priority Pass Lounges, Airbnb- und Expedia-Erstattungen und umfassenden Reiseversicherungen. Für Gelegenheitsreisende bieten Bybit oder Nexo gutes Cashback auf Fremdwährungskäufe ohne zu hohe Staking-Anforderungen. Für Backpacker und Langzeitreisende sind Brighty oder MetaMask Card ideal: kostenlos, keine FX-Gebühren, weltweit über Visa nutzbar, mit Cashback ab dem ersten Kauf.` },
      { h2: `Praktische Tipps für die Nutzung Ihrer Krypto-Karte im Urlaub`, p: `Vor der Reise: Aktivieren Sie Ihre Karte und führen Sie eine erste Zahlung in Deutschland durch, um die Funktionsfähigkeit zu prüfen. Notieren Sie das kostenlose monatliche Abhebungslimit Ihrer Karte. Unterwegs: Zahlen Sie immer in der Landeswährung (lehnen Sie die DCC-Konvertierung ab — sie kostet 3 bis 5% mehr). Halten Sie eine klassische Bankkarte als Reserve bereit. Bei Problemen: Crypto.com und Nexo Support sind 24/7 per Live-Chat erreichbar. MetaMask Card hat einen reaktionsschnellen Discord-Community-Support. Halten Sie immer etwas Bargeld in der Landeswährung für Notfälle bereit.` },
    ],
    es: [
      { h2: `¿Qué tarjeta crypto elegir para viajar al extranjero?`, p: `Para los viajes, tres criterios son prioritarios: ausencia de comisiones por divisas extranjeras, retiradas de cajero gratuitas en el extranjero y aceptación mundial a través de Visa o Mastercard. Crypto.com ofrece hasta 400€/mes de retiradas gratuitas en los niveles superiores. Bybit y Nexo también ofrecen ventajas de viaje con cashback en crypto en todas las compras en el extranjero, independientemente de la moneda local.` },
      { h2: `Comisiones de cambio y retiradas de cajero con tarjeta crypto`, p: `La mayoría de las tarjetas crypto cobran 0% de comisiones en compras en divisas extranjeras — una ventaja importante frente a las tarjetas bancarias clásicas (1,5% a 3%). Sin embargo, las retiradas de cajero suelen estar limitadas según el nivel de la tarjeta. Comprueba el límite mensual gratuito antes de viajar: varía de 200€ (niveles de entrada) a ilimitado (niveles premium). Por encima del límite, suelen aplicarse comisiones del 2%.` },
      { h2: `Seguros de viaje y ventajas premium de las tarjetas crypto`, p: `Las tarjetas crypto de niveles superiores incluyen a menudo seguros de viaje integrados: Crypto.com Jade, Indigo y Obsidian cubren cancelaciones de vuelo, retrasos de equipaje y emergencias médicas hasta 10 millones de dólares. Bybit Voyager y Nexo ofrecen protecciones similares. Estos seguros pueden sustituir tu seguro de viaje anual clásico (60-150€/año) — una ventaja frecuentemente subestimada. Revisa las condiciones de cobertura (activación de la tarjeta, importe mínimo de transacción) en los términos y condiciones antes de partir.` },
      { h2: `¿Qué tarjeta para qué tipo de viajero?`, p: `La elección óptima depende de tu perfil de viajero. Para viajeros frecuentes (10+ vuelos/año), Crypto.com Jade o Indigo maximizan el valor con lounges Priority Pass, reembolsos de Airbnb y Expedia y seguros de viaje completos. Para viajeros ocasionales, Bybit o Nexo ofrecen buen cashback en compras en divisas extranjeras sin exigir demasiado staking. Para mochileros y viajeros de larga estancia, Brighty o MetaMask Card son ideales: gratuitas, sin comisiones FX, utilizables con Visa en todo el mundo, con cashback desde la primera compra.` },
      { h2: `Consejos prácticos para usar tu tarjeta crypto de viaje`, p: `Antes de partir: activa tu tarjeta y realiza un primer pago en España para verificar su funcionamiento. Anota el límite mensual de retirada gratuita en cajero de tu tarjeta. Durante el viaje: paga siempre en moneda local (rechaza la conversión DCC que ofrece el comercio — cuesta entre un 3 y un 5% más). Guarda una tarjeta bancaria clásica como respaldo. En caso de problema: el soporte de Crypto.com y Nexo está disponible 24h/24 por chat en directo. MetaMask Card cuenta con un soporte comunitario Discord muy reactivo. Ten siempre un pequeño importe en efectivo local para situaciones de emergencia.` },
    ],
    it: [
      { h2: `Quale carta crypto scegliere per viaggiare all'estero?`, p: `Per i viaggi, tre criteri sono prioritari: assenza di commissioni su valute straniere, prelievi gratuiti agli ATM all'estero e accettazione mondiale tramite Visa o Mastercard. Crypto.com offre fino a 400€/mese di prelievi gratuiti sui livelli superiori. Bybit e Nexo propongono anche vantaggi viaggio con cashback in crypto su tutti gli acquisti all'estero, indipendentemente dalla valuta locale.` },
      { h2: `Commissioni di cambio e prelievi ATM con carta crypto`, p: `La maggior parte delle carte crypto applica 0% di commissioni sugli acquisti in valuta straniera — un grande vantaggio rispetto alle carte bancarie classiche (1,5% a 3%). Tuttavia, i prelievi ATM sono spesso limitati in base al livello della carta. Verifica il limite mensile gratuito prima di partire: varia da 200€ (livelli base) a illimitato (livelli premium). Oltre il limite, si applicano generalmente commissioni del 2%.` },
      { h2: `Assicurazioni viaggio e vantaggi premium delle carte crypto`, p: `Le carte crypto dei livelli superiori includono spesso assicurazioni viaggio integrate: Crypto.com Jade, Indigo e Obsidian coprono cancellazioni di volo, ritardi bagagli ed emergenze mediche fino a 10 milioni di dollari. Bybit Voyager e Nexo offrono protezioni simili. Queste assicurazioni possono sostituire la tua classica assicurazione viaggio annuale (60-150€/anno) — un vantaggio spesso sottovalutato. Verifica le condizioni di copertura (attivazione della carta, importo minimo di transazione) nelle condizioni generali prima di partire.` },
      { h2: `Quale carta per quale tipo di viaggio?`, p: `La scelta ottimale dipende dal tuo profilo di viaggiatore. Per i grandi viaggiatori (10+ voli/anno), Crypto.com Jade o Indigo massimizzano il valore con lounge Priority Pass, rimborsi Airbnb ed Expedia e assicurazioni viaggio complete. Per i viaggiatori occasionali, Bybit o Nexo offrono buon cashback sugli acquisti in valuta straniera senza richiedere troppo staking. Per backpacker e viaggiatori a lungo termine, Brighty o MetaMask Card sono ideali: gratuite, senza commissioni FX, utilizzabili su Visa in tutto il mondo, con cashback dal primo acquisto.` },
      { h2: `Consigli pratici per usare la carta crypto in viaggio`, p: `Prima di partire: attiva la carta ed effettua un primo pagamento in Italia per verificarne il funzionamento. Annota il limite mensile di prelievo gratuito agli ATM della tua carta. Durante il viaggio: paga sempre in valuta locale (rifiuta la conversione DCC proposta dal commerciante — costa tra il 3 e il 5% in più). Conserva una carta bancaria classica come backup. In caso di problemi: il supporto di Crypto.com e Nexo è disponibile 24h/24 tramite live chat. MetaMask Card ha un supporto Discord reattivo. Tieni sempre con te una piccola somma in contanti locali per le emergenze.` },
    ],
    en: [
      { h2: `Which crypto card to choose for travelling abroad?`, p: `For travel, three criteria are paramount: no foreign exchange fees, free ATM withdrawals abroad and worldwide acceptance via Visa or Mastercard. Crypto.com offers up to €400/month in free withdrawals on higher tiers. Bybit and Nexo also offer compelling travel benefits with crypto cashback on all foreign purchases, regardless of the local currency used.` },
      { h2: `Foreign exchange fees and ATM withdrawals with crypto cards`, p: `Most crypto cards charge 0% fees on foreign currency purchases — a major advantage over traditional bank cards (1.5% to 3% in fees). However, ATM withdrawals are often capped based on card tier. Check your free monthly limit before travelling: it ranges from €200 (entry tiers) to unlimited (premium tiers) depending on the issuer. Beyond the limit, a 2% fee typically applies.` },
      { h2: `Travel insurance and premium perks on crypto cards`, p: `Higher-tier crypto cards frequently include integrated travel insurance: Crypto.com Jade, Indigo and Obsidian cover flight cancellations, baggage delays and medical emergencies up to $10 million. Bybit Voyager and Nexo offer similar protection. These policies can replace a standalone annual travel insurance plan (€60-€150/year) — an often underrated benefit. Check the coverage conditions (card activation requirement, minimum transaction amount) in the terms and conditions before your trip.` },
      { h2: `Which card for which type of traveller?`, p: `The optimal choice depends on your travel profile. For frequent flyers (10+ flights/year), Crypto.com Jade or Indigo maximise value with Priority Pass lounges, Airbnb and Expedia reimbursements, and comprehensive travel insurance. For occasional travellers, Bybit or Nexo provide solid cashback on foreign currency purchases without excessive staking requirements. For backpackers and long-term travellers, Brighty or MetaMask Card are ideal: free, no FX fees, usable on Visa worldwide, with cashback from the very first purchase.` },
      { h2: `Practical tips for using your crypto card while travelling`, p: `Before you leave: activate your card and make a first payment at home to confirm it works. Note your card's free monthly ATM withdrawal limit. While travelling: always pay in local currency (decline the DCC conversion offered by merchants — it costs 3 to 5% extra). Keep a classic bank card as backup. If problems arise: Crypto.com and Nexo support are available 24/7 via live chat. MetaMask Card has a responsive Discord community for support. Always carry a small amount of local cash for emergencies.` },
    ],
  },
  'no-fees': {
    fr: [
      { h2: `Pourquoi choisir une carte crypto sans frais annuels ?`, p: `Les frais annuels d'une carte crypto peuvent atteindre 180€/an pour les niveaux premium. Avant de payer, calculez si les avantages (cashback, lounges, abonnements) dépassent ce coût. Pour un utilisateur dépensant 500€/mois avec un cashback de 1%, le gain annuel est de 60€ — bien en deçà des 180€ de frais. Les cartes gratuites comme MetaMask Card, Gnosis Pay ou Brighty offrent un excellent point d'entrée sans engagement financier.` },
      { h2: `Cartes crypto gratuites : MetaMask, Gnosis Pay, Brighty — comparatif ${YEAR}`, p: `MetaMask Card est entièrement gratuite (0€/an), disponible sur Visa, avec un cashback de 1% en ETH sur les achats courants — sans staking obligatoire. Gnosis Pay, gratuite également, est unique en tant que carte on-chain native, avec cashback en GNO. Brighty propose une carte USDC gratuite avec IBAN européen intégré et jusqu'à 1,75% de cashback. Ces trois options cumulent les avantages des fintech traditionnelles et de la DeFi.` },
      { h2: `Frais cachés des cartes crypto "gratuites" : ce qu'il faut vérifier`, p: `Une carte sans frais annuels peut néanmoins générer des coûts indirects. Les plus courants : frais de change sur les achats en devises étrangères (généralement 0 à 3%), frais ATM au-delà d'un plafond mensuel gratuit (200 à 400€ selon les cartes), et parfois des frais d'inactivité si la carte n'est pas utilisée pendant 12 mois. Avant de vous inscrire, lisez le tableau des frais complet sur le site officiel. Gnosis Pay et MetaMask Card se distinguent par une transparence totale sur leurs conditions tarifaires, sans surprise.` },
      { h2: `Quelle carte crypto gratuite choisir selon votre usage ?`, p: `Votre choix dépend de votre profil. Si vous êtes déjà utilisateur DeFi avec un wallet Ethereum, MetaMask Card s'intègre naturellement — aucun compte centralisé requis. Si vous voulez une carte adossée à un stablecoin (USDC) avec un IBAN européen pour recevoir votre salaire, Brighty est idéale. Si vous préférez une carte on-chain entièrement décentralisée avec règlement en xDAI, Gnosis Pay est la plus avancée techniquement. Pour les utilisateurs qui veulent simplement un cashback simple sans frais et sans crypto complexe, Revolut (niveau Standard) reste une option solide dans l'UE, combinant banque et crypto dans une seule app.` },
      { h2: `Cartes crypto sans frais et staking : sont-elles vraiment rentables ?`, p: `Oui — et souvent plus que les cartes premium avec staking. Prenons MetaMask Card : 0€/an de frais, 1% de cashback en ETH sur tous les achats. Pour 1 000€ de dépenses mensuelles, vous accumulez 120€ de cashback annuel en ETH sans immobiliser de capital. Comparez à Crypto.com Ruby Steel : 10€/mois = 120€/an de frais + 2% de cashback (soit 240€/an sur 1 000€/mois) — gain net de 120€, identique à MetaMask Card, mais avec 350€ de CRO bloqués. Plus le CRO baisse, moins ce calcul est favorable. Les cartes gratuites sans staking éliminent ce risque entièrement.` },
    ],
    de: [
      { h2: `Warum eine Krypto-Karte ohne Jahresgebühren wählen?`, p: `Die Jahresgebühren einer Krypto-Karte können für Premium-Stufen bis zu 180€/Jahr betragen. Bevor Sie zahlen, prüfen Sie, ob die Vorteile (Cashback, Lounges, Abos) diese Kosten übersteigen. Für einen Nutzer mit 500€ Monatsausgaben und 1% Cashback beträgt der Jahresgewinn 60€ — weit unter 180€ Gebühren. Kostenlose Karten wie MetaMask Card, Gnosis Pay oder Brighty bieten einen hervorragenden Einstieg ohne finanzielle Verpflichtung.` },
      { h2: `Kostenlose Krypto-Karten: MetaMask, Gnosis Pay, Brighty — Vergleich ${YEAR}`, p: `MetaMask Card ist völlig kostenlos (0€/Jahr), auf Visa verfügbar, mit 1% Cashback in ETH auf alltägliche Einkäufe — ohne Pflicht-Staking. Gnosis Pay, ebenfalls kostenlos, ist einzigartig als native On-Chain-Karte mit GNO-Cashback. Brighty bietet eine kostenlose USDC-Karte mit integrierter europäischer IBAN und bis zu 1,75% Cashback. Alle drei vereinen die Vorteile traditioneller Fintechs und DeFi.` },
      { h2: `Versteckte Gebühren bei "kostenlosen" Krypto-Karten: Was Sie prüfen sollten`, p: `Eine Karte ohne Jahresgebühr kann dennoch indirekte Kosten verursachen. Die häufigsten: Wechselgebühren auf Fremdwährungskäufe (0 bis 3%), ATM-Gebühren über dem kostenlosen Monatslimit (200 bis 400€ je nach Karte) und manchmal Inaktivitätsgebühren nach 12 Monaten ohne Nutzung. Lesen Sie immer die vollständige Gebührentabelle auf der offiziellen Website. Gnosis Pay und MetaMask Card zeichnen sich durch vollständige Transparenz über ihre Konditionen aus, ohne Überraschungen.` },
      { h2: `Welche kostenlose Krypto-Karte für welches Nutzungsprofil?`, p: `Ihre Wahl hängt von Ihrem Profil ab. DeFi-Nutzer mit einem Ethereum-Wallet wählen MetaMask Card — kein zentrales Konto erforderlich. Wenn Sie eine an einen Stablecoin (USDC) gebundene Karte mit europäischer IBAN für Ihr Gehalt möchten, ist Brighty ideal. Für eine vollständig dezentralisierte On-Chain-Karte mit xDAI-Abrechnung ist Gnosis Pay die technisch fortschrittlichste Option. Für einfaches Cashback ohne Crypto-Komplexität bleibt Revolut (Standard) eine solide Option in Deutschland, die Banking und Crypto in einer App vereint.` },
      { h2: `Kostenlose Krypto-Karten ohne Staking: Sind sie wirklich rentabel?`, p: `Ja — und oft rentabler als Premium-Karten mit Staking. Nehmen wir MetaMask Card: 0€/Jahr Gebühren, 1% ETH-Cashback auf alle Einkäufe. Bei 1.000€ monatlichen Ausgaben akkumulieren Sie 120€ Jahres-Cashback in ETH ohne gebundenes Kapital. Im Vergleich: Crypto.com Ruby Steel — 10€/Monat = 120€/Jahr Gebühren + 2% Cashback (240€/Jahr bei 1.000€/Monat) — Nettogewinn von 120€, identisch mit MetaMask Card, aber mit 350€ CRO blockiert. Je stärker CRO fällt, desto ungünstiger diese Rechnung. Kostenlose Karten ohne Staking eliminieren dieses Risiko vollständig.` },
    ],
    es: [
      { h2: `¿Por qué elegir una tarjeta crypto sin comisiones anuales?`, p: `Las comisiones anuales de una tarjeta crypto pueden alcanzar los 180€/año en los niveles premium. Antes de pagar, calcula si las ventajas (cashback, lounges, suscripciones) superan ese coste. Para un usuario que gasta 500€/mes con un cashback del 1%, la ganancia anual es de 60€ — muy por debajo de los 180€ de comisiones. Tarjetas gratuitas como MetaMask Card, Gnosis Pay o Brighty ofrecen un excelente punto de entrada sin compromiso financiero.` },
      { h2: `Tarjetas crypto gratuitas: MetaMask, Gnosis Pay, Brighty — comparativa ${YEAR}`, p: `MetaMask Card es completamente gratuita (0€/año), disponible en Visa, con un cashback del 1% en ETH en compras cotidianas — sin staking obligatorio. Gnosis Pay, también gratuita, es única como tarjeta on-chain nativa, con cashback en GNO. Brighty propone una tarjeta USDC gratuita con IBAN europeo integrado y hasta el 1,75% de cashback. Estas tres opciones combinan las ventajas de las fintech tradicionales y la DeFi.` },
      { h2: `Comisiones ocultas de las tarjetas crypto "gratuitas": qué debes verificar`, p: `Una tarjeta sin comisiones anuales puede generar costes indirectos. Los más habituales: comisiones de cambio en compras con divisas extranjeras (0 a 3%), comisiones en cajeros automáticos más allá del límite mensual gratuito (200 a 400€ según la tarjeta) y, en ocasiones, comisiones por inactividad tras 12 meses sin uso. Lee siempre la tabla de comisiones completa en el sitio oficial. Gnosis Pay y MetaMask Card destacan por su transparencia total en las condiciones tarifarias, sin sorpresas.` },
      { h2: `¿Qué tarjeta crypto gratuita elegir según tu perfil?`, p: `Tu elección depende de tu perfil. Si ya eres usuario DeFi con un wallet Ethereum, MetaMask Card se integra de forma natural — sin cuenta centralizada. Si quieres una tarjeta respaldada por un stablecoin (USDC) con IBAN europeo para recibir tu nómina, Brighty es ideal. Para una tarjeta on-chain completamente descentralizada con liquidación en xDAI, Gnosis Pay es la más avanzada técnicamente. Para quienes quieren cashback simple sin complicaciones cripto, Revolut (nivel Standard) sigue siendo una opción sólida en España, combinando banca y cripto en una sola app.` },
      { h2: `Tarjetas crypto gratuitas sin staking: ¿son realmente rentables?`, p: `Sí — y a menudo más que las tarjetas premium con staking. Tomemos MetaMask Card: 0€/año de comisiones, 1% de cashback en ETH en todas las compras. Con 1.000€ de gastos mensuales, acumulas 120€ de cashback anual en ETH sin inmovilizar capital. Comparado con Crypto.com Ruby Steel: 10€/mes = 120€/año de comisiones + 2% cashback (240€/año con 1.000€/mes) — ganancia neta de 120€, idéntica a MetaMask Card, pero con 350€ de CRO bloqueados. Cuanto más baja el CRO, menos favorable es este cálculo. Las tarjetas gratuitas sin staking eliminan ese riesgo por completo.` },
    ],
    it: [
      { h2: `Perché scegliere una carta crypto senza commissioni annuali?`, p: `Le commissioni annuali di una carta crypto possono arrivare a 180€/anno per i livelli premium. Prima di pagare, verifica se i vantaggi (cashback, lounge, abbonamenti) superano questo costo. Per un utente che spende 500€/mese con un cashback dell'1%, il guadagno annuale è di 60€ — ben al di sotto dei 180€ di commissioni. Carte gratuite come MetaMask Card, Gnosis Pay o Brighty offrono un ottimo punto di partenza senza impegno finanziario.` },
      { h2: `Carte crypto gratuite: MetaMask, Gnosis Pay, Brighty — confronto ${YEAR}`, p: `MetaMask Card è completamente gratuita (0€/anno), disponibile su Visa, con cashback dell'1% in ETH sugli acquisti quotidiani — senza staking obbligatorio. Gnosis Pay, anch'essa gratuita, è unica come carta on-chain nativa, con cashback in GNO. Brighty propone una carta USDC gratuita con IBAN europeo integrato e fino all'1,75% di cashback. Queste tre opzioni combinano i vantaggi delle fintech tradizionali e della DeFi.` },
      { h2: `Costi nascosti delle carte crypto "gratuite": cosa verificare`, p: `Una carta senza commissioni annuali può comunque generare costi indiretti. I più comuni: commissioni di cambio sugli acquisti in valuta straniera (da 0 a 3%), commissioni ATM oltre il limite mensile gratuito (200-400€ secondo la carta) e talvolta commissioni di inattività dopo 12 mesi senza utilizzo. Leggi sempre la tabella delle commissioni completa sul sito ufficiale. Gnosis Pay e MetaMask Card si distinguono per la totale trasparenza sulle condizioni tariffarie, senza sorprese.` },
      { h2: `Quale carta crypto gratuita scegliere in base al tuo profilo?`, p: `La scelta dipende dal tuo profilo. Se sei già un utente DeFi con un wallet Ethereum, MetaMask Card si integra naturalmente — nessun conto centralizzato richiesto. Se vuoi una carta ancorata a uno stablecoin (USDC) con IBAN europeo per ricevere lo stipendio, Brighty è ideale. Per una carta on-chain completamente decentralizzata con liquidazione in xDAI, Gnosis Pay è la più avanzata tecnicamente. Per chi vuole semplicemente cashback senza complessità cripto, Revolut (livello Standard) rimane un'opzione solida in Italia, combinando banca e crypto in un'unica app.` },
      { h2: `Carte crypto gratuite senza staking: sono davvero convenienti?`, p: `Sì — e spesso più delle carte premium con staking. Prendiamo MetaMask Card: 0€/anno di commissioni, 1% di cashback in ETH su tutti gli acquisti. Con 1.000€ di spese mensili, accumuli 120€ di cashback annuale in ETH senza immobilizzare capitale. A confronto, Crypto.com Ruby Steel: 10€/mese = 120€/anno di commissioni + 2% cashback (240€/anno con 1.000€/mese) — guadagno netto di 120€, identico a MetaMask Card, ma con 350€ di CRO bloccati. Più il CRO scende, meno questo calcolo è favorevole. Le carte gratuite senza staking eliminano questo rischio completamente.` },
    ],
    en: [
      { h2: `Why choose a crypto card with no annual fees?`, p: `Annual fees on a crypto card can reach €180/year at premium tiers. Before paying, calculate whether the benefits (cashback, lounges, subscriptions) actually exceed that cost. For a user spending €500/month at 1% cashback, the annual gain is €60 — well below €180 in fees. Free cards like MetaMask Card, Gnosis Pay and Brighty offer a great entry point with zero financial commitment.` },
      { h2: `Free crypto cards: MetaMask, Gnosis Pay, Brighty — ${YEAR} comparison`, p: `MetaMask Card is completely free (€0/year), Visa-powered, with 1% ETH cashback on everyday purchases — no staking required. Gnosis Pay, also free, is unique as a native on-chain card with GNO cashback. Brighty offers a free USDC card with a built-in European IBAN and up to 1.75% cashback. All three combine the best of traditional fintech with DeFi transparency.` },
      { h2: `Hidden fees on "free" crypto cards: what to check`, p: `A card with no annual fee can still generate indirect costs. The most common: foreign exchange fees on purchases in foreign currencies (0 to 3%), ATM fees beyond the free monthly limit (€200-€400 depending on the card), and sometimes inactivity fees after 12 months without use. Always read the full fee schedule on the official website before signing up. Gnosis Pay and MetaMask Card stand out for complete transparency on their fee conditions, with no surprises.` },
      { h2: `Which free crypto card suits your usage profile?`, p: `Your choice depends on your profile. If you're already a DeFi user with an Ethereum wallet, MetaMask Card integrates naturally — no centralised account required. If you want a card backed by a stablecoin (USDC) with a European IBAN to receive your salary, Brighty is ideal. For a fully decentralised on-chain card settling in xDAI, Gnosis Pay is the most technically advanced. For users who want simple cashback without crypto complexity, Revolut (Standard tier) remains a solid option across the EU, combining banking and crypto in a single app.` },
      { h2: `Free no-staking crypto cards: are they actually profitable?`, p: `Yes — and often more so than premium staking cards. Take MetaMask Card: €0/year in fees, 1% ETH cashback on all purchases. At €1,000 monthly spending, you accumulate €120 in annual ETH cashback without locking up any capital. Compare with Crypto.com Ruby Steel: €10/month = €120/year in fees + 2% cashback (€240/year at €1,000/month) — a net gain of €120, identical to MetaMask Card, but with €350 of CRO locked. The more CRO falls, the worse this calculation becomes. Free no-staking cards eliminate this risk entirely.` },
    ],
  },
  rewards: {
    fr: [
      { h2: `Quelles récompenses valent vraiment le coup sur une carte crypto ?`, p: `L'accès aux lounges d'aéroport vaut environ 30-40€ par visite (prix journalier Priority Pass). Si vous prenez 6 vols par an, cela représente 180-240€ d'économies annuelles. Netflix offert représente 167€/an, Spotify 120€/an. En additionnant ces avantages, une carte Crypto.com Jade ou Bybit Voyager peut s'autofinancer même avec des frais annuels modérés — à condition d'utiliser réellement chaque avantage.` },
      { h2: `Crypto.com, Nexo, Bybit : quelles récompenses pour chaque profil ?`, p: `Crypto.com brille pour les grands voyageurs : lounges, remboursement Airbnb (10%), Expedia (10%), Netflix et Spotify. Nexo offre du cashback en BTC ou NEXO sur tous les achats, idéal pour les accumulateurs. Bybit propose des remboursements similaires avec une exigence de staking moindre. Pour les utilisateurs quotidiens sans voyage fréquent, Gnosis Pay et MetaMask Card optimisent le cashback pur sans avantages lifestyle superflus.` },
      { h2: `Récompenses crypto vs miles d'avion : que choisir ?`, p: `La question revient souvent chez les voyageurs actifs. Les miles d'avion (programme Flying Blue, Miles & More) s'accumulent vite mais perdent de la valeur en cas de non-utilisation et sont liés à des dates de péremption. Le cashback en BTC ou ETH, lui, ne périme jamais et peut s'apprécier avec le marché. Nexo et Crypto.com permettent même de cumuler cashback crypto ET avantages voyage. Si vous voyagez en Europe avec des compagnies low-cost, le cashback crypto est souvent plus rentable que des miles qui ne couvrent pas ces vols.` },
      { h2: `Comment maximiser ses récompenses avec une carte crypto ?`, p: `Pour tirer le maximum de votre carte à récompenses, concentrez toutes vos dépenses récurrentes sur cette carte : abonnements (streaming, gym, logiciels), courses alimentaires, restaurants, transports. Vérifiez si votre carte propose des taux de cashback boostés pour certaines catégories — certaines cartes Crypto.com offrent 10% de remboursement sur Airbnb ou Expedia. Rechargez votre carte en crypto pour éviter les frais de conversion, et consultez régulièrement votre historique de cashback pour vérifier que les récompenses sont bien créditées.` },
      { h2: `Les récompenses cachées des cartes crypto que vous ignorez peut-être`, p: `Au-delà du cashback visible, de nombreuses cartes offrent des avantages sous-exploités. Crypto.com rembourse jusqu'à 100% de votre abonnement CRO Arena (anciennement Staples Center). Nexo offre des rendements supplémentaires sur vos actifs déposés, cumulables avec le cashback carte. Bybit propose des boosts ponctuels de cashback lors de campagnes (doublement temporaire du taux sur certaines catégories). Bitpanda donne accès à des NFT exclusifs et des tirages au sort pour les utilisateurs actifs. Vérifiez la section "récompenses" de votre app régulièrement — les promotions sont souvent temporaires et non notifiées par email.` },
    ],
    de: [
      { h2: `Welche Prämien lohnen sich wirklich bei einer Krypto-Karte?`, p: `Flughafen-Lounge-Zugang kostet etwa 30-40€ pro Besuch (Priority Pass Tagespreis). Bei 6 Flügen pro Jahr ergibt das 180-240€ jährliche Ersparnisse. Netflix inklusive spart 167€/Jahr, Spotify 120€/Jahr. Addiert man diese Vorteile, kann eine Crypto.com Jade oder Bybit Voyager sich selbst finanzieren — vorausgesetzt, man nutzt wirklich jeden Vorteil.` },
      { h2: `Crypto.com, Nexo, Bybit: Welche Prämien passen zu welchem Profil?`, p: `Crypto.com glänzt für Vielreisende: Lounges, Airbnb-Erstattung (10%), Expedia (10%), Netflix und Spotify. Nexo bietet Cashback in BTC oder NEXO auf alle Einkäufe — ideal zum Akkumulieren. Bybit bietet ähnliche Erstattungen mit geringeren Staking-Anforderungen. Für Alltagsnutzer ohne häufige Reisen optimieren Gnosis Pay und MetaMask Card den reinen Cashback ohne überflüssige Lifestyle-Vorteile.` },
      { h2: `Krypto-Prämien vs. Flugmeilen: Was ist besser?`, p: `Die Frage stellt sich für aktive Reisende regelmäßig. Flugmeilen (Flying Blue, Miles & More) sammeln sich schnell, verlieren aber bei Nichtnutzung an Wert und verfallen. BTC- oder ETH-Cashback verfällt nie und kann mit dem Markt steigen. Nexo und Crypto.com erlauben sogar die Kombination von Krypto-Cashback und Reisevorteilen. Wer oft mit Low-Cost-Airlines in Europa reist, profitiert meist mehr vom Krypto-Cashback als von Meilen, die diese Flüge nicht abdecken.` },
      { h2: `Wie maximiert man Prämien mit einer Krypto-Karte?`, p: `Um das Maximum aus Ihrer Prämienkarte herauszuholen, bündeln Sie alle regelmäßigen Ausgaben auf diese Karte: Abonnements (Streaming, Fitness, Software), Lebensmittel, Restaurants, Transport. Prüfen Sie, ob Ihre Karte erhöhte Cashback-Raten für bestimmte Kategorien bietet — einige Crypto.com-Karten bieten 10% Erstattung auf Airbnb oder Expedia. Laden Sie Ihre Karte in Krypto auf, um Umrechnungsgebühren zu vermeiden, und überprüfen Sie regelmäßig Ihren Cashback-Verlauf.` },
      { h2: `Versteckte Prämien von Krypto-Karten, die Sie vielleicht nicht kennen`, p: `Über den sichtbaren Cashback hinaus bieten viele Karten wenig genutzte Vorteile. Crypto.com erstattet bis zu 100% Ihres CRO Arena-Abonnements. Nexo bietet zusätzliche Renditen auf hinterlegte Assets, kombinierbar mit dem Karten-Cashback. Bybit bietet gelegentliche Cashback-Boosts bei Kampagnen (vorübergehende Verdoppelung des Satzes in bestimmten Kategorien). Bitpanda gewährt aktiven Nutzern Zugang zu exklusiven NFTs und Gewinnspielen. Prüfen Sie regelmäßig den "Prämien"-Bereich Ihrer App — Aktionen sind oft zeitlich begrenzt und werden nicht per E-Mail angekündigt.` },
    ],
    es: [
      { h2: `¿Qué recompensas valen realmente la pena en una tarjeta crypto?`, p: `El acceso a los lounges de aeropuerto vale aproximadamente 30-40€ por visita (precio diario Priority Pass). Con 6 vuelos al año, eso representa 180-240€ de ahorro anual. Netflix incluido supone 167€/año, Spotify 120€/año. Sumando estas ventajas, una tarjeta Crypto.com Jade o Bybit Voyager puede autofinanciarse incluso con comisiones anuales moderadas — siempre que realmente uses cada ventaja.` },
      { h2: `Crypto.com, Nexo, Bybit: ¿qué recompensas para cada perfil?`, p: `Crypto.com destaca para grandes viajeros: lounges, reembolso Airbnb (10%), Expedia (10%), Netflix y Spotify. Nexo ofrece cashback en BTC o NEXO en todas las compras, ideal para acumuladores. Bybit propone reembolsos similares con menor exigencia de staking. Para usuarios cotidianos sin viajes frecuentes, Gnosis Pay y MetaMask Card optimizan el cashback puro sin ventajas lifestyle superfluas.` },
      { h2: `Recompensas crypto vs millas de vuelo: ¿qué elegir?`, p: `La pregunta surge con frecuencia entre los viajeros activos. Las millas de vuelo (Flying Blue, Miles & More) se acumulan rápido pero pierden valor si no se usan y caducan. El cashback en BTC o ETH nunca caduca y puede revalorizarse con el mercado. Nexo y Crypto.com permiten incluso combinar cashback crypto y ventajas de viaje. Si viajas a menudo con aerolíneas de bajo coste en Europa, el cashback crypto suele ser más rentable que las millas que no cubren esos vuelos.` },
      { h2: `¿Cómo maximizar las recompensas con una tarjeta crypto?`, p: `Para sacar el máximo partido a tu tarjeta de recompensas, concentra todos tus gastos recurrentes en ella: suscripciones (streaming, gimnasio, software), compras de alimentación, restaurantes, transporte. Comprueba si tu tarjeta ofrece tasas de cashback elevadas para ciertas categorías — algunas tarjetas Crypto.com dan un 10% de reembolso en Airbnb o Expedia. Recarga tu tarjeta en cripto para evitar comisiones de conversión y consulta regularmente tu historial de cashback.` },
      { h2: `Las recompensas ocultas de las tarjetas crypto que quizás no conoces`, p: `Más allá del cashback visible, muchas tarjetas ofrecen ventajas poco aprovechadas. Crypto.com reembolsa hasta el 100% de tu suscripción al CRO Arena. Nexo ofrece rendimientos adicionales sobre tus activos depositados, acumulables con el cashback de la tarjeta. Bybit propone boosts puntuales de cashback en campañas (duplicación temporal de la tasa en ciertas categorías). Bitpanda da acceso a NFT exclusivos y sorteos para usuarios activos. Revisa regularmente la sección "recompensas" de tu app — las promociones suelen ser temporales y no se anuncian por email.` },
    ],
    it: [
      { h2: `Quali premi valgono davvero la pena su una carta crypto?`, p: `L'accesso alle lounge aeroportuali vale circa 30-40€ a visita (prezzo giornaliero Priority Pass). Con 6 voli all'anno, questo rappresenta 180-240€ di risparmio annuale. Netflix incluso vale 167€/anno, Spotify 120€/anno. Sommando questi vantaggi, una Crypto.com Jade o Bybit Voyager può autofinanziarsi anche con commissioni annuali moderate — a patto di utilizzare davvero ogni vantaggio.` },
      { h2: `Crypto.com, Nexo, Bybit: quali premi per ogni profilo?`, p: `Crypto.com eccelle per i grandi viaggiatori: lounge, rimborso Airbnb (10%), Expedia (10%), Netflix e Spotify. Nexo offre cashback in BTC o NEXO su tutti gli acquisti, ideale per gli accumulatori. Bybit propone rimborsi simili con requisiti di staking minori. Per gli utenti quotidiani senza viaggi frequenti, Gnosis Pay e MetaMask Card ottimizzano il cashback puro senza vantaggi lifestyle superflui.` },
      { h2: `Premi crypto vs miglia aeree: cosa scegliere?`, p: `La domanda si pone spesso tra i viaggiatori attivi. Le miglia aeree (Flying Blue, Miles & More) si accumulano velocemente ma perdono valore se non vengono utilizzate e hanno scadenze. Il cashback in BTC o ETH non scade mai e può apprezzarsi con il mercato. Nexo e Crypto.com permettono addirittura di combinare cashback crypto e vantaggi viaggio. Se viaggi spesso con compagnie low-cost in Europa, il cashback crypto è spesso più redditizio delle miglia che non coprono quei voli.` },
      { h2: `Come massimizzare i premi con una carta crypto?`, p: `Per ottenere il massimo dalla tua carta premi, concentra tutte le spese ricorrenti su di essa: abbonamenti (streaming, palestra, software), spesa alimentare, ristoranti, trasporti. Verifica se la tua carta offre tassi di cashback maggiorati per certe categorie — alcune carte Crypto.com offrono il 10% di rimborso su Airbnb o Expedia. Ricarica la carta in crypto per evitare commissioni di conversione e controlla regolarmente il tuo storico cashback.` },
      { h2: `I premi nascosti delle carte crypto che forse non conosci`, p: `Oltre al cashback visibile, molte carte offrono vantaggi poco sfruttati. Crypto.com rimborsa fino al 100% dell'abbonamento al CRO Arena. Nexo offre rendimenti aggiuntivi sugli asset depositati, cumulabili con il cashback della carta. Bybit propone boost occasionali di cashback durante campagne (raddoppio temporaneo del tasso in certe categorie). Bitpanda dà accesso a NFT esclusivi e estrazioni a sorte per gli utenti attivi. Controlla regolarmente la sezione "premi" della tua app — le promozioni sono spesso temporanee e non vengono annunciate via email.` },
    ],
    en: [
      { h2: `Which rewards are actually worth it on a crypto card?`, p: `Airport lounge access is worth around €30-40 per visit (Priority Pass daily rate). With 6 flights a year, that's €180-240 in annual savings. Included Netflix saves €167/year, Spotify €120/year. Tallying these up, a Crypto.com Jade or Bybit Voyager can pay for itself even with moderate annual fees — provided you actually use every benefit on offer.` },
      { h2: `Crypto.com, Nexo, Bybit: which rewards suit which profile?`, p: `Crypto.com shines for frequent travellers: lounges, Airbnb (10%) and Expedia (10%) reimbursements, Netflix and Spotify. Nexo offers BTC or NEXO cashback on all purchases — ideal for accumulators. Bybit provides similar reimbursements with lower staking requirements. For everyday users who don't travel often, Gnosis Pay and MetaMask Card optimise pure cashback without superfluous lifestyle perks.` },
      { h2: `Crypto rewards vs air miles: which is better?`, p: `The question comes up regularly among active travellers. Airline miles (Flying Blue, Miles & More) accumulate quickly but lose value if unused and expire. BTC or ETH cashback never expires and can appreciate with the market. Nexo and Crypto.com even let you combine crypto cashback with travel perks. If you frequently fly with low-cost carriers in Europe, crypto cashback is often more profitable than miles that don't cover those routes.` },
      { h2: `How to maximise rewards with a crypto card?`, p: `To get the most from your rewards card, concentrate all recurring spending on it: subscriptions (streaming, gym, software), groceries, restaurants, transport. Check whether your card offers boosted cashback rates for specific categories — some Crypto.com cards give 10% back on Airbnb or Expedia. Top up in crypto to avoid conversion fees, and regularly check your cashback history to confirm rewards are being credited correctly.` },
      { h2: `Hidden crypto card rewards you might not know about`, p: `Beyond the visible cashback, many cards offer underused benefits. Crypto.com reimburses up to 100% of your CRO Arena subscription. Nexo gives additional yield on deposited assets, stackable on top of card cashback. Bybit runs occasional cashback boosts during campaigns (temporary rate doubling in certain categories). Bitpanda grants active users access to exclusive NFTs and prize draws. Check the "rewards" section of your app regularly — promotions are often time-limited and not announced by email.` },
    ],
  },
  virtual: {
    fr: [
      { h2: `Qu'est-ce qu'une carte crypto virtuelle et à quoi sert-elle ?`, p: `Une carte crypto virtuelle fonctionne comme une carte physique, mais existe uniquement sous forme numérique. Vous l'ajoutez à Apple Pay, Google Pay ou Samsung Pay pour payer en ligne et en magasin via NFC. L'avantage principal : activation immédiate (souvent en moins de 5 minutes), aucun délai de livraison et possibilité de générer des numéros uniques pour sécuriser vos achats en ligne contre la fraude.` },
      { h2: `Meilleures cartes crypto virtuelles en ${YEAR} : Crypto.com, Wirex, Brighty`, p: `Crypto.com propose une carte virtuelle Visa activable immédiatement, rechargeable en crypto ou en euro. Wirex offre des cartes virtuelles multi-devises avec cashback en WXT. Brighty fournit une carte USDC virtuelle avec IBAN européen intégré. Pour les achats en ligne uniquement, ces cartes virtuelles sont idéales : zéro frais de port, cashback dès le premier achat et protection totale du numéro de carte physique.` },
      { h2: `Carte crypto virtuelle et sécurité : ce qu'il faut savoir`, p: `La sécurité est l'un des arguments les plus solides en faveur des cartes virtuelles. Contrairement à une carte physique, votre numéro virtuel peut être "freezé" ou régénéré en un clic depuis l'app si vous soupçonnez une fraude. Certains émetteurs proposent des numéros de carte à usage unique pour les achats sur des sites inconnus. En cas de perte ou vol de votre téléphone, votre carte virtuelle reste protégée par le code PIN de l'app et l'authentification biométrique — bien plus sûre qu'une carte physique volée.` },
      { h2: `Cartes crypto virtuelles vs wallet mobile : quelle différence ?`, p: `Une carte crypto virtuelle et un wallet crypto (MetaMask, Trust Wallet) sont deux outils complémentaires, pas substituables. Le wallet stocke vos crypto-actifs on-chain avec vos clés privées. La carte virtuelle est reliée à un compte émetteur (custodial ou semi-custodial) et convertit automatiquement vos cryptos en monnaie fiat au moment du paiement. L'exception notable est MetaMask Card, qui connecte directement votre wallet à la carte — aucun compte intermédiaire requis. C'est la convergence la plus avancée entre carte virtuelle et wallet DeFi en ${YEAR}.` },
      { h2: `Comment utiliser une carte crypto virtuelle au quotidien`, p: `Pour les achats en ligne, la carte virtuelle est prête à l'emploi dès son activation : saisissez le numéro dans le formulaire de paiement, comme n'importe quelle Visa. Pour les achats en magasin, ajoutez-la à Apple Pay ou Google Pay — le paiement NFC fonctionne instantanément. Pour recharger, virement SEPA depuis votre banque (gratuit, sous 1 jour ouvré) ou transfert crypto depuis votre exchange. Astuce sécurité : générez un numéro de carte temporaire pour chaque achat sur un site inconnu, disponible dans Crypto.com, Wirex ou Brighty via le menu "carte virtuelle" de l'app.` },
    ],
    de: [
      { h2: `Was ist eine virtuelle Krypto-Karte und wofür ist sie nützlich?`, p: `Eine virtuelle Krypto-Karte funktioniert wie eine physische Karte, existiert aber nur digital. Sie fügen sie zu Apple Pay, Google Pay oder Samsung Pay hinzu, um online und im Geschäft per NFC zu zahlen. Der Hauptvorteil: sofortige Aktivierung (oft in weniger als 5 Minuten), keine Lieferzeit und die Möglichkeit, einmalige Nummern für sichere Online-Einkäufe gegen Betrug zu generieren.` },
      { h2: `Beste virtuelle Krypto-Karten ${YEAR}: Crypto.com, Wirex, Brighty`, p: `Crypto.com bietet eine sofort aktivierbare virtuelle Visa-Karte, aufladbar mit Krypto oder Euro. Wirex bietet virtuelle Multi-Währungskarten mit WXT-Cashback. Brighty liefert eine virtuelle USDC-Karte mit integrierter europäischer IBAN. Für reine Online-Einkäufe sind diese virtuellen Karten ideal: kein Versand, Cashback ab dem ersten Kauf und vollständiger Schutz der physischen Kartennummer.` },
      { h2: `Virtuelle Krypto-Karten und Sicherheit: Was Sie wissen müssen`, p: `Sicherheit ist eines der stärksten Argumente für virtuelle Karten. Im Gegensatz zu einer physischen Karte kann Ihre virtuelle Nummer per App-Klick "eingefroren" oder neu generiert werden, wenn Sie Betrug vermuten. Einige Emittenten bieten Einweg-Kartennummern für Einkäufe auf unbekannten Websites an. Bei Verlust oder Diebstahl Ihres Telefons bleibt Ihre virtuelle Karte durch den App-PIN und biometrische Authentifizierung geschützt — sicherer als eine gestohlene physische Karte.` },
      { h2: `Virtuelle Krypto-Karten vs. Krypto-Wallet: Was ist der Unterschied?`, p: `Eine virtuelle Krypto-Karte und ein Krypto-Wallet (MetaMask, Trust Wallet) sind komplementäre Werkzeuge, keine Substitute. Das Wallet speichert Ihre Krypto-Assets on-chain mit Ihren privaten Schlüsseln. Die virtuelle Karte ist an ein Emittentenkonto gebunden und konvertiert Ihre Kryptos automatisch in Fiat beim Bezahlen. Die bemerkenswerte Ausnahme ist MetaMask Card, die Ihr Wallet direkt mit der Karte verbindet — kein Zwischenkonto erforderlich. Das ist die fortschrittlichste Konvergenz zwischen virtueller Karte und DeFi-Wallet in ${YEAR}.` },
      { h2: `Wie man eine virtuelle Krypto-Karte im Alltag nutzt`, p: `Für Online-Einkäufe ist die virtuelle Karte sofort nach der Aktivierung einsatzbereit: Geben Sie die Nummer in das Zahlungsformular ein, wie bei jeder Visa. Für Einkäufe im Geschäft fügen Sie sie zu Apple Pay oder Google Pay hinzu — NFC-Zahlung funktioniert sofort. Zum Aufladen: SEPA-Überweisung von Ihrer Bank (kostenlos, innerhalb 1 Werktag) oder Krypto-Transfer von Ihrer Exchange. Sicherheitstipp: Generieren Sie für jeden Kauf auf einer unbekannten Website eine temporäre Kartennummer, verfügbar in Crypto.com, Wirex oder Brighty über das App-Menü "virtuelle Karte".` },
    ],
    es: [
      { h2: `¿Qué es una tarjeta crypto virtual y para qué sirve?`, p: `Una tarjeta crypto virtual funciona como una tarjeta física, pero existe únicamente en formato digital. La añades a Apple Pay, Google Pay o Samsung Pay para pagar online y en tiendas mediante NFC. La ventaja principal: activación inmediata (a menudo en menos de 5 minutos), sin espera de envío y posibilidad de generar números únicos para proteger tus compras online contra el fraude.` },
      { h2: `Mejores tarjetas crypto virtuales en ${YEAR}: Crypto.com, Wirex, Brighty`, p: `Crypto.com ofrece una tarjeta Visa virtual activable de inmediato, recargable en cripto o en euros. Wirex propone tarjetas virtuales multidivisa con cashback en WXT. Brighty facilita una tarjeta USDC virtual con IBAN europeo integrado. Para compras online exclusivamente, estas tarjetas virtuales son ideales: sin gastos de envío, cashback desde la primera compra y protección total del número de tarjeta física.` },
      { h2: `Tarjeta crypto virtual y seguridad: lo que debes saber`, p: `La seguridad es uno de los argumentos más sólidos a favor de las tarjetas virtuales. A diferencia de una tarjeta física, tu número virtual puede "congelarse" o regenerarse con un toque desde la app si sospechas fraude. Algunos emisores ofrecen números de tarjeta de un solo uso para compras en sitios desconocidos. En caso de pérdida o robo de tu teléfono, tu tarjeta virtual permanece protegida por el PIN de la app y la autenticación biométrica — mucho más seguro que una tarjeta física robada.` },
      { h2: `Tarjetas crypto virtuales vs wallet móvil: ¿cuál es la diferencia?`, p: `Una tarjeta crypto virtual y un wallet crypto (MetaMask, Trust Wallet) son herramientas complementarias, no sustitutos. El wallet almacena tus activos cripto on-chain con tus claves privadas. La tarjeta virtual está vinculada a una cuenta emisora y convierte automáticamente tus criptos en moneda fiat al momento del pago. La excepción notable es MetaMask Card, que conecta directamente tu wallet a la tarjeta — sin cuenta intermediaria. Es la convergencia más avanzada entre tarjeta virtual y wallet DeFi en ${YEAR}.` },
      { h2: `Cómo usar una tarjeta crypto virtual en el día a día`, p: `Para compras online, la tarjeta virtual está lista desde su activación: introduce el número en el formulario de pago, como cualquier Visa. Para compras en tienda, agrégala a Apple Pay o Google Pay — el pago NFC funciona al instante. Para recargar: transferencia SEPA desde tu banco (gratuita, en 1 día hábil) o transferencia cripto desde tu exchange. Consejo de seguridad: genera un número de tarjeta temporal para cada compra en un sitio desconocido, disponible en Crypto.com, Wirex o Brighty en el menú "tarjeta virtual" de la app.` },
    ],
    it: [
      { h2: `Cos'è una carta crypto virtuale e a cosa serve?`, p: `Una carta crypto virtuale funziona come una carta fisica, ma esiste solo in formato digitale. La aggiungi ad Apple Pay, Google Pay o Samsung Pay per pagare online e nei negozi tramite NFC. Il principale vantaggio: attivazione immediata (spesso in meno di 5 minuti), nessuna attesa di consegna e possibilità di generare numeri unici per proteggere gli acquisti online dalle frodi.` },
      { h2: `Migliori carte crypto virtuali nel ${YEAR}: Crypto.com, Wirex, Brighty`, p: `Crypto.com propone una carta Visa virtuale attivabile immediatamente, ricaricabile in crypto o in euro. Wirex offre carte virtuali multi-valuta con cashback in WXT. Brighty fornisce una carta USDC virtuale con IBAN europeo integrato. Per gli acquisti esclusivamente online, queste carte virtuali sono ideali: zero spese di spedizione, cashback dal primo acquisto e protezione totale del numero di carta fisica.` },
      { h2: `Carta crypto virtuale e sicurezza: cosa sapere`, p: `La sicurezza è uno degli argomenti più forti a favore delle carte virtuali. A differenza di una carta fisica, il tuo numero virtuale può essere "bloccato" o rigenerato con un tap dall'app se sospetti una frode. Alcuni emittenti offrono numeri di carta monouso per acquisti su siti sconosciuti. In caso di perdita o furto del tuo telefono, la carta virtuale rimane protetta dal PIN dell'app e dall'autenticazione biometrica — molto più sicuro di una carta fisica rubata.` },
      { h2: `Carte crypto virtuali vs wallet mobile: qual è la differenza?`, p: `Una carta crypto virtuale e un wallet crypto (MetaMask, Trust Wallet) sono strumenti complementari, non sostituti. Il wallet conserva i tuoi asset crypto on-chain con le tue chiavi private. La carta virtuale è collegata a un conto emittente e converte automaticamente le tue crypto in valuta fiat al momento del pagamento. L'eccezione notevole è MetaMask Card, che collega direttamente il tuo wallet alla carta — nessun conto intermedio richiesto. È la convergenza più avanzata tra carta virtuale e wallet DeFi nel ${YEAR}.` },
      { h2: `Come usare una carta crypto virtuale nella vita quotidiana`, p: `Per gli acquisti online, la carta virtuale è pronta subito dopo l'attivazione: inserisci il numero nel modulo di pagamento, come per qualsiasi Visa. Per gli acquisti in negozio, aggiungila ad Apple Pay o Google Pay — il pagamento NFC funziona istantaneamente. Per ricaricare: bonifico SEPA dalla tua banca (gratuito, entro 1 giorno lavorativo) o trasferimento crypto dal tuo exchange. Consiglio di sicurezza: genera un numero di carta temporaneo per ogni acquisto su un sito sconosciuto, disponibile in Crypto.com, Wirex o Brighty nel menu "carta virtuale" dell'app.` },
    ],
    en: [
      { h2: `What is a virtual crypto card and what is it used for?`, p: `A virtual crypto card works exactly like a physical card but exists only in digital form. You add it to Apple Pay, Google Pay or Samsung Pay to pay online and in stores via NFC. The main advantage: instant activation (often under 5 minutes), no delivery wait, and the ability to generate unique card numbers for online purchases, protecting your real card details from fraud.` },
      { h2: `Best virtual crypto cards in ${YEAR}: Crypto.com, Wirex, Brighty`, p: `Crypto.com offers an instantly activatable virtual Visa card, top-uppable in crypto or euros. Wirex provides multi-currency virtual cards with WXT cashback. Brighty delivers a virtual USDC card with a built-in European IBAN. For online-only purchases, these virtual cards are ideal: no shipping delays, cashback from the first purchase, and full protection for your physical card number.` },
      { h2: `Virtual crypto card security: what you need to know`, p: `Security is one of the strongest arguments for virtual cards. Unlike a physical card, your virtual number can be frozen or regenerated with one tap in the app if you suspect fraud. Some issuers offer single-use card numbers for purchases on unfamiliar sites. If your phone is lost or stolen, your virtual card stays protected by the app PIN and biometric authentication — far more secure than a stolen physical card.` },
      { h2: `Virtual crypto cards vs crypto wallet: what's the difference?`, p: `A virtual crypto card and a crypto wallet (MetaMask, Trust Wallet) are complementary tools, not substitutes. The wallet stores your crypto assets on-chain with your private keys. The virtual card is linked to an issuer account and automatically converts your crypto to fiat at payment time. The notable exception is MetaMask Card, which connects your wallet directly to the card — no intermediate account needed. This is the most advanced convergence between virtual card and DeFi wallet in ${YEAR}.` },
      { h2: `How to use a virtual crypto card in everyday life`, p: `For online purchases, the virtual card is ready immediately after activation: enter the number in the payment form like any Visa. For in-store purchases, add it to Apple Pay or Google Pay — NFC payment works instantly. To top up: SEPA transfer from your bank (free, within 1 business day) or crypto transfer from your exchange. Security tip: generate a temporary card number for each purchase on an unfamiliar site, available in Crypto.com, Wirex or Brighty under the "virtual card" menu in the app.` },
    ],
  },
  beginner: {
    fr: [
      { h2: `Comment commencer avec une carte crypto quand on est débutant ?`, p: `La première étape est de choisir une carte accessible sans staking et sans frais annuels. Ouvrez un compte sur la plateforme, complétez la vérification KYC (identité + domicile), puis rechargez votre carte depuis votre exchange ou directement en euros via virement SEPA. Pour les débutants, évitez les plateformes avec des tokens propriétaires volatils — privilégiez des cartes adossées à des stablecoins (USDC) ou directement à votre solde en euros.` },
      { h2: `Meilleures cartes crypto pour débutants en ${YEAR} : Revolut, Brighty, MetaMask`, p: `Revolut combine banque classique et crypto dans une seule app — idéale pour les débutants qui veulent tester sans s'engager. Brighty est 100% gratuite avec un IBAN européen et un cashback en USDC sans staking. MetaMask Card est parfaite si vous êtes déjà familier avec les wallets Web3. Ces trois options partagent un point commun : inscription rapide en moins de 10 minutes et utilisation immédiate dès le premier jour.` },
      { h2: `Les erreurs à éviter avec votre première carte crypto`, p: `Plusieurs pièges classiques guettent les nouveaux utilisateurs. Premier piège : choisir une carte en se basant uniquement sur le taux de cashback affiché, sans tenir compte des exigences de staking et de la volatilité du token associé. Deuxième : recharger en crypto au dernier moment, ce qui expose à des délais de transaction et des frais de réseau variables. Troisième : négliger les paramètres de sécurité — activez toujours le 2FA et les notifications de paiement. Enfin, lisez attentivement les limites mensuelles de cashback avant de compter sur un gain annuel projeté.` },
      { h2: `Comment comprendre la fiscalité de votre carte crypto dès le départ ?`, p: `En Europe, l'utilisation d'une carte crypto génère des événements fiscaux à chaque conversion de crypto en euros. En France, ces conversions sont taxées à la flat tax de 30% sur les plus-values. En Allemagne, les cryptos détenues plus d'un an sont exonérées. Pour un débutant, la recommandation la plus simple est d'utiliser des stablecoins (USDC, USDT) pour recharger votre carte : pas de volatilité, pas de plus-value réalisée, pas d'impôt sur la conversion. C'est le moyen le plus simple de profiter du cashback crypto sans les complications fiscales associées aux actifs volatils.` },
      { h2: `Questions fréquentes des débutants sur les cartes crypto`, p: `Peut-on utiliser une carte crypto sans posséder de crypto ? Oui — vous pouvez recharger en euros via virement SEPA sur Brighty ou Revolut, sans jamais toucher à de la crypto. Faut-il un compte bancaire pour obtenir une carte crypto ? Non, certaines cartes (Brighty, MetaMask Card) fonctionnent sans banque traditionnelle. Combien de temps faut-il pour recevoir sa carte ? La version virtuelle est disponible en moins de 5 minutes. La version physique est envoyée sous 5 à 10 jours ouvrés selon l'émetteur. Peut-on dépenser directement ses cryptos ou faut-il convertir ? La conversion en euros se fait automatiquement au moment du paiement — vous n'avez rien à faire manuellement.` },
    ],
    de: [
      { h2: `Wie startet man als Anfänger mit einer Krypto-Karte?`, p: `Der erste Schritt ist die Wahl einer zugänglichen Karte ohne Staking und ohne Jahresgebühren. Eröffnen Sie ein Konto auf der Plattform, schließen Sie die KYC-Verifizierung ab (Ausweis + Wohnsitz) und laden Sie Ihre Karte von Ihrer Exchange oder direkt in Euro per SEPA-Überweisung auf. Anfänger sollten Plattformen mit volatilen proprietären Token meiden — bevorzugen Sie Karten, die an Stablecoins (USDC) oder direkt an Ihr Euro-Guthaben gebunden sind.` },
      { h2: `Beste Krypto-Karten für Anfänger ${YEAR}: Revolut, Brighty, MetaMask`, p: `Revolut vereint klassisches Banking und Krypto in einer App — ideal für Einsteiger, die es ohne Verpflichtungen testen möchten. Brighty ist 100% kostenlos mit europäischer IBAN und USDC-Cashback ohne Staking. MetaMask Card ist perfekt, wenn Sie bereits mit Web3-Wallets vertraut sind. Alle drei haben eines gemeinsam: schnelle Registrierung in unter 10 Minuten und sofortige Nutzung ab dem ersten Tag.` },
      { h2: `Fehler, die man mit der ersten Krypto-Karte vermeiden sollte`, p: `Klassische Fallen erwarten neue Nutzer. Erste Falle: Karte nur anhand des beworbenen Cashback-Satzes wählen, ohne Staking-Anforderungen und Token-Volatilität zu berücksichtigen. Zweite: Krypto in letzter Minute aufladen, was zu Transaktionsverzögerungen und variablen Netzwerkgebühren führt. Dritte: Sicherheitseinstellungen vernachlässigen — aktivieren Sie immer 2FA und Zahlungsbenachrichtigungen. Lesen Sie schließlich die monatlichen Cashback-Limits, bevor Sie auf einen projizierten Jahresgewinn zählen.` },
      { h2: `Steuerliche Grundlagen Ihrer Krypto-Karte von Anfang an verstehen`, p: `In Deutschland gilt: Kryptos, die länger als ein Jahr gehalten werden, sind bei Verkauf steuerfrei. Kryptowährungen, die kürzer als ein Jahr gehalten wurden, werden zum persönlichen Einkommensteuersatz besteuert. Für Anfänger ist die einfachste Empfehlung: Stablecoins (USDC, USDT) zum Aufladen der Karte verwenden — keine Volatilität, kein realisierter Gewinn, keine Steuer auf die Konvertierung. So genießen Sie Krypto-Cashback ohne die steuerlichen Komplikationen volatiler Krypto-Assets.` },
      { h2: `Häufige Fragen von Einsteigern zu Krypto-Karten`, p: `Kann man eine Krypto-Karte nutzen, ohne Krypto zu besitzen? Ja — bei Brighty oder Revolut können Sie per SEPA in Euro aufladen, ohne jemals Kryptowährung anzufassen. Braucht man ein Bankkonto für eine Krypto-Karte? Nein, einige Karten (Brighty, MetaMask Card) funktionieren ohne traditionelle Bank. Wie lange dauert es, die Karte zu erhalten? Die virtuelle Version ist in weniger als 5 Minuten verfügbar. Die physische Version wird in 5-10 Werktagen versendet. Kann man direkt mit Krypto bezahlen oder muss man erst umtauschen? Die Umrechnung in Euro erfolgt automatisch beim Bezahlen — kein manueller Schritt nötig.` },
    ],
    es: [
      { h2: `¿Cómo empezar con una tarjeta crypto siendo principiante?`, p: `El primer paso es elegir una tarjeta accesible sin staking y sin comisiones anuales. Abre una cuenta en la plataforma, completa la verificación KYC (identidad + domicilio), y luego recarga tu tarjeta desde tu exchange o directamente en euros mediante transferencia SEPA. Los principiantes deben evitar plataformas con tokens propietarios volátiles — prioriza tarjetas respaldadas por stablecoins (USDC) o directamente por tu saldo en euros.` },
      { h2: `Mejores tarjetas crypto para principiantes en ${YEAR}: Revolut, Brighty, MetaMask`, p: `Revolut combina banca clásica y cripto en una sola app — ideal para principiantes que quieren probar sin comprometerse. Brighty es 100% gratuita con IBAN europeo y cashback en USDC sin staking. MetaMask Card es perfecta si ya estás familiarizado con los wallets Web3. Las tres comparten algo: registro rápido en menos de 10 minutos y uso inmediato desde el primer día.` },
      { h2: `Errores que debes evitar con tu primera tarjeta crypto`, p: `Varios errores clásicos acechan a los nuevos usuarios. El primero: elegir una tarjeta basándose únicamente en la tasa de cashback anunciada, sin tener en cuenta los requisitos de staking y la volatilidad del token asociado. El segundo: recargar en cripto en el último momento, lo que expone a retrasos de transacción y comisiones de red variables. El tercero: descuidar la seguridad — activa siempre el 2FA y las notificaciones de pago. Finalmente, lee con atención los límites mensuales de cashback antes de contar con una ganancia anual proyectada.` },
      { h2: `Cómo entender la fiscalidad de tu tarjeta crypto desde el principio`, p: `En España, el uso de una tarjeta crypto genera hechos imponibles en cada conversión de cripto a euros, tributando como ganancia patrimonial en el IRPF. Para un principiante, la recomendación más sencilla es usar stablecoins (USDC, USDT) para recargar la tarjeta: sin volatilidad, sin plusvalía realizada, sin impuesto sobre la conversión. Es la forma más simple de disfrutar del cashback crypto sin las complicaciones fiscales asociadas a los activos volátiles.` },
      { h2: `Preguntas frecuentes de principiantes sobre las tarjetas crypto`, p: `¿Se puede usar una tarjeta crypto sin tener criptomonedas? Sí — en Brighty o Revolut puedes recargar en euros por transferencia SEPA, sin tocar nunca cripto. ¿Se necesita una cuenta bancaria para tener una tarjeta crypto? No, algunas tarjetas (Brighty, MetaMask Card) funcionan sin banco tradicional. ¿Cuánto tiempo se tarda en recibir la tarjeta? La versión virtual está disponible en menos de 5 minutos. La versión física se envía en 5-10 días hábiles. ¿Se paga directamente con cripto o hay que convertir primero? La conversión a euros se hace automáticamente en el momento del pago — no hay que hacer nada manualmente.` },
    ],
    it: [
      { h2: `Come iniziare con una carta crypto da principiante?`, p: `Il primo passo è scegliere una carta accessibile senza staking e senza commissioni annuali. Apri un account sulla piattaforma, completa la verifica KYC (identità + residenza), poi ricarica la tua carta dal tuo exchange o direttamente in euro tramite bonifico SEPA. I principianti dovrebbero evitare piattaforme con token proprietari volatili — privilegia carte legate a stablecoin (USDC) o direttamente al tuo saldo in euro.` },
      { h2: `Migliori carte crypto per principianti nel ${YEAR}: Revolut, Brighty, MetaMask`, p: `Revolut combina banca classica e cripto in un'unica app — ideale per i principianti che vogliono provare senza impegnarsi. Brighty è 100% gratuita con IBAN europeo e cashback in USDC senza staking. MetaMask Card è perfetta se sei già familiare con i wallet Web3. Le tre opzioni hanno in comune: registrazione rapida in meno di 10 minuti e utilizzo immediato dal primo giorno.` },
      { h2: `Errori da evitare con la prima carta crypto`, p: `Diverse trappole classiche attendono i nuovi utenti. Prima: scegliere la carta basandosi solo sul tasso di cashback pubblicizzato, senza considerare i requisiti di staking e la volatilità del token associato. Seconda: ricaricare in crypto all'ultimo momento, con rischio di ritardi nelle transazioni e commissioni di rete variabili. Terza: trascurare le impostazioni di sicurezza — attiva sempre il 2FA e le notifiche di pagamento. Infine, leggi attentamente i limiti mensili di cashback prima di calcolare un guadagno annuale.` },
      { h2: `Come capire la fiscalità della tua carta crypto fin dall'inizio`, p: `In Italia, l'utilizzo di una carta crypto genera eventi fiscali ad ogni conversione di crypto in euro. Le plusvalenze sono tassate al 26%. Per un principiante, la raccomandazione più semplice è usare stablecoin (USDC, USDT) per ricaricare la carta: nessuna volatilità, nessuna plusvalenza realizzata, nessuna imposta sulla conversione. È il modo più semplice per godere del cashback crypto senza le complicazioni fiscali legate agli asset volatili.` },
      { h2: `Domande frequenti dei principianti sulle carte crypto`, p: `Si può usare una carta crypto senza possedere criptovalute? Sì — su Brighty o Revolut puoi ricaricare in euro tramite bonifico SEPA, senza mai toccare crypto. Serve un conto bancario per avere una carta crypto? No, alcune carte (Brighty, MetaMask Card) funzionano senza banca tradizionale. Quanto tempo ci vuole per ricevere la carta? La versione virtuale è disponibile in meno di 5 minuti. La versione fisica viene spedita in 5-10 giorni lavorativi. Si paga direttamente in crypto o bisogna convertire prima? La conversione in euro avviene automaticamente al momento del pagamento — nessun passaggio manuale necessario.` },
    ],
    en: [
      { h2: `How to get started with a crypto card as a beginner?`, p: `The first step is choosing an accessible card with no staking and no annual fees. Open an account on the platform, complete KYC verification (identity + address), then top up your card from your exchange or directly in euros via SEPA transfer. Beginners should avoid platforms with volatile proprietary tokens — opt for cards backed by stablecoins (USDC) or directly by your euro balance for a smoother experience.` },
      { h2: `Best crypto cards for beginners in ${YEAR}: Revolut, Brighty, MetaMask`, p: `Revolut combines classic banking and crypto in one app — ideal for beginners who want to try without committing. Brighty is 100% free with a European IBAN and USDC cashback with no staking. MetaMask Card is perfect if you're already familiar with Web3 wallets. All three share the same advantage: fast sign-up in under 10 minutes and immediate use from day one.` },
      { h2: `Mistakes to avoid with your first crypto card`, p: `Several classic pitfalls await new users. First: choosing a card based solely on the advertised cashback rate without accounting for staking requirements and token volatility. Second: topping up in crypto at the last minute, which exposes you to transaction delays and variable network fees. Third: neglecting security settings — always enable 2FA and payment notifications. Finally, read the monthly cashback caps carefully before projecting an annual return.` },
      { h2: `Understanding crypto card tax implications from the start`, p: `In most European countries, using a crypto card triggers a taxable event every time you convert crypto to euros. In the UK and France, gains are taxed at flat rates of 20-30%. For beginners, the simplest approach is to top up your card using stablecoins (USDC, USDT): no volatility, no realised gain, no tax on the conversion. This is the easiest way to enjoy crypto cashback without the tax complications tied to volatile assets.` },
      { h2: `Beginner FAQs about crypto cards`, p: `Can you use a crypto card without owning any crypto? Yes — on Brighty or Revolut you can top up in euros via SEPA transfer, without ever touching crypto. Do you need a bank account to get a crypto card? No, some cards (Brighty, MetaMask Card) work without a traditional bank account. How long does it take to receive the card? The virtual version is available in under 5 minutes. The physical card is shipped within 5-10 business days. Do you pay directly with crypto or do you need to convert first? The conversion to euros happens automatically at the point of payment — no manual step required.` },
    ],
  },
  '2026': {
    fr: [
      { h2: `Quelles cartes crypto sont incontournables en ${YEAR} ?`, p: `En 2026, le marché des cartes crypto s'est consolidé autour de quelques acteurs solides : Crypto.com reste le leader avec son écosystème complet, Nexo s'impose pour le cashback en BTC sans staking, Gnosis Pay monte en puissance avec sa proposition on-chain unique. Les nouvelles venues comme MetaMask Card et Ether.fi Card attirent les utilisateurs DeFi. La réglementation MiCA en Europe apporte davantage de transparence et de sécurité pour les consommateurs.` },
      { h2: `Tendances cartes crypto 2026 : MiCA, on-chain, stablecoins`, p: `La réglementation MiCA (Markets in Crypto-Assets), pleinement en vigueur depuis 2025, oblige les émetteurs à détenir des réserves et à publier des rapports de conformité. Conséquence : les cartes émises par des acteurs réglementés en Europe (Crypto.com, Nexo, Revolut) sont désormais mieux protégées. La tendance on-chain s'accélère avec des cartes comme Gnosis Pay qui règlent directement depuis votre wallet — sans intermédiaire et avec une transparence totale.` },
      { h2: `Comment choisir sa carte crypto en ${YEAR} selon son profil ?`, p: `En 2026, le choix d'une carte crypto dépend avant tout de votre usage principal. Vous êtes un grand voyageur ? Crypto.com Jade ou Indigo vous offrent lounges Priority Pass, assurance voyage et cashback sur Airbnb. Vous voulez accumuler du Bitcoin ? Nexo Card offre du cashback en BTC sans staking obligatoire. Vous êtes utilisateur DeFi ? MetaMask Card ou Gnosis Pay connectent directement votre wallet. Vous débutez ? Brighty ou Revolut Standard offrent une transition en douceur sans risque. La maturité du marché en 2026 signifie qu'il existe une carte adaptée à chaque profil.` },
      { h2: `Ce qui a changé en ${YEAR} pour les cartes crypto en Europe`, p: `2026 marque un tournant réglementaire et technologique pour les cartes crypto européennes. MiCA est pleinement applicable, forçant les émetteurs non conformes hors du marché. Les consommateurs bénéficient de protections similaires aux banques. Le règlement on-chain progresse (Gnosis Pay, MetaMask Card, Ether.fi Card), les stablecoins s'imposent comme moyen de recharge privilégié, et les interfaces s'intègrent aux wallets existants. La barrière à l'entrée pour la première carte crypto n'a jamais été aussi basse.` },
      { h2: `Notre sélection des meilleures cartes crypto de ${YEAR} par catégorie`, p: `Meilleure carte crypto tous profils : Crypto.com Jade (cashback 3%, lounges, assurances voyage, remboursements Airbnb/Expedia/Netflix). Meilleure carte sans staking : Gnosis Pay (2% on-chain, self-custody, réseau xDAI). Meilleure carte pour les débutants : Brighty (gratuite, USDC, IBAN européen, cashback 1,75%). Meilleure carte pour accumulation BTC : Nexo Card (2% en BTC, sans staking). Meilleure carte DeFi-native : MetaMask Card (cashback ETH, wallet direct). Ces recommandations ${YEAR} sont basées sur la conformité réglementaire MiCA, la solidité financière de l'émetteur et le cashback réel après déduction des coûts de staking.` },
    ],
    de: [
      { h2: `Welche Krypto-Karten sind ${YEAR} unverzichtbar?`, p: `2026 hat sich der Krypto-Kartenmarkt um einige starke Akteure konsolidiert: Crypto.com bleibt mit seinem umfassenden Ökosystem führend, Nexo überzeugt für BTC-Cashback ohne Staking, Gnosis Pay gewinnt mit seinem einzigartigen On-Chain-Angebot an Bedeutung. Neulinge wie MetaMask Card und Ether.fi Card ziehen DeFi-Nutzer an. Die MiCA-Regulierung in Europa bringt mehr Transparenz und Sicherheit für Verbraucher.` },
      { h2: `Krypto-Karten Trends 2026: MiCA, On-Chain, Stablecoins`, p: `Die MiCA-Regulierung (Markets in Crypto-Assets), seit 2025 vollständig in Kraft, verpflichtet Emittenten zur Reservehaltung und Compliance-Berichterstattung. Folge: Karten von in Europa regulierten Akteuren (Crypto.com, Nexo, Revolut) sind nun besser geschützt. Der On-Chain-Trend beschleunigt sich mit Karten wie Gnosis Pay, die direkt aus Ihrer Wallet abrechnen — ohne Zwischenhändler und mit vollständiger Transparenz.` },
      { h2: `Wie wählt man ${YEAR} die passende Krypto-Karte nach Profil?`, p: `2026 hängt die Wahl einer Krypto-Karte vor allem von Ihrer Hauptnutzung ab. Vielreisender? Crypto.com Jade oder Indigo bieten Priority Pass Lounges und umfassende Reiseversicherung. Bitcoin akkumulieren? Nexo Card gibt Cashback in BTC ohne Staking. DeFi-Nutzer? MetaMask Card oder Gnosis Pay verbinden direkt Ihre Wallet. Anfänger? Brighty oder Revolut Standard ermöglichen einen sanften Einstieg. Die Marktreife 2026 bedeutet: Es gibt eine passende Karte für jedes Profil.` },
      { h2: `Was hat sich ${YEAR} für Krypto-Karten in Europa verändert?`, p: `2026 markiert einen regulatorischen und technologischen Wendepunkt. MiCA ist vollständig anwendbar und drängt nicht-konforme Emittenten aus dem Markt. Verbraucher genießen nun Schutz vergleichbar mit traditionellen Banken. On-Chain-Abwicklung wächst (Gnosis Pay, MetaMask Card, Ether.fi Card), Stablecoins etablieren sich als Auflademittel, Interfaces integrieren sich zunehmend in bestehende Wallets. Die Hürde für die erste Krypto-Karte war noch nie so niedrig.` },
      { h2: `Unsere Auswahl der besten Krypto-Karten ${YEAR} nach Kategorie`, p: `Beste Krypto-Karte für alle Profile: Crypto.com Jade (3% Cashback, Lounges, Reiseversicherung, Airbnb/Expedia/Netflix-Erstattungen). Beste Karte ohne Staking: Gnosis Pay (2% on-chain, Self-Custody, xDAI-Netzwerk). Beste Karte für Einsteiger: Brighty (kostenlos, USDC, europäische IBAN, 1,75% Cashback). Beste Karte für BTC-Akkumulation: Nexo Card (2% in BTC, kein Staking). Beste DeFi-native Karte: MetaMask Card (ETH-Cashback, direktes Wallet). Diese ${YEAR}-Empfehlungen basieren auf MiCA-Compliance, finanzieller Stabilität des Emittenten und realem Cashback nach Abzug der Staking-Kosten.` },
    ],
    es: [
      { h2: `¿Qué tarjetas crypto son imprescindibles en ${YEAR}?`, p: `En 2026, el mercado de tarjetas crypto se ha consolidado en torno a varios actores sólidos: Crypto.com sigue siendo el líder con su ecosistema completo, Nexo destaca por el cashback en BTC sin staking, Gnosis Pay gana fuerza con su propuesta on-chain única. Las recién llegadas como MetaMask Card y Ether.fi Card atraen a los usuarios DeFi. La regulación MiCA en Europa aporta mayor transparencia y seguridad para los consumidores.` },
      { h2: `Tendencias tarjetas crypto 2026: MiCA, on-chain, stablecoins`, p: `La regulación MiCA (Markets in Crypto-Assets), plenamente en vigor desde 2025, obliga a los emisores a mantener reservas y publicar informes de cumplimiento. Consecuencia: las tarjetas emitidas por actores regulados en Europa (Crypto.com, Nexo, Revolut) están ahora mejor protegidas. La tendencia on-chain se acelera con tarjetas como Gnosis Pay que liquidan directamente desde tu wallet — sin intermediarios y con total transparencia.` },
      { h2: `¿Cómo elegir tu tarjeta crypto en ${YEAR} según tu perfil?`, p: `En 2026, la elección depende de tu uso principal. ¿Viajero frecuente? Crypto.com Jade o Indigo ofrecen lounges Priority Pass y seguro de viaje. ¿Quieres acumular Bitcoin? Nexo Card da cashback en BTC sin staking obligatorio. ¿Usuario DeFi? MetaMask Card o Gnosis Pay conectan directamente tu wallet. ¿Principiante? Brighty o Revolut Standard ofrecen una transición suave. El mercado maduro de 2026 ofrece una tarjeta para cada perfil.` },
      { h2: `Qué ha cambiado en ${YEAR} para las tarjetas crypto en Europa`, p: `2026 es un punto de inflexión regulatorio y tecnológico. MiCA es plenamente aplicable, expulsando del mercado a emisores no conformes. Los consumidores disfrutan de protecciones similares a la banca tradicional. El pago on-chain avanza (Gnosis Pay, MetaMask Card, Ether.fi Card), los stablecoins se imponen como medio de recarga, y las interfaces se integran con los wallets existentes.` },
      { h2: `Nuestra selección de las mejores tarjetas crypto de ${YEAR} por categoría`, p: `Mejor tarjeta crypto para todos los perfiles: Crypto.com Jade (cashback 3%, lounges, seguro de viaje, reembolsos Airbnb/Expedia/Netflix). Mejor tarjeta sin staking: Gnosis Pay (2% on-chain, autocustodia, red xDAI). Mejor tarjeta para principiantes: Brighty (gratuita, USDC, IBAN europeo, cashback 1,75%). Mejor tarjeta para acumular BTC: Nexo Card (2% en BTC, sin staking). Mejor tarjeta DeFi-native: MetaMask Card (cashback ETH, wallet directo). Estas recomendaciones de ${YEAR} se basan en el cumplimiento de MiCA, la solidez financiera del emisor y el cashback real tras deducir los costes de staking.` },
    ],
    it: [
      { h2: `Quali carte crypto sono imprescindibili nel ${YEAR}?`, p: `Nel 2026, il mercato delle carte crypto si è consolidato attorno ad alcuni attori solidi: Crypto.com rimane il leader con il suo ecosistema completo, Nexo si impone per il cashback in BTC senza staking, Gnosis Pay guadagna terreno con la sua proposta on-chain unica. Le new entry come MetaMask Card e Ether.fi Card attraggono gli utenti DeFi. La regolamentazione MiCA in Europa porta maggiore trasparenza e sicurezza per i consumatori.` },
      { h2: `Tendenze carte crypto 2026: MiCA, on-chain, stablecoin`, p: `La regolamentazione MiCA (Markets in Crypto-Assets), pienamente in vigore dal 2025, obbliga gli emittenti a detenere riserve e a pubblicare rapporti di conformità. Conseguenza: le carte emesse da attori regolamentati in Europa (Crypto.com, Nexo, Revolut) sono ora meglio tutelate. La tendenza on-chain accelera con carte come Gnosis Pay che regolano direttamente dal tuo wallet — senza intermediari e con totale trasparenza.` },
      { h2: `Come scegliere la carta crypto nel ${YEAR} in base al profilo`, p: `Nel 2026, la scelta dipende dal tuo utilizzo principale. Grande viaggiatore? Crypto.com Jade o Indigo offrono lounge Priority Pass e assicurazione viaggio. Vuoi accumulare Bitcoin? Nexo Card dà cashback in BTC senza staking obbligatorio. Utente DeFi? MetaMask Card o Gnosis Pay collegano direttamente il tuo wallet. Principiante? Brighty o Revolut Standard offrono una transizione graduale. Il mercato maturo del 2026 offre una carta per ogni profilo.` },
      { h2: `Cosa è cambiato nel ${YEAR} per le carte crypto in Europa`, p: `Il 2026 segna un punto di svolta normativo e tecnologico. MiCA è pienamente applicabile, espellendo gli emittenti non conformi. I consumatori godono di protezioni paragonabili alle banche tradizionali. I pagamenti on-chain avanzano (Gnosis Pay, MetaMask Card, Ether.fi Card), le stablecoin si affermano come mezzo di ricarica, e le interfacce si integrano sempre più con i wallet esistenti.` },
      { h2: `La nostra selezione delle migliori carte crypto del ${YEAR} per categoria`, p: `Miglior carta crypto per tutti i profili: Crypto.com Jade (cashback 3%, lounge, assicurazione viaggio, rimborsi Airbnb/Expedia/Netflix). Migliore senza staking: Gnosis Pay (2% on-chain, self-custody, rete xDAI). Migliore per principianti: Brighty (gratuita, USDC, IBAN europeo, cashback 1,75%). Migliore per accumulare BTC: Nexo Card (2% in BTC, senza staking). Migliore DeFi-native: MetaMask Card (cashback ETH, wallet diretto). Queste raccomandazioni del ${YEAR} si basano sulla conformità MiCA, la solidità finanziaria dell'emittente e il cashback reale dopo deduzione dei costi di staking.` },
    ],
    en: [
      { h2: `Which crypto cards are essential in ${YEAR}?`, p: `In 2026, the crypto card market has consolidated around a few strong players: Crypto.com remains the leader with its complete ecosystem, Nexo stands out for BTC cashback with no staking, Gnosis Pay is rising with its unique on-chain proposition. Newcomers like MetaMask Card and Ether.fi Card are attracting DeFi users. MiCA regulation in Europe brings greater transparency and consumer protection to the sector.` },
      { h2: `Crypto card trends 2026: MiCA, on-chain, stablecoins`, p: `The MiCA (Markets in Crypto-Assets) regulation, fully in force since 2025, requires issuers to hold reserves and publish compliance reports. Result: cards issued by Europe-regulated players (Crypto.com, Nexo, Revolut) now carry stronger consumer protections. The on-chain trend is accelerating with cards like Gnosis Pay, which settle directly from your wallet — no intermediary, full transparency.` },
      { h2: `How to choose your crypto card in ${YEAR} by profile`, p: `In 2026, your choice of crypto card depends primarily on your main use case. Frequent flyer? Crypto.com Jade or Indigo offer Priority Pass lounges, travel insurance and Airbnb cashback. Want to accumulate Bitcoin? Nexo Card gives BTC cashback with no mandatory staking. DeFi user? MetaMask Card or Gnosis Pay connect directly to your wallet. Beginner? Brighty or Revolut Standard offer a smooth entry with no risk. The market's maturity in 2026 means there's a suitable card for every profile — without major trade-offs.` },
      { h2: `What has changed in ${YEAR} for crypto cards in Europe`, p: `2026 marks a regulatory and technological turning point for European crypto cards. MiCA is now fully applicable, forcing non-compliant issuers out of the market. Consumers enjoy protections comparable to traditional banks. On the technology side, on-chain settlement is growing (Gnosis Pay, MetaMask Card, Ether.fi Card), stablecoins are the preferred top-up method, and interfaces integrate increasingly with existing wallets. The barrier to getting your first crypto card has never been lower.` },
      { h2: `Our picks for the best crypto cards of ${YEAR} by category`, p: `Best overall crypto card: Crypto.com Jade (3% cashback, lounges, travel insurance, Airbnb/Expedia/Netflix reimbursements). Best no-staking card: Gnosis Pay (2% on-chain, self-custody, xDAI network). Best card for beginners: Brighty (free, USDC, European IBAN, 1.75% cashback). Best for accumulating BTC: Nexo Card (2% in BTC, no staking). Best DeFi-native card: MetaMask Card (ETH cashback, direct wallet). These ${YEAR} recommendations are based on MiCA compliance, issuer financial soundness, and real cashback after deducting staking costs.` },
    ],
  },
  france: {
    fr: [
      { h2: `Quelles cartes crypto sont vraiment disponibles en France ?`, p: `Toutes les cartes crypto ne sont pas disponibles en France. Certaines, comme la Coinbase Card, fonctionnent dans l'UE mais avec des restrictions. Les cartes disponibles en France et les plus fiables sont : Crypto.com Visa, Nexo Card, Bybit Card, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty, Deblock et Revolut. Vérifiez toujours la disponibilité sur le site officiel, car les règles de conformité peuvent évoluer. Depuis MiCA (2025), les émetteurs régulés en UE doivent afficher clairement leur couverture géographique.` },
      { h2: `Réglementation MiCA et cartes crypto en France : ce que vous devez savoir`, p: `Le règlement MiCA (Markets in Crypto-Assets), en vigueur depuis décembre 2024, impose des normes strictes aux émetteurs de cartes crypto opérant en France et dans l'UE : réserves prouvables, rapports de transparence, protection des fonds clients. Résultat concret : les émetteurs régulés comme Crypto.com, Nexo ou Revolut offrent désormais une protection comparable aux banques classiques. Pour les utilisateurs français, cela signifie plus de sécurité et des recours clarifiés en cas de litige. Privilégiez toujours une carte émise par un acteur disposant d'un agrément AMF, ACPR ou équivalent MiCA.` },
      { h2: `Fiscalité des cartes crypto en France en ${YEAR}`, p: `En France, chaque utilisation d'une carte crypto implique une conversion crypto → euros au moment du paiement. Cette conversion est un fait générateur d'imposition : les plus-values réalisées sont soumises à la flat tax de 30% (Prélèvement Forfaitaire Unique). Pour simplifier votre déclaration, utilisez Waltio, Koinly ou CoinTracking pour agréger automatiquement vos transactions. La stratégie la plus simple pour éviter tout événement fiscal : rechargez votre carte en stablecoins (USDC, USDT) — valeur stable, pas de plus-value réalisée, pas de déclaration à prévoir sur la conversion.` },
      { h2: `Meilleures cartes crypto pour les résidents français en ${YEAR}`, p: `Pour les résidents français, les cartes offrant le meilleur rapport qualité-prix en 2026 sont : Crypto.com Visa (écosystème complet, 5 niveaux, disponible en France), Nexo Card (cashback en BTC sans staking), Gnosis Pay (on-chain, self-custody), MetaMask Card (DeFi-native, cashback en ETH), Brighty (gratuite, USDC, IBAN français possible) et Deblock (fintech franco-crypto, IBAN FR, interface en français). Toutes ces cartes disposent d'une autorisation réglementaire valide en France.` },
      { h2: `Ouvrir une carte crypto depuis la France : guide pas-à-pas en ${YEAR}`, p: `(1) Choisissez votre carte sur TopCryptoCards selon votre profil (cashback, staking, DeFi). (2) Créez un compte sur la plateforme officielle — 5 à 10 minutes. (3) Complétez le KYC : pièce d'identité (CNI ou passeport) + selfie, validation sous 24 à 72 heures. (4) Si votre carte l'exige, stakez le montant minimum requis (ex. 350 CRO pour la Crypto.com Ruby Steel). (5) Rechargez via virement SEPA depuis votre banque française (BNP Paribas, Crédit Agricole, Société Générale, LCL…). (6) Votre carte virtuelle est disponible immédiatement, la carte physique arrive en 5 à 10 jours ouvrés.` },
    ],
    de: [
      { h2: `Welche Krypto-Karten sind in Deutschland wirklich verfügbar?`, p: `Nicht alle Krypto-Karten sind in Deutschland verfügbar. Einige, wie die Coinbase Card, funktionieren in der EU, aber mit Einschränkungen. Die in Deutschland verfügbaren und zuverlässigsten Karten sind: Crypto.com Visa, Nexo Card, Bybit Card, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty und Revolut. Überprüfen Sie immer die Verfügbarkeit auf der offiziellen Website, da sich Compliance-Regeln ändern können. Seit MiCA (2025) müssen EU-regulierte Emittenten ihre geografische Abdeckung klar ausweisen.` },
      { h2: `MiCA-Regulierung und Krypto-Karten in Deutschland: Was Sie wissen müssen`, p: `Die MiCA-Verordnung (Markets in Crypto-Assets), seit Dezember 2024 in Kraft, verpflichtet Krypto-Karten-Emittenten in Deutschland und der EU zu strengen Standards: nachweisliche Reserven, Transparenzberichte, Kundenvermögensschutz. Konkrete Folge: Regulierte Emittenten wie Crypto.com, Nexo oder Revolut bieten nun einen Schutz vergleichbar mit klassischen Banken. Bevorzugen Sie stets eine Karte eines Anbieters mit MiCA- oder nationaler Lizenz (BaFin).` },
      { h2: `Krypto-Karten Steuer in Deutschland ${YEAR}`, p: `In Deutschland gilt: Kryptowährungen, die länger als ein Jahr gehalten wurden, sind bei Veräußerung steuerfrei. Bei weniger als einem Jahr Haltedauer wird der Gewinn zum persönlichen Einkommensteuersatz besteuert (bis zu 45%). Jede Kartenzahlung ist technisch eine Veräußerung. Einfachste Lösung: Stablecoins (USDC, USDT) zum Aufladen verwenden — kein Kursgewinn, keine Steuerpflicht auf die Konvertierung. Tools wie Waltio oder Koinly helfen bei der automatischen Auswertung.` },
      { h2: `Beste Krypto-Karten für Nutzer in Deutschland ${YEAR}`, p: `Für deutsche Nutzer bieten in 2026 folgende Karten das beste Preis-Leistungs-Verhältnis: Crypto.com Visa (umfassendstes Ökosystem, 5 Stufen), Nexo Card (BTC-Cashback ohne Staking), Gnosis Pay (On-Chain, Self-Custody), MetaMask Card (DeFi-nativ, ETH-Cashback), Brighty (kostenlos, USDC, europäische IBAN) und Revolut (Banking + Krypto in einer App). Alle verfügen über eine gültige MiCA-Zulassung oder BaFin-Registrierung.` },
      { h2: `Krypto-Karte aus Deutschland beantragen: Schritt-für-Schritt-Anleitung ${YEAR}`, p: `(1) Wählen Sie auf TopCryptoCards die passende Karte nach Ihrem Profil. (2) Erstellen Sie ein Konto auf der offiziellen Plattform — 5 bis 10 Minuten. (3) Schließen Sie das KYC ab: Personalausweis oder Reisepass + Selfie, Genehmigung in 24 bis 72 Stunden. (4) Laden Sie bei Bedarf den erforderlichen Mindestbetrag auf (z. B. 350 CRO für Crypto.com Ruby Steel). (5) Aufladen per SEPA-Überweisung von Ihrer deutschen Bank (Deutsche Bank, Sparkasse, Commerzbank, DKB, ING…). (6) Virtuelle Karte sofort verfügbar, physische Karte in 5 bis 10 Werktagen.` },
    ],
    es: [
      { h2: `¿Qué tarjetas crypto están realmente disponibles en España?`, p: `No todas las tarjetas crypto están disponibles en España. Algunas, como la Coinbase Card, funcionan en la UE pero con restricciones. Las más fiables disponibles en España son: Crypto.com Visa, Nexo Card, Bybit Card, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty y Revolut. Verifica siempre la disponibilidad en el sitio oficial, ya que las reglas de cumplimiento pueden cambiar. Desde MiCA (2025), los emisores regulados en la UE deben indicar claramente su cobertura geográfica.` },
      { h2: `Regulación MiCA y tarjetas crypto en España: lo que debes saber`, p: `El reglamento MiCA (Markets in Crypto-Assets), en vigor desde diciembre de 2024, impone estándares estrictos a los emisores de tarjetas crypto en España y la UE: reservas demostrables, informes de transparencia, protección de fondos de clientes. Resultado concreto: los emisores regulados como Crypto.com, Nexo o Revolut ofrecen ahora una protección comparable a la banca tradicional. Prioriza siempre una tarjeta emitida por un proveedor con licencia MiCA o equivalente (CNMV).` },
      { h2: `Fiscalidad de las tarjetas crypto en España en ${YEAR}`, p: `En España, cada uso de una tarjeta crypto implica una conversión cripto → euros en el momento del pago, considerada una transmisión patrimonial sujeta al IRPF como ganancia. La solución más sencilla: recargar la tarjeta con stablecoins (USDC, USDT) — valor estable, sin plusvalía realizada, sin obligación fiscal en la conversión. Herramientas como Koinly o TaxDown ayudan a gestionar automáticamente las transacciones crypto para la declaración de la renta.` },
      { h2: `Mejores tarjetas crypto para residentes en España en ${YEAR}`, p: `Para los residentes en España, las mejores opciones en 2026 son: Crypto.com Visa (ecosistema completo, 5 niveles), Nexo Card (cashback en BTC sin staking), Gnosis Pay (on-chain, autocustodia), MetaMask Card (DeFi-nativa, cashback en ETH), Brighty (gratuita, USDC, IBAN europeo) y Revolut (banca + cripto en una sola app). Todas cuentan con autorización MiCA válida o equivalente nacional.` },
      { h2: `Cómo abrir una tarjeta crypto desde España: guía paso a paso en ${YEAR}`, p: `(1) Elige tu tarjeta en TopCryptoCards según tu perfil (cashback, staking, DeFi). (2) Crea una cuenta en la plataforma oficial — de 5 a 10 minutos. (3) Completa el KYC: DNI o pasaporte + selfie, validación en 24-72 horas. (4) Si tu tarjeta lo requiere, deposita el staking mínimo necesario (p. ej., 350 CRO para Crypto.com Ruby Steel). (5) Recarga por transferencia SEPA desde tu banco español (BBVA, Santander, CaixaBank, ING…). (6) La tarjeta virtual está disponible de inmediato, la física llega en 5-10 días hábiles.` },
    ],
    it: [
      { h2: `Quali carte crypto sono davvero disponibili in Italia?`, p: `Non tutte le carte crypto sono disponibili in Italia. Alcune, come la Coinbase Card, funzionano nell'UE ma con restrizioni. Le più affidabili disponibili in Italia sono: Crypto.com Visa, Nexo Card, Bybit Card, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty e Revolut. Verifica sempre la disponibilità sul sito ufficiale, poiché le regole di conformità possono cambiare. Dal MiCA (2025), gli emittenti regolamentati nell'UE devono indicare chiaramente la loro copertura geografica.` },
      { h2: `Regolamentazione MiCA e carte crypto in Italia: cosa devi sapere`, p: `Il regolamento MiCA (Markets in Crypto-Assets), in vigore da dicembre 2024, impone standard severi agli emittenti di carte crypto in Italia e nell'UE: riserve dimostrabili, rapporti di trasparenza, protezione dei fondi dei clienti. Risultato concreto: gli emittenti regolamentati come Crypto.com, Nexo o Revolut offrono ora una protezione paragonabile alle banche tradizionali. Preferisci sempre una carta emessa da un provider con licenza MiCA o equivalente (OAM).` },
      { h2: `Fiscalità delle carte crypto in Italia nel ${YEAR}`, p: `In Italia, ogni utilizzo di una carta crypto comporta una conversione cripto → euro al momento del pagamento, soggetta a imposta sulle plusvalenze del 26% (imposta sostitutiva). La soluzione più semplice: ricaricare la carta con stablecoin (USDC, USDT) — valore stabile, nessuna plusvalenza realizzata, nessun evento fiscale sulla conversione. Strumenti come Koinly o Cointracking facilitano la rendicontazione automatica delle transazioni.` },
      { h2: `Migliori carte crypto per i residenti in Italia nel ${YEAR}`, p: `Per i residenti in Italia, le migliori opzioni nel 2026 sono: Crypto.com Visa (ecosistema completo, 5 livelli), Nexo Card (cashback in BTC senza staking), Gnosis Pay (on-chain, self-custody), MetaMask Card (DeFi-nativa, cashback in ETH), Brighty (gratuita, USDC, IBAN europeo) e Revolut (banca + crypto in un'unica app). Tutte dispongono di un'autorizzazione MiCA valida o equivalente nazionale (OAM).` },
      { h2: `Come aprire una carta crypto dall'Italia: guida passo passo nel ${YEAR}`, p: `(1) Scegli la carta su TopCryptoCards in base al tuo profilo (cashback, staking, DeFi). (2) Crea un account sulla piattaforma ufficiale — da 5 a 10 minuti. (3) Completa il KYC: carta d'identità o passaporto + selfie, approvazione in 24-72 ore. (4) Se richiesto dalla carta, deposita il minimo in staking (es. 350 CRO per Crypto.com Ruby Steel). (5) Ricarica tramite bonifico SEPA dalla tua banca italiana (Intesa Sanpaolo, UniCredit, Fineco, N26 Italy…). (6) La carta virtuale è disponibile immediatamente, la fisica arriva in 5-10 giorni lavorativi.` },
    ],
    en: [
      { h2: `Which crypto cards are truly available in Europe?`, p: `Not all crypto cards are available across Europe. Some, like the Coinbase Card, operate in the EU but with restrictions. The most reliable cards available across the EU are: Crypto.com Visa, Nexo Card, Bybit Card, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty, and Revolut. Always verify availability on the official website, as compliance rules can change. Since MiCA (2025), EU-regulated issuers must clearly state their geographic coverage.` },
      { h2: `MiCA regulation and crypto cards in Europe: what you need to know`, p: `The MiCA (Markets in Crypto-Assets) regulation, in force since December 2024, imposes strict standards on crypto card issuers operating in the EU: provable reserves, transparency reports, client fund protection. Concrete result: regulated issuers like Crypto.com, Nexo, and Revolut now offer protection comparable to traditional banks. Always prioritise a card issued by a provider holding a MiCA licence or national equivalent.` },
      { h2: `Crypto card taxation in Europe in ${YEAR}`, p: `Tax treatment of crypto cards varies by country. In France, crypto conversions at point of sale trigger capital gains tax at the 30% flat rate. In Germany, crypto held over 12 months is tax-exempt at sale. In Italy, gains are taxed at 26%. In Spain, they fall under personal income tax. The simplest approach for all European users: top up your card with stablecoins (USDC, USDT) — stable value, no realised capital gain, no taxable event on the conversion.` },
      { h2: `Best crypto cards available across Europe in ${YEAR}`, p: `For European users seeking the best combination of availability, reliability and returns, the top options in 2026 are: Crypto.com Visa (widest feature set, 5 tiers, available EU-wide), Nexo Card (BTC cashback, no staking required), Gnosis Pay (on-chain, self-custody), MetaMask Card (DeFi-native, ETH cashback), Brighty (free, USDC, European IBAN) and Revolut (banking + crypto in one app). All hold valid MiCA authorisation or national equivalents.` },
      { h2: `How to open a crypto card from Europe: step-by-step guide in ${YEAR}`, p: `(1) Choose your card on TopCryptoCards based on your profile (cashback, staking, DeFi). (2) Create an account on the official platform — 5 to 10 minutes. (3) Complete KYC: passport or national ID + selfie, approved in 24-72 hours. (4) If required, deposit the minimum staking amount (e.g. 350 CRO for Crypto.com Ruby Steel). (5) Top up via SEPA transfer from your European bank — free and arrives within 1 business day. (6) Virtual card is available immediately; physical card ships in 5-10 business days.` },
    ],
  },
  'no-kyc': {
    fr: [
      { h2: `Cartes crypto sans KYC : ce que cela signifie vraiment`, p: `Le terme "sans KYC" est souvent mal compris. Aucune carte Visa ou Mastercard n'est légalement utilisable sans identification — MiCA et la directive AMLD5 l'exigent. Ce que l'on appelle "cartes sans KYC" sont en réalité des cartes à custody réduit : Gnosis Pay règle directement depuis votre Gnosis Safe (wallet self-custody), MetaMask Card fonctionne sans compte custodial centralisé. Le KYC reste requis pour l'émission de la carte, mais votre crypto ne transite pas par un intermédiaire centralisé.` },
      { h2: `Gnosis Pay et MetaMask Card : les cartes crypto les plus proches du modèle sans intermédiaire`, p: `Gnosis Pay est la carte on-chain la plus avancée : chaque paiement est signé depuis votre Gnosis Safe et réglé en xDAI directement sur la blockchain. Aucun compte custodial, aucun intermédiaire entre votre wallet et le terminal de paiement. MetaMask Card suit le même principe : votre crypto reste dans votre wallet jusqu'au moment du paiement, sans que la plateforme en soit gardien. Ces deux cartes représentent l'avant-garde de la souveraineté financière crypto en ${YEAR}.` },
      { h2: `Les limites de l'auto-custody appliqué aux cartes de paiement`, p: `Les cartes à custody réduit comme Gnosis Pay et MetaMask Card présentent des avantages indéniables en termes de souveraineté, mais aussi des contraintes pratiques. Le rechargement nécessite une maîtrise des wallets on-chain (gas fees, bridging, gestion des clés). En cas de perte de vos clés privées, votre capital est irrécupérable — aucun service client ne peut vous aider. La liquidité peut également être limitée selon le réseau. Ces cartes sont idéales pour les utilisateurs DeFi expérimentés, moins adaptées aux débutants qui préféreront une solution custodiale comme Brighty ou Nexo.` },
      { h2: `Sécurité et auto-custody : les bonnes pratiques en ${YEAR}`, p: `Si vous utilisez une carte crypto à custody réduit, quelques règles sont impératives. Premièrement, sauvegardez votre seed phrase (12 ou 24 mots) hors ligne, sur papier ou sur une plaque en acier inoxydable — jamais en cloud ou screenshot. Deuxièmement, utilisez un hardware wallet (Ledger, Trezor) comme couche de sécurité supplémentaire. Troisièmement, vérifiez systématiquement les adresses de contrat avant d'interagir avec votre Gnosis Safe ou votre wallet MetaMask. L'auto-custody offre une liberté maximale, mais exige une discipline de sécurité proportionnelle.` },
      { h2: `FAQ : cartes crypto et KYC — toutes les vraies réponses`, p: `Peut-on utiliser une carte crypto sans fournir de pièce d'identité ? Non — toute carte Visa ou Mastercard exige un KYC légal. Ce qu'on appelle "sans KYC" signifie "sans compte custodial centralisé", pas sans identification. Gnosis Pay exige-t-elle un KYC ? Oui, pour l'émission de la carte, mais votre crypto reste dans votre wallet. MetaMask Card partage-t-elle mes données bancaires ? Non — MetaMask Card ne stocke pas vos fonds, votre wallet reste non-custodial. Peut-on payer anonymement avec une carte crypto on-chain ? Les transactions Gnosis Pay sont visibles sur l'explorateur de la Gnosis Chain, mais ne sont pas liées à votre identité civile publiquement.` },
    ],
    de: [
      { h2: `Krypto-Karten ohne KYC: Was das wirklich bedeutet`, p: `Der Begriff "ohne KYC" wird oft missverstanden. Keine Visa- oder Mastercard-Karte ist ohne Identifizierung legal nutzbar — MiCA und AMLD5 schreiben das vor. Was als "KYC-freie Karten" bezeichnet wird, sind Karten mit reduzierter Verwahrung: Gnosis Pay rechnet direkt aus Ihrem Gnosis Safe (Self-Custody-Wallet) ab, MetaMask Card funktioniert ohne zentrales Depot-Konto. KYC ist für die Kartenausgabe weiterhin erforderlich, aber Ihre Krypto geht nicht durch einen zentralisierten Mittelsmann.` },
      { h2: `Gnosis Pay und MetaMask Card: Die fortschrittlichsten Krypto-Karten ohne Intermediär`, p: `Gnosis Pay ist die fortschrittlichste On-Chain-Karte: Jede Zahlung wird aus Ihrem Gnosis Safe signiert und in xDAI direkt auf der Blockchain abgerechnet. Kein Depot-Konto, kein Mittelsmann zwischen Ihrer Wallet und dem Zahlungsterminal. MetaMask Card folgt demselben Prinzip: Ihre Krypto bleibt in Ihrer Wallet bis zum Zahlungsmoment, ohne dass die Plattform Verwahrstelle ist. Diese zwei Karten repräsentieren die Avantgarde der Krypto-Finanzsouveränität in ${YEAR}.` },
      { h2: `Grenzen der Self-Custody bei Zahlungskarten`, p: `Karten mit reduzierter Verwahrung wie Gnosis Pay und MetaMask Card bieten echte Souveränitätsvorteile, aber auch praktische Einschränkungen. Das Aufladen erfordert On-Chain-Wallet-Kenntnisse (Gas-Gebühren, Bridging, Schlüsselverwaltung). Bei Verlust Ihrer privaten Schlüssel ist Ihr Kapital unwiederbringlich verloren — kein Kundenservice kann helfen. Diese Karten eignen sich ideal für erfahrene DeFi-Nutzer, weniger für Anfänger, die besser mit custodial Lösungen wie Brighty oder Nexo starten.` },
      { h2: `Sicherheit und Self-Custody: Best Practices in ${YEAR}`, p: `Bei Krypto-Karten mit reduzierter Verwahrung sind einige Regeln unerlässlich. Erstens: Sichern Sie Ihre Seed-Phrase (12 oder 24 Wörter) offline auf Papier oder einer Edelstahlplatte — niemals in der Cloud oder als Screenshot. Zweitens: Verwenden Sie ein Hardware-Wallet (Ledger, Trezor) als zusätzliche Sicherheitsschicht. Drittens: Überprüfen Sie systematisch Contract-Adressen vor jeder Interaktion mit Ihrem Gnosis Safe oder MetaMask-Wallet. Self-Custody bietet maximale Freiheit — erfordert aber proportionale Sicherheitsdisziplin.` },
      { h2: `FAQ: Krypto-Karten und KYC — die echten Antworten`, p: `Kann man eine Krypto-Karte ohne Ausweis nutzen? Nein — jede Visa- oder Mastercard-Karte erfordert legal KYC. "Ohne KYC" bedeutet "ohne zentralisiertes Depot-Konto", nicht ohne Identifikation. Verlangt Gnosis Pay KYC? Ja, für die Kartenausgabe, aber Ihre Krypto bleibt in Ihrer Wallet. Teilt MetaMask Card meine Bankdaten? Nein — MetaMask Card verwahrt Ihre Gelder nicht, Ihre Wallet bleibt non-custodial. Kann man mit einer On-Chain-Karte anonym bezahlen? Gnosis-Pay-Transaktionen sind im Gnosis-Chain-Explorer sichtbar, aber nicht öffentlich mit Ihrer Identität verknüpft.` },
    ],
    es: [
      { h2: `Tarjetas crypto sin KYC: lo que realmente significa`, p: `El término "sin KYC" se entiende mal con frecuencia. Ninguna tarjeta Visa o Mastercard es legalmente utilizable sin identificación — MiCA y AMLD5 lo exigen. Lo que se llama "tarjetas sin KYC" son en realidad tarjetas con custodia reducida: Gnosis Pay liquida directamente desde tu Gnosis Safe (wallet de autocustodia), MetaMask Card funciona sin cuenta custodial centralizada. El KYC sigue siendo necesario para la emisión de la tarjeta, pero tus criptos no pasan por un intermediario centralizado.` },
      { h2: `Gnosis Pay y MetaMask Card: las tarjetas crypto más cercanas al modelo sin intermediario`, p: `Gnosis Pay es la tarjeta on-chain más avanzada: cada pago se firma desde tu Gnosis Safe y se liquida en xDAI directamente en la blockchain. Sin cuenta custodial, sin intermediario entre tu wallet y el terminal de pago. MetaMask Card sigue el mismo principio: tu cripto permanece en tu wallet hasta el momento del pago, sin que la plataforma sea su custodio. Estas dos tarjetas representan la vanguardia de la soberanía financiera crypto en ${YEAR}.` },
      { h2: `Límites de la autocustodia aplicada a tarjetas de pago`, p: `Las tarjetas con custodia reducida como Gnosis Pay y MetaMask Card ofrecen ventajas reales en términos de soberanía, pero también limitaciones prácticas. La recarga requiere dominar los wallets on-chain (comisiones gas, bridging, gestión de claves). En caso de pérdida de tus claves privadas, tu capital es irrecuperable — ningún servicio de atención al cliente puede ayudarte. Estas tarjetas son ideales para usuarios DeFi experimentados, menos adecuadas para principiantes, que se beneficiarían más de soluciones custodiadas como Brighty o Nexo.` },
      { h2: `Seguridad y autocustodia: buenas prácticas en ${YEAR}`, p: `Con tarjetas crypto de custodia reducida, algunas reglas son imprescindibles. Primero: guarda tu frase semilla (12 o 24 palabras) fuera de línea, en papel o en una placa de acero inoxidable — nunca en la nube ni como captura de pantalla. Segundo: usa un hardware wallet (Ledger, Trezor) como capa de seguridad adicional. Tercero: verifica sistemáticamente las direcciones de contrato antes de interactuar con tu Gnosis Safe o wallet MetaMask. La autocustodia ofrece libertad máxima, pero exige una disciplina de seguridad proporcional.` },
      { h2: `FAQ: tarjetas crypto y KYC — respuestas reales`, p: `¿Se puede usar una tarjeta crypto sin proporcionar un documento de identidad? No — toda tarjeta Visa o Mastercard exige KYC legalmente. "Sin KYC" significa "sin cuenta custodial centralizada", no sin identificación. ¿Gnosis Pay exige KYC? Sí, para la emisión de la tarjeta, pero tus criptos permanecen en tu wallet. ¿MetaMask Card comparte mis datos bancarios? No — MetaMask Card no custodia tus fondos, tu wallet sigue siendo no-custodial. ¿Se puede pagar de forma anónima con una tarjeta on-chain? Las transacciones de Gnosis Pay son visibles en el explorador de la Gnosis Chain, pero no están vinculadas públicamente a tu identidad civil.` },
    ],
    it: [
      { h2: `Carte crypto senza KYC: cosa significa davvero`, p: `Il termine "senza KYC" è spesso frainteso. Nessuna carta Visa o Mastercard è legalmente utilizzabile senza identificazione — MiCA e AMLD5 lo richiedono. Quelle che vengono chiamate "carte senza KYC" sono in realtà carte a custodia ridotta: Gnosis Pay regola direttamente dal tuo Gnosis Safe (wallet self-custody), MetaMask Card funziona senza conto custodiale centralizzato. Il KYC rimane necessario per l'emissione della carta, ma le tue criptovalute non transitano attraverso un intermediario centralizzato.` },
      { h2: `Gnosis Pay e MetaMask Card: le carte crypto più vicine al modello senza intermediari`, p: `Gnosis Pay è la carta on-chain più avanzata: ogni pagamento viene firmato dal tuo Gnosis Safe e regolato in xDAI direttamente sulla blockchain. Nessun conto custodiale, nessun intermediario tra il tuo wallet e il terminale di pagamento. MetaMask Card segue lo stesso principio: la tua cripto rimane nel tuo wallet fino al momento del pagamento, senza che la piattaforma ne sia custode. Queste due carte rappresentano l'avanguardia della sovranità finanziaria crypto nel ${YEAR}.` },
      { h2: `Limiti della self-custody applicata alle carte di pagamento`, p: `Le carte a custodia ridotta come Gnosis Pay e MetaMask Card offrono vantaggi reali in termini di sovranità, ma anche limitazioni pratiche. La ricarica richiede padronanza dei wallet on-chain (gas fee, bridging, gestione delle chiavi). In caso di perdita delle chiavi private, il capitale è irrecuperabile — nessun servizio clienti può aiutarti. Queste carte sono ideali per utenti DeFi esperti, meno adatte ai principianti, che beneficerebbero di soluzioni custodiali come Brighty o Nexo.` },
      { h2: `Sicurezza e self-custody: le buone pratiche nel ${YEAR}`, p: `Con carte crypto a custodia ridotta, alcune regole sono imprescindibili. Primo: conserva la tua seed phrase (12 o 24 parole) offline, su carta o su una piastra in acciaio inossidabile — mai nel cloud o come screenshot. Secondo: usa un hardware wallet (Ledger, Trezor) come livello di sicurezza aggiuntivo. Terzo: verifica sistematicamente gli indirizzi dei contratti prima di interagire con il tuo Gnosis Safe o wallet MetaMask. La self-custody offre libertà massima, ma richiede una disciplina di sicurezza proporzionale.` },
      { h2: `FAQ: carte crypto e KYC — le vere risposte`, p: `Si può usare una carta crypto senza fornire un documento d'identità? No — ogni carta Visa o Mastercard richiede KYC per legge. "Senza KYC" significa "senza conto custodiale centralizzato", non senza identificazione. Gnosis Pay richiede il KYC? Sì, per l'emissione della carta, ma le tue crypto rimangono nel tuo wallet. MetaMask Card condivide i miei dati bancari? No — MetaMask Card non custodisce i tuoi fondi, il tuo wallet rimane non-custodial. Si può pagare anonimamente con una carta on-chain? Le transazioni di Gnosis Pay sono visibili nell'explorer della Gnosis Chain, ma non sono pubblicamente collegate alla tua identità civile.` },
    ],
    en: [
      { h2: `No-KYC crypto cards: what it really means`, p: `The term "no-KYC" is frequently misunderstood. No Visa or Mastercard can legally operate without identification — MiCA and AMLD5 require it. What are called "no-KYC cards" are actually reduced-custody cards: Gnosis Pay settles directly from your Gnosis Safe (self-custody wallet), MetaMask Card works without a centralised custodial account. KYC is still required to issue the card, but your crypto doesn't pass through a centralised intermediary.` },
      { h2: `Gnosis Pay and MetaMask Card: the closest crypto cards to the no-intermediary model`, p: `Gnosis Pay is the most advanced on-chain card: every payment is signed from your Gnosis Safe and settled in xDAI directly on the blockchain. No custodial account, no intermediary between your wallet and the payment terminal. MetaMask Card follows the same principle: your crypto stays in your wallet until the moment of payment, with the platform never acting as custodian. These two cards represent the frontier of crypto financial sovereignty in ${YEAR}.` },
      { h2: `Limits of self-custody applied to payment cards`, p: `Self-custody cards like Gnosis Pay and MetaMask Card offer genuine sovereignty advantages, but also practical constraints. Top-ups require on-chain wallet proficiency (gas fees, bridging, key management). If you lose your private keys, your funds are gone permanently — no customer support can help. These cards are ideal for experienced DeFi users, less suited for beginners, who are better served by custodial solutions like Brighty or Nexo for their first crypto card.` },
      { h2: `Security and self-custody: best practices in ${YEAR}`, p: `With reduced-custody crypto cards, a few rules are non-negotiable. First: back up your seed phrase (12 or 24 words) offline — on paper or a steel plate — never in the cloud or as a screenshot. Second: use a hardware wallet (Ledger, Trezor) as an additional security layer. Third: always verify contract addresses before interacting with your Gnosis Safe or MetaMask wallet. Self-custody offers maximum freedom — but demands proportional security discipline in return.` },
      { h2: `FAQ: crypto cards and KYC — the real answers`, p: `Can you use a crypto card without providing ID? No — every Visa or Mastercard legally requires KYC. "No-KYC" means "no centralised custodial account", not no identification. Does Gnosis Pay require KYC? Yes, to issue the card — but your crypto stays in your own wallet. Does MetaMask Card share my banking data? No — MetaMask Card doesn't hold your funds; your wallet remains non-custodial. Can you pay anonymously with an on-chain card? Gnosis Pay transactions are visible on the Gnosis Chain explorer, but are not publicly linked to your civil identity.` },
    ],
  },
  physical: {
    fr: [
      { h2: `Carte crypto physique vs virtuelle : quelles différences concrètes ?`, p: `La carte physique se distingue par trois avantages clés : l'accès aux retraits d'espèces (impossible avec une carte purement virtuelle), l'utilisation chez tous les commerçants acceptant Visa/Mastercard sans smartphone nécessaire, et une sécurité renforcée puisque votre numéro de carte virtuelle reste protégé. En revanche, la livraison prend 1 à 2 semaines selon votre pays, contre une activation instantanée pour la carte virtuelle. Les deux formats sont complémentaires : la plupart des émetteurs proposent les deux avec un seul compte, vous laissant choisir selon le contexte.` },
      { h2: `Crypto.com, Revolut, Nexo, Bybit : meilleures cartes physiques ${YEAR}`, p: `Crypto.com offre une carte Visa physique disponible en 5 niveaux (Ruby, Jade, Indigo, Frosted Rose, Obsidian) avec un cashback de 1% à 8% selon le staking en CRO. Revolut propose une carte physique gratuite (niveau Standard) avec des avantages bancaires complets dès la version premium. Nexo fournit une carte Mastercard physique avec cashback en BTC ou NEXO, sans staking obligatoire. Bybit propose une carte Visa physique avec cashback en BIT et des plafonds de retraits DAB avantageux pour les voyageurs fréquents.` },
      { h2: `Livraison et sécurité de la carte crypto physique`, p: `La livraison d'une carte physique prend généralement 7 à 15 jours ouvrables en Europe, selon votre pays et le prestataire logistique de l'émetteur. Crypto.com expédie dans le monde entier via un suivi de colis. Revolut et Nexo livrent dans l'UE en 5 à 10 jours. Dès réception, activez immédiatement votre carte dans l'app et activez le 2FA. En cas de perte ou vol, bloquez instantanément votre carte depuis l'app — la plupart des émetteurs proposent un blocage instantané sans fermer votre compte. Le remplacement est généralement expédié sous 10 jours.` },
      { h2: `Carte crypto physique à l'étranger : DAB, acceptation et conseils`, p: `Les cartes crypto physiques sont particulièrement adaptées aux voyages. Visa et Mastercard sont acceptées dans presque tous les commerces et DAB internationaux. Vérifiez votre plafond mensuel de retrait gratuit avant de partir — la plupart des cartes d'entrée de gamme offrent 200 à 400€ gratuits, les niveaux premium jusqu'à 800€ ou illimité. Signalez vos voyages prolongés à votre émetteur pour éviter les blocages de transaction. Dans les pays à faible infrastructure bancaire, gardez toujours des liquidités locales en secours.` },
      { h2: `Quand opter pour une carte crypto physique plutôt que virtuelle ?`, p: `La carte physique s'impose dans trois situations clés : les retraits DAB (la carte virtuelle ne fonctionne pas aux distributeurs), les commerces qui n'acceptent pas Apple Pay ou Google Pay (rares mais existants, surtout en zones rurales ou dans certains pays), et les voyages dans des régions à connectivité limitée où vous ne pouvez pas vous fier à votre smartphone. La carte virtuelle est préférable pour tous les achats en ligne, les abonnements, et les pays où le paiement sans contact est universel. La stratégie optimale en ${YEAR} : activez la carte virtuelle immédiatement après votre KYC, utilisez-la au quotidien, et demandez la carte physique uniquement si vous en avez un besoin concret — la livraison prend 1 à 2 semaines de toute façon.` },
    ],
    de: [
      { h2: `Physische vs. virtuelle Krypto-Karte: Was sind die konkreten Unterschiede?`, p: `Die physische Karte zeichnet sich durch drei Hauptvorteile aus: Zugang zu Bargeldabhebungen (unmöglich mit einer rein virtuellen Karte), Nutzung bei allen Visa/Mastercard-Händlern ohne Smartphone und erhöhte Sicherheit, da Ihre virtuelle Kartennummer geschützt bleibt. Die Lieferung dauert 1–2 Wochen, während eine virtuelle Karte sofort aktiviert wird. Beide Formate ergänzen sich: die meisten Emittenten bieten beide mit nur einem Konto an.` },
      { h2: `Crypto.com, Revolut, Nexo, Bybit: Beste physische Krypto-Karten ${YEAR}`, p: `Crypto.com bietet eine physische Visa-Karte in 5 Stufen (Ruby, Jade, Indigo, Frosted Rose, Obsidian) mit 1% bis 8% Cashback je nach CRO-Staking. Revolut bietet eine kostenlose physische Karte (Standard) oder Premium-Stufen mit vollständigen Bankvorteilen. Nexo liefert eine physische Mastercard mit Cashback in BTC oder NEXO ohne Staking-Pflicht. Bybit bietet eine physische Visa-Karte mit BIT-Cashback und vorteilhaften ATM-Abhebungslimits für Reisende.` },
      { h2: `Lieferung und Sicherheit der physischen Krypto-Karte`, p: `Die Lieferung einer physischen Karte dauert in Europa in der Regel 7-15 Werktage, je nach Land und Logistikpartner des Emittenten. Crypto.com versendet weltweit mit Sendungsverfolgung. Revolut und Nexo liefern innerhalb der EU in 5-10 Tagen. Nach dem Erhalt aktivieren Sie die Karte sofort in der App und aktivieren Sie 2FA. Bei Verlust oder Diebstahl sperren Sie die Karte sofort über die App — die meisten Emittenten bieten sofortige Sperrung ohne Kontoschließung. Eine Ersatzkarte wird in der Regel innerhalb von 10 Werktagen versandt.` },
      { h2: `Physische Krypto-Karte im Ausland: Geldautomaten, Akzeptanz und Tipps`, p: `Physische Krypto-Karten eignen sich besonders gut für Reisen. Visa und Mastercard werden bei nahezu allen internationalen Händlern und Geldautomaten akzeptiert. Prüfen Sie Ihr monatliches Freiabhebungslimit vor der Reise — die meisten Einstiegskarten bieten 200-400€ kostenlos, Premium-Karten bis zu 800€ oder unbegrenzt. Informieren Sie Ihren Emittenten vor längeren Reisen, um Transaktionssperren zu vermeiden. In Ländern mit schlechter Karteninfrastruktur immer Bargeld als Backup mitführen.` },
      { h2: `Wann sollte man eine physische statt einer virtuellen Krypto-Karte wählen?`, p: `Die physische Karte ist in drei Situationen unverzichtbar: Bargeldabhebungen am Geldautomaten (eine rein virtuelle Karte funktioniert dort nicht), Händler ohne kontaktloses Bezahlen oder NFC-Terminal (selten, aber in ländlichen Regionen und bestimmten Ländern noch anzutreffen), sowie Reisen in Gebiete mit eingeschränkter Smartphone-Konnektivität. Die virtuelle Karte ist für Online-Einkäufe, Abonnements und Länder mit universalem NFC-Bezahlen vorzuziehen. Die optimale Strategie in ${YEAR}: Virtuelle Karte sofort nach der KYC-Validierung aktivieren und im Alltag nutzen — die physische Karte nur beantragen, wenn ein konkreter Bedarf besteht, da die Lieferung ohnehin 1 bis 2 Wochen dauert.` },
    ],
    es: [
      { h2: `Tarjeta crypto física vs virtual: ¿cuáles son las diferencias concretas?`, p: `La tarjeta física se distingue por tres ventajas clave: acceso a retiradas de efectivo (imposible con una tarjeta puramente virtual), uso en todos los comercios que acepten Visa/Mastercard sin necesidad de smartphone, y mayor seguridad ya que el número de tu tarjeta virtual permanece protegido. La entrega tarda 1–2 semanas según el país, frente a una activación instantánea para la tarjeta virtual. Ambos formatos son complementarios: la mayoría de emisores ofrecen los dos con una sola cuenta.` },
      { h2: `Crypto.com, Revolut, Nexo, Bybit: mejores tarjetas físicas ${YEAR}`, p: `Crypto.com ofrece una tarjeta Visa física disponible en 5 niveles (Ruby, Jade, Indigo, Frosted Rose, Obsidian) con cashback del 1% al 8% según el staking en CRO. Revolut propone una tarjeta física gratuita (nivel Standard) o premium con ventajas bancarias completas. Nexo proporciona una Mastercard física con cashback en BTC o NEXO sin staking obligatorio. Bybit ofrece una tarjeta Visa física con cashback en BIT y límites de retirada en cajero ventajosos para viajeros frecuentes.` },
      { h2: `Entrega y seguridad de la tarjeta crypto física`, p: `La entrega de una tarjeta física tarda normalmente entre 7 y 15 días laborables en Europa, según el país y el proveedor logístico del emisor. Crypto.com envía a todo el mundo con seguimiento. Revolut y Nexo entregan en la UE en 5-10 días. Al recibirla, actívala inmediatamente en la app y activa el 2FA. En caso de pérdida o robo, bloquéala al instante desde la app — la mayoría de emisores ofrecen bloqueo instantáneo sin cerrar tu cuenta. La tarjeta de sustitución se envía normalmente en 10 días laborables.` },
      { h2: `Tarjeta crypto física en el extranjero: cajeros, aceptación y consejos`, p: `Las tarjetas crypto físicas son especialmente útiles para los viajes. Visa y Mastercard se aceptan en prácticamente todos los comercios y cajeros internacionales. Consulta tu límite mensual de retirada gratuita antes de viajar — la mayoría de tarjetas de nivel básico ofrecen 200-400€ gratis, los niveles premium hasta 800€ o ilimitado. Informa a tu emisor antes de viajes prolongados para evitar bloqueos de transacciones. En países con escasa infraestructura bancaria, lleva siempre algo de efectivo local como respaldo.` },
      { h2: `¿Cuándo optar por una tarjeta crypto física en lugar de una virtual?`, p: `La tarjeta física es indispensable en tres situaciones: retiradas de efectivo en cajeros (una tarjeta puramente virtual no funciona en ellos), comercios sin pago sin contacto ni terminal NFC (escasos, pero aún presentes en zonas rurales y ciertos países), y viajes a regiones con conectividad limitada en los que no puedes depender del smartphone. La tarjeta virtual es preferible para todas las compras online, suscripciones y países donde el pago sin contacto es universal. La estrategia óptima en ${YEAR}: activa la tarjeta virtual inmediatamente tras el KYC y úsala en el día a día — solicita la física solo si tienes una necesidad concreta, ya que la entrega tarda de 1 a 2 semanas de todos modos.` },
    ],
    it: [
      { h2: `Carta crypto fisica vs virtuale: quali sono le differenze concrete?`, p: `La carta fisica si distingue per tre vantaggi chiave: accesso ai prelievi di contante (impossibile con una carta puramente virtuale), utilizzo presso tutti i commercianti che accettano Visa/Mastercard senza smartphone necessario, e maggiore sicurezza poiché il numero della tua carta virtuale rimane protetto. La consegna richiede 1–2 settimane, contro un'attivazione istantanea per la carta virtuale. I due formati sono complementari: la maggior parte degli emittenti li offre entrambi con un unico account.` },
      { h2: `Crypto.com, Revolut, Nexo, Bybit: migliori carte fisiche ${YEAR}`, p: `Crypto.com offre una carta Visa fisica disponibile in 5 livelli (Ruby, Jade, Indigo, Frosted Rose, Obsidian) con cashback dall'1% all'8% in base allo staking in CRO. Revolut propone una carta fisica gratuita (livello Standard) o premium con vantaggi bancari completi. Nexo fornisce una Mastercard fisica con cashback in BTC o NEXO senza staking obbligatorio. Bybit offre una carta Visa fisica con cashback in BIT e limiti di prelievo ATM vantaggiosi per i viaggiatori frequenti.` },
      { h2: `Consegna e sicurezza della carta crypto fisica`, p: `La consegna di una carta fisica richiede generalmente 7-15 giorni lavorativi in Europa, a seconda del paese e del corriere scelto dall'emittente. Crypto.com spedisce in tutto il mondo con tracciamento. Revolut e Nexo consegnano nell'UE in 5-10 giorni. Alla ricezione, attiva immediatamente la carta nell'app e abilita il 2FA. In caso di smarrimento o furto, bloccala istantaneamente dall'app — la maggior parte degli emittenti offre blocco immediato senza chiudere il conto. La carta sostitutiva viene spedita in genere entro 10 giorni lavorativi.` },
      { h2: `Carta crypto fisica all'estero: ATM, accettazione e consigli`, p: `Le carte crypto fisiche sono particolarmente adatte ai viaggi. Visa e Mastercard sono accettate praticamente ovunque nel mondo, sia nei negozi che agli ATM. Prima di partire, verifica il limite mensile di prelievo gratuito — la maggior parte delle carte base offre 200-400€ gratis, i livelli premium fino a 800€ o illimitato. Informa il tuo emittente prima di viaggi prolungati per evitare blocchi di sicurezza sulle transazioni. Nei paesi con infrastruttura bancaria limitata, tieni sempre del contante locale come riserva.` },
      { h2: `Quando scegliere una carta crypto fisica invece di una virtuale?`, p: `La carta fisica è indispensabile in tre situazioni: prelievi di contante agli ATM (una carta puramente virtuale non funziona agli sportelli bancomat), commercianti senza pagamento contactless o terminale NFC (rari, ma ancora presenti in zone rurali e alcuni paesi), e viaggi in aree con connettività limitata dove non puoi affidarti allo smartphone. La carta virtuale è preferibile per tutti gli acquisti online, gli abbonamenti e i paesi in cui il pagamento contactless è universale. La strategia ottimale nel ${YEAR}: attiva la carta virtuale subito dopo la validazione KYC e usala quotidianamente — richiedi la fisica solo se hai un'esigenza concreta, visto che la consegna richiede comunque 1-2 settimane.` },
    ],
    en: [
      { h2: `Physical vs virtual crypto card: what are the concrete differences?`, p: `A physical card stands out for three key advantages: access to cash withdrawals (impossible with a purely virtual card), use at all Visa/Mastercard merchants without needing a smartphone, and enhanced security since your virtual card number stays protected. The downside is delivery: 1–2 weeks depending on your country, versus instant activation for a virtual card. Both formats are complementary — most issuers offer both with a single account, letting you choose based on context.` },
      { h2: `Crypto.com, Revolut, Nexo, Bybit: best physical cards in ${YEAR}`, p: `Crypto.com offers a physical Visa card in 5 tiers (Ruby, Jade, Indigo, Frosted Rose, Obsidian) with 1% to 8% cashback depending on CRO staking. Revolut provides a free physical card (Standard tier) or premium tiers with full banking benefits. Nexo delivers a physical Mastercard with cashback in BTC or NEXO and no mandatory staking. Bybit offers a physical Visa card with BIT cashback and advantageous ATM withdrawal limits for frequent travelers.` },
      { h2: `Physical crypto card delivery and security: what to expect`, p: `Physical card delivery typically takes 7-15 business days across Europe, depending on your country and the issuer's logistics partner. Crypto.com ships globally via tracked delivery. Revolut and Nexo ship within the EU in 5-10 days. Once received, activate your card immediately in the app and enable 2FA. If your physical card is lost or stolen, freeze it instantly from the app — most issuers offer instant card freeze without cancelling your account. A replacement is usually shipped within 10 business days.` },
      { h2: `Physical crypto card abroad: ATMs, acceptance and tips`, p: `Physical crypto cards perform best in travel scenarios. Visa and Mastercard are accepted at virtually all international merchants and ATMs. Check your card's free monthly ATM withdrawal limit before travelling — most entry-tier cards offer €200-€400 free, with premium tiers offering up to €800 or unlimited. Inform your issuer before extended travel to avoid transaction blocks. For countries with poor card infrastructure, always carry some local cash as backup — even Visa coverage isn't universal in all rural areas.` },
      { h2: `When should you choose a physical crypto card over a virtual one?`, p: `A physical card is essential in three specific situations: ATM cash withdrawals (a purely virtual card simply won't work at a cash machine), merchants without NFC or contactless terminals (rare but still common in rural areas and some countries), and travel to regions with limited smartphone connectivity where you can't rely on Apple Pay or Google Pay. A virtual card is preferable for all online purchases, subscriptions, and countries where contactless payment is universal. The optimal strategy in ${YEAR}: activate your virtual card immediately after KYC — use it daily — and only request a physical card if you have a concrete need, since delivery takes 1–2 weeks regardless.` },
    ],
  },
  belgium: {
    fr: [
      { h2: `Quelles cartes crypto sont disponibles pour les résidents belges ?`, p: `Les résidents belges ont accès aux mêmes cartes crypto que les Français, grâce au passeport EEE offert par le règlement MiCA. Crypto.com Visa, Revolut, Nexo Card, Gnosis Pay, MetaMask Card, Bybit Card et Brighty sont toutes disponibles pour les utilisateurs en Belgique. La FSMA (Financial Services and Markets Authority) supervise les prestataires de services sur crypto-actifs en Belgique et exige le respect des normes MiCA pour tout opérateur actif sur le marché belge.` },
      { h2: `Fiscalité des cryptomonnaies en Belgique : ce que les utilisateurs doivent savoir`, p: `En Belgique, la fiscalité des cryptomonnaies dépend du profil de l'investisseur. Les gains réalisés dans le cadre d'une gestion normale de patrimoine privé sont en principe exonérés d'impôt. En revanche, les activités spéculatives ou professionnelles sont imposées comme revenus divers (33%) ou revenus professionnels. Chaque paiement par carte crypto déclenche techniquement une conversion crypto → euros, potentiellement imposable selon votre profil. Consultez un expert-comptable belge pour une situation personnalisée.` },
      { h2: `Carte crypto Belgique : Gnosis Pay et MetaMask Card en tête`, p: `Pour les résidents belges, Gnosis Pay se distingue par son modèle on-chain unique : chaque paiement est réglé directement depuis votre Gnosis Safe en xDAI, sans intermédiaire centralisé. MetaMask Card offre une alternative DeFi-native avec cashback en ETH. Pour les utilisateurs souhaitant un cashback plus élevé, Crypto.com Jade (3%) ou Nexo Card (en BTC) sont d'excellentes options disponibles en Belgique. Toutes ces cartes sont Visa ou Mastercard, acceptées dans toute la Belgique et à l'étranger.` },
      { h2: `Meilleur cashback crypto pour les résidents belges en ${YEAR}`, p: `En Belgique, le classement des cartes par cashback réel donne : Crypto.com Jade (3% en CRO, staking requis), Nexo Card (2% en BTC ou NEXO, sans staking), Gnosis Pay (2% en GNO, on-chain, sans staking), Bitpanda Card (2% en BEST), Brighty (1,75% en USDC, sans staking). Pour les résidents belges qui souhaitent maximiser leur retour sans immobiliser de capital, Nexo Card et Gnosis Pay offrent le meilleur rapport rendement/risque. Le cashback en BTC (Nexo) est particulièrement pertinent dans un contexte de marché haussier, tandis que le cashback en USDC (Brighty) est plus stable et prévisible pour une gestion prudente.` },
      { h2: `Comment ouvrir une carte crypto depuis la Belgique : guide pas-à-pas`, p: `Ouvrir une carte crypto depuis la Belgique est simple. (1) Choisissez votre émetteur selon votre profil : Gnosis Pay pour le DeFi, Nexo pour le cashback BTC, Brighty pour la simplicité. (2) Téléchargez l'application officielle et créez votre compte. (3) KYC : photographiez votre carte nationale belge ou votre passeport et prenez un selfie. Délai : 5 à 30 minutes. (4) Activez votre carte virtuelle immédiatement après la validation KYC. (5) Rechargez via virement SEPA depuis votre banque belge (Belfius, ING, BNP Paribas Fortis, KBC). (6) Ajoutez votre carte à Apple Pay ou Google Pay pour payer partout en Belgique et à l'étranger.` },
    ],
    de: [
      { h2: `Welche Krypto-Karten sind für belgische Einwohner verfügbar?`, p: `Belgische Einwohner haben dank des MiCA-EWR-Passes Zugang zu denselben Krypto-Karten wie deutsche Nutzer. Crypto.com Visa, Revolut, Nexo Card, Gnosis Pay, MetaMask Card, Bybit Card und Brighty sind alle in Belgien verfügbar. Die FSMA überwacht Anbieter von Krypto-Dienstleistungen in Belgien und verlangt MiCA-Konformität für alle auf dem belgischen Markt aktiven Betreiber.` },
      { h2: `Krypto-Steuer in Belgien: Was Nutzer wissen müssen`, p: `In Belgien hängt die Steuerbehandlung von Kryptowährungen vom Profil des Anlegers ab. Gewinne aus normaler Privatvermögensverwaltung sind grundsätzlich steuerfrei. Spekulative oder berufliche Tätigkeiten werden als sonstige Einkünfte (33%) oder Berufseinkünfte besteuert. Jede Kartenzahlung mit Krypto löst technisch eine Konvertierung aus, die je nach Profil steuerpflichtig sein kann. Konsultieren Sie einen belgischen Steuerberater für Ihre konkrete Situation.` },
      { h2: `Krypto-Karte Belgien: Gnosis Pay und MetaMask Card vorn`, p: `Für belgische Einwohner sticht Gnosis Pay mit seinem einzigartigen On-Chain-Modell hervor: Jede Zahlung wird direkt aus Ihrem Gnosis Safe in xDAI abgerechnet, ohne zentralisierten Intermediär. MetaMask Card bietet eine DeFi-native Alternative mit ETH-Cashback. Für höheren Cashback sind Crypto.com Jade (3%) oder Nexo Card (in BTC) ausgezeichnete Optionen für Belgien. Alle Karten sind Visa oder Mastercard, überall in Belgien und international akzeptiert.` },
      { h2: `Bestes Cashback für belgische Einwohner in ${YEAR}`, p: `In Belgien liefert das Ranking nach realem Cashback: Crypto.com Jade (3% in CRO, Staking erforderlich), Nexo Card (2% in BTC oder NEXO, kein Staking), Gnosis Pay (2% in GNO, on-chain, kein Staking), Bitpanda Card (2% in BEST), Brighty (1,75% in USDC, kein Staking). Für belgische Nutzer, die maximale Rendite ohne Kapitalblockierung wollen, bieten Nexo Card und Gnosis Pay das beste Rendite/Risiko-Verhältnis. BTC-Cashback (Nexo) ist besonders attraktiv in einem Bullenmarkt, während USDC-Cashback (Brighty) stabiler und berechenbarer für konservatives Vermögensmanagement ist.` },
      { h2: `Krypto-Karte in Belgien eröffnen: Schritt-für-Schritt-Anleitung`, p: `Eine Krypto-Karte in Belgien zu eröffnen ist einfach. (1) Emittenten nach Profil wählen: Gnosis Pay für DeFi, Nexo für BTC-Cashback, Brighty für Einfachheit. (2) Offizielle App herunterladen und Konto erstellen. (3) KYC: Belgischen Personalausweis oder Pass fotografieren, Selfie aufnehmen. Bearbeitungszeit: 5 bis 30 Minuten. (4) Virtuelle Karte sofort nach KYC-Validierung aktivieren. (5) Per SEPA-Überweisung vom belgischen Bankkonto aufladen (Belfius, ING, BNP Paribas Fortis, KBC). (6) Karte zu Apple Pay oder Google Pay hinzufügen für Zahlungen in Belgien und im Ausland.` },
    ],
    es: [
      { h2: `¿Qué tarjetas crypto están disponibles para residentes en Bélgica?`, p: `Los residentes en Bélgica tienen acceso a las mismas tarjetas crypto que los usuarios franceses, gracias al pasaporte EEE de MiCA. Crypto.com Visa, Revolut, Nexo Card, Gnosis Pay, MetaMask Card, Bybit Card y Brighty están disponibles en Bélgica. La FSMA supervisa a los proveedores de servicios de criptoactivos en Bélgica y exige el cumplimiento de MiCA para todos los operadores activos en el mercado belga.` },
      { h2: `Fiscalidad de las criptomonedas en Bélgica: lo que los usuarios deben saber`, p: `En Bélgica, el tratamiento fiscal de las criptomonedas depende del perfil del inversor. Las ganancias obtenidas en el marco de una gestión normal del patrimonio privado están en principio exentas de impuestos. Las actividades especulativas o profesionales se gravan como ingresos diversos (33%) o ingresos profesionales. Cada pago con tarjeta crypto desencadena técnicamente una conversión que puede ser imponible según tu perfil. Consulta a un asesor fiscal belga para tu situación concreta.` },
      { h2: `Tarjeta crypto Bélgica: Gnosis Pay y MetaMask Card a la cabeza`, p: `Para los residentes en Bélgica, Gnosis Pay destaca por su modelo on-chain único: cada pago se liquida directamente desde tu Gnosis Safe en xDAI, sin intermediario centralizado. MetaMask Card ofrece una alternativa DeFi-nativa con cashback en ETH. Para mayor cashback, Crypto.com Jade (3%) o Nexo Card (en BTC) son excelentes opciones disponibles en Bélgica. Todas son Visa o Mastercard, aceptadas en toda Bélgica y en el extranjero.` },
      { h2: `Mejor cashback crypto para residentes en Bélgica en ${YEAR}`, p: `En Bélgica, el ranking de tarjetas por cashback real es: Crypto.com Jade (3% en CRO, staking requerido), Nexo Card (2% en BTC o NEXO, sin staking), Gnosis Pay (2% en GNO, on-chain, sin staking), Bitpanda Card (2% en BEST), Brighty (1,75% en USDC, sin staking). Para residentes belgas que quieran maximizar el retorno sin inmovilizar capital, Nexo Card y Gnosis Pay ofrecen la mejor relación rentabilidad/riesgo. El cashback en BTC (Nexo) es especialmente relevante en un mercado alcista, mientras que el cashback en USDC (Brighty) es más estable y predecible para una gestión conservadora.` },
      { h2: `Cómo abrir una tarjeta crypto desde Bélgica: guía paso a paso`, p: `Abrir una tarjeta crypto desde Bélgica es sencillo. (1) Elige tu emisor según tu perfil: Gnosis Pay para DeFi, Nexo para cashback BTC, Brighty para simplicidad. (2) Descarga la app oficial y crea tu cuenta. (3) KYC: fotografía tu DNI belga o pasaporte y hazte un selfie de verificación. Plazo: 5 a 30 minutos. (4) Activa la tarjeta virtual inmediatamente tras la validación KYC. (5) Recarga mediante transferencia SEPA desde tu banco belga (Belfius, ING, BNP Paribas Fortis, KBC). (6) Añade tu tarjeta a Apple Pay o Google Pay para pagar en Bélgica y en el extranjero.` },
    ],
    it: [
      { h2: `Quali carte crypto sono disponibili per i residenti in Belgio?`, p: `I residenti in Belgio hanno accesso alle stesse carte crypto degli utenti francesi, grazie al passaporto SEE di MiCA. Crypto.com Visa, Revolut, Nexo Card, Gnosis Pay, MetaMask Card, Bybit Card e Brighty sono tutte disponibili in Belgio. La FSMA supervisiona i fornitori di servizi su cripto-asset in Belgio e richiede la conformità MiCA per tutti gli operatori attivi sul mercato belga.` },
      { h2: `Fiscalità delle criptovalute in Belgio: cosa devono sapere gli utenti`, p: `In Belgio, il trattamento fiscale delle criptovalute dipende dal profilo dell'investitore. I guadagni realizzati nell'ambito di una normale gestione del patrimonio privato sono in linea di principio esenti da imposta. Le attività speculative o professionali sono tassate come redditi diversi (33%) o redditi professionali. Ogni pagamento con carta crypto genera tecnicamente una conversione potenzialmente imponibile. Consulta un commercialista belga per la tua situazione specifica.` },
      { h2: `Carta crypto Belgio: Gnosis Pay e MetaMask Card in testa`, p: `Per i residenti in Belgio, Gnosis Pay si distingue con il suo modello on-chain unico: ogni pagamento viene regolato direttamente dal tuo Gnosis Safe in xDAI, senza intermediario centralizzato. MetaMask Card offre un'alternativa DeFi-nativa con cashback in ETH. Per un cashback più elevato, Crypto.com Jade (3%) o Nexo Card (in BTC) sono ottime opzioni disponibili in Belgio. Tutte le carte sono Visa o Mastercard, accettate in tutto il Belgio e all'estero.` },
      { h2: `Miglior cashback crypto per i residenti in Belgio nel ${YEAR}`, p: `In Belgio, il ranking delle carte per cashback reale è: Crypto.com Jade (3% in CRO, staking richiesto), Nexo Card (2% in BTC o NEXO, senza staking), Gnosis Pay (2% in GNO, on-chain, senza staking), Bitpanda Card (2% in BEST), Brighty (1,75% in USDC, senza staking). Per i residenti belgi che vogliono massimizzare il rendimento senza immobilizzare capitale, Nexo Card e Gnosis Pay offrono il miglior rapporto rendimento/rischio. Il cashback in BTC (Nexo) è particolarmente rilevante in un mercato rialzista, mentre il cashback in USDC (Brighty) è più stabile e prevedibile per una gestione conservativa.` },
      { h2: `Come aprire una carta crypto dal Belgio: guida passo dopo passo`, p: `Aprire una carta crypto dal Belgio è semplice. (1) Scegli il tuo emittente in base al tuo profilo: Gnosis Pay per la DeFi, Nexo per il cashback BTC, Brighty per la semplicità. (2) Scarica l'app ufficiale e crea il tuo account. (3) KYC: fotografa la tua carta d'identità belga o il passaporto e scatta un selfie di verifica. Tempi: 5-30 minuti. (4) Attiva la carta virtuale immediatamente dopo la validazione KYC. (5) Ricarica tramite bonifico SEPA dal tuo conto bancario belga (Belfius, ING, BNP Paribas Fortis, KBC). (6) Aggiungi la carta a Apple Pay o Google Pay per pagamenti in Belgio e all'estero.` },
    ],
    en: [
      { h2: `Which crypto cards are available for Belgian residents?`, p: `Belgian residents have access to the same crypto cards as French users, thanks to the EEA passport provided by MiCA. Crypto.com Visa, Revolut, Nexo Card, Gnosis Pay, MetaMask Card, Bybit Card, and Brighty are all available in Belgium. The FSMA (Financial Services and Markets Authority) supervises crypto-asset service providers in Belgium and requires MiCA compliance for all operators active on the Belgian market.` },
      { h2: `Cryptocurrency taxation in Belgium: what users need to know`, p: `In Belgium, the tax treatment of cryptocurrencies depends on the investor's profile. Gains made in the context of normal private wealth management are in principle tax-exempt. Speculative or professional activities are taxed as miscellaneous income (33%) or professional income. Each crypto card payment technically triggers a conversion that may be taxable depending on your profile. Consult a Belgian tax advisor for your specific situation.` },
      { h2: `Crypto card Belgium: Gnosis Pay and MetaMask Card lead the way`, p: `For Belgian residents, Gnosis Pay stands out with its unique on-chain model: each payment is settled directly from your Gnosis Safe in xDAI, without a centralized intermediary. MetaMask Card offers a DeFi-native alternative with ETH cashback. For higher cashback, Crypto.com Jade (3%) or Nexo Card (in BTC) are excellent options available in Belgium. All cards are Visa or Mastercard, accepted throughout Belgium and internationally.` },
      { h2: `Best crypto cashback for Belgian residents in ${YEAR}`, p: `In Belgium, the ranking of cards by real cashback is: Crypto.com Jade (3% in CRO, staking required), Nexo Card (2% in BTC or NEXO, no staking), Gnosis Pay (2% in GNO, on-chain, no staking), Bitpanda Card (2% in BEST), Brighty (1.75% in USDC, no staking). For Belgian residents who want to maximise returns without locking up capital, Nexo Card and Gnosis Pay offer the best risk/return profile. BTC cashback (Nexo) is particularly appealing in a bull market, while USDC cashback (Brighty) is more stable and predictable for conservative wealth management.` },
      { h2: `How to open a crypto card in Belgium: step-by-step guide`, p: `Opening a crypto card in Belgium is straightforward. (1) Choose your issuer based on your profile: Gnosis Pay for DeFi, Nexo for BTC cashback, Brighty for simplicity. (2) Download the official app and create your account. (3) KYC: photograph your Belgian national ID card or passport and take a verification selfie. Processing time: 5 to 30 minutes. (4) Activate your virtual card immediately after KYC approval. (5) Top up via SEPA transfer from your Belgian bank account (Belfius, ING, BNP Paribas Fortis, KBC). (6) Add your card to Apple Pay or Google Pay for instant payments throughout Belgium and abroad.` },
    ],
  },
  austria: {
    fr: [
      { h2: `Quelles cartes crypto sont disponibles pour les résidents autrichiens ?`, p: `Les résidents autrichiens bénéficient d'un accès complet aux cartes crypto régulées MiCA du marché européen. Bitpanda Card (plateforme viennoise, FMA + BaFin + AMF), Crypto.com Visa, Nexo Card, Gnosis Pay, MetaMask Card et Revolut sont toutes disponibles en Autriche. Bitpanda est l'acteur le plus réglementé d'Autriche et représente le choix naturel pour les résidents souhaitant une solution locale. La FMA (Finanzmarktaufsicht) supervise l'ensemble du secteur crypto autrichien.` },
      { h2: `Fiscalité des cryptomonnaies en Autriche : taux forfaitaire de 27,5%`, p: `L'Autriche applique depuis 2022 un régime fiscal simplifié pour les cryptomonnaies : un taux forfaitaire de 27,5% (Kapitalertragsteuer — KESt) s'applique à l'ensemble des revenus crypto, qu'il s'agisse de plus-values à la revente ou de revenus passifs (staking, cashback). C'est l'un des régimes les plus clairs d'Europe. Chaque utilisation d'une carte crypto déclenche potentiellement un événement fiscal. La stratégie la plus simple : utiliser des stablecoins pour recharger votre carte.` },
      { h2: `Bitpanda Card : la carte crypto native autrichienne`, p: `Bitpanda, fondée à Vienne en 2014, est la plateforme crypto la plus réglementée d'Europe avec des licences FMA (Autriche), BaFin (Allemagne) et AMF (France). La Bitpanda Card permet de dépenser vos actifs Bitpanda directement — Bitcoin, Ethereum, stablecoins — avec conversion automatique au moment du paiement. C'est le choix naturel pour les utilisateurs autrichiens déjà clients de Bitpanda, en complément des offres internationales comme Crypto.com ou Nexo.` },
      { h2: `Meilleur cashback crypto pour les résidents autrichiens en ${YEAR}`, p: `En Autriche, le classement des cartes par cashback réel donne : Crypto.com Jade (3% en CRO, staking requis), Nexo Card (2% en BTC ou NEXO, sans staking), Bitpanda Card (2% en BEST — avantage unique pour les clients Bitpanda déjà actifs), Gnosis Pay (2% en GNO, on-chain), Brighty (1,75% en USDC, sans staking). La Bitpanda Card mérite une mention spéciale pour les résidents autrichiens : si vous êtes déjà client Bitpanda, c'est la carte la plus intégrée à votre écosystème existant. Pour les autres, Nexo Card offre le meilleur cashback sans staking, et Brighty reste la plus simple d'accès.` },
      { h2: `Comment ouvrir une carte crypto depuis l'Autriche : guide pratique`, p: `Ouvrir une carte crypto en Autriche suit le même processus que dans les autres pays MiCA. (1) Pour les utilisateurs Bitpanda : téléchargez l'app Bitpanda, vérifiez votre identité si besoin, et demandez la Bitpanda Card depuis votre tableau de bord. (2) Pour les autres cartes : téléchargez l'app de l'émetteur choisi (Nexo, Gnosis Pay, Crypto.com) et créez votre compte. (3) KYC : document autrichien (Personalausweis ou Reisepass) + selfie. Délai : 5 à 60 minutes. (4) Rechargez via SEPA depuis votre banque autrichienne (Erste Bank, Bank Austria, Raiffeisen, Sparkasse). (5) Rappel fiscal : chaque paiement par carte crypto depuis un actif volatile peut déclencher une cession imposable à 27,5% (KESt). Utilisez des stablecoins pour recharger et éviter tout événement fiscal.` },
    ],
    de: [
      { h2: `Welche Krypto-Karten sind für österreichische Einwohner verfügbar?`, p: `Österreichische Einwohner haben vollen Zugang zu MiCA-regulierten Krypto-Karten des europäischen Markts. Bitpanda Card (Wiener Plattform, FMA + BaFin + AMF), Crypto.com Visa, Nexo Card, Gnosis Pay, MetaMask Card und Revolut sind alle in Österreich verfügbar. Bitpanda ist der am stärksten regulierte Akteur Österreichs und die natürliche Wahl für einheimische Nutzer. Die FMA (Finanzmarktaufsicht) überwacht den gesamten österreichischen Krypto-Sektor.` },
      { h2: `Krypto-Steuer in Österreich: Pauschalsteuersatz 27,5%`, p: `Österreich wendet seit 2022 ein vereinfachtes Steuersystem für Kryptowährungen an: Ein Pauschalsteuersatz von 27,5% (Kapitalertragsteuer — KESt) gilt für alle Krypto-Einkünfte, ob Veräußerungsgewinne oder passive Erträge (Staking, Cashback). Dies ist eine der klarsten Regelungen in Europa. Jede Krypto-Kartenzahlung löst potenziell ein steuerpflichtiges Ereignis aus. Einfachste Strategie: Stablecoins zum Aufladen der Karte verwenden.` },
      { h2: `Bitpanda Card: die native österreichische Krypto-Karte`, p: `Bitpanda, 2014 in Wien gegründet, ist die am stärksten regulierte Krypto-Plattform Europas mit Lizenzen der FMA (Österreich), BaFin (Deutschland) und AMF (Frankreich). Die Bitpanda Card ermöglicht es, Bitpanda-Assets direkt auszugeben — Bitcoin, Ethereum, Stablecoins — mit automatischer Konvertierung zum Zahlungszeitpunkt. Für österreichische Bitpanda-Nutzer ist sie die natürliche Wahl, ergänzend zu internationalen Angeboten wie Crypto.com oder Nexo.` },
      { h2: `Bestes Cashback für österreichische Einwohner in ${YEAR}`, p: `In Österreich liefert das Ranking nach realem Cashback: Crypto.com Jade (3% in CRO, Staking erforderlich), Nexo Card (2% in BTC oder NEXO, kein Staking), Bitpanda Card (2% in BEST — einzigartiger Vorteil für bestehende Bitpanda-Nutzer), Gnosis Pay (2% in GNO, on-chain), Brighty (1,75% in USDC, kein Staking). Die Bitpanda Card verdient besondere Erwähnung für österreichische Nutzer: Wenn Sie bereits Bitpanda-Kunde sind, ist sie die bestintegrierte Karte. Für andere bietet Nexo Card das beste Cashback ohne Staking, und Brighty bleibt die einfachste Option.` },
      { h2: `Krypto-Karte in Österreich eröffnen: Praxisleitfaden`, p: `Eine Krypto-Karte in Österreich zu eröffnen folgt demselben Prozess wie in anderen MiCA-Ländern. (1) Für Bitpanda-Nutzer: App herunterladen, Identität verifizieren, Bitpanda Card direkt im Dashboard beantragen. (2) Für andere Karten: App des gewählten Emittenten (Nexo, Gnosis Pay, Crypto.com) und Konto erstellen. (3) KYC: Österreichisches Dokument (Personalausweis oder Reisepass) + Selfie. Bearbeitungszeit: 5 bis 60 Minuten. (4) Per SEPA vom österreichischen Bankkonto aufladen (Erste Bank, Bank Austria, Raiffeisen, Sparkasse). (5) Steuerhinweis: Aufladung mit volatiler Krypto kann ein steuerpflichtiges Ereignis (27,5% KeSt) auslösen. Stablecoins zum Aufladen verwenden, um Steuerereignisse zu vermeiden.` },
    ],
    es: [
      { h2: `¿Qué tarjetas crypto están disponibles para residentes en Austria?`, p: `Los residentes en Austria tienen acceso completo a las tarjetas crypto reguladas por MiCA del mercado europeo. Bitpanda Card (plataforma de Viena, FMA + BaFin + AMF), Crypto.com Visa, Nexo Card, Gnosis Pay, MetaMask Card y Revolut están disponibles en Austria. Bitpanda es el actor más regulado de Austria y la elección natural para los usuarios locales. La FMA (Finanzmarktaufsicht) supervisa todo el sector crypto austriaco.` },
      { h2: `Fiscalidad de las criptomonedas en Austria: tipo impositivo fijo del 27,5%`, p: `Austria aplica desde 2022 un régimen fiscal simplificado para las criptomonedas: un tipo impositivo fijo del 27,5% (Kapitalertragsteuer — KESt) se aplica a todos los rendimientos crypto, ya sean plusvalías o ingresos pasivos (staking, cashback). Es uno de los regímenes más claros de Europa. Cada pago con tarjeta crypto desencadena potencialmente un evento fiscal. La estrategia más sencilla: usar stablecoins para recargar tu tarjeta.` },
      { h2: `Bitpanda Card: la tarjeta crypto nativa austriaca`, p: `Bitpanda, fundada en Viena en 2014, es la plataforma crypto más regulada de Europa con licencias de la FMA (Austria), BaFin (Alemania) y AMF (Francia). La Bitpanda Card permite gastar activos de Bitpanda directamente — Bitcoin, Ethereum, stablecoins — con conversión automática en el momento del pago. Para los usuarios austriacos ya clientes de Bitpanda, es la elección natural, complementaria a ofertas internacionales como Crypto.com o Nexo.` },
      { h2: `Mejor cashback crypto para residentes en Austria en ${YEAR}`, p: `En Austria, el ranking de tarjetas por cashback real es: Crypto.com Jade (3% en CRO, staking requerido), Nexo Card (2% en BTC o NEXO, sin staking), Bitpanda Card (2% en BEST — ventaja única para clientes existentes de la plataforma vienesa), Gnosis Pay (2% en GNO, on-chain), Brighty (1,75% en USDC, sin staking). La Bitpanda Card merece mención especial para los residentes austriacos: si ya eres cliente de Bitpanda, es la tarjeta más integrada a tu ecosistema. Para los demás, Nexo Card ofrece el mejor cashback sin staking, y Brighty sigue siendo la más accesible.` },
      { h2: `Cómo abrir una tarjeta crypto desde Austria: guía práctica`, p: `Abrir una tarjeta crypto en Austria sigue el mismo proceso que en otros países MiCA. (1) Para usuarios de Bitpanda: descarga la app, verifica tu identidad si es necesario, y solicita la Bitpanda Card desde tu panel. (2) Para otras tarjetas: descarga la app del emisor elegido (Nexo, Gnosis Pay, Crypto.com) y crea tu cuenta. (3) KYC: documento austriaco (Personalausweis o Reisepass) + selfie. Plazo: 5 a 60 minutos. (4) Recarga mediante SEPA desde tu banco austriaco (Erste Bank, Bank Austria, Raiffeisen, Sparkasse). (5) Recordatorio fiscal: cada pago con cripto volátil puede constituir una enajenación sujeta al 27,5% (KeSt). Usa stablecoins para recargar y evitar eventos fiscales.` },
    ],
    it: [
      { h2: `Quali carte crypto sono disponibili per i residenti in Austria?`, p: `I residenti in Austria hanno pieno accesso alle carte crypto regolamentate MiCA del mercato europeo. Bitpanda Card (piattaforma viennese, FMA + BaFin + AMF), Crypto.com Visa, Nexo Card, Gnosis Pay, MetaMask Card e Revolut sono tutte disponibili in Austria. Bitpanda è l'attore più regolamentato dell'Austria e la scelta naturale per gli utenti locali. La FMA (Finanzmarktaufsicht) supervisiona l'intero settore crypto austriaco.` },
      { h2: `Fiscalità delle criptovalute in Austria: aliquota fissa del 27,5%`, p: `L'Austria applica dal 2022 un regime fiscale semplificato per le criptovalute: un'aliquota fissa del 27,5% (Kapitalertragsteuer — KESt) si applica a tutti i redditi crypto, che siano plusvalenze o redditi passivi (staking, cashback). È uno dei regimi più chiari d'Europa. Ogni pagamento con carta crypto genera potenzialmente un evento fiscale. La strategia più semplice: usare stablecoin per ricaricare la carta.` },
      { h2: `Bitpanda Card: la carta crypto nativa austriaca`, p: `Bitpanda, fondata a Vienna nel 2014, è la piattaforma crypto più regolamentata d'Europa con licenze FMA (Austria), BaFin (Germania) e AMF (Francia). La Bitpanda Card consente di spendere gli asset Bitpanda direttamente — Bitcoin, Ethereum, stablecoin — con conversione automatica al momento del pagamento. Per gli utenti austriaci già clienti di Bitpanda, è la scelta naturale, complementare a offerte internazionali come Crypto.com o Nexo.` },
      { h2: `Miglior cashback crypto per i residenti in Austria nel ${YEAR}`, p: `In Austria, il ranking delle carte per cashback reale è: Crypto.com Jade (3% in CRO, staking richiesto), Nexo Card (2% in BTC o NEXO, senza staking), Bitpanda Card (2% in BEST — vantaggio unico per i clienti esistenti della piattaforma viennese), Gnosis Pay (2% in GNO, on-chain), Brighty (1,75% in USDC, senza staking). La Bitpanda Card merita una menzione speciale per i residenti austriaci: se sei già cliente di Bitpanda, è la carta più integrata al tuo ecosistema. Per gli altri, Nexo Card offre il miglior cashback senza staking, e Brighty rimane la più accessibile.` },
      { h2: `Come aprire una carta crypto dall'Austria: guida pratica`, p: `Aprire una carta crypto in Austria segue lo stesso processo degli altri paesi MiCA. (1) Per gli utenti Bitpanda: scarica l'app, verifica la tua identità se necessario, e richiedi la Bitpanda Card direttamente dal pannello. (2) Per altre carte: scarica l'app dell'emittente scelto (Nexo, Gnosis Pay, Crypto.com) e crea il tuo account. (3) KYC: documento austriaco (Personalausweis o Reisepass) + selfie. Tempi: 5-60 minuti. (4) Ricarica tramite SEPA dal tuo conto bancario austriaco (Erste Bank, Bank Austria, Raiffeisen, Sparkasse). (5) Promemoria fiscale: ogni pagamento con cripto volatile può costituire una cessione imponibile al 27,5% (KeSt). Usa stablecoin per ricaricare ed evitare eventi fiscali.` },
    ],
    en: [
      { h2: `Which crypto cards are available for Austrian residents?`, p: `Austrian residents have full access to MiCA-regulated crypto cards from the European market. Bitpanda Card (Viennese platform, FMA + BaFin + AMF), Crypto.com Visa, Nexo Card, Gnosis Pay, MetaMask Card, and Revolut are all available in Austria. Bitpanda is Austria's most regulated operator and the natural choice for local users. The FMA (Finanzmarktaufsicht) oversees the entire Austrian crypto sector.` },
      { h2: `Cryptocurrency taxation in Austria: flat 27.5% tax rate`, p: `Austria has applied a simplified tax regime for cryptocurrencies since 2022: a flat 27.5% rate (Kapitalertragsteuer — KESt) applies to all crypto income, whether capital gains or passive income (staking, cashback). This is one of the clearest frameworks in Europe. Each crypto card payment potentially triggers a taxable event. The simplest strategy: use stablecoins to top up your card, as stable-value conversions generate no taxable capital gain.` },
      { h2: `Bitpanda Card: Austria's native crypto card`, p: `Bitpanda, founded in Vienna in 2014, is Europe's most regulated crypto platform, holding FMA (Austria), BaFin (Germany), and AMF (France) licenses. The Bitpanda Card lets you spend Bitpanda assets directly — Bitcoin, Ethereum, stablecoins — with automatic conversion at the point of payment. For Austrian users already on Bitpanda, it's the natural first choice, complementing international options like Crypto.com or Nexo for those seeking higher cashback tiers.` },
      { h2: `Best crypto cashback for Austrian residents in ${YEAR}`, p: `In Austria, the ranking of cards by real cashback is: Crypto.com Jade (3% in CRO, staking required), Nexo Card (2% in BTC or NEXO, no staking), Bitpanda Card (2% in BEST — a unique advantage for existing users of the Vienna-based platform), Gnosis Pay (2% in GNO, on-chain), Brighty (1.75% in USDC, no staking). The Bitpanda Card deserves special mention for Austrian residents: if you're already a Bitpanda customer, it's the most integrated card for your existing ecosystem. For others, Nexo Card provides the best cashback with no staking, and Brighty remains the most accessible option.` },
      { h2: `How to open a crypto card in Austria: practical guide`, p: `Opening a crypto card in Austria follows the same process as other MiCA countries. (1) For Bitpanda users: download the Bitpanda app, complete identity verification if needed, and request the Bitpanda Card directly from your dashboard. (2) For other cards: download your chosen issuer's app (Nexo, Gnosis Pay, Crypto.com) and create your account. (3) KYC: Austrian ID document (Personalausweis or Reisepass) + verification selfie. Processing time: 5 to 60 minutes. (4) Top up via SEPA transfer from your Austrian bank account (Erste Bank, Bank Austria, Raiffeisen, Sparkasse). (5) Tax reminder: each top-up using volatile crypto may constitute a taxable disposal at 27.5% (KeSt). Use stablecoins to top up your card to avoid triggering taxable events.` },
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
  physical: {
    fr: [
      { q:'Comment recevoir une carte crypto physique ?', a:"Après inscription et validation KYC, commandez votre carte depuis l'application. La livraison prend 5 à 15 jours ouvrés selon votre pays et le niveau de carte choisi. La carte Crypto.com est gratuite à partir du niveau Ruby Steel." },
      { q:'La carte crypto physique fonctionne-t-elle à l\'étranger ?', a:"Oui, les cartes Visa et Mastercard sont acceptées dans plus de 200 pays. La plupart des cartes crypto n'appliquent pas de frais de change sur les dépenses en devise étrangère." },
      { q:'Peut-on retirer des espèces avec une carte crypto physique ?', a:"Oui, c'est l'avantage principal par rapport à une carte virtuelle. Les plafonds de retrait DAB varient de 200€/mois (entrée de gamme) à illimités (niveau premium)." },
      { q:'La carte physique est-elle plus sécurisée qu\'une carte virtuelle ?', a:"Les deux ont des atouts différents : la carte virtuelle ne peut pas être skimmée et génère des numéros uniques. La physique est sécurisée par le code PIN et peut être bloquée instantanément depuis l'app." },
      { q:'Combien de temps prend la livraison d\'une carte crypto physique ?', a:"En France, comptez 5 à 10 jours ouvrés. Crypto.com, Nexo et Bybit offrent la livraison gratuite. Certains émetteurs facturent des frais de remplacement (5–10€) en cas de perte ou de vol." },
    ],
    de: [
      { q:'Wie erhält man eine physische Krypto-Karte?', a:'Nach Registrierung und KYC-Verifizierung bestellen Sie Ihre physische Karte über die App. Die Lieferung dauert 5 bis 15 Werktage je nach Land und gewählter Kartenstufe.' },
      { q:'Funktioniert die physische Krypto-Karte im Ausland?', a:'Ja, Visa- und Mastercard-Karten werden in über 200 Ländern akzeptiert. Die meisten Krypto-Karten berechnen keine Wechselgebühren bei Fremdwährungsausgaben.' },
      { q:'Kann man mit einer physischen Krypto-Karte Bargeld abheben?', a:'Ja, das ist der Hauptvorteil gegenüber einer virtuellen Karte. Die ATM-Abhebungslimits reichen von 200€/Monat (Einstieg) bis unbegrenzt (Premium).' },
      { q:'Ist die physische Karte sicherer als eine virtuelle?', a:'Beide haben unterschiedliche Vorteile: Die virtuelle Karte kann nicht geskimmt werden. Die physische wird durch PIN gesichert und kann sofort über die App gesperrt werden.' },
      { q:'Wie lange dauert die Lieferung einer physischen Krypto-Karte?', a:'In Deutschland rechnen Sie mit 5 bis 10 Werktagen. Crypto.com, Nexo und Bybit bieten kostenlose Lieferung. Einige Emittenten berechnen Ersatzgebühren (5–10€) bei Verlust oder Diebstahl.' },
    ],
    es: [
      { q:'¿Cómo recibir una tarjeta crypto física?', a:'Tras el registro y la validación KYC, pide tu tarjeta desde la aplicación. La entrega tarda 5 a 15 días hábiles según tu país y el nivel de tarjeta elegido.' },
      { q:'¿La tarjeta crypto física funciona en el extranjero?', a:'Sí, las tarjetas Visa y Mastercard están aceptadas en más de 200 países. La mayoría no aplican comisiones de cambio sobre gastos en divisa extranjera.' },
      { q:'¿Se puede retirar efectivo con una tarjeta crypto física?', a:"Sí, es la principal ventaja frente a una tarjeta virtual. Los límites de retirada en cajero varían de 200€/mes (entrada) a ilimitados (nivel premium)." },
      { q:'¿Es la tarjeta física más segura que una virtual?', a:'Ambas tienen ventajas distintas: la virtual no puede ser skimmeada. La física está protegida por PIN y puede bloquearse instantáneamente desde la app.' },
      { q:'¿Cuánto tarda la entrega de una tarjeta crypto física?', a:'En España, cuenta con 5 a 10 días hábiles. Crypto.com, Nexo y Bybit ofrecen entrega gratuita. Algunos emisores cobran tasas de reposición (5–10€) por pérdida o robo.' },
    ],
    it: [
      { q:'Come ricevere una carta crypto fisica?', a:"Dopo la registrazione e la validazione KYC, ordina la tua carta dall'applicazione. La consegna richiede da 5 a 15 giorni lavorativi in base al paese e al livello di carta scelto." },
      { q:'La carta crypto fisica funziona all\'estero?', a:'Sì, le carte Visa e Mastercard sono accettate in oltre 200 paesi. La maggior parte non applica commissioni di cambio sulle spese in valuta estera.' },
      { q:'Si può prelevare contante con una carta crypto fisica?', a:"Sì, è il principale vantaggio rispetto a una carta virtuale. I limiti di prelievo ATM variano da 200€/mese (base) a illimitati (livello premium)." },
      { q:'La carta fisica è più sicura di una virtuale?', a:"Entrambe hanno vantaggi diversi: la carta virtuale non può essere clonata fisicamente. La fisica è protetta da PIN e può essere bloccata istantaneamente dall'app." },
      { q:'Quanto tempo richiede la consegna di una carta crypto fisica?', a:'In Italia, conta 5–10 giorni lavorativi. Crypto.com, Nexo e Bybit offrono consegna gratuita. Alcuni emittenti addebitano spese di sostituzione (5–10€) in caso di smarrimento o furto.' },
    ],
    en: [
      { q:'How do you receive a physical crypto card?', a:'After registration and KYC validation, order your physical card from the app. Delivery takes 5 to 15 business days depending on your country and chosen card tier.' },
      { q:'Does a physical crypto card work abroad?', a:'Yes, Visa and Mastercard are accepted in over 200 countries. Most crypto cards charge no foreign exchange fees on spending in foreign currencies.' },
      { q:'Can you withdraw cash with a physical crypto card?', a:"Yes — that's the main advantage over a virtual card. ATM withdrawal limits range from €200/month (entry tier) to unlimited (premium tiers)." },
      { q:'Is a physical card more secure than a virtual one?', a:'Both have different security advantages: virtual cards cannot be physically skimmed. Physical cards are secured by PIN and can be instantly blocked from the app.' },
      { q:'How long does delivery of a physical crypto card take?', a:'In most of Europe, expect 5 to 10 business days. Crypto.com, Nexo and Bybit offer free delivery. Some issuers charge replacement fees (€5–10) for lost or stolen cards.' },
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
  physical:     (c) => c.virtual_only !== true,
  beginner:     (c) => (c.annual_fees || 0) === 0 && (c.staking_required || 0) === 0,
  'no-kyc':     (c) => Array.isArray(c.extras) && c.extras.some((e: string) => ['self_custody','hybrid_custody','web3_native','defi_native','exodus_wallet'].includes(e)),
  '2026':       () => true,
  travel:       () => true,
  rewards:      (c) => (c.cashback_premium || c.cashback_base || 0) > 0,
  belgium:      () => true,
  austria:      () => true,
};
const THEME_SORT: Record<string, (a: any, b: any) => number> = {
  best:         (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  cashback:     (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  'no-fees':    (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  'no-staking': (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  france:       (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  virtual:      (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  physical:     (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  beginner:     (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  'no-kyc':     (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  '2026':       (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  travel:       (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  rewards:      (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  belgium:      (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  austria:      (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
};
/** Override: theme with a specific market key (not = lang). Used for country pages. */
const THEME_MARKET: Record<string, string> = {
  belgium: 'be',
  austria: 'at',
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
  physical:     { fr: 'carte-crypto-physique', de: 'physische-krypto-karte', es: 'tarjeta-crypto-fisica', it: 'carta-crypto-fisica', en: 'physical-crypto-card' },
  belgium:      { fr: 'carte-crypto-belgique', de: 'krypto-karte-belgien', es: 'tarjeta-crypto-belgica', it: 'carta-crypto-belgio', en: 'crypto-card-belgium' },
  austria:      { fr: 'carte-crypto-autriche', de: 'krypto-karte-oesterreich', es: 'tarjeta-crypto-austria', it: 'carta-crypto-austria', en: 'crypto-card-austria' },
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
  virtual:      ['physical', 'no-fees', 'best', 'cashback'],
  physical:     ['virtual', 'travel', 'cashback', 'rewards'],
  beginner:     ['no-fees', 'no-staking', 'best', 'no-kyc'],
  'no-kyc':     ['no-staking', 'beginner', 'no-fees', 'virtual'],
  '2026':       ['best', 'cashback', 'rewards', 'travel'],
  travel:       ['cashback', 'rewards', 'no-fees', '2026'],
  rewards:      ['cashback', 'travel', '2026', 'best'],
  belgium:      ['best', 'cashback', 'no-fees', 'france'],
  austria:      ['best', 'cashback', 'no-fees', 'france'],
};
const THEME_EMOJI: Record<string, string> = {
  best: '⭐', cashback: '💰', 'no-fees': '🆓', 'no-staking': '🔓',
  france: '🇪🇺', virtual: '📱', physical: '💳', beginner: '🎯', 'no-kyc': '🔐',
  '2026': '🚀', travel: '✈️', rewards: '🎁', belgium: '🇧🇪', austria: '🇦🇹',
};
const THEME_LABEL: Record<string, Record<string, string>> = {
  best:         { fr:'Meilleure carte', de:'Beste Karte', es:'Mejor tarjeta', it:'Migliore carta', en:'Best card' },
  cashback:     { fr:'Cashback', de:'Cashback', es:'Cashback', it:'Cashback', en:'Cashback' },
  'no-fees':    { fr:'Sans frais', de:'Ohne Gebühren', es:'Sin comisiones', it:'Senza costi', en:'No fees' },
  'no-staking': { fr:'Sans staking', de:'Ohne Staking', es:'Sin staking', it:'Senza staking', en:'No staking' },
  france:       { fr:'Disponible en France', de:'In Deutschland', es:'En España', it:'In Italia', en:'Available in EU' },
  virtual:      { fr:'Carte virtuelle', de:'Virtuelle Karte', es:'Tarjeta virtual', it:'Carta virtuale', en:'Virtual card' },
  physical:     { fr:'Carte physique', de:'Physische Karte', es:'Tarjeta física', it:'Carta fisica', en:'Physical card' },
  beginner:     { fr:'Pour débutants', de:'Für Einsteiger', es:'Para principiantes', it:'Per principianti', en:'For beginners' },
  'no-kyc':     { fr:'Sans KYC', de:'Ohne KYC', es:'Sin KYC', it:'Senza KYC', en:'No KYC' },
  '2026':       { fr:'Meilleures 2026', de:'Beste 2026', es:'Mejores 2026', it:'Migliori 2026', en:'Best 2026' },
  travel:       { fr:'Voyage', de:'Reisen', es:'Viaje', it:'Viaggio', en:'Travel' },
  rewards:      { fr:'Récompenses', de:'Prämien', es:'Recompensas', it:'Premi', en:'Rewards' },
  belgium:      { fr:'Disponible en Belgique', de:'In Belgien', es:'En Bélgica', it:'In Belgio', en:'Available in Belgium' },
  austria:      { fr:'Disponible en Autriche', de:'In Österreich', es:'En Austria', it:'In Austria', en:'Available in Austria' },
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

const POPULAR_COMPARISONS_TITLE: Record<string, string> = {
  fr: 'Comparatifs populaires', de: 'Beliebte Vergleiche', es: 'Comparativas populares', it: 'Confronti popolari', en: 'Popular comparisons',
};

/** Maps each theme to relevant card-vs-card comparison slugs (alphabetically normalized). */
const THEME_COMPARISONS: Record<string, string[]> = {
  best: [
    'nexo-card-vs-revolut-metal',
    'bybit-card-vs-nexo-card',
    'bybit-card-vs-coinbase-card',
    'coinbase-card-vs-nexo-card',
  ],
  cashback: [
    'bybit-card-vs-nexo-card',
    'coinbase-card-vs-nexo-card',
    'nexo-card-vs-okx-card',
    'bybit-card-vs-coinbase-card',
  ],
  'no-fees': [
    'coinbase-card-vs-nexo-card',
    'bitpanda-card-vs-coinbase-card',
    'bybit-card-vs-coinbase-card',
    'nexo-card-vs-okx-card',
  ],
  'no-staking': [
    'nexo-card-vs-revolut-metal',
    'coinbase-card-vs-nexo-card',
    'bybit-card-vs-nexo-card',
  ],
  france: [
    'nexo-card-vs-revolut-metal',
    'coinbase-card-vs-nexo-card',
    'crypto-com-midnight-blue-vs-nexo-card',
  ],
  travel: [
    'nexo-card-vs-revolut-metal',
    'bybit-card-vs-nexo-card',
    'bybit-card-vs-revolut-metal',
  ],
  rewards: [
    'bybit-card-vs-nexo-card',
    'crypto-com-midnight-blue-vs-nexo-card',
    'nexo-card-vs-revolut-metal',
  ],
  beginner: [
    'coinbase-card-vs-nexo-card',
    'crypto-com-midnight-blue-vs-nexo-card',
    'bitpanda-card-vs-coinbase-card',
  ],
  '2026': [
    'nexo-card-vs-revolut-metal',
    'bybit-card-vs-nexo-card',
    'kraken-krak-card-vs-nexo-card',
    'bybit-card-vs-coinbase-card',
  ],
  virtual: [
    'bybit-card-vs-nexo-card',
    'coinbase-card-vs-nexo-card',
  ],
  'no-kyc': [
    'bybit-card-vs-nexo-card',
    'nexo-card-vs-okx-card',
  ],
};

/** Convert a comparison slug like 'nexo-card-vs-revolut-metal' to a display label. */
function compSlugToLabel(slug: string): string {
  return slug.split('-vs-').map((part) =>
    part.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  ).join(' vs ');
}

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
    const effectiveMarket = THEME_MARKET[theme] ?? lang;
    const marketFilter = (c: any) => !Array.isArray(c.markets) || c.markets.includes(effectiveMarket);
    const sorted = [...cards].filter(c => filterFn(c) && marketFilter(c)).sort(sortFn);
    const limit = THEME_LIMIT[theme];
    return limit ? sorted.slice(0, limit) : sorted;
  }, [cards, theme, lang]);

  const segment = LANG_TO_SEGMENT[lang] || 'cards';
  const brandsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
  const SEE_TIERS_LABEL: Record<string, string> = { fr: 'Voir toutes les cartes', de: 'Alle Karten', es: 'Ver tarjetas', it: 'Vedi carte', en: 'See all cards' };

  // ── SEO ───────────────────────────────────────────────────────────────────────
  // Cannibalization fix: "2026" pages are year-specific variants of the "best" evergreen
  // page. We tell Google the canonical is the "best" page so it consolidates ranking
  // signals there instead of splitting them across both URLs.
  const canonicalOverride = theme === '2026'
    ? `https://topcryptocards.eu/${lang}/${THEMATIC_ROUTES.best[lang as keyof typeof THEMATIC_ROUTES.best]}`
    : undefined;

  useSeoMeta({
    title: config?.title || 'TopCryptoCards',
    description: config?.description || '',
    lang,
    canonical: canonicalOverride,
  });

  /* Hreflang */
  useHreflang(
    (() => { const slugs = THEMATIC_SLUGS[theme]; return slugs ? (l: string) => slugs[l] ? `https://topcryptocards.eu/${l}/${slugs[l]}` : null : null; })(),
    [theme],
  );

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

    // BreadcrumbList
    const homeL: Record<string, string> = { fr: 'Accueil', de: 'Startseite', es: 'Inicio', it: 'Home', en: 'Home' };
    const breadcrumbEl = document.createElement('script');
    breadcrumbEl.id = 'schema-thematic-breadcrumb'; breadcrumbEl.type = 'application/ld+json';
    breadcrumbEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeL[lang] ?? 'Home', item: `${window.location.origin}/${lang}` },
        { '@type': 'ListItem', position: 2, name: config?.h1 ?? segment, item: `${window.location.origin}/${lang}/${segment}` },
      ],
    });
    document.getElementById('schema-thematic-breadcrumb')?.remove();
    document.head.appendChild(breadcrumbEl);

    return () => {
      document.getElementById('schema-itemlist')?.remove();
      document.getElementById('schema-faqpage')?.remove();
      document.getElementById('schema-thematic-breadcrumb')?.remove();
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

      {/* Key-facts comparison table — top 3 cards, structured HTML for featured snippets */}
      {!loading && filteredCards.length >= 2 && (() => {
        const TOP = filteredCards.slice(0, 3);
        const KEY_FACTS_LABELS: Record<string, string[]> = {
          fr: ['Cashback', 'Frais annuels', 'Staking requis', 'Réseau', 'Trust Score'],
          de: ['Cashback', 'Jahresgebühr', 'Staking erf.', 'Netzwerk', 'Trust Score'],
          es: ['Cashback', 'Comisiones anuales', 'Staking req.', 'Red', 'Trust Score'],
          it: ['Cashback', 'Commissioni annuali', 'Staking rich.', 'Rete', 'Trust Score'],
          en: ['Cashback', 'Annual fees', 'Staking req.', 'Network', 'Trust Score'],
        };
        const labels = KEY_FACTS_LABELS[lang] ?? KEY_FACTS_LABELS.en;
        const FREE_LABEL: Record<string, string> = { fr: 'Gratuit', de: 'Kostenlos', es: 'Gratis', it: 'Gratuito', en: 'Free' };
        const NO_STAKING_LABEL: Record<string, string> = { fr: 'Non requis', de: 'Nicht erf.', es: 'No requerido', it: 'Non richiesto', en: 'Not required' };
        function fmtCashback(c: any): string {
          const val = c.cashback_premium || c.cashback_base;
          return val ? `${val}%` : '—';
        }
        function fmtFees(c: any): string {
          return (c.annual_fees || 0) > 0 ? `${c.annual_fees} €/${({fr:'an',de:'Jahr',es:'año',it:'anno',en:'year'})[lang]??'year'}` : (FREE_LABEL[lang]??'Free');
        }
        function fmtStaking(c: any): string {
          if (!c.staking_required || c.staking_required <= 0) return NO_STAKING_LABEL[lang] ?? 'Not required';
          return `~€${Math.round(c.staking_required).toLocaleString()}`;
        }
        function getRow(c: any): string[] {
          return [fmtCashback(c), fmtFees(c), fmtStaking(c), c.card_network ?? '—', c.trust_score != null ? `${c.trust_score.toFixed(1)}/10` : '—'];
        }
        return (
          <div className="mb-8 overflow-x-auto">
            <table className="w-full text-sm border border-bg-border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-bg-elevated border-b border-bg-border">
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider min-w-[120px]">
                    {({ fr:'Critère', de:'Kriterium', es:'Criterio', it:'Criterio', en:'Criteria' })[lang]??'Criteria'}
                  </th>
                  {TOP.map((c: any, i: number) => (
                    <th key={c.id} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      <span className="text-cyan-400 mr-1">#{i + 1}</span>{c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {labels.map((label, rowIdx) => (
                  <tr key={label} className={rowIdx % 2 === 0 ? 'bg-bg-base' : 'bg-bg-elevated'}>
                    <td className="px-4 py-3 text-slate-400 font-medium">{label}</td>
                    {TOP.map((c: any) => (
                      <td key={c.id} className="px-4 py-3 font-semibold text-white">{getRow(c)[rowIdx]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}

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

      {/* Popular comparisons */}
      {(THEME_COMPARISONS[theme] || []).length > 0 && (() => {
        const rt = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS] ?? ROUTE_TRANSLATIONS.en;
        const compSeg = rt.comparisons ?? 'compare';
        return (
          <div className="mb-12">
            <h2 className="text-base font-semibold text-slate-400 mb-3">
              {POPULAR_COMPARISONS_TITLE[lang] || POPULAR_COMPARISONS_TITLE['en']}
            </h2>
            <div className="flex flex-wrap gap-2">
              {(THEME_COMPARISONS[theme] || []).map((slug) => (
                <Link
                  key={slug}
                  to={`/${lang}/${compSeg}/${slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-bg-border text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all"
                >
                  <span>⚖️</span>
                  {compSlugToLabel(slug)}
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

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