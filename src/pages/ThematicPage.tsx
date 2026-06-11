import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';
import type { CryptoCard } from '../types/card';
import CardDetailDrawer from '../components/CardDetailDrawer';

const YEAR = new Date().getFullYear();

// ─── Theme config ─────────────────────────────────────────────────────────────

const THEME_CONFIG: Record<string, Record<string, { title: string; h1: string; description: string; intro: string }>> = {
  best: {
    fr: { title: `Meilleure Carte Crypto ${YEAR} — Comparatif Complet | TopCryptoCards`, h1: `Les Meilleures Cartes Crypto en ${YEAR}`, description: `Comparez les meilleures cartes crypto disponibles en France. Cashback, frais, régulation : notre sélection complète mise à jour en ${YEAR}.`, intro: `Choisir la meilleure carte crypto n'est pas une décision à prendre à la légère. Cashback, frais annuels, staking requis, disponibilité en France, régulation : les critères sont nombreux et varient selon votre profil. Ce comparatif rassemble toutes les cartes crypto disponibles en ${YEAR}, classées par fiabilité et pertinence.` },
    de: { title: `Beste Krypto Karte ${YEAR} — Vollständiger Vergleich | TopCryptoCards`, h1: `Die besten Krypto-Karten ${YEAR}`, description: `Vergleichen Sie die besten Krypto-Karten in Deutschland. Cashback, Gebühren, Regulierung: unsere vollständige Auswahl ${YEAR}.`, intro: `Die Wahl der besten Krypto-Karte ist keine einfache Entscheidung. Cashback, Jahresgebühren, Staking-Anforderungen, Verfügbarkeit in Deutschland, Regulierung: die Kriterien sind zahlreich. Dieser Vergleich bringt alle in ${YEAR} verfügbaren Krypto-Karten zusammen.` },
    es: { title: `Mejor Tarjeta Crypto ${YEAR} — Comparativa Completa | TopCryptoCards`, h1: `Las Mejores Tarjetas Crypto en ${YEAR}`, description: `Compara las mejores tarjetas crypto disponibles en España. Cashback, comisiones, regulación: nuestra selección completa ${YEAR}.`, intro: `Elegir la mejor tarjeta crypto no es una decisión fácil. Cashback, comisiones anuales, staking requerido, disponibilidad en España, regulación: los criterios son numerosos. Esta comparativa reúne todas las tarjetas crypto disponibles en ${YEAR}.` },
    it: { title: `Migliore Carta Crypto ${YEAR} — Confronto Completo | TopCryptoCards`, h1: `Le Migliori Carte Crypto nel ${YEAR}`, description: `Confronta le migliori carte crypto disponibili in Italia. Cashback, commissioni, regolamentazione: la nostra selezione completa ${YEAR}.`, intro: `Scegliere la migliore carta crypto non è una decisione semplice. Cashback, costi annuali, staking richiesto, disponibilità in Italia, regolamentazione: i criteri sono numerosi. Questo confronto raccoglie tutte le carte crypto disponibili nel ${YEAR}.` },
    en: { title: `Best Crypto Card ${YEAR} — Full Comparison | TopCryptoCards`, h1: `The Best Crypto Cards in ${YEAR}`, description: `Compare the best crypto cards available in Europe. Cashback, fees, regulation: our complete selection updated for ${YEAR}.`, intro: `Choosing the best crypto card is not a simple decision. Cashback rates, annual fees, staking requirements, availability, and regulation all vary significantly. This comparison covers all crypto cards available in ${YEAR}, ranked by reliability and value.` },
  },
  cashback: {
    fr: { title: `Carte Crypto Cashback ${YEAR} — Jusqu'à 8% de Récompenses | TopCryptoCards`, h1: `Cartes Crypto avec le Meilleur Cashback`, description: `Classement des cartes crypto avec le meilleur cashback en ${YEAR}. De 1% à 8% selon les cartes, trouvez la plus rentable.`, intro: `Le cashback est l'avantage principal des cartes crypto : chaque achat vous rapporte des cryptomonnaies. Mais les taux varient considérablement, de 0.5% à 8% selon les cartes et les conditions. Ce classement compare les cartes crypto avec le meilleur cashback disponibles en ${YEAR}.` },
    de: { title: `Krypto Karte Cashback ${YEAR} — Bis zu 8% Belohnungen | TopCryptoCards`, h1: `Krypto-Karten mit dem besten Cashback`, description: `Ranking der Krypto-Karten mit dem besten Cashback ${YEAR}. Von 1% bis 8%, finden Sie die profitabelste.`, intro: `Cashback ist der Hauptvorteil von Krypto-Karten: Jeder Kauf bringt Ihnen Kryptowährungen ein. Die Sätze variieren jedoch erheblich, von 0,5% bis 8%. Dieses Ranking vergleicht Krypto-Karten mit dem besten Cashback in ${YEAR}.` },
    es: { title: `Tarjeta Crypto Cashback ${YEAR} — Hasta 8% de Recompensas | TopCryptoCards`, h1: `Tarjetas Crypto con el Mejor Cashback`, description: `Clasificación de tarjetas crypto con el mejor cashback en ${YEAR}. Del 1% al 8%, encuentra la más rentable.`, intro: `El cashback es la principal ventaja de las tarjetas crypto: cada compra te genera criptomonedas. Pero las tasas varían considerablemente, del 0,5% al 8%. Esta clasificación compara las tarjetas crypto con el mejor cashback disponibles en ${YEAR}.` },
    it: { title: `Carta Crypto Cashback ${YEAR} — Fino all'8% di Ricompense | TopCryptoCards`, h1: `Carte Crypto con il Miglior Cashback`, description: `Classifica delle carte crypto con il miglior cashback nel ${YEAR}. Dall'1% all'8%, trova la più redditizia.`, intro: `Il cashback è il principale vantaggio delle carte crypto: ogni acquisto ti fa guadagnare criptovalute. Ma i tassi variano notevolmente, dallo 0,5% all'8%. Questa classifica confronta le carte crypto con il miglior cashback disponibili nel ${YEAR}.` },
    en: { title: `Crypto Card Cashback ${YEAR} — Up to 8% Rewards | TopCryptoCards`, h1: `Crypto Cards with the Best Cashback`, description: `Ranking of crypto cards with the best cashback in ${YEAR}. From 1% to 8%, find the most profitable one.`, intro: `Cashback is the main advantage of crypto cards: every purchase earns you cryptocurrency. But rates vary significantly, from 0.5% to 8%. This ranking compares the best cashback crypto cards available in ${YEAR}.` },
  },
  'no-fees': {
    fr: { title: `Carte Crypto Sans Frais ${YEAR} — Gratuite et avec Cashback | TopCryptoCards`, h1: `Cartes Crypto Sans Frais Annuels en ${YEAR}`, description: `Les meilleures cartes crypto sans frais annuels en ${YEAR}. Cashback sans abonnement, sans engagement.`, intro: `Pourquoi payer un abonnement annuel pour une carte crypto quand des alternatives gratuites offrent d'excellents taux de cashback ? Ce comparatif liste toutes les cartes crypto sans frais annuels disponibles en ${YEAR}, classées par cashback décroissant.` },
    de: { title: `Kostenlose Krypto Karte ${YEAR} — Ohne Jahresgebühr | TopCryptoCards`, h1: `Kostenlose Krypto-Karten ohne Jahresgebühr`, description: `Die besten kostenlosen Krypto-Karten ${YEAR}. Cashback ohne Jahresgebühr.`, intro: `Warum eine Jahresgebühr für eine Krypto-Karte zahlen, wenn kostenlose Alternativen hervorragende Cashback-Raten bieten? Dieser Vergleich listet alle kostenlosen Krypto-Karten in ${YEAR}.` },
    es: { title: `Tarjeta Crypto Sin Comisiones ${YEAR} — Gratis y con Cashback | TopCryptoCards`, h1: `Tarjetas Crypto Gratuitas sin Cuota Anual`, description: `Las mejores tarjetas crypto sin comisiones anuales en ${YEAR}. Cashback sin suscripción.`, intro: `¿Por qué pagar una cuota anual por una tarjeta crypto cuando hay alternativas gratuitas con excelentes tasas de cashback? Esta comparativa lista todas las tarjetas crypto sin comisiones anuales disponibles en ${YEAR}.` },
    it: { title: `Carta Crypto Senza Costi ${YEAR} — Gratuita e con Cashback | TopCryptoCards`, h1: `Carte Crypto Gratuite Senza Costi Annuali`, description: `Le migliori carte crypto senza costi annuali nel ${YEAR}. Cashback senza abbonamento.`, intro: `Perché pagare un abbonamento annuale per una carta crypto quando esistono alternative gratuite con ottimi tassi di cashback? Questo confronto elenca tutte le carte crypto senza costi annuali disponibili nel ${YEAR}.` },
    en: { title: `Free Crypto Card ${YEAR} — No Annual Fees + Cashback | TopCryptoCards`, h1: `Crypto Cards with No Annual Fees`, description: `The best free crypto cards in ${YEAR}. Cashback with no subscription, no commitment.`, intro: `Why pay an annual fee for a crypto card when free alternatives offer excellent cashback rates? This comparison lists all no-fee crypto cards available in ${YEAR}, ranked by cashback rate.` },
  },
  'no-staking': {
    fr: { title: `Carte Crypto Sans Staking ${YEAR} — Cashback Sans Conditions | TopCryptoCards`, h1: `Cartes Crypto Sans Staking Requis`, description: `Cartes crypto avec cashback sans obligation de staking en ${YEAR}. Aucun dépôt bloqué requis.`, intro: `Le staking obligatoire est la principale contrainte des cartes crypto premium : il faut immobiliser des milliers d'euros en cryptomonnaies pour débloquer le cashback. Ces cartes offrent un cashback sans aucune obligation de staking, accessibles immédiatement.` },
    de: { title: `Krypto Karte Ohne Staking ${YEAR} — Cashback Ohne Bedingungen | TopCryptoCards`, h1: `Krypto-Karten Ohne Staking-Pflicht`, description: `Krypto-Karten mit Cashback ohne Staking-Anforderung ${YEAR}. Keine gesperrten Gelder erforderlich.`, intro: `Pflicht-Staking ist die Haupteinschränkung bei Premium-Krypto-Karten. Diese Karten bieten Cashback ohne jede Staking-Verpflichtung.` },
    es: { title: `Tarjeta Crypto Sin Staking ${YEAR} — Cashback Sin Condiciones | TopCryptoCards`, h1: `Tarjetas Crypto Sin Staking Requerido`, description: `Tarjetas crypto con cashback sin obligación de staking en ${YEAR}. Sin fondos bloqueados.`, intro: `El staking obligatorio es la principal restricción de las tarjetas crypto premium. Estas tarjetas ofrecen cashback sin ninguna obligación de staking.` },
    it: { title: `Carta Crypto Senza Staking ${YEAR} — Cashback Senza Condizioni | TopCryptoCards`, h1: `Carte Crypto Senza Staking Richiesto`, description: `Carte crypto con cashback senza obbligo di staking nel ${YEAR}. Nessun deposito bloccato.`, intro: `Lo staking obbligatorio è il principale limite delle carte crypto premium. Queste carte offrono cashback senza alcun obbligo di staking.` },
    en: { title: `Crypto Card No Staking ${YEAR} — Cashback Without Conditions | TopCryptoCards`, h1: `Crypto Cards Without Staking Requirements`, description: `Crypto cards with cashback and no staking requirement in ${YEAR}. No locked funds required.`, intro: `Mandatory staking is the main drawback of premium crypto cards. These cards offer cashback with no staking obligation whatsoever — your funds stay free.` },
  },
  france: {
    fr: { title: `Carte Crypto France ${YEAR} — Disponibles et Légales en France | TopCryptoCards`, h1: `Cartes Crypto Disponibles en France`, description: `Les meilleures cartes crypto disponibles et légales en France en ${YEAR}. Régulation AMF/ACPR vérifiée.`, intro: `Toutes les cartes crypto ne sont pas disponibles en France. Entre les restrictions géographiques, les exigences KYC et les questions de régulation, le choix se réduit. Ce comparatif liste uniquement les cartes accessibles aux résidents français en ${YEAR}.` },
    de: { title: `Krypto Karte Deutschland ${YEAR} — In Deutschland Verfügbar | TopCryptoCards`, h1: `Krypto-Karten Verfügbar in Deutschland`, description: `Die besten in Deutschland verfügbaren Krypto-Karten ${YEAR}. BaFin-Regulierung geprüft.`, intro: `Nicht alle Krypto-Karten sind in Deutschland verfügbar. Dieser Vergleich listet nur die für deutsche Einwohner zugänglichen Karten in ${YEAR}.` },
    es: { title: `Tarjeta Crypto España ${YEAR} — Disponibles en España | TopCryptoCards`, h1: `Tarjetas Crypto Disponibles en España`, description: `Las mejores tarjetas crypto disponibles en España en ${YEAR}. Regulación CNMV verificada.`, intro: `No todas las tarjetas crypto están disponibles en España. Esta comparativa lista únicamente las accesibles para residentes españoles en ${YEAR}.` },
    it: { title: `Carta Crypto Italia ${YEAR} — Disponibili in Italia | TopCryptoCards`, h1: `Carte Crypto Disponibili in Italia`, description: `Le migliori carte crypto disponibili in Italia nel ${YEAR}. Regolamentazione OAM verificata.`, intro: `Non tutte le carte crypto sono disponibili in Italia. Questo confronto elenca solo quelle accessibili ai residenti italiani nel ${YEAR}.` },
    en: { title: `Crypto Card Europe ${YEAR} — Available in UK & Europe | TopCryptoCards`, h1: `Crypto Cards Available in Europe`, description: `The best crypto cards available in Europe in ${YEAR}. FCA/MiCA regulated options included.`, intro: `Not all crypto cards are available across Europe. This comparison lists only cards accessible to European residents in ${YEAR}, with regulatory status verified.` },
  },
  virtual: {
    fr: { title: `Carte Crypto Virtuelle ${YEAR} — Paiements en Ligne | TopCryptoCards`, h1: `Cartes Crypto Virtuelles en ${YEAR}`, description: `Les meilleures cartes crypto virtuelles pour payer en ligne en ${YEAR}. Compatible Apple Pay, Google Pay.`, intro: `Les cartes crypto virtuelles sont idéales pour les achats en ligne et les paiements contactless via smartphone.` },
    de: { title: `Virtuelle Krypto Karte ${YEAR} — Online-Zahlungen | TopCryptoCards`, h1: `Virtuelle Krypto-Karten ${YEAR}`, description: `Die besten virtuellen Krypto-Karten für Online-Zahlungen ${YEAR}.`, intro: `Virtuelle Krypto-Karten sind ideal für Online-Einkäufe und kontaktlose Zahlungen per Smartphone.` },
    es: { title: `Tarjeta Crypto Virtual ${YEAR} — Pagos Online | TopCryptoCards`, h1: `Tarjetas Crypto Virtuales en ${YEAR}`, description: `Las mejores tarjetas crypto virtuales para pagos online en ${YEAR}.`, intro: `Las tarjetas crypto virtuales son ideales para compras online y pagos contactless.` },
    it: { title: `Carta Crypto Virtuale ${YEAR} — Pagamenti Online | TopCryptoCards`, h1: `Carte Crypto Virtuali nel ${YEAR}`, description: `Le migliori carte crypto virtuali per pagamenti online nel ${YEAR}.`, intro: `Le carte crypto virtuali sono ideali per gli acquisti online e i pagamenti contactless.` },
    en: { title: `Virtual Crypto Card ${YEAR} — Online Payments | TopCryptoCards`, h1: `Virtual Crypto Cards in ${YEAR}`, description: `The best virtual crypto cards for online payments in ${YEAR}.`, intro: `Virtual crypto cards are ideal for online shopping and contactless payments via smartphone.` },
  },
  beginner: {
    fr: { title: `Carte Crypto Débutant ${YEAR} — Simple, Sans Risque | TopCryptoCards`, h1: `Meilleures Cartes Crypto pour Débutants`, description: `Les cartes crypto les plus simples pour commencer en ${YEAR}. Sans staking, sans frais, sans complexité.`, intro: `Vous découvrez les cartes crypto et vous ne savez pas par où commencer ? Ces cartes ont été sélectionnées pour leur simplicité : aucun staking requis, aucun frais annuel, une interface accessible et un cashback immédiat dès le premier achat.` },
    de: { title: `Krypto Karte Einsteiger ${YEAR} — Einfach, Ohne Risiko | TopCryptoCards`, h1: `Beste Krypto-Karten für Einsteiger`, description: `Die einfachsten Krypto-Karten für den Einstieg ${YEAR}.`, intro: `Diese Karten wurden für ihre Einfachheit ausgewählt: kein Staking, keine Jahresgebühr, sofortiges Cashback.` },
    es: { title: `Tarjeta Crypto Principiante ${YEAR} — Simple y Sin Riesgo | TopCryptoCards`, h1: `Mejores Tarjetas Crypto para Principiantes`, description: `Las tarjetas crypto más sencillas para empezar en ${YEAR}.`, intro: `Estas tarjetas han sido seleccionadas por su simplicidad: sin staking, sin cuota anual, cashback inmediato.` },
    it: { title: `Carta Crypto Principiante ${YEAR} — Semplice, Senza Rischi | TopCryptoCards`, h1: `Migliori Carte Crypto per Principianti`, description: `Le carte crypto più semplici per iniziare nel ${YEAR}.`, intro: `Queste carte sono state selezionate per la loro semplicità: nessuno staking, nessun costo annuale, cashback immediato.` },
    en: { title: `Best Beginner Crypto Card ${YEAR} — Simple & Risk-Free | TopCryptoCards`, h1: `Best Crypto Cards for Beginners`, description: `The simplest crypto cards to get started in ${YEAR}. No staking, no fees, no complexity.`, intro: `New to crypto cards? These cards were selected for their simplicity: no staking required, no annual fee, and instant cashback from your very first purchase.` },
  },
};

// ─── FAQ config ───────────────────────────────────────────────────────────────

type FaqItem = { q: string; a: string };

const FAQ_CONFIG: Record<string, Record<string, FaqItem[]>> = {
  best: {
    fr: [
      { q: `Quelle est la meilleure carte crypto en ${YEAR} ?`, a: `La meilleure carte crypto dépend de votre profil. Pour maximiser le cashback, les cartes avec staking (Crypto.com, Nexo) offrent jusqu'à 8%. Pour éviter les contraintes, des cartes sans frais ni staking comme Pluton ou Gnosis Pay sont idéales.` },
      { q: 'Comment comparer les cartes crypto efficacement ?', a: 'Comparez le cashback net (après frais annuels), le staking requis pour le débloquer, les cryptos acceptées et la disponibilité dans votre pays. Notre simulateur vous permet de calculer le gain annuel réel selon vos dépenses.' },
      { q: 'Les cartes crypto sont-elles sûres ?', a: "Les cartes émises par des entités régulées (FCA, AMF, MiCA) offrent les meilleures garanties. Vérifiez toujours le statut réglementaire de l'émetteur avant de vous inscrire." },
      { q: 'Le cashback crypto est-il imposable ?', a: 'En France, les gains crypto peuvent être soumis à la fiscalité des plus-values numériques (30% flat tax). Consultez un conseiller fiscal pour votre situation personnelle.' },
    ],
    de: [
      { q: `Was ist die beste Krypto-Karte in ${YEAR}?`, a: `Die beste Krypto-Karte hängt von Ihrem Profil ab. Für maximales Cashback bieten Karten mit Staking bis zu 8%. Für ein einfaches Erlebnis sind Karten ohne Gebühren ideal.` },
      { q: 'Wie vergleiche ich Krypto-Karten effektiv?', a: 'Vergleichen Sie das Netto-Cashback, das erforderliche Staking, akzeptierte Kryptowährungen und die Verfügbarkeit in Deutschland.' },
      { q: 'Sind Krypto-Karten sicher?', a: 'Von regulierten Unternehmen (BaFin, FCA, MiCA) ausgestellte Karten bieten die besten Garantien.' },
      { q: 'Ist Krypto-Cashback steuerpflichtig?', a: 'In Deutschland können Krypto-Gewinne der Abgeltungssteuer unterliegen. Konsultieren Sie einen Steuerberater.' },
    ],
    es: [
      { q: `¿Cuál es la mejor tarjeta crypto en ${YEAR}?`, a: `La mejor tarjeta crypto depende de tu perfil. Para maximizar el cashback, las tarjetas con staking ofrecen hasta un 8%.` },
      { q: '¿Cómo comparar tarjetas crypto eficazmente?', a: 'Compara el cashback neto, el staking requerido, las criptos aceptadas y la disponibilidad en España.' },
      { q: '¿Son seguras las tarjetas crypto?', a: 'Las tarjetas emitidas por entidades reguladas (CNMV, FCA, MiCA) ofrecen las mejores garantías.' },
      { q: '¿El cashback crypto está sujeto a impuestos?', a: 'En España, las ganancias en criptomonedas tributan como ganancias patrimoniales. Consulta a un asesor fiscal.' },
    ],
    it: [
      { q: `Qual è la migliore carta crypto nel ${YEAR}?`, a: `La migliore carta crypto dipende dal tuo profilo. Per massimizzare il cashback, le carte con staking offrono fino all'8%.` },
      { q: 'Come confrontare le carte crypto efficacemente?', a: 'Confronta il cashback netto, lo staking richiesto, le crypto accettate e la disponibilità in Italia.' },
      { q: 'Le carte crypto sono sicure?', a: "Le carte emesse da entità regolamentate (OAM, FCA, MiCA) offrono le migliori garanzie." },
      { q: 'Il cashback crypto è tassabile?', a: 'In Italia, i guadagni in criptovalute sono soggetti a tassazione. Consulta un consulente fiscale.' },
    ],
    en: [
      { q: `What is the best crypto card in ${YEAR}?`, a: `The best crypto card depends on your profile. For maximum cashback, staking-based cards offer up to 8%. For simplicity, no-fee no-staking cards are ideal.` },
      { q: 'How do I effectively compare crypto cards?', a: 'Compare net cashback (after annual fees), staking required, supported cryptos, and availability in your country.' },
      { q: 'Are crypto cards safe?', a: 'Cards issued by regulated entities (FCA, MiCA) offer the best protections. Always verify the regulatory status before signing up.' },
      { q: 'Is crypto cashback taxable?', a: 'Tax rules vary by country. Crypto rewards may be treated as income or capital gains. Consult a tax advisor.' },
    ],
  },
  cashback: {
    fr: [
      { q: 'Quel est le taux de cashback maximum sur une carte crypto ?', a: "Les cartes premium comme Crypto.com Obsidian ou Nexo Platinum offrent jusqu'à 8% de cashback, en échange d'un staking important de tokens natifs." },
      { q: 'Le cashback est-il versé en crypto ou en euros ?', a: 'Selon la carte, le cashback est versé en token natif, en Bitcoin, en stablecoins ou directement en euros.' },
      { q: 'Comment calculer son cashback annuel réel ?', a: 'Multipliez vos dépenses mensuelles par le taux de cashback, puis déduisez les frais annuels. Notre simulateur fait ce calcul automatiquement.' },
      { q: 'Y a-t-il un plafond sur le cashback ?', a: 'Certaines cartes plafonnent le cashback mensuel. Lisez attentivement les conditions générales avant de choisir.' },
    ],
    de: [
      { q: 'Wie hoch ist der maximale Cashback bei einer Krypto-Karte?', a: 'Premium-Karten bieten bis zu 8% Cashback, in der Regel im Austausch gegen erhebliches Staking nativer Tokens.' },
      { q: 'Wird Cashback in Krypto oder Euro ausgezahlt?', a: 'Je nach Karte wird Cashback als nativer Token, Bitcoin, Stablecoin oder direkt in Euro ausgezahlt.' },
      { q: 'Wie berechnet man den jährlichen Netto-Cashback?', a: 'Multiplizieren Sie Ihre monatlichen Ausgaben mit dem Cashback-Satz und ziehen Sie Jahresgebühren ab.' },
      { q: 'Gibt es eine Obergrenze für Cashback?', a: 'Einige Karten begrenzen den monatlichen Cashback. Lesen Sie die Bedingungen sorgfältig.' },
    ],
    es: [
      { q: '¿Cuál es el cashback máximo en una tarjeta crypto?', a: 'Las tarjetas premium ofrecen hasta un 8% de cashback, generalmente a cambio de staking de tokens nativos.' },
      { q: '¿El cashback se paga en crypto o en euros?', a: 'Según la tarjeta, el cashback se paga en token nativo, Bitcoin, stablecoins o directamente en euros.' },
      { q: '¿Cómo calcular el cashback anual real?', a: 'Multiplica tus gastos mensuales por la tasa de cashback y resta las cuotas anuales.' },
      { q: '¿Hay un límite en el cashback?', a: 'Algunas tarjetas limitan el cashback mensual. Lee atentamente los términos y condiciones.' },
    ],
    it: [
      { q: "Qual è il cashback massimo su una carta crypto?", a: "Le carte premium offrono fino all'8% di cashback, in cambio di staking di token nativi." },
      { q: 'Il cashback viene pagato in crypto o in euro?', a: 'A seconda della carta, il cashback viene pagato in token nativo, Bitcoin, stablecoin o in euro.' },
      { q: 'Come calcolare il cashback annuale reale?', a: 'Moltiplica le tue spese mensili per il tasso di cashback e deduci le commissioni annuali.' },
      { q: 'Esiste un limite sul cashback?', a: 'Alcune carte limitano il cashback mensile. Leggi attentamente i termini e condizioni.' },
    ],
    en: [
      { q: 'What is the maximum cashback rate on a crypto card?', a: 'Premium cards like Crypto.com Obsidian or Nexo Platinum offer up to 8% cashback, typically requiring significant staking of native tokens.' },
      { q: 'Is cashback paid in crypto or fiat?', a: 'Depending on the card, cashback is paid in native tokens, Bitcoin, stablecoins, or directly in fiat currency.' },
      { q: 'How do I calculate my real annual cashback?', a: 'Multiply your monthly spending by the cashback rate, then subtract annual fees. Our simulator does this automatically.' },
      { q: 'Is there a cap on cashback earnings?', a: 'Some cards cap monthly cashback. Read the terms and conditions carefully before choosing.' },
    ],
  },
  'no-fees': {
    fr: [
      { q: 'Existe-t-il vraiment des cartes crypto gratuites ?', a: 'Oui, plusieurs cartes crypto n\'ont aucun frais annuel : Pluton, Gnosis Pay, ou les niveaux de base de Crypto.com et Nexo. Elles offrent néanmoins un cashback réel, souvent entre 0.5% et 2%.' },
      { q: 'Quelle est la différence entre une carte gratuite et une carte premium ?', a: "Les cartes gratuites n'exigent aucun frais ni staking mais leur cashback est plus limité (0.5-2%). Les cartes premium demandent un staking important mais offrent jusqu'à 8%." },
      { q: 'Les cartes sans frais ont-elles des limites cachées ?', a: 'Vérifiez les frais de retrait ATM, les limites mensuelles de cashback, et les frais de change. Ces frais peuvent annuler l\'avantage "gratuit".' },
      { q: 'Peut-on cumuler une carte gratuite avec une carte premium ?', a: 'Oui, certains utilisateurs combinent une carte sans frais pour le quotidien et une premium pour les grosses dépenses.' },
    ],
    de: [
      { q: 'Gibt es wirklich kostenlose Krypto-Karten?', a: 'Ja, mehrere Krypto-Karten haben keine Jahresgebühr: Pluton, Gnosis Pay oder die Basisstufen von Crypto.com und Nexo.' },
      { q: 'Was ist der Unterschied zwischen einer kostenlosen und einer Premium-Karte?', a: 'Kostenlose Karten haben kein Staking, aber begrenztes Cashback (0,5-2%). Premium-Karten bieten bis zu 8%.' },
      { q: 'Haben kostenlose Karten versteckte Kosten?', a: 'Prüfen Sie Geldautomaten-Gebühren, monatliche Cashback-Limits und Fremdwährungsgebühren.' },
      { q: 'Kann man eine kostenlose mit einer Premium-Karte kombinieren?', a: 'Ja, eine kostenlose Karte für den Alltag und eine Premium-Karte für größere Ausgaben ist eine gute Kombination.' },
    ],
    es: [
      { q: '¿Existen realmente tarjetas crypto gratuitas?', a: 'Sí, varias tarjetas crypto no tienen cuota anual: Pluton, Gnosis Pay, o los niveles básicos de Crypto.com y Nexo.' },
      { q: '¿Cuál es la diferencia entre una tarjeta gratuita y una premium?', a: 'Las tarjetas gratuitas no requieren staking pero su cashback es más limitado (0,5-2%). Las premium ofrecen hasta el 8%.' },
      { q: '¿Las tarjetas gratuitas tienen costes ocultos?', a: 'Verifica las comisiones de cajero, los límites de cashback y las comisiones por divisas extranjeras.' },
      { q: '¿Se puede combinar una tarjeta gratuita con una premium?', a: 'Sí, una gratuita para el día a día y una premium para gastos importantes es una buena estrategia.' },
    ],
    it: [
      { q: 'Esistono davvero carte crypto gratuite?', a: "Sì, diverse carte crypto non hanno costi annuali: Pluton, Gnosis Pay, o i livelli base di Crypto.com e Nexo." },
      { q: 'Qual è la differenza tra una carta gratuita e una premium?', a: "Le carte gratuite non richiedono staking ma il loro cashback è più limitato (0,5-2%). Le premium offrono fino all'8%." },
      { q: 'Le carte gratuite hanno costi nascosti?', a: 'Verifica le commissioni ATM, i limiti mensili di cashback e le commissioni per valute estere.' },
      { q: 'Si può combinare una carta gratuita con una premium?', a: 'Sì, una gratuita per uso quotidiano e una premium per spese importanti è una buona strategia.' },
    ],
    en: [
      { q: 'Do truly free crypto cards exist?', a: 'Yes, several crypto cards have no annual fee: Pluton, Gnosis Pay, or the base tiers of Crypto.com and Nexo. They still offer real cashback, typically 0.5–2%.' },
      { q: 'What is the difference between a free and a premium card?', a: 'Free cards require no fees or staking but offer limited cashback (0.5–2%). Premium cards require significant staking but offer up to 8% cashback.' },
      { q: 'Do free cards have hidden costs?', a: 'Check ATM withdrawal fees, monthly cashback caps, and foreign currency fees — these can offset the "free" advantage.' },
      { q: 'Can I combine a free card with a premium one?', a: 'Yes. A free card for everyday use and a premium card for large purchases is a popular strategy.' },
    ],
  },
  'no-staking': {
    fr: [
      { q: "Qu'est-ce que le staking obligatoire pour une carte crypto ?", a: "Le staking consiste à immobiliser des tokens natifs pour débloquer les avantages de la carte. Le montant requis peut aller de quelques centaines à plusieurs milliers d'euros." },
      { q: 'Quelles cartes crypto offrent du cashback sans staking ?', a: 'Pluton, Gnosis Pay, Monolith ou certains niveaux de Nexo proposent du cashback sans aucune obligation de staking.' },
      { q: 'Le cashback sans staking est-il vraiment compétitif ?', a: 'Les taux sont généralement entre 0.5% et 3% sans staking, contre 2% à 8% avec staking. Pour des dépenses modérées, la carte sans staking est souvent plus rentable après calcul des risques.' },
      { q: 'Pourquoi éviter le staking pour une carte crypto ?', a: "Le staking immobilise des capitaux exposés à la volatilité crypto. Pour les profils prudents, les cartes sans staking sont plus sûres." },
    ],
    de: [
      { q: 'Was ist Pflicht-Staking bei einer Krypto-Karte?', a: 'Staking bedeutet, native Tokens zu sperren, um Kartenvorteile freizuschalten. Der Betrag kann von Hunderten bis Tausenden Euro reichen.' },
      { q: 'Welche Krypto-Karten bieten Cashback ohne Staking?', a: 'Pluton, Gnosis Pay oder bestimmte Nexo-Stufen bieten Cashback ohne Staking-Verpflichtung.' },
      { q: 'Ist Cashback ohne Staking wettbewerbsfähig?', a: 'Die Sätze liegen ohne Staking bei 0,5-3%, mit Staking bei 2-8%. Für moderate Ausgaben ist die Karte ohne Staking rentabler.' },
      { q: 'Warum sollte man Staking vermeiden?', a: 'Staking bindet Kapital, das der Krypto-Volatilität ausgesetzt ist. Für vorsichtige Profile sind Karten ohne Staking sicherer.' },
    ],
    es: [
      { q: '¿Qué es el staking obligatorio en una tarjeta crypto?', a: 'El staking consiste en inmovilizar tokens nativos para desbloquear los beneficios de la tarjeta.' },
      { q: '¿Qué tarjetas crypto ofrecen cashback sin staking?', a: 'Pluton, Gnosis Pay o ciertos niveles de Nexo ofrecen cashback sin obligación de staking.' },
      { q: '¿El cashback sin staking es competitivo?', a: 'Las tasas son del 0,5-3% sin staking vs. el 2-8% con staking. Para gastos moderados, la tarjeta sin staking suele ser más rentable.' },
      { q: '¿Por qué evitar el staking?', a: 'El staking inmoviliza capital expuesto a la volatilidad crypto. Para perfiles conservadores es más seguro evitarlo.' },
    ],
    it: [
      { q: "Cos'è lo staking obbligatorio per una carta crypto?", a: "Lo staking consiste nell'immobilizzare token nativi per sbloccare i vantaggi della carta." },
      { q: 'Quali carte crypto offrono cashback senza staking?', a: 'Pluton, Gnosis Pay o certi livelli di Nexo offrono cashback senza obbligo di staking.' },
      { q: 'Il cashback senza staking è competitivo?', a: "I tassi sono tra lo 0,5% e il 3% senza staking vs. il 2-8% con staking." },
      { q: 'Perché evitare lo staking?', a: 'Lo staking immobilizza capitale esposto alla volatilità crypto. Per i profili prudenti è più sicuro evitarlo.' },
    ],
    en: [
      { q: 'What is mandatory staking for a crypto card?', a: 'Staking means locking native tokens to unlock card benefits. The required amount can range from hundreds to thousands of euros.' },
      { q: 'Which crypto cards offer cashback without staking?', a: 'Pluton, Gnosis Pay, Monolith, or certain Nexo tiers provide cashback with no staking obligation.' },
      { q: 'Is cashback without staking competitive?', a: 'Rates are typically 0.5–3% without staking vs. 2–8% with staking. For moderate spenders, the no-staking card is often more profitable once risk is factored in.' },
      { q: 'Why avoid staking for a crypto card?', a: 'Staking locks up capital exposed to crypto volatility. Conservative profiles are safer without staking.' },
    ],
  },
  france: {
    fr: [
      { q: 'Quelles cartes crypto sont disponibles en France ?', a: 'En France, les cartes Crypto.com, Nexo, Pluton, Binance, Coinbase et plusieurs autres sont disponibles. Certaines nécessitent une vérification KYC.' },
      { q: 'Les cartes crypto sont-elles légales en France ?', a: "Oui. Les émetteurs doivent être enregistrés comme PSAN auprès de l'AMF ou opérer sous licence européenne MiCA." },
      { q: 'Comment ouvrir une carte crypto en France ?', a: "Le processus est 100% en ligne : téléchargement de l'application, vérification d'identité, et réception de la carte sous 5 à 10 jours." },
      { q: 'Les cartes crypto sont-elles acceptées partout en France ?', a: 'Les cartes Visa et Mastercard des émetteurs crypto sont acceptées partout où ces réseaux sont pris en charge.' },
    ],
    de: [
      { q: 'Welche Krypto-Karten sind in Deutschland verfügbar?', a: 'Crypto.com, Nexo, Pluton, Binance, Coinbase und weitere sind in Deutschland verfügbar.' },
      { q: 'Sind Krypto-Karten in Deutschland legal?', a: 'Ja. Emittenten müssen unter BaFin-Aufsicht oder europäischer MiCA-Lizenz operieren.' },
      { q: 'Wie eröffnet man eine Krypto-Karte in Deutschland?', a: 'Der Prozess ist vollständig online: App herunterladen, Identität verifizieren, Karte erhalten.' },
      { q: 'Werden Krypto-Karten überall akzeptiert?', a: 'Visa/Mastercard-basierte Krypto-Karten werden überall akzeptiert, wo diese Netzwerke unterstützt werden.' },
    ],
    es: [
      { q: '¿Qué tarjetas crypto están disponibles en España?', a: 'Crypto.com, Nexo, Pluton, Binance, Coinbase y otras están disponibles en España.' },
      { q: '¿Son legales las tarjetas crypto en España?', a: 'Sí. Los emisores deben estar registrados ante la CNMV u operar bajo licencia europea MiCA.' },
      { q: '¿Cómo abrir una tarjeta crypto en España?', a: 'El proceso es 100% online: descargar la app, verificar identidad, recibir la tarjeta.' },
      { q: '¿Se aceptan en toda España?', a: 'Las tarjetas Visa/Mastercard de emisores crypto se aceptan en todos los comercios que admiten estas redes.' },
    ],
    it: [
      { q: 'Quali carte crypto sono disponibili in Italia?', a: 'Crypto.com, Nexo, Pluton, Binance, Coinbase e altre sono disponibili in Italia.' },
      { q: 'Le carte crypto sono legali in Italia?', a: 'Sì. Gli emittenti devono essere registrati presso OAM o operare sotto licenza europea MiCA.' },
      { q: 'Come aprire una carta crypto in Italia?', a: "Il processo è 100% online: scaricare l'app, verificare l'identità, ricevere la carta." },
      { q: 'Le carte crypto sono accettate ovunque?', a: 'Le carte Visa/Mastercard degli emittenti crypto sono accettate ovunque questi circuiti siano supportati.' },
    ],
    en: [
      { q: 'Which crypto cards are available in Europe?', a: 'Crypto.com, Nexo, Pluton, Binance, Coinbase and many others are available across Europe.' },
      { q: 'Are crypto cards legal in Europe?', a: 'Yes. Issuers must operate under FCA, MiCA, or equivalent national regulation.' },
      { q: 'How do I get a crypto card in Europe?', a: 'The process is fully online: download the app, complete KYC verification, receive your card in 5–10 days.' },
      { q: 'Are crypto cards accepted everywhere?', a: 'Visa/Mastercard-based crypto cards are accepted anywhere those payment networks are supported.' },
    ],
  },
  virtual: {
    fr: [
      { q: "Qu'est-ce qu'une carte crypto virtuelle ?", a: "Une carte crypto virtuelle est une carte numérique sans support physique, utilisable pour les paiements en ligne et via Apple Pay / Google Pay. Elle est généralement disponible immédiatement après inscription." },
      { q: 'Peut-on utiliser une carte crypto virtuelle en magasin ?', a: 'Oui, via Apple Pay ou Google Pay. La carte virtuelle est ajoutée au wallet de votre smartphone et fonctionne sur tous les terminaux NFC.' },
      { q: 'Les cartes virtuelles sont-elles sûres ?', a: "Elles sont souvent plus sûres car le numéro de carte peut être renouvelé facilement. En cas de fraude, votre compte principal n'est pas compromis." },
      { q: 'Quelle carte crypto virtuelle a le meilleur cashback ?', a: 'Les cartes virtuelles premium offrent le même cashback que leurs équivalents physiques. Des cartes 100% virtuelles comme Monolith proposent des taux compétitifs sans staking.' },
    ],
    de: [
      { q: 'Was ist eine virtuelle Krypto-Karte?', a: 'Eine virtuelle Krypto-Karte ist eine digitale Karte ohne physischen Träger, verwendbar für Online-Zahlungen und über Apple Pay / Google Pay.' },
      { q: 'Kann man sie im Geschäft verwenden?', a: 'Ja, über Apple Pay oder Google Pay an allen NFC-Terminals.' },
      { q: 'Sind virtuelle Karten sicher?', a: 'Oft sicherer als physische, da die Kartennummer leicht erneuert werden kann.' },
      { q: 'Welche virtuelle Karte hat den besten Cashback?', a: 'Premium-Karten bieten denselben Cashback wie ihre physischen Äquivalente.' },
    ],
    es: [
      { q: '¿Qué es una tarjeta crypto virtual?', a: 'Una tarjeta digital sin soporte físico, utilizable para pagos online y a través de Apple Pay / Google Pay.' },
      { q: '¿Se puede usar en tiendas?', a: 'Sí, mediante Apple Pay o Google Pay en todos los terminales NFC.' },
      { q: '¿Son seguras?', a: 'A menudo más seguras que las físicas, ya que el número puede renovarse fácilmente.' },
      { q: '¿Cuál tiene el mejor cashback?', a: 'Las tarjetas premium ofrecen el mismo cashback que sus equivalentes físicos.' },
    ],
    it: [
      { q: "Cos'è una carta crypto virtuale?", a: 'Una carta digitale senza supporto fisico, utilizzabile per i pagamenti online e tramite Apple Pay / Google Pay.' },
      { q: 'Si può usare in negozio?', a: 'Sì, tramite Apple Pay o Google Pay su tutti i terminali NFC.' },
      { q: 'Sono sicure?', a: 'Spesso più sicure di quelle fisiche, perché il numero può essere rinnovato facilmente.' },
      { q: 'Quale ha il miglior cashback?', a: 'Le carte premium offrono lo stesso cashback dei loro equivalenti fisici.' },
    ],
    en: [
      { q: 'What is a virtual crypto card?', a: 'A digital card with no physical form, usable for online payments and via Apple Pay / Google Pay. Usually available immediately after sign-up.' },
      { q: 'Can I use it in stores?', a: 'Yes, via Apple Pay or Google Pay at any NFC-enabled terminal.' },
      { q: 'Are virtual cards as secure as physical ones?', a: 'Often more so — virtual card numbers can be renewed instantly if compromised.' },
      { q: 'Which virtual crypto card has the best cashback?', a: 'Premium virtual cards match their physical counterparts. Cards like Monolith offer competitive rates with no staking required.' },
    ],
  },
  beginner: {
    fr: [
      { q: 'Comment choisir sa première carte crypto ?', a: 'Pour un débutant, privilégiez une carte sans frais annuels et sans staking requis. Pluton, Gnosis Pay ou le niveau de base de Crypto.com sont de bons points de départ.' },
      { q: 'Quels documents sont nécessaires pour obtenir une carte crypto ?', a: "Généralement : une pièce d'identité valide, un justificatif de domicile récent, et parfois un selfie pour la vérification KYC. Tout se fait en ligne." },
      { q: "Est-il risqué d'utiliser une carte crypto pour la première fois ?", a: "Non, si vous choisissez un émetteur régulé. Le risque principal est la volatilité du cashback reçu en crypto." },
      { q: 'Combien de temps faut-il pour obtenir sa carte crypto ?', a: "La carte virtuelle est disponible immédiatement après validation KYC. La carte physique arrive en 5 à 10 jours ouvrés." },
    ],
    de: [
      { q: 'Wie wählt man seine erste Krypto-Karte?', a: 'Für Einsteiger empfehlen wir eine Karte ohne Jahresgebühr und ohne Staking. Pluton, Gnosis Pay oder das Basisniveau von Crypto.com sind gute Ausgangspunkte.' },
      { q: 'Welche Dokumente benötigt man?', a: 'Lichtbildausweis, Adressnachweis und manchmal ein Selfie für die KYC-Verifizierung.' },
      { q: 'Ist die erste Nutzung riskant?', a: 'Nein, wenn Sie einen regulierten Emittenten wählen.' },
      { q: 'Wie lange dauert es?', a: 'Die virtuelle Karte ist nach KYC-Validierung sofort verfügbar. Die physische Karte kommt in 5-10 Werktagen.' },
    ],
    es: [
      { q: '¿Cómo elegir tu primera tarjeta crypto?', a: 'Para principiantes, elige una sin cuota anual y sin staking. Pluton, Gnosis Pay o el nivel básico de Crypto.com son buenos puntos de partida.' },
      { q: '¿Qué documentos se necesitan?', a: 'Documento de identidad válido, justificante de domicilio y a veces un selfie para la verificación KYC.' },
      { q: '¿Es arriesgado para un principiante?', a: 'No, si eliges un emisor regulado.' },
      { q: '¿Cuánto tiempo se tarda?', a: 'La tarjeta virtual está disponible inmediatamente. La física llega en 5-10 días hábiles.' },
    ],
    it: [
      { q: 'Come scegliere la prima carta crypto?', a: 'Per i principianti, scegli una senza commissioni annuali e senza staking. Pluton, Gnosis Pay o il livello base di Crypto.com sono buoni punti di partenza.' },
      { q: 'Quali documenti servono?', a: "Documento di identità valido, prova di residenza e a volte un selfie per la verifica KYC." },
      { q: 'È rischioso per un principiante?', a: 'No, se si sceglie un emittente regolamentato.' },
      { q: 'Quanto tempo ci vuole?', a: 'La carta virtuale è disponibile immediatamente. Quella fisica arriva in 5-10 giorni lavorativi.' },
    ],
    en: [
      { q: 'How do I choose my first crypto card?', a: 'For beginners, choose a card with no annual fee and no staking required. Pluton, Gnosis Pay, or the base tier of Crypto.com are great starting points.' },
      { q: 'What documents do I need?', a: 'Typically: a valid ID, a recent proof of address, and sometimes a selfie for KYC verification. Everything is done online.' },
      { q: 'Is it risky for a beginner?', a: 'Not if you choose a regulated issuer. The main risk is cashback volatility when paid in crypto.' },
      { q: 'How long does it take?', a: 'The virtual card is usually available immediately after KYC approval. The physical card arrives in 5–10 business days.' },
    ],
  },
};

// ─── Theme filters / sorts ────────────────────────────────────────────────────

const THEME_FILTERS: Record<string, (card: any) => boolean> = {
  best:          () => true,
  cashback:      (c) => (c.cashback_premium || c.cashback_base || 0) > 0,
  'no-fees':     (c) => (c.annual_fees || 0) === 0,
  'no-staking':  (c) => (c.staking_required || 0) === 0,
  france:        (c) => Array.isArray(c.markets) ? c.markets.includes('fr') : true,
  virtual:       (c) => c.virtual_only === true,
  beginner:      (c) => (c.annual_fees || 0) === 0 && (c.staking_required || 0) === 0,
};

const THEME_SORT: Record<string, (a: any, b: any) => number> = {
  best:          (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  cashback:      (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  'no-fees':     (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  'no-staking':  (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  france:        (a, b) => (b.trust_score || 0) - (a.trust_score || 0),
  virtual:       (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
  beginner:      (a, b) => (b.cashback_premium || b.cashback_base || 0) - (a.cashback_premium || a.cashback_base || 0),
};

const THEME_LIMIT: Record<string, number> = { best: 15 };

// ─── FAQ accordion ────────────────────────────────────────────────────────────

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mt-12 max-w-3xl">
      <h2 className="text-xl font-bold text-white mb-6">FAQ</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="border border-slate-700/50 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left text-white font-medium hover:bg-slate-800/50 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 flex-shrink-0 ml-3 transition-transform ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-slate-300 text-sm leading-relaxed border-t border-slate-700/50">
                <p className="pt-3">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ThematicPageProps {
  theme: string;
}

export default function ThematicPage({ theme }: ThematicPageProps) {
  const { lang = 'fr' } = useParams<{ lang: string }>();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<CryptoCard | null>(null);

  const storeCards = useAppStore((s) => s.cards);

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

  const config = THEME_CONFIG[theme]?.[lang] || THEME_CONFIG[theme]?.['en'];
  const filterFn = THEME_FILTERS[theme] || (() => true);
  const sortFn = THEME_SORT[theme] || (() => 0);
  const faqItems = FAQ_CONFIG[theme]?.[lang] || FAQ_CONFIG[theme]?.['en'] || [];

  const filteredCards = useMemo(() => {
    const sorted = [...cards].filter(filterFn).sort(sortFn);
    const limit = THEME_LIMIT[theme];
    return limit ? sorted.slice(0, limit) : sorted;
  }, [cards, theme]);

  const handleCardClick = (cardId: string) => {
    const fullCard = storeCards.find((c) => c.id === cardId);
    if (fullCard) setDetail(fullCard);
  };

  // ── Meta tags + Schema.org JSON-LD ───────────────────────────────────────
  useEffect(() => {
    if (!config) return;

    document.title = config.title;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = config.description;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = window.location.origin + window.location.pathname;

    document.querySelectorAll('script[data-schema="thematic"]').forEach(el => el.remove());

    if (faqItems.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-schema', 'thematic');
      s.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(s);
    }

    return () => { document.querySelectorAll('script[data-schema="thematic"]').forEach(el => el.remove()); };
  }, [config, theme, lang, faqItems]);

  useEffect(() => {
    if (loading || filteredCards.length === 0 || !config) return;
    document.querySelectorAll('script[data-schema="thematic-list"]').forEach(el => el.remove());
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: config.h1,
      description: config.description,
      numberOfItems: filteredCards.length,
      itemListElement: filteredCards.slice(0, 10).map((card, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: card.name,
        description: `${card.issuer} — ${card.cashback_premium || card.cashback_base || 0}% cashback`,
      })),
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-schema', 'thematic-list');
    s.textContent = JSON.stringify(itemListSchema);
    document.head.appendChild(s);
    return () => { document.querySelectorAll('script[data-schema="thematic-list"]').forEach(el => el.remove()); };
  }, [loading, filteredCards, config]);

  if (!config) return null;

  const freeLabel: Record<string, string> = { fr: 'Gratuit', de: 'Kostenlos', es: 'Gratis', it: 'Gratuito', en: 'Free' };
  const updatedLabel: Record<string, string> = { fr: 'Mis à jour', de: 'Aktualisiert', es: 'Actualizado', it: 'Aggiornato', en: 'Updated' };
  const cardsLabel: Record<string, string> = { fr: 'cartes', de: 'Karten', es: 'tarjetas', it: 'carte', en: 'cards' };
  const detailsLabel: Record<string, string> = { fr: 'Voir les détails', de: 'Details', es: 'Ver detalles', it: 'Dettagli', en: 'View details' };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-3">{config.h1}</h1>
      <p className="text-slate-400 text-sm mb-4">
        {updatedLabel[lang] || 'Updated'}{' '}
        {new Date().toLocaleDateString(lang, { year: 'numeric', month: 'long' })}
        {' · '}
        <span className="text-cyan-400">{loading ? '…' : filteredCards.length}</span>
        {' '}
        {cardsLabel[lang] || 'cards'}
      </p>
      <p className="text-slate-300 mb-8 max-w-3xl leading-relaxed">{config.intro}</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-surface p-4 rounded-xl h-48 animate-pulse bg-slate-800/50" />
          ))}
        </div>
      ) : filteredCards.length === 0 ? (
        <p className="text-slate-400">Aucune carte trouvée pour ce critère.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {filteredCards.map((card: any) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="card-surface p-4 rounded-xl hover:border-cyan-500/50 border border-transparent transition-all text-left w-full focus:outline-none focus:border-cyan-500/50"
            >
              {card.real_card_image && (
                <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', width: '100%', aspectRatio: '1.586' }}>
                  <img
                    src={card.real_card_image}
                    alt={card.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                  />
                </div>
              )}
              <h2 className="text-white font-semibold text-base mb-1">{card.name}</h2>
              <p className="text-slate-400 text-sm">{card.issuer}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-3 text-xs">
                  {(card.cashback_premium || card.cashback_base) ? (
                    <span className="text-cyan-400 font-medium">
                      {card.cashback_premium || card.cashback_base}% cashback
                    </span>
                  ) : null}
                  <span className="text-slate-500">
                    {(card.annual_fees || 0) > 0
                      ? `${card.annual_fees} €/an`
                      : freeLabel[lang] || 'Free'}
                  </span>
                </div>
                <span className="text-xs text-cyan-400/60 transition-colors">
                  {detailsLabel[lang]} →
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {faqItems.length > 0 && <FaqAccordion items={faqItems} />}

      <CardDetailDrawer card={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
