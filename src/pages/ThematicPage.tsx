import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Breadcrumb from '../components/Breadcrumb';

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
    fr: { title:`Meilleure Carte Crypto ${YEAR} — Comparatif Complet | TopCryptoCards`, h1:`Les Meilleures Cartes Crypto en ${YEAR}`, description:`Comparez les meilleures cartes crypto disponibles en France. Cashback, frais, régulation : notre sélection complète mise à jour en ${YEAR}.`, intro:`Choisir la meilleure carte crypto n'est pas une décision à prendre à la légère. Cashback, frais annuels, staking requis, disponibilité en France, régulation : les critères sont nombreux et varient selon votre profil. Ce comparatif rassemble toutes les cartes crypto disponibles en ${YEAR}, classées par fiabilité et pertinence.`, outro:`Pour faire le bon choix, comparez les taux de cashback mais pensez aussi aux conditions : certaines cartes exigent un staking important pour débloquer les meilleurs avantages. Si vous débutez, préférez une carte sans staking et sans frais annuels. Si vous êtes déjà investi en crypto, les cartes premium peuvent offrir jusqu'à 8% de cashback.` },
    de: { title:`Beste Krypto Karte ${YEAR} — Vollständiger Vergleich | TopCryptoCards`, h1:`Die besten Krypto-Karten ${YEAR}`, description:`Vergleichen Sie die besten Krypto-Karten in Deutschland. Cashback, Gebühren, Regulierung: unsere vollständige Auswahl ${YEAR}.`, intro:`Die Wahl der besten Krypto-Karte ist keine einfache Entscheidung. Cashback, Jahresgebühren, Staking-Anforderungen, Verfügbarkeit in Deutschland, Regulierung: die Kriterien sind zahlreich. Dieser Vergleich bringt alle in ${YEAR} verfügbaren Krypto-Karten zusammen, geordnet nach Vertrauenswürdigkeit.`, outro:`Vergleichen Sie Cashback-Sätze, aber berücksichtigen Sie auch die Bedingungen: Einige Karten erfordern erhebliches Staking, um die besten Vorteile freizuschalten. Wenn Sie Anfänger sind, bevorzugen Sie eine Karte ohne Staking und ohne Jahresgebühr.` },
    es: { title:`Mejor Tarjeta Crypto ${YEAR} — Comparativa Completa | TopCryptoCards`, h1:`Las Mejores Tarjetas Crypto en ${YEAR}`, description:`Compara las mejores tarjetas crypto disponibles en España. Cashback, comisiones, regulación: nuestra selección completa ${YEAR}.`, intro:`Elegir la mejor tarjeta crypto no es una decisión fácil. Cashback, comisiones anuales, staking requerido, disponibilidad en España, regulación: los criterios son numerosos. Esta comparativa reúne todas las tarjetas crypto disponibles en ${YEAR}, clasificadas por fiabilidad.`, outro:`Para tomar la decisión correcta, compara las tasas de cashback pero también ten en cuenta las condiciones: algunas tarjetas exigen un staking importante para desbloquear los mejores beneficios. Si eres principiante, elige una tarjeta sin staking y sin cuota anual.` },
    it: { title:`Migliore Carta Crypto ${YEAR} — Confronto Completo | TopCryptoCards`, h1:`Le Migliori Carte Crypto nel ${YEAR}`, description:`Confronta le migliori carte crypto disponibili in Italia. Cashback, commissioni, regolamentazione: la nostra selezione completa ${YEAR}.`, intro:`Scegliere la migliore carta crypto non è una decisione semplice. Cashback, costi annuali, staking richiesto, disponibilità in Italia, regolamentazione: i criteri sono numerosi. Questo confronto raccoglie tutte le carte crypto disponibili nel ${YEAR}, classificate per affidabilità.`, outro:`Per fare la scelta giusta, confronta i tassi di cashback ma considera anche le condizioni: alcune carte richiedono uno staking importante per sbloccare i migliori vantaggi. Se sei un principiante, preferisci una carta senza staking e senza costi annuali.` },
    en: { title:`Best Crypto Card ${YEAR} — Full Comparison | TopCryptoCards`, h1:`The Best Crypto Cards in ${YEAR}`, description:`Compare the best crypto cards available in Europe. Cashback, fees, regulation: our complete selection updated for ${YEAR}.`, intro:`Choosing the best crypto card is not a simple decision. Cashback rates, annual fees, staking requirements, availability, and regulation all vary significantly. This comparison covers all crypto cards available in ${YEAR}, ranked by reliability and value.`, outro:`To make the right choice, compare cashback rates but also consider the conditions: some cards require significant staking to unlock the best benefits. If you're a beginner, opt for a card with no staking and no annual fee.` },
  },
  cashback: {
    fr: { title:`Carte Crypto Cashback ${YEAR} — Jusqu'à 8% de Récompenses | TopCryptoCards`, h1:`Cartes Crypto avec le Meilleur Cashback`, description:`Classement des cartes crypto avec le meilleur cashback en ${YEAR}. De 1% à 8% selon les cartes, trouvez la plus rentable.`, intro:`Le cashback est l'avantage principal des cartes crypto : chaque achat vous rapporte des cryptomonnaies. Mais les taux varient considérablement, de 0.5% à 8% selon les cartes et les conditions. Ce classement compare les cartes crypto avec le meilleur cashback disponibles en ${YEAR}.`, outro:`Attention aux conditions : un taux de 8% peut nécessiter de bloquer 400 000 CRO en staking. Calculez le retour sur investissement réel avant de vous engager. Pour la plupart des utilisateurs, un cashback de 1 à 3% sans staking est plus rentable à long terme.` },
    de: { title:`Krypto Karte Cashback ${YEAR} — Bis zu 8% Belohnungen | TopCryptoCards`, h1:`Krypto-Karten mit dem besten Cashback`, description:`Ranking der Krypto-Karten mit dem besten Cashback ${YEAR}. Von 1% bis 8%, finden Sie die profitabelste.`, intro:`Cashback ist der Hauptvorteil von Krypto-Karten: Jeder Kauf bringt Ihnen Kryptowährungen ein. Die Sätze variieren jedoch erheblich, von 0,5% bis 8%. Dieses Ranking vergleicht Krypto-Karten mit dem besten Cashback in ${YEAR}.`, outro:`Achten Sie auf die Bedingungen: Ein Satz von 8% kann erhebliches Staking erfordern. Berechnen Sie den tatsächlichen ROI, bevor Sie sich verpflichten. Für die meisten Nutzer ist ein Cashback von 1-3% ohne Staking langfristig rentabler.` },
    es: { title:`Tarjeta Crypto Cashback ${YEAR} — Hasta 8% de Recompensas | TopCryptoCards`, h1:`Tarjetas Crypto con el Mejor Cashback`, description:`Clasificación de tarjetas crypto con el mejor cashback en ${YEAR}. Del 1% al 8%, encuentra la más rentable.`, intro:`El cashback es la principal ventaja de las tarjetas crypto: cada compra te genera criptomonedas. Pero las tasas varían considerablemente, del 0,5% al 8%. Esta clasificación compara las tarjetas crypto con el mejor cashback disponibles en ${YEAR}.`, outro:`Atención a las condiciones: una tasa del 8% puede requerir bloquear miles de euros en staking. Calcula el ROI real antes de comprometerte. Para la mayoría, un cashback del 1-3% sin staking es más rentable a largo plazo.` },
    it: { title:`Carta Crypto Cashback ${YEAR} — Fino all'8% di Ricompense | TopCryptoCards`, h1:`Carte Crypto con il Miglior Cashback`, description:`Classifica delle carte crypto con il miglior cashback nel ${YEAR}. Dall'1% all'8%, trova la più redditizia.`, intro:`Il cashback è il principale vantaggio delle carte crypto: ogni acquisto ti fa guadagnare criptovalute. Ma i tassi variano notevolmente, dallo 0,5% all'8%. Questa classifica confronta le carte crypto con il miglior cashback disponibili nel ${YEAR}.`, outro:`Attenzione alle condizioni: un tasso dell'8% può richiedere di bloccare migliaia di euro in staking. Calcola il ROI reale prima di impegnarti. Per la maggior parte degli utenti, un cashback dell'1-3% senza staking è più redditizio a lungo termine.` },
    en: { title:`Crypto Card Cashback ${YEAR} — Up to 8% Rewards | TopCryptoCards`, h1:`Crypto Cards with the Best Cashback`, description:`Ranking of crypto cards with the best cashback in ${YEAR}. From 1% to 8%, find the most profitable one.`, intro:`Cashback is the main advantage of crypto cards: every purchase earns you cryptocurrency. But rates vary significantly, from 0.5% to 8%. This ranking compares the best cashback crypto cards available in ${YEAR}.`, outro:`Watch out for conditions: an 8% rate may require staking thousands of euros. Calculate the real ROI before committing. For most users, a 1-3% cashback with no staking is more profitable in the long run.` },
  },
  'no-fees': {
    fr: { title:`Carte Crypto Sans Frais ${YEAR} — Gratuite et avec Cashback | TopCryptoCards`, h1:`Cartes Crypto Sans Frais Annuels en ${YEAR}`, description:`Les meilleures cartes crypto sans frais annuels en ${YEAR}. Cashback sans abonnement, sans engagement.`, intro:`Pourquoi payer un abonnement annuel pour une carte crypto quand des alternatives gratuites offrent d'excellents taux de cashback ? Ce comparatif liste toutes les cartes crypto sans frais annuels disponibles en ${YEAR}, classées par cashback décroissant.`, outro:`Une carte gratuite n'est pas synonyme de carte moins bonne. MetaMask Card, Gnosis Pay ou Brighty offrent de vrais avantages sans aucun abonnement. Comparez les plafonds de retrait et les cryptos acceptées pour choisir la meilleure option gratuite.` },
    de: { title:`Kostenlose Krypto Karte ${YEAR} — Ohne Jahresgebühr | TopCryptoCards`, h1:`Krypto-Karten ohne Jahresgebühr`, description:`Die besten kostenlosen Krypto-Karten ${YEAR}. Cashback ohne Jahresgebühr.`, intro:`Warum eine Jahresgebühr für eine Krypto-Karte zahlen, wenn kostenlose Alternativen hervorragende Cashback-Raten bieten? Dieser Vergleich listet alle kostenlosen Krypto-Karten in ${YEAR}.`, outro:`Eine kostenlose Karte bedeutet nicht schlechtere Qualität. Vergleichen Sie Abhebungslimits und unterstützte Kryptowährungen, um die beste kostenlose Option zu finden.` },
    es: { title:`Tarjeta Crypto Sin Comisiones ${YEAR} — Gratis y con Cashback | TopCryptoCards`, h1:`Tarjetas Crypto Sin Cuota Anual`, description:`Las mejores tarjetas crypto sin comisiones anuales en ${YEAR}. Cashback sin suscripción.`, intro:`¿Por qué pagar una cuota anual por una tarjeta crypto cuando hay alternativas gratuitas con excelentes tasas de cashback? Esta comparativa lista todas las tarjetas crypto sin comisiones anuales disponibles en ${YEAR}.`, outro:`Una tarjeta gratuita no significa una tarjeta inferior. Compara los límites de retirada y las criptomonedas aceptadas para encontrar la mejor opción gratuita.` },
    it: { title:`Carta Crypto Senza Costi ${YEAR} — Gratuita e con Cashback | TopCryptoCards`, h1:`Carte Crypto Senza Costi Annuali`, description:`Le migliori carte crypto senza costi annuali nel ${YEAR}. Cashback senza abbonamento.`, intro:`Perché pagare un abbonamento annuale per una carta crypto quando esistono alternative gratuite con ottimi tassi di cashback? Questo confronto elenca tutte le carte crypto senza costi annuali disponibili nel ${YEAR}.`, outro:`Una carta gratuita non significa qualità inferiore. Confronta i limiti di prelievo e le criptovalute accettate per trovare la migliore opzione gratuita.` },
    en: { title:`Free Crypto Card ${YEAR} — No Annual Fees + Cashback | TopCryptoCards`, h1:`Crypto Cards with No Annual Fees`, description:`The best free crypto cards in ${YEAR}. Cashback with no subscription, no commitment.`, intro:`Why pay an annual fee for a crypto card when free alternatives offer excellent cashback rates? This comparison lists all no-fee crypto cards available in ${YEAR}, ranked by cashback rate.`, outro:`A free card doesn't mean a worse card. Compare withdrawal limits and supported cryptocurrencies to find the best free option for your needs.` },
  },
  'no-staking': {
    fr: { title:`Carte Crypto Sans Staking ${YEAR} — Cashback Sans Conditions | TopCryptoCards`, h1:`Cartes Crypto Sans Staking Requis`, description:`Cartes crypto avec cashback sans obligation de staking en ${YEAR}. Aucun dépôt bloqué requis.`, intro:`Le staking obligatoire est la principale contrainte des cartes crypto premium : il faut immobiliser des milliers d'euros en cryptomonnaies pour débloquer le cashback. Ces cartes offrent un cashback sans aucune obligation de staking.`, outro:`Sans staking, votre capital reste libre. C'est particulièrement avantageux dans un marché volatil : vous n'êtes pas exposé au risque de dépréciation de la crypto stakée. MetaMask Card et Gnosis Pay sont les leaders de cette catégorie.` },
    de: { title:`Krypto Karte Ohne Staking ${YEAR} — Cashback Ohne Bedingungen | TopCryptoCards`, h1:`Krypto-Karten Ohne Staking-Pflicht`, description:`Krypto-Karten mit Cashback ohne Staking-Anforderung ${YEAR}. Keine gesperrten Gelder.`, intro:`Pflicht-Staking ist die Haupteinschränkung bei Premium-Krypto-Karten. Diese Karten bieten Cashback ohne jede Staking-Verpflichtung, sodass Ihr Kapital frei bleibt.`, outro:`Ohne Staking bleibt Ihr Kapital frei. Dies ist besonders vorteilhaft auf volatilen Märkten: Sie sind nicht dem Risiko der Abwertung der gestakten Kryptowährung ausgesetzt.` },
    es: { title:`Tarjeta Crypto Sin Staking ${YEAR} — Cashback Sin Condiciones | TopCryptoCards`, h1:`Tarjetas Crypto Sin Staking Requerido`, description:`Tarjetas crypto con cashback sin obligación de staking en ${YEAR}. Sin fondos bloqueados.`, intro:`El staking obligatorio es la principal restricción de las tarjetas crypto premium. Estas tarjetas ofrecen cashback sin ninguna obligación de staking, manteniendo tu capital libre.`, outro:`Sin staking, tu capital permanece libre. Es especialmente ventajoso en un mercado volátil: no estás expuesto al riesgo de depreciación de la cripto en staking.` },
    it: { title:`Carta Crypto Senza Staking ${YEAR} — Cashback Senza Condizioni | TopCryptoCards`, h1:`Carte Crypto Senza Staking Richiesto`, description:`Carte crypto con cashback senza obbligo di staking nel ${YEAR}. Nessun deposito bloccato.`, intro:`Lo staking obbligatorio è il principale limite delle carte crypto premium. Queste carte offrono cashback senza alcun obbligo di staking, mantenendo il tuo capitale libero.`, outro:`Senza staking, il tuo capitale rimane libero. È particolarmente vantaggioso in un mercato volatile: non sei esposto al rischio di svalutazione della cripto in staking.` },
    en: { title:`Crypto Card No Staking ${YEAR} — Cashback Without Conditions | TopCryptoCards`, h1:`Crypto Cards Without Staking Requirements`, description:`Crypto cards with cashback and no staking requirement in ${YEAR}. No locked funds required.`, intro:`Mandatory staking is the main drawback of premium crypto cards. These cards offer cashback with no staking obligation — your funds stay free and accessible at all times.`, outro:`Without staking, your capital stays free. This is especially advantageous in a volatile market: you're not exposed to the depreciation risk of a staked token. MetaMask Card and Gnosis Pay lead this category.` },
  },
  france: {
    fr: { title:`Carte Crypto France ${YEAR} — Disponibles et Légales en France | TopCryptoCards`, h1:`Cartes Crypto Disponibles en France`, description:`Les meilleures cartes crypto disponibles et légales en France en ${YEAR}. Régulation AMF/ACPR vérifiée.`, intro:`Toutes les cartes crypto ne sont pas disponibles en France. Entre les restrictions géographiques, les exigences KYC et les questions de régulation, le choix se réduit. Ce comparatif liste uniquement les cartes accessibles aux résidents français en ${YEAR}.`, outro:`En France, privilégiez les cartes émises par des entités régulées PSAN (Prestataire de Services sur Actifs Numériques) enregistrées auprès de l'AMF. Cela garantit un niveau de protection de vos fonds en cas de faillite de l'émetteur.` },
    de: { title:`Krypto Karte Deutschland ${YEAR} — In Deutschland Verfügbar | TopCryptoCards`, h1:`Krypto-Karten Verfügbar in Deutschland`, description:`Die besten in Deutschland verfügbaren Krypto-Karten ${YEAR}. BaFin-Regulierung geprüft.`, intro:`Nicht alle Krypto-Karten sind in Deutschland verfügbar. Dieser Vergleich listet nur die für deutsche Einwohner zugänglichen Karten in ${YEAR}, geordnet nach Vertrauenswürdigkeit.`, outro:`In Deutschland bevorzugen Sie Karten von BaFin-regulierten Unternehmen. Dies gewährleistet ein Mindestmaß an Schutz im Falle einer Insolvenz des Emittenten.` },
    es: { title:`Tarjeta Crypto España ${YEAR} — Disponibles en España | TopCryptoCards`, h1:`Tarjetas Crypto Disponibles en España`, description:`Las mejores tarjetas crypto disponibles en España en ${YEAR}. Regulación CNMV verificada.`, intro:`No todas las tarjetas crypto están disponibles en España. Esta comparativa lista únicamente las accesibles para residentes españoles en ${YEAR}.`, outro:`En España, elige tarjetas de entidades registradas ante la CNMV o el Banco de España. Esto garantiza un nivel mínimo de protección de tus fondos.` },
    it: { title:`Carta Crypto Italia ${YEAR} — Disponibili in Italia | TopCryptoCards`, h1:`Carte Crypto Disponibili in Italia`, description:`Le migliori carte crypto disponibili in Italia nel ${YEAR}. Regolamentazione OAM verificata.`, intro:`Non tutte le carte crypto sono disponibili in Italia. Questo confronto elenca solo quelle accessibili ai residenti italiani nel ${YEAR}.`, outro:`In Italia, preferisci carte emesse da entità registrate presso l'OAM (Organismo Agenti e Mediatori). Questo garantisce un livello minimo di protezione dei tuoi fondi.` },
    en: { title:`Crypto Card Europe ${YEAR} — Available in Europe | TopCryptoCards`, h1:`Crypto Cards Available in Europe`, description:`The best crypto cards available in Europe in ${YEAR}. FCA/MiCA regulated options included.`, intro:`Not all crypto cards are available across Europe. This comparison lists only cards accessible to European residents in ${YEAR}, with regulatory status verified.`, outro:`In Europe, prioritize cards from MiCA-compliant or FCA/BaFin-regulated entities. This ensures a minimum level of fund protection in the event of issuer insolvency.` },
  },
  virtual: {
    fr: { title:`Carte Crypto Virtuelle ${YEAR} — Paiements en Ligne | TopCryptoCards`, h1:`Cartes Crypto Virtuelles en ${YEAR}`, description:`Les meilleures cartes crypto virtuelles pour payer en ligne en ${YEAR}. Compatible Apple Pay, Google Pay.`, intro:`Les cartes crypto virtuelles sont idéales pour les achats en ligne et les paiements contactless via smartphone. Elles sont souvent disponibles immédiatement après inscription, sans attendre une carte physique.`, outro:`La carte virtuelle est souvent le moyen le plus rapide de commencer à dépenser ses cryptos. Disponible en quelques minutes après la validation KYC, elle se connecte directement à Apple Pay ou Google Pay pour des paiements instantanés.` },
    de: { title:`Virtuelle Krypto Karte ${YEAR} — Online-Zahlungen | TopCryptoCards`, h1:`Virtuelle Krypto-Karten ${YEAR}`, description:`Die besten virtuellen Krypto-Karten für Online-Zahlungen ${YEAR}. Apple Pay, Google Pay kompatibel.`, intro:`Virtuelle Krypto-Karten sind ideal für Online-Einkäufe und kontaktlose Zahlungen per Smartphone. Sie sind oft sofort nach der Registrierung verfügbar.`, outro:`Die virtuelle Karte ist oft der schnellste Weg, Kryptowährungen auszugeben. Verfügbar in wenigen Minuten nach der KYC-Validierung, verbindet sie sich direkt mit Apple Pay oder Google Pay.` },
    es: { title:`Tarjeta Crypto Virtual ${YEAR} — Pagos Online | TopCryptoCards`, h1:`Tarjetas Crypto Virtuales en ${YEAR}`, description:`Las mejores tarjetas crypto virtuales para pagos online en ${YEAR}. Compatible con Apple Pay, Google Pay.`, intro:`Las tarjetas crypto virtuales son ideales para compras online y pagos contactless. Suelen estar disponibles inmediatamente después del registro.`, outro:`La tarjeta virtual es a menudo la forma más rápida de empezar a gastar criptos. Disponible en minutos tras la validación KYC, se conecta directamente a Apple Pay o Google Pay.` },
    it: { title:`Carta Crypto Virtuale ${YEAR} — Pagamenti Online | TopCryptoCards`, h1:`Carte Crypto Virtuali nel ${YEAR}`, description:`Le migliori carte crypto virtuali per pagamenti online nel ${YEAR}. Compatibili con Apple Pay, Google Pay.`, intro:`Le carte crypto virtuali sono ideali per gli acquisti online e i pagamenti contactless. Spesso sono disponibili immediatamente dopo la registrazione.`, outro:`La carta virtuale è spesso il modo più rapido per iniziare a spendere crypto. Disponibile in pochi minuti dopo la validazione KYC, si collega direttamente ad Apple Pay o Google Pay.` },
    en: { title:`Virtual Crypto Card ${YEAR} — Online Payments | TopCryptoCards`, h1:`Virtual Crypto Cards in ${YEAR}`, description:`The best virtual crypto cards for online payments in ${YEAR}. Apple Pay, Google Pay compatible.`, intro:`Virtual crypto cards are ideal for online shopping and contactless payments via smartphone. They are usually available immediately after registration — no waiting for a physical card.`, outro:`A virtual card is often the fastest way to start spending crypto. Available within minutes of KYC approval, it connects directly to Apple Pay or Google Pay for instant payments anywhere.` },
  },
  beginner: {
    fr: { title:`Carte Crypto Débutant ${YEAR} — Simple, Sans Risque | TopCryptoCards`, h1:`Meilleures Cartes Crypto pour Débutants`, description:`Les cartes crypto les plus simples pour commencer en ${YEAR}. Sans staking, sans frais, sans complexité.`, intro:`Vous découvrez les cartes crypto et vous ne savez pas par où commencer ? Ces cartes ont été sélectionnées pour leur simplicité : aucun staking requis, aucun frais annuel, une interface accessible et un cashback immédiat dès le premier achat.`, outro:`Pour un débutant, le critère le plus important est la simplicité d'utilisation. Commencez par une carte sans staking et sans frais. Une fois que vous êtes à l'aise, vous pourrez explorer les cartes premium avec des taux de cashback plus élevés.` },
    de: { title:`Krypto Karte Einsteiger ${YEAR} — Einfach, Ohne Risiko | TopCryptoCards`, h1:`Beste Krypto-Karten für Einsteiger`, description:`Die einfachsten Krypto-Karten für den Einstieg ${YEAR}. Kein Staking, keine Gebühren.`, intro:`Diese Karten wurden für ihre Einfachheit ausgewählt: kein Staking erforderlich, keine Jahresgebühr, sofortiges Cashback ab dem ersten Kauf.`, outro:`Für Einsteiger ist Benutzerfreundlichkeit das wichtigste Kriterium. Beginnen Sie mit einer Karte ohne Staking und ohne Gebühren.` },
    es: { title:`Tarjeta Crypto Principiante ${YEAR} — Simple y Sin Riesgo | TopCryptoCards`, h1:`Mejores Tarjetas Crypto para Principiantes`, description:`Las tarjetas crypto más sencillas para empezar en ${YEAR}. Sin staking, sin comisiones.`, intro:`Estas tarjetas han sido seleccionadas por su simplicidad: sin staking requerido, sin cuota anual, cashback inmediato desde la primera compra.`, outro:`Para un principiante, el criterio más importante es la facilidad de uso. Empieza con una tarjeta sin staking y sin comisiones.` },
    it: { title:`Carta Crypto Principiante ${YEAR} — Semplice, Senza Rischi | TopCryptoCards`, h1:`Migliori Carte Crypto per Principianti`, description:`Le carte crypto più semplici per iniziare nel ${YEAR}. Senza staking, senza costi.`, intro:`Queste carte sono state selezionate per la loro semplicità: nessuno staking richiesto, nessun costo annuale, cashback immediato dal primo acquisto.`, outro:`Per un principiante, il criterio più importante è la facilità d'uso. Inizia con una carta senza staking e senza costi.` },
    en: { title:`Best Beginner Crypto Card ${YEAR} — Simple & Risk-Free | TopCryptoCards`, h1:`Best Crypto Cards for Beginners`, description:`The simplest crypto cards to get started in ${YEAR}. No staking, no fees, no complexity.`, intro:`New to crypto cards? These cards were selected for their simplicity: no staking required, no annual fee, and instant cashback from your very first purchase.`, outro:`For a beginner, ease of use is the most important criterion. Start with a card that has no staking and no fees. Once you're comfortable, you can explore premium cards with higher cashback rates.` },
  },
  'no-kyc': {
    fr: { title:`Carte Crypto Sans KYC ${YEAR} — Inscription Simplifiée | TopCryptoCards`, h1:`Cartes Crypto Sans KYC ou KYC Simplifié`, description:`Cartes crypto avec inscription simplifiée en ${YEAR}. Découvrez les solutions sans vérification d'identité complète pour payer en crypto facilement.`, intro:`La plupart des cartes crypto exigent un KYC complet : pièce d'identité, justificatif de domicile, selfie. Mais certaines solutions proposent une inscription simplifiée, notamment les cartes basées sur le self-custody et les wallets Web3 comme MetaMask Card ou Gnosis Pay. Ces cartes fonctionnent directement depuis votre wallet, réduisant les étapes de vérification.`, outro:`Important : aucune carte crypto réglementée en Europe ne permet une utilisation 100% anonyme. Les réglementations MiCA et AML imposent un niveau minimal de vérification. Pour une utilisation légale et sécurisée, choisissez des cartes conformes aux réglementations de votre pays.` },
    de: { title:`Krypto Karte Ohne KYC ${YEAR} — Einfache Anmeldung | TopCryptoCards`, h1:`Krypto-Karten ohne vollständiges KYC`, description:`Krypto-Karten mit vereinfachter Registrierung ${YEAR}. Lösungen ohne vollständige Identitätsprüfung für einfache Krypto-Zahlungen.`, intro:`Die meisten Krypto-Karten erfordern ein vollständiges KYC: Ausweis, Adressnachweis, Selfie. Einige Lösungen bieten jedoch eine vereinfachte Anmeldung an, insbesondere Self-Custody- und Web3-Wallet-basierte Karten wie MetaMask Card oder Gnosis Pay, die direkt von Ihrem Wallet aus funktionieren.`, outro:`Wichtig: Keine regulierte Krypto-Karte in Europa erlaubt eine vollständig anonyme Nutzung. MiCA- und AML-Vorschriften erfordern ein Mindestmaß an Verifizierung. Wählen Sie stets Karten, die den lokalen Vorschriften entsprechen.` },
    es: { title:`Tarjeta Crypto Sin KYC ${YEAR} — Registro Simplificado | TopCryptoCards`, h1:`Tarjetas Crypto Sin KYC Completo`, description:`Tarjetas crypto con registro simplificado en ${YEAR}. Soluciones sin verificación de identidad completa para pagar en crypto fácilmente.`, intro:`La mayoría de las tarjetas crypto exigen un KYC completo: DNI, justificante de domicilio, selfie. Pero algunas soluciones ofrecen un registro simplificado, especialmente las tarjetas basadas en self-custody y wallets Web3 como MetaMask Card o Gnosis Pay, que funcionan directamente desde tu wallet.`, outro:`Importante: ninguna tarjeta crypto regulada en Europa permite un uso 100% anónimo. Las regulaciones MiCA y AML exigen un nivel mínimo de verificación. Elige tarjetas conformes con las regulaciones locales para un uso legal y seguro.` },
    it: { title:`Carta Crypto Senza KYC ${YEAR} — Registrazione Semplificata | TopCryptoCards`, h1:`Carte Crypto Senza KYC Completo`, description:`Carte crypto con registrazione semplificata nel ${YEAR}. Soluzioni senza verifica d'identità completa per pagare in crypto facilmente.`, intro:`La maggior parte delle carte crypto richiede un KYC completo: documento d'identità, prova di residenza, selfie. Ma alcune soluzioni offrono una registrazione semplificata, in particolare le carte basate su self-custody e wallet Web3 come MetaMask Card o Gnosis Pay, che operano direttamente dal tuo wallet.`, outro:`Importante: nessuna carta crypto regolamentata in Europa consente un utilizzo al 100% anonimo. Le normative MiCA e AML richiedono un livello minimo di verifica. Scegli sempre carte conformi alle normative locali per un utilizzo legale e sicuro.` },
    en: { title:`Crypto Card No KYC ${YEAR} — Simplified Registration | TopCryptoCards`, h1:`Crypto Cards Without Full KYC`, description:`Crypto cards with simplified registration in ${YEAR}. Solutions with reduced identity verification for easy crypto payments.`, intro:`Most crypto cards require full KYC: ID document, proof of address, selfie. But some solutions offer simplified registration, especially self-custody and Web3 wallet-based cards like MetaMask Card or Gnosis Pay, which operate directly from your wallet and reduce verification steps significantly.`, outro:`Important: no regulated crypto card in Europe allows fully anonymous use. MiCA and AML regulations require a minimum level of verification from all card users. Always choose cards compliant with your local regulations for safe and legal use.` },
  },
  '2026': {
    fr: { title:`Meilleure Carte Crypto 2026 — Comparatif Complet et Mis à Jour | TopCryptoCards`, h1:`Les Meilleures Cartes Crypto en 2026`, description:`Quelle est la meilleure carte crypto en 2026 ? Comparatif complet des cartes avec le meilleur cashback, les frais les plus bas et la plus grande fiabilité.`, intro:`En 2026, le marché des cartes crypto a profondément évolué. L'entrée en vigueur du règlement MiCA en Europe a renforcé les standards de protection des utilisateurs. De nouvelles cartes sont apparues, des offres ont été améliorées. Ce comparatif recense les meilleures options disponibles en 2026, classées par note de confiance et rapport qualité/prix.`, outro:`En 2026, privilégiez les cartes émises par des entités conformes MiCA. La réglementation européenne offre désormais une protection solide : vos fonds sont mieux encadrés, les recours en cas de litige plus clairs. Comparez les taux de cashback mais ne négligez pas la fiabilité de l'émetteur.` },
    de: { title:`Beste Krypto Karte 2026 — Vollständiger Aktueller Vergleich | TopCryptoCards`, h1:`Die Besten Krypto-Karten 2026`, description:`Was ist die beste Krypto-Karte 2026? Vollständiger Vergleich mit bestem Cashback, niedrigsten Gebühren und höchster Zuverlässigkeit.`, intro:`2026 hat sich der Krypto-Karten-Markt erheblich weiterentwickelt. Die MiCA-Verordnung in Europa hat die Nutzerstandards gestärkt. Neue Karten sind erschienen, Angebote wurden verbessert. Dieser Vergleich listet die besten verfügbaren Optionen 2026 nach Vertrauenswürdigkeit und Preis-Leistungs-Verhältnis.`, outro:`2026 bevorzugen Sie MiCA-konforme Karten von regulierten Emittenten. Die europäische Regulierung bietet nun soliden Schutz für Ihre Gelder. Vergleichen Sie Cashback-Raten, vernachlässigen Sie aber nicht die Zuverlässigkeit des Emittenten.` },
    es: { title:`Mejor Tarjeta Crypto 2026 — Comparativa Completa Actualizada | TopCryptoCards`, h1:`Las Mejores Tarjetas Crypto en 2026`, description:`¿Cuál es la mejor tarjeta crypto en 2026? Comparativa completa con el mejor cashback, menores comisiones y mayor fiabilidad.`, intro:`En 2026, el mercado de tarjetas crypto ha evolucionado profundamente. La regulación MiCA en Europa ha reforzado los estándares de protección. Nuevas tarjetas han aparecido y las ofertas han mejorado. Esta comparativa recoge las mejores opciones de 2026, clasificadas por puntuación de confianza y relación calidad/precio.`, outro:`En 2026, prioriza tarjetas emitidas por entidades conformes con MiCA. La regulación europea ofrece ahora una protección sólida para tus fondos. Compara las tasas de cashback pero no descuides la fiabilidad del emisor.` },
    it: { title:`Migliore Carta Crypto 2026 — Confronto Completo Aggiornato | TopCryptoCards`, h1:`Le Migliori Carte Crypto nel 2026`, description:`Qual è la migliore carta crypto nel 2026? Confronto completo con il miglior cashback, costi più bassi e massima affidabilità.`, intro:`Nel 2026, il mercato delle carte crypto si è profondamente evoluto. L'entrata in vigore di MiCA in Europa ha rafforzato gli standard di protezione degli utenti. Nuove carte sono apparse e le offerte sono migliorate. Questo confronto raccoglie le migliori opzioni del 2026, classificate per punteggio di fiducia e rapporto qualità/prezzo.`, outro:`Nel 2026, privilegia carte emesse da entità conformi a MiCA. La regolamentazione europea offre ora una protezione solida per i tuoi fondi. Confronta i tassi di cashback ma non trascurare l'affidabilità dell'emittente.` },
    en: { title:`Best Crypto Card 2026 — Complete Updated Comparison | TopCryptoCards`, h1:`The Best Crypto Cards in 2026`, description:`What is the best crypto card in 2026? Complete comparison of cards with the best cashback, lowest fees, and highest reliability for this year.`, intro:`In 2026, the crypto card market has evolved significantly. The MiCA regulation across Europe has strengthened user protection standards. New cards have emerged and existing offers have improved. This comparison covers the best options available in 2026, ranked by trust score and overall value for money.`, outro:`In 2026, prioritize MiCA-compliant cards issued by regulated entities. European regulation now provides solid protection for your funds. Compare cashback rates but don't overlook the issuer's reliability and regulatory track record.` },
  },
  travel: {
    fr: { title:`Carte Crypto Voyage ${YEAR} — Meilleure Carte pour Voyager | TopCryptoCards`, h1:`Meilleures Cartes Crypto pour Voyager en ${YEAR}`, description:`Quelle carte crypto choisir pour voyager en ${YEAR} ? Sans frais de change, cashback à l'étranger, acceptée dans 200 pays.`, intro:`Voyager avec une carte crypto offre de nombreux avantages : pas de frais de change excessifs, cashback en crypto sur chaque achat à l'étranger, et acceptation dans plus de 50 millions de points de vente Visa/Mastercard. Ces cartes sont idéales pour les digital nomads et les voyageurs fréquents qui souhaitent maximiser leurs dépenses à l'international.`, outro:`Pour voyager, privilégiez une carte sans frais de change et avec des plafonds de retrait généreux. La Crypto.com Obsidian offre même les lounges d'aéroport gratuitement. Pour les voyageurs occasionnels, Gnosis Pay ou MetaMask Card suffisent sans aucun frais annuel.` },
    de: { title:`Krypto Karte Reise ${YEAR} — Beste Karte für Reisende | TopCryptoCards`, h1:`Beste Krypto-Karten für Reisende ${YEAR}`, description:`Welche Krypto-Karte für Reisen ${YEAR}? Keine Wechselgebühren, Cashback im Ausland, in 200 Ländern akzeptiert.`, intro:`Mit einer Krypto-Karte zu reisen bietet viele Vorteile: keine übermäßigen Wechselgebühren, Cashback in Krypto bei jedem Auslandskauf und Akzeptanz bei über 50 Millionen Händlern weltweit. Diese Karten sind ideal für digitale Nomaden und Vielreisende, die ihre internationalen Ausgaben maximieren möchten.`, outro:`Für Reisen wählen Sie eine Karte ohne Wechselgebühren und mit großzügigen Abhebungslimits. Die Crypto.com Obsidian bietet sogar kostenlose Flughafen-Lounges. Für Gelegenheitsreisende reichen Gnosis Pay oder MetaMask Card ohne Jahresgebühr vollkommen aus.` },
    es: { title:`Tarjeta Crypto Viaje ${YEAR} — Mejor Tarjeta para Viajar | TopCryptoCards`, h1:`Mejores Tarjetas Crypto para Viajeros en ${YEAR}`, description:`¿Qué tarjeta crypto elegir para viajar en ${YEAR}? Sin comisiones de cambio, cashback en el extranjero, aceptada en 200 países.`, intro:`Viajar con una tarjeta crypto ofrece muchas ventajas: sin comisiones de cambio excesivas, cashback en crypto en cada compra en el extranjero y aceptación en más de 50 millones de comercios Visa/Mastercard. Estas tarjetas son ideales para nómadas digitales y viajeros frecuentes que desean maximizar sus gastos internacionales.`, outro:`Para viajar, elige una tarjeta sin comisiones de cambio y con límites de retirada generosos. Crypto.com Obsidian ofrece incluso acceso gratuito a lounges de aeropuerto. Para viajeros ocasionales, Gnosis Pay o MetaMask Card son más que suficientes sin cuota anual.` },
    it: { title:`Carta Crypto Viaggio ${YEAR} — Migliore Carta per Viaggiare | TopCryptoCards`, h1:`Migliori Carte Crypto per Viaggiatori nel ${YEAR}`, description:`Quale carta crypto scegliere per viaggiare nel ${YEAR}? Senza commissioni di cambio, cashback all'estero, accettata in 200 paesi.`, intro:`Viaggiare con una carta crypto offre molti vantaggi: nessuna commissione di cambio eccessiva, cashback in crypto per ogni acquisto all'estero e accettazione in oltre 50 milioni di punti vendita Visa/Mastercard. Queste carte sono ideali per i nomadi digitali e i viaggiatori frequenti che desiderano massimizzare le spese internazionali.`, outro:`Per viaggiare, scegli una carta senza commissioni di cambio e con limiti di prelievo generosi. Crypto.com Obsidian offre persino l'accesso gratuito alle lounge aeroportuali. Per i viaggiatori occasionali, Gnosis Pay o MetaMask Card sono più che sufficienti senza costi annuali.` },
    en: { title:`Crypto Card for Travel ${YEAR} — Best Cards for Travelers | TopCryptoCards`, h1:`Best Crypto Cards for Travel in ${YEAR}`, description:`Which crypto card for travel in ${YEAR}? No currency exchange fees, cashback abroad, accepted in 200+ countries.`, intro:`Traveling with a crypto card offers many advantages: no excessive currency exchange fees, crypto cashback on every purchase abroad, and acceptance at over 50 million Visa/Mastercard merchants worldwide. These cards are ideal for digital nomads and frequent travelers who want to maximize their international spending.`, outro:`For travel, choose a card with no exchange fees and generous ATM withdrawal limits. Crypto.com Obsidian even includes free airport lounge access. For occasional travelers, Gnosis Pay or MetaMask Card are more than sufficient with no annual fee.` },
  },
  rewards: {
    fr: { title:`Carte Crypto Récompenses ${YEAR} — Gagnez des Rewards à Chaque Achat | TopCryptoCards`, h1:`Cartes Crypto avec les Meilleures Récompenses en ${YEAR}`, description:`Les cartes crypto avec les meilleures récompenses en ${YEAR} : cashback, lounge VIP, Netflix offert, Spotify remboursé. Comparez les avantages.`, intro:`Les cartes crypto premium offrent bien plus qu'un simple cashback : accès aux lounges d'aéroport, abonnements offerts (Netflix, Spotify), assurance voyage, cashback en crypto sur tous vos achats. Ces récompenses peuvent valoir plusieurs centaines d'euros par an selon votre usage et niveau de staking.`, outro:`Pour maximiser vos récompenses, évaluez les avantages en valeur monétaire réelle. Calculez si la dépréciation potentielle du token staké ne dépasse pas la valeur des avantages annuels. Pour la plupart des utilisateurs, Gnosis Pay et MetaMask Card offrent un excellent rapport récompenses/risque sans staking.` },
    de: { title:`Krypto Karte Prämien ${YEAR} — Belohnungen bei jedem Einkauf | TopCryptoCards`, h1:`Krypto-Karten mit den besten Prämien ${YEAR}`, description:`Die besten Krypto-Karten mit Prämien ${YEAR}: Cashback, VIP-Lounges, Netflix inklusive, Spotify erstattet.`, intro:`Premium-Krypto-Karten bieten weit mehr als nur Cashback: Flughafen-Lounge-Zugang, inklusive Abonnements (Netflix, Spotify), Reiseversicherung und Krypto-Cashback auf alle Einkäufe. Diese Prämien können je nach Nutzung und Staking-Niveau mehrere hundert Euro pro Jahr wert sein.`, outro:`Bewerten Sie die Vorteile in echtem Geldwert, bevor Sie sich für ein Staking-Niveau entscheiden. Für die meisten Nutzer bieten Gnosis Pay und MetaMask Card ein hervorragendes Prämien-/Risikoprofil ohne jedes Staking.` },
    es: { title:`Tarjeta Crypto Recompensas ${YEAR} — Gana Rewards en Cada Compra | TopCryptoCards`, h1:`Tarjetas Crypto con las Mejores Recompensas en ${YEAR}`, description:`Las mejores tarjetas crypto con recompensas en ${YEAR}: cashback, lounges VIP, Netflix incluido, Spotify reembolsado.`, intro:`Las tarjetas crypto premium ofrecen mucho más que un simple cashback: acceso a lounges de aeropuerto, suscripciones incluidas (Netflix, Spotify), seguro de viaje y cashback en crypto en todas tus compras. Estas recompensas pueden valer varios cientos de euros al año según tu uso y nivel de staking.`, outro:`Evalúa las ventajas en valor monetario real antes de comprometerte con un nivel de staking. Para la mayoría de usuarios, Gnosis Pay y MetaMask Card ofrecen una excelente relación recompensas/riesgo sin staking alguno.` },
    it: { title:`Carta Crypto Premi ${YEAR} — Guadagna Ricompense ad Ogni Acquisto | TopCryptoCards`, h1:`Carte Crypto con i Migliori Premi nel ${YEAR}`, description:`Le migliori carte crypto con premi nel ${YEAR}: cashback, lounge VIP, Netflix incluso, Spotify rimborsato.`, intro:`Le carte crypto premium offrono molto più di un semplice cashback: accesso alle lounge aeroportuali, abbonamenti inclusi (Netflix, Spotify), assicurazione viaggio e cashback in crypto su tutti gli acquisti. Questi premi possono valere diverse centinaia di euro all'anno in base all'utilizzo e al livello di staking.`, outro:`Valuta i vantaggi in termini di valore monetario reale prima di impegnarti in uno staking. Per la maggior parte degli utenti, Gnosis Pay e MetaMask Card offrono un ottimo rapporto premi/rischio senza alcuno staking.` },
    en: { title:`Crypto Card Rewards ${YEAR} — Earn Rewards on Every Purchase | TopCryptoCards`, h1:`Crypto Cards with the Best Rewards in ${YEAR}`, description:`The best crypto cards with rewards in ${YEAR}: cashback, VIP lounges, Netflix included, Spotify reimbursed.`, intro:`Premium crypto cards offer much more than simple cashback: airport lounge access, included subscriptions (Netflix, Spotify), travel insurance, and crypto cashback on all your purchases. These rewards can be worth several hundred euros per year depending on your usage and staking tier.`, outro:`Evaluate the benefits in real monetary value before committing to a staking tier. For most users, Gnosis Pay and MetaMask Card offer an excellent rewards-to-risk profile with no staking required at all.` },
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

  // ── SEO ───────────────────────────────────────────────────────────────────────
  useSeoMeta({
    title: config?.title || 'TopCryptoCards',
    description: config?.description || '',
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
    free:    { fr:'Gratuit', de:'Kostenlos', es:'Gratis', it:'Gratuito', en:'Free' },
    updated: { fr:'Mis à jour', de:'Aktualisiert', es:'Actualizado', it:'Aggiornato', en:'Updated' },
    cards:   { fr:'cartes', de:'Karten', es:'tarjetas', it:'carte', en:'cards' },
    faq:     { fr:'Questions fréquentes', de:'Häufige Fragen', es:'Preguntas frecuentes', it:'Domande frequenti', en:'Frequently Asked Questions' },
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
      <p className="text-slate-300 mb-8 max-w-3xl leading-relaxed">{config.intro}</p>

      {/* Card grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-surface p-4 rounded-xl h-48 animate-pulse bg-slate-800/50" />
          ))}
        </div>
      ) : filteredCards.length === 0 ? (
        <p className="text-slate-400 mb-10">Aucune carte trouvée pour ce critère.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredCards.map((card: any, idx: number) => (
            <Link
              key={card.id}
              to={`/${lang}/${segment}/${card.id}`}
              className="card-surface p-4 rounded-xl hover:border-cyan-500/50 border border-transparent transition-all block relative"
            >
              {idx < 3 && (
                <span className="absolute top-3 right-3 bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  #{idx + 1}
                </span>
              )}
              {card.real_card_image && (
                <div style={{ borderRadius:'12px', overflow:'hidden', marginBottom:'12px', width:'100%', aspectRatio:'1.586' }}>
                  <img src={card.real_card_image} alt={card.name}
                    style={{ width:'100%', height:'100%', objectFit:'cover' }}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                  />
                </div>
              )}
              <h2 className="text-white font-semibold text-base mb-1">{card.name}</h2>
              <p className="text-slate-400 text-sm">{card.issuer}</p>
              <div className="mt-3 flex gap-3 text-xs">
                {(card.cashback_premium || card.cashback_base) ? (
                  <span className="text-cyan-400 font-medium">{card.cashback_premium || card.cashback_base}% cashback</span>
                ) : null}
                <span className="text-slate-500">
                  {(card.annual_fees || 0) > 0 ? `${card.annual_fees} €/an` : t('free')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Outro */}
      <p className="text-slate-300 mb-10 max-w-3xl leading-relaxed border-l-2 border-cyan-500/30 pl-4 italic">
        {config.outro}
      </p>

      {/* Internal link: crypto guide hub */}
      <div className="mb-12">
        <Link
          to={`/${lang}/cryptos`}
          className="inline-flex items-center gap-3 px-5 py-4 rounded-xl bg-bg-card border border-bg-border hover:border-cyan-accent/40 transition-all group max-w-md"
        >
          <span className="text-2xl">₿</span>
          <div>
            <div className="font-semibold text-white group-hover:text-cyan-accent transition-colors text-sm">
              {lang === 'fr' ? 'Guide des Cryptomonnaies' : lang === 'de' ? 'Kryptowährungs-Guide' : lang === 'es' ? 'Guía de Criptomonedas' : lang === 'it' ? 'Guida alle Criptovalute' : 'Cryptocurrency Guide'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {lang === 'fr' ? 'Bitcoin, Ethereum, XRP… tout comprendre en 10 fiches' : lang === 'de' ? 'Bitcoin, Ethereum, XRP… 10 Krypto-Guides' : lang === 'es' ? 'Bitcoin, Ethereum, XRP… 10 guías completas' : lang === 'it' ? 'Bitcoin, Ethereum, XRP… 10 guide complete' : 'Bitcoin, Ethereum, XRP… 10 in-depth guides'}
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