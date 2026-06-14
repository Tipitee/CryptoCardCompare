// ─────────────────────────────────────────────────────────────────────────────
// cardReviewsSectionsI18n.ts — Translated long-form sections (EN / DE / ES / IT)
// FR versions live in cardReviews.ts
// ─────────────────────────────────────────────────────────────────────────────

export interface CardReviewSections {
  presentation: string;
  cashback: string;
  frais: string;
  securite: string;
  experience: string;
}

// [slug][lang] → sections
export const CARD_REVIEWS_SECTIONS: Record<string, Record<string, CardReviewSections>> = {

  // ──────────────────────────────────────────── CRYPTO.COM ──
  'crypto-com-card': {
    en: {
      presentation: `The **Crypto.com Visa Card** is one of the most widely used crypto cards in the world, available in over 40 countries. It operates across 5 tiers (Midnight Blue, Ruby Steel, Jade Green / Royal Indigo, Frosted Rose Gold / Icy White, and Obsidian), each requiring an increasing CRO stake locked for 180 days. The physical card is issued free of charge with no annual fee at any tier.`,
      cashback: `Cashback ranges from **0% (Midnight Blue)** to **5% (Obsidian)**, credited in CRO directly to your Crypto.com account. Mid-tier levels earn 1% (Ruby Steel), 2% (Jade/Indigo), and 3% (Rose Gold/Icy White). Higher tiers also fully reimburse subscriptions such as Spotify (up to €12.99/month), Netflix (up to €13.99/month), and Amazon Prime. Note: cashback is paid in CRO, whose value fluctuates with the market.`,
      frais: `**No annual fee** at any tier — a significant advantage. Foreign currency conversion fees are 0% on higher tiers but may reach 0.5% on lower ones. ATM withdrawals are free up to €200/month (Ruby Steel) or €400/month (higher tiers), with a 2% fee above the limit.`,
      securite: `Crypto.com is regulated across multiple jurisdictions (MiCA licence in the EU, FCA in the UK, MSB in the US). The platform uses **2FA**, **instant card freeze** via the app, customisable transaction limits, and stores 100% of user funds in cold storage. Insurance coverage applies up to certain thresholds depending on jurisdiction.`,
      experience: `The Crypto.com app is highly rated (4.5/5 on the App Store) and lets you manage your card, view transaction history, freeze/unfreeze the card, and track your cashback in real time. The card is compatible with **Apple Pay** and **Google Pay**. Customer support is mainly available via in-app chat — response times can be long during peak periods.`,
    },
    de: {
      presentation: `Die **Crypto.com Visa Card** ist eine der meistgenutzten Krypto-Karten der Welt und in über 40 Ländern verfügbar. Sie funktioniert auf 5 Stufen (Midnight Blue, Ruby Steel, Jade Green / Royal Indigo, Frosted Rose Gold / Icy White und Obsidian), von denen jede ein zunehmendes CRO-Staking für 180 Tage erfordert. Die physische Karte wird kostenlos ausgestellt, ohne Jahresgebühr auf irgendeiner Stufe.`,
      cashback: `Der Cashback reicht von **0 % (Midnight Blue)** bis **5 % (Obsidian)**, der in CRO direkt auf Ihr Crypto.com-Konto gutgeschrieben wird. Mittlere Stufen bieten 1 % (Ruby Steel), 2 % (Jade/Indigo) und 3 % (Rose Gold/Icy White). Höhere Stufen erstatten auch vollständig Abonnements wie Spotify (bis zu 12,99 €/Monat), Netflix (bis zu 13,99 €/Monat) und Amazon Prime. Hinweis: Der Cashback wird in CRO ausgezahlt, dessen Wert mit dem Markt schwankt.`,
      frais: `**Keine Jahresgebühr** auf allen Stufen — ein wesentlicher Vorteil. Fremdwährungsgebühren betragen 0 % auf höheren Stufen, können aber auf niedrigeren 0,5 % erreichen. Geldautomaten-Abhebungen sind kostenlos bis zu 200 €/Monat (Ruby Steel) oder 400 €/Monat (höhere Stufen), mit 2 % Gebühr über dem Limit.`,
      securite: `Crypto.com ist in mehreren Jurisdiktionen reguliert (MiCA-Lizenz in der EU, FCA in Großbritannien, MSB in den USA). Die Plattform verwendet **2FA**, **sofortige Kartensperre** über die App, anpassbare Transaktionslimits und speichert 100 % der Nutzerfonds in Cold Storage. Der Versicherungsschutz gilt bis zu bestimmten Schwellenwerten je nach Jurisdiktion.`,
      experience: `Die Crypto.com App wird hoch bewertet (4,5/5 im App Store) und ermöglicht Kartenverwaltung, Transaktionshistorie, Karte sperren/entsperren und Cashback-Tracking in Echtzeit. Die Karte ist mit **Apple Pay** und **Google Pay** kompatibel. Der Kundensupport ist hauptsächlich über den In-App-Chat verfügbar — Antwortzeiten können in Stoßzeiten lang sein.`,
    },
    es: {
      presentation: `La **Crypto.com Visa Card** es una de las tarjetas crypto más utilizadas del mundo, disponible en más de 40 países. Funciona en 5 niveles (Midnight Blue, Ruby Steel, Jade Green / Royal Indigo, Frosted Rose Gold / Icy White y Obsidian), cada uno requiriendo un staking de CRO creciente durante 180 días. La tarjeta física se emite gratuitamente sin comisión anual en ningún nivel.`,
      cashback: `El cashback varía del **0 % (Midnight Blue)** al **5 % (Obsidian)**, acreditado en CRO directamente en tu cuenta Crypto.com. Los niveles intermedios ofrecen 1 % (Ruby Steel), 2 % (Jade/Indigo) y 3 % (Rose Gold/Icy White). Los niveles superiores también reembolsan completamente suscripciones como Spotify (hasta 12,99 €/mes), Netflix (hasta 13,99 €/mes) y Amazon Prime. Nota: el cashback se paga en CRO, cuyo valor fluctúa con el mercado.`,
      frais: `**Sin comisión anual** en ningún nivel — una ventaja significativa. Las comisiones de conversión de divisas extranjeras son del 0 % en niveles superiores pero pueden llegar al 0,5 % en los inferiores. Los retiros en cajero son gratuitos hasta 200 €/mes (Ruby Steel) o 400 €/mes (niveles superiores), con un 2 % de comisión por encima del límite.`,
      securite: `Crypto.com está regulado en múltiples jurisdicciones (licencia MiCA en la UE, FCA en el Reino Unido, MSB en EE.UU.). La plataforma usa **2FA**, **bloqueo instantáneo de tarjeta** vía la app, límites de transacción personalizables y almacena el 100 % de los fondos de usuarios en cold storage. La cobertura del seguro aplica hasta ciertos umbrales según la jurisdicción.`,
      experience: `La app de Crypto.com está muy bien valorada (4,5/5 en el App Store) y permite gestionar la tarjeta, ver el historial de transacciones, bloquear/desbloquear la tarjeta y rastrear el cashback en tiempo real. La tarjeta es compatible con **Apple Pay** y **Google Pay**. El soporte al cliente está disponible principalmente vía chat en la app — los tiempos de respuesta pueden ser largos en períodos de alta actividad.`,
    },
    it: {
      presentation: `La **Crypto.com Visa Card** è una delle carte crypto più diffuse al mondo, disponibile in oltre 40 paesi. Funziona su 5 livelli (Midnight Blue, Ruby Steel, Jade Green / Royal Indigo, Frosted Rose Gold / Icy White e Obsidian), ognuno dei quali richiede uno staking di CRO crescente per 180 giorni. La carta fisica viene emessa gratuitamente senza commissioni annuali a nessun livello.`,
      cashback: `Il cashback va dallo **0% (Midnight Blue)** al **5% (Obsidian)**, accreditato in CRO direttamente sul tuo account Crypto.com. I livelli intermedi offrono 1% (Ruby Steel), 2% (Jade/Indigo) e 3% (Rose Gold/Icy White). I livelli superiori rimborsano anche completamente abbonamenti come Spotify (fino a 12,99 €/mese), Netflix (fino a 13,99 €/mese) e Amazon Prime. Nota: il cashback viene pagato in CRO, il cui valore fluttua con il mercato.`,
      frais: `**Nessuna commissione annuale** a nessun livello — un vantaggio significativo. Le commissioni di conversione valuta estera sono 0% sui livelli superiori ma possono arrivare allo 0,5% su quelli inferiori. I prelievi ATM sono gratuiti fino a 200 €/mese (Ruby Steel) o 400 €/mese (livelli superiori), con una commissione del 2% oltre il limite.`,
      securite: `Crypto.com è regolamentata in più giurisdizioni (licenza MiCA nell'UE, FCA nel Regno Unito, MSB negli USA). La piattaforma usa **2FA**, **blocco istantaneo della carta** tramite l'app, limiti di transazione personalizzabili e conserva il 100% dei fondi utente in cold storage. La copertura assicurativa si applica fino a certe soglie a seconda della giurisdizione.`,
      experience: `L'app di Crypto.com è molto apprezzata (4,5/5 sull'App Store) e permette di gestire la carta, visualizzare la cronologia delle transazioni, bloccare/sbloccare la carta e monitorare il cashback in tempo reale. La carta è compatibile con **Apple Pay** e **Google Pay**. Il supporto clienti è disponibile principalmente tramite chat in-app — i tempi di risposta possono essere lunghi nei periodi di punta.`,
    },
  },

  // ──────────────────────────────────────────── BINANCE ──
  'binance-card': {
    en: {
      presentation: `The **Binance Card** is a prepaid Visa issued in partnership with Moorwand, available in the European Economic Area. It draws directly from the user's Binance wallet, converting crypto to euros at point of sale in real time. The card is linked to the Binance account and requires full KYC verification to obtain.`,
      cashback: `Cashback ranges from **0.1% to 8% in BNB** depending on the average BNB balance held on the account over the previous month. Approximate tiers: 0–1 BNB → 0.1% · 1–3 BNB → 1% · 3–10 BNB → 3% · 10+ BNB → 8%. Cashback is credited in BNB within 24 hours of each transaction. Unlike other cards, BNB is not locked — it remains available at all times.`,
      frais: `**€0 annual fee** and **€0 card delivery fee**. Foreign currency transactions are converted via Binance at a competitive spread. ATM withdrawals are free within certain monthly limits. No dormancy or inactivity fees.`,
      securite: `Binance is the world's largest exchange by volume but faced significant regulatory penalties in 2023–2024 (DOJ, SEC, CFTC in the US). In Europe, Binance holds licences in several countries. The card includes standard security controls: 2FA, instant freeze, real-time notifications.`,
      experience: `Card management is handled directly within the Binance app, which is feature-rich. The card supports **Apple Pay** and **Google Pay**. The experience is smooth for existing Binance users. However, customer support has been criticised for slow response times.`,
    },
    de: {
      presentation: `Die **Binance Card** ist eine Prepaid-Visa, die in Partnerschaft mit Moorwand im Europäischen Wirtschaftsraum angeboten wird. Sie zieht direkt aus dem Binance-Wallet des Nutzers und konvertiert Krypto zum Zeitpunkt der Zahlung in Echtzeit in Euro. Die Karte ist mit dem Binance-Konto verknüpft und erfordert eine vollständige KYC-Verifizierung.`,
      cashback: `Der Cashback reicht von **0,1 % bis 8 % in BNB**, abhängig vom durchschnittlichen BNB-Guthaben des Vormonats. Richtwerte: 0–1 BNB → 0,1 % · 1–3 BNB → 1 % · 3–10 BNB → 3 % · 10+ BNB → 8 %. Der Cashback wird innerhalb von 24 Stunden in BNB gutgeschrieben. Anders als bei anderen Karten ist das BNB nicht gesperrt und jederzeit verfügbar.`,
      frais: `**0 € Jahresgebühr** und **0 € Liefergebühr**. Fremdwährungstransaktionen werden über Binance mit wettbewerbsfähigem Spread konvertiert. Geldautomaten-Abhebungen sind innerhalb bestimmter monatlicher Limits kostenlos. Keine Inaktivitätsgebühren.`,
      securite: `Binance ist der weltgrößte Exchange nach Volumen, hatte aber 2023–2024 erhebliche regulatorische Strafen (DOJ, SEC, CFTC in den USA). In Europa hält Binance Lizenzen in mehreren Ländern. Die Karte beinhaltet Standardsicherheitskontrollen: 2FA, Sofortsperre, Echtzeit-Benachrichtigungen.`,
      experience: `Die Kartenverwaltung erfolgt direkt in der Binance-App, die sehr funktionsreich ist. Die Karte unterstützt **Apple Pay** und **Google Pay**. Die Erfahrung ist für bestehende Binance-Nutzer reibungslos. Der Kundensupport wird jedoch für lange Reaktionszeiten kritisiert.`,
    },
    es: {
      presentation: `La **Binance Card** es una Visa prepago emitida en asociación con Moorwand, disponible en el Espacio Económico Europeo. Funciona directamente desde la cartera Binance del usuario, convirtiendo crypto a euros en tiempo real en el punto de venta. La tarjeta está vinculada a la cuenta Binance y requiere verificación KYC completa.`,
      cashback: `El cashback varía del **0,1 % al 8 % en BNB** según el saldo medio de BNB en la cuenta durante el mes anterior. Niveles orientativos: 0–1 BNB → 0,1 % · 1–3 BNB → 1 % · 3–10 BNB → 3 % · 10+ BNB → 8 %. El cashback se acredita en BNB en 24 horas. A diferencia de otras tarjetas, los BNB no están bloqueados y están disponibles en todo momento.`,
      frais: `**0 € de comisión anual** y **0 € de envío de tarjeta**. Las transacciones en divisas extranjeras se convierten a través de Binance con un diferencial competitivo. Los retiros en cajero son gratuitos dentro de ciertos límites mensuales. Sin comisiones de inactividad.`,
      securite: `Binance es el exchange más grande del mundo por volumen, pero enfrentó importantes sanciones regulatorias en 2023–2024 (DOJ, SEC, CFTC en EE.UU.). En Europa, Binance tiene licencias en varios países. La tarjeta incluye controles de seguridad estándar: 2FA, bloqueo instantáneo, notificaciones en tiempo real.`,
      experience: `La gestión de la tarjeta se realiza directamente en la app de Binance, que es muy completa. La tarjeta es compatible con **Apple Pay** y **Google Pay**. La experiencia es fluida para los usuarios habituales de Binance. Sin embargo, el soporte al cliente ha sido criticado por sus largos tiempos de respuesta.`,
    },
    it: {
      presentation: `La **Binance Card** è una Visa prepagata emessa in partnership con Moorwand, disponibile nello Spazio Economico Europeo. Attinge direttamente dal wallet Binance dell'utente, convertendo crypto in euro in tempo reale al punto vendita. La carta è collegata all'account Binance e richiede verifica KYC completa.`,
      cashback: `Il cashback va dallo **0,1% all'8% in BNB** in base al saldo medio di BNB nel mese precedente. Livelli indicativi: 0–1 BNB → 0,1% · 1–3 BNB → 1% · 3–10 BNB → 3% · 10+ BNB → 8%. Il cashback viene accreditato in BNB entro 24 ore. A differenza di altre carte, il BNB non è bloccato e rimane disponibile in qualsiasi momento.`,
      frais: `**0 € di commissioni annuali** e **0 € di spedizione carta**. Le transazioni in valuta estera vengono convertite tramite Binance con uno spread competitivo. I prelievi ATM sono gratuiti entro certi limiti mensili. Nessuna commissione di inattività.`,
      securite: `Binance è il più grande exchange al mondo per volume, ma ha subito significative sanzioni regolamentari nel 2023–2024 (DOJ, SEC, CFTC negli USA). In Europa, Binance detiene licenze in diversi paesi. La carta include controlli di sicurezza standard: 2FA, blocco istantaneo, notifiche in tempo reale.`,
      experience: `La gestione della carta avviene direttamente nell'app Binance, molto ricca di funzionalità. La carta supporta **Apple Pay** e **Google Pay**. L'esperienza è fluida per gli utenti Binance esistenti. Il supporto clienti è però criticato per i lunghi tempi di risposta.`,
    },
  },

  // ──────────────────────────────────────────── BYBIT ──
  'bybit-card': {
    en: {
      presentation: `The **Bybit Card** is a prepaid Mastercard issued by Bybit in partnership with European payment providers. It is linked directly to the user's Bybit account and lets them spend crypto instantly at any merchant accepting Mastercard. The card is available in most EU countries.`,
      cashback: `Cashback can reach **10% in MNT** based on monthly spending levels. Rates are tiered: under €1,000/month → 2% in MNT · €1,000–5,000/month → 5% in MNT · over €5,000/month → 10% in MNT (capped). MNT is Bybit's native token, convertible to BTC, ETH, or USDT on the platform.`,
      frais: `**€0 annual fee**. Crypto-to-EUR conversion happens at market rate at time of payment with minimal spread. ATM withdrawals are free up to a monthly cap. No dormancy or inactivity fees.`,
      securite: `Bybit is a major crypto derivatives exchange regulated across multiple jurisdictions. The card includes biometric authentication, instant freeze, and push-notification alerts. Bybit uses cold storage for the majority of funds. Note: Bybit was temporarily restricted in some European countries before obtaining the required licences.`,
      experience: `The Bybit app is well designed and provides full card management. Transactions appear in real time and cashback is credited promptly. The card supports **Apple Pay** and **Google Pay**. Customer support is available 24/7 via chat with variable response times.`,
    },
    de: {
      presentation: `Die **Bybit Card** ist eine Prepaid-Mastercard, die von Bybit in Partnerschaft mit europäischen Zahlungsanbietern ausgestellt wird. Sie ist direkt mit dem Bybit-Konto des Nutzers verknüpft und ermöglicht sofortige Krypto-Ausgaben bei jedem Mastercard-Akzeptanzstelle. Die Karte ist in den meisten EU-Ländern verfügbar.`,
      cashback: `Der Cashback kann **10 % in MNT** erreichen, basierend auf dem monatlichen Ausgabenniveau. Staffelung: unter 1.000 €/Monat → 2 % in MNT · 1.000–5.000 €/Monat → 5 % in MNT · über 5.000 €/Monat → 10 % in MNT (gedeckelt). MNT ist Bybits nativer Token, auf der Plattform in BTC, ETH oder USDT konvertierbar.`,
      frais: `**0 € Jahresgebühr**. Die Krypto-zu-EUR-Konvertierung erfolgt zum Marktpreis zum Zeitpunkt der Zahlung mit minimalem Spread. Geldautomaten-Abhebungen sind bis zu einem monatlichen Limit kostenlos. Keine Inaktivitätsgebühren.`,
      securite: `Bybit ist ein großer Krypto-Derivate-Exchange, der in mehreren Jurisdiktionen reguliert ist. Die Karte beinhaltet biometrische Authentifizierung, Sofortsperre und Push-Benachrichtigungen. Bybit verwendet Cold Storage für den Großteil der Gelder. Hinweis: Bybit war in einigen europäischen Ländern vorübergehend eingeschränkt, bevor die erforderlichen Lizenzen erteilt wurden.`,
      experience: `Die Bybit-App ist gut gestaltet und bietet vollständige Kartenverwaltung. Transaktionen erscheinen in Echtzeit und der Cashback wird schnell gutgeschrieben. Die Karte unterstützt **Apple Pay** und **Google Pay**. Der Kundensupport ist 24/7 per Chat mit variablen Reaktionszeiten verfügbar.`,
    },
    es: {
      presentation: `La **Bybit Card** es una Mastercard prepago emitida por Bybit en asociación con proveedores de pago europeos. Está vinculada directamente a la cuenta Bybit del usuario y permite gastar crypto al instante en cualquier comercio que acepte Mastercard. La tarjeta está disponible en la mayoría de los países de la UE.`,
      cashback: `El cashback puede alcanzar el **10 % en MNT** según el nivel de gasto mensual. Los tipos son escalonados: menos de 1.000 €/mes → 2 % en MNT · 1.000–5.000 €/mes → 5 % en MNT · más de 5.000 €/mes → 10 % en MNT (con tope). MNT es el token nativo de Bybit, convertible en BTC, ETH o USDT en la plataforma.`,
      frais: `**0 € de comisión anual**. La conversión crypto-EUR se realiza al precio de mercado en el momento del pago con un diferencial mínimo. Los retiros en cajero son gratuitos hasta un límite mensual. Sin comisiones de inactividad.`,
      securite: `Bybit es un importante exchange de derivados crypto regulado en múltiples jurisdicciones. La tarjeta incluye autenticación biométrica, bloqueo instantáneo y alertas push. Bybit utiliza cold storage para la mayoría de los fondos. Nota: Bybit fue restringida temporalmente en algunos países europeos antes de obtener las licencias requeridas.`,
      experience: `La app de Bybit está bien diseñada y ofrece gestión completa de la tarjeta. Las transacciones aparecen en tiempo real y el cashback se acredita rápidamente. La tarjeta es compatible con **Apple Pay** y **Google Pay**. El soporte al cliente está disponible 24/7 vía chat con tiempos de respuesta variables.`,
    },
    it: {
      presentation: `La **Bybit Card** è una Mastercard prepagata emessa da Bybit in partnership con fornitori di pagamento europei. È collegata direttamente all'account Bybit dell'utente e permette di spendere crypto istantaneamente presso qualsiasi esercente che accetta Mastercard. La carta è disponibile nella maggior parte dei paesi UE.`,
      cashback: `Il cashback può raggiungere il **10% in MNT** in base ai livelli di spesa mensile. Le tariffe sono progressive: meno di 1.000 €/mese → 2% in MNT · 1.000–5.000 €/mese → 5% in MNT · oltre 5.000 €/mese → 10% in MNT (con tetto). MNT è il token nativo di Bybit, convertibile in BTC, ETH o USDT sulla piattaforma.`,
      frais: `**0 € di commissioni annuali**. La conversione crypto-EUR avviene al prezzo di mercato al momento del pagamento con uno spread minimo. I prelievi ATM sono gratuiti fino a un limite mensile. Nessuna commissione di inattività.`,
      securite: `Bybit è un importante exchange di derivati crypto regolamentato in più giurisdizioni. La carta include autenticazione biometrica, blocco istantaneo e avvisi push. Bybit utilizza il cold storage per la maggior parte dei fondi. Nota: Bybit è stata temporaneamente limitata in alcuni paesi europei prima di ottenere le licenze necessarie.`,
      experience: `L'app Bybit è ben progettata e offre gestione completa della carta. Le transazioni appaiono in tempo reale e il cashback viene accreditato rapidamente. La carta supporta **Apple Pay** e **Google Pay**. Il supporto clienti è disponibile 24/7 tramite chat con tempi di risposta variabili.`,
    },
  },

  // ──────────────────────────────────────────── OKX ──
  'okx-card': {
    en: {
      presentation: `The **OKX Card** is a prepaid Mastercard issued by OKX, one of the world's largest exchanges. It lets you spend over 30 different cryptocurrencies directly at merchants, with real-time conversion. Available via the OKX app, it targets both beginners and advanced users within the OKX ecosystem.`,
      cashback: `Cashback ranges between **1% and 3%** based on usage level and OKB balance held. The base rate is 1% for all users, rising to 3% for those holding a minimum OKB balance. Cashback is paid in OKB, the platform's native token.`,
      frais: `**€0 annual fee**. Foreign currency transactions are converted at market rate. ATM withdrawals incur minimal fees above a monthly cap. No account maintenance fees.`,
      securite: `OKX is regulated in multiple jurisdictions and holds licences in Europe. The platform uses cold storage for 95% of funds and offers an insurance system for custody assets. The card includes 2FA, real-time notifications, and instant freeze.`,
      experience: `The OKX app delivers a positive overall experience with a modern interface. The card supports **Apple Pay** and **Google Pay**. OKX stands out for its Web3 integration — your OKX wallet connects directly to dApps. Customer support is primarily available in English.`,
    },
    de: {
      presentation: `Die **OKX Card** ist eine Prepaid-Mastercard, die von OKX, einem der weltweit größten Exchanges, ausgestellt wird. Sie ermöglicht es, über 30 verschiedene Kryptowährungen direkt bei Händlern auszugeben, mit Echtzeit-Konvertierung. Verfügbar über die OKX-App, richtet sie sich sowohl an Anfänger als auch an fortgeschrittene Nutzer im OKX-Ökosystem.`,
      cashback: `Der Cashback liegt zwischen **1 % und 3 %**, basierend auf dem Nutzungsniveau und dem gehaltenen OKB-Guthaben. Der Basissatz beträgt 1 % für alle Nutzer und kann auf 3 % steigen, wenn ein Mindest-OKB-Guthaben gehalten wird. Der Cashback wird in OKB, dem nativen Token der Plattform, ausgezahlt.`,
      frais: `**0 € Jahresgebühr**. Fremdwährungstransaktionen werden zum Marktpreis konvertiert. Geldautomaten-Abhebungen verursachen minimale Gebühren über einem monatlichen Limit. Keine Kontowartungsgebühren.`,
      securite: `OKX ist in mehreren Jurisdiktionen reguliert und hält Lizenzen in Europa. Die Plattform verwendet Cold Storage für 95 % der Gelder und bietet ein Versicherungssystem für Custody-Assets. Die Karte beinhaltet 2FA, Echtzeit-Benachrichtigungen und Sofortsperre.`,
      experience: `Die OKX-App bietet eine insgesamt positive Erfahrung mit moderner Oberfläche. Die Karte unterstützt **Apple Pay** und **Google Pay**. OKX zeichnet sich durch seine Web3-Integration aus — Ihr OKX-Wallet verbindet sich direkt mit dApps. Der Kundensupport ist hauptsächlich auf Englisch verfügbar.`,
    },
    es: {
      presentation: `La **OKX Card** es una Mastercard prepago emitida por OKX, uno de los exchanges más grandes del mundo. Permite gastar más de 30 criptomonedas directamente en comercios, con conversión en tiempo real. Disponible a través de la app OKX, está dirigida tanto a principiantes como a usuarios avanzados del ecosistema OKX.`,
      cashback: `El cashback oscila entre el **1 % y el 3 %** según el nivel de uso y el saldo de OKB mantenido. La tasa base es del 1 % para todos los usuarios, pudiendo subir al 3 % para quienes mantienen un saldo mínimo de OKB. El cashback se paga en OKB, el token nativo de la plataforma.`,
      frais: `**0 € de comisión anual**. Las transacciones en divisas extranjeras se convierten al precio de mercado. Los retiros en cajero incurren en comisiones mínimas por encima de un límite mensual. Sin comisiones de mantenimiento de cuenta.`,
      securite: `OKX está regulado en múltiples jurisdicciones y tiene licencias en Europa. La plataforma usa cold storage para el 95% de los fondos y ofrece un sistema de seguros para activos en custodia. La tarjeta incluye 2FA, notificaciones en tiempo real y bloqueo instantáneo.`,
      experience: `La app de OKX ofrece una experiencia general positiva con una interfaz moderna. La tarjeta es compatible con **Apple Pay** y **Google Pay**. OKX se distingue por su integración Web3 — tu wallet OKX se conecta directamente a dApps. El soporte al cliente está disponible principalmente en inglés.`,
    },
    it: {
      presentation: `La **OKX Card** è una Mastercard prepagata emessa da OKX, uno dei più grandi exchange al mondo. Permette di spendere oltre 30 diverse criptovalute direttamente presso i commercianti, con conversione in tempo reale. Disponibile tramite l'app OKX, si rivolge sia ai principianti che agli utenti avanzati dell'ecosistema OKX.`,
      cashback: `Il cashback varia tra **1% e 3%** in base al livello di utilizzo e al saldo OKB detenuto. Il tasso base è dell'1% per tutti gli utenti, che può salire al 3% per chi detiene un saldo minimo di OKB. Il cashback viene pagato in OKB, il token nativo della piattaforma.`,
      frais: `**0 € di commissioni annuali**. Le transazioni in valuta estera vengono convertite al prezzo di mercato. I prelievi ATM comportano commissioni minime oltre un limite mensile. Nessuna commissione di manutenzione dell'account.`,
      securite: `OKX è regolamentata in più giurisdizioni e detiene licenze in Europa. La piattaforma usa il cold storage per il 95% dei fondi e offre un sistema assicurativo per gli asset in custodia. La carta include 2FA, notifiche in tempo reale e blocco istantaneo.`,
      experience: `L'app OKX offre un'esperienza complessivamente positiva con un'interfaccia moderna. La carta supporta **Apple Pay** e **Google Pay**. OKX si distingue per la sua integrazione Web3 — il tuo wallet OKX si connette direttamente alle dApp. Il supporto clienti è disponibile principalmente in inglese.`,
    },
  },

  // ──────────────────────────────────────────── COINBASE ──
  'coinbase-card': {
    en: {
      presentation: `The **Coinbase Card** is a Visa issued by Coinbase, the only crypto exchange listed on a stock exchange (Nasdaq: COIN). Available in Europe and the US, it links directly to the user's Coinbase account and converts any crypto to local currency at point of sale. No staking is required to earn cashback.`,
      cashback: `Coinbase offers two cashback options to choose from: **4% in XLM** (Stellar Lumens) or **1% in BTC** (Bitcoin). Cashback is credited instantly after each transaction. The option to earn BTC as cashback is unique on the market, even if the 1% rate is limited compared to competitors.`,
      frais: `**€0 annual fee** and **€0 card delivery**. However, Coinbase applies conversion fees slightly higher than competitors (approximately 1–2.5% depending on currency and amount). ATM withdrawals may incur fees. No inactivity fees.`,
      securite: `Coinbase is **the most regulated crypto card on the market** from a legal standpoint. The exchange is subject to the strictest US regulations, is Nasdaq-listed, publishes quarterly accounts, and is regulated in every country where it operates. 98% of funds are kept in cold storage. Insurance programme on custody funds.`,
      experience: `The Coinbase app is the most user-friendly on the market, designed with beginners in mind. The card supports **Apple Pay** and **Google Pay**. Managing crypto, tracking cashback, and card settings are all accessible in a few taps. Customer support is available by email and chat, though response times can sometimes be slow.`,
    },
    de: {
      presentation: `Die **Coinbase Card** ist eine Visa, die von Coinbase ausgestellt wird, dem einzigen an der Börse notierten Krypto-Exchange (Nasdaq: COIN). In Europa und den USA verfügbar, ist sie direkt mit dem Coinbase-Konto des Nutzers verknüpft und konvertiert jede Krypto zum Marktpreis am Point of Sale. Kein Staking erforderlich für Cashback.`,
      cashback: `Coinbase bietet zwei Cashback-Optionen zur Wahl: **4 % in XLM** (Stellar Lumens) oder **1 % in BTC** (Bitcoin). Der Cashback wird sofort nach jeder Transaktion gutgeschrieben. Die Möglichkeit, BTC als Cashback zu erhalten, ist einzigartig auf dem Markt, auch wenn der Satz von 1 % im Vergleich zur Konkurrenz begrenzt ist.`,
      frais: `**0 € Jahresgebühr** und **0 € Kartenlieferung**. Coinbase wendet jedoch leicht höhere Konvertierungsgebühren als Konkurrenten an (ca. 1–2,5 % je nach Währung und Betrag). Geldautomaten-Abhebungen können Gebühren verursachen. Keine Inaktivitätsgebühren.`,
      securite: `Coinbase ist **die am stärksten regulierte Krypto-Karte auf dem Markt**. Der Exchange unterliegt den strengsten US-Vorschriften, ist an der Nasdaq notiert, veröffentlicht Quartalsabschlüsse und ist in jedem Land, in dem er tätig ist, reguliert. 98 % der Gelder werden in Cold Storage aufbewahrt. Versicherungsprogramm für Custody-Gelder.`,
      experience: `Die Coinbase-App ist die benutzerfreundlichste auf dem Markt, für Anfänger konzipiert. Die Karte unterstützt **Apple Pay** und **Google Pay**. Krypto-Verwaltung, Cashback-Tracking und Karteneinstellungen sind in wenigen Taps zugänglich. Support per E-Mail und Chat, Reaktionszeiten können variieren.`,
    },
    es: {
      presentation: `La **Coinbase Card** es una Visa emitida por Coinbase, el único exchange crypto cotizado en bolsa (Nasdaq: COIN). Disponible en Europa y EE.UU., está vinculada directamente a la cuenta Coinbase del usuario y convierte cualquier crypto a moneda local en el punto de venta. No se requiere staking para obtener cashback.`,
      cashback: `Coinbase ofrece dos opciones de cashback a elegir: **4 % en XLM** (Stellar Lumens) o **1 % en BTC** (Bitcoin). El cashback se acredita instantáneamente después de cada transacción. La posibilidad de obtener BTC como cashback es única en el mercado, aunque la tasa del 1 % es limitada respecto a la competencia.`,
      frais: `**0 € de comisión anual** y **0 € de envío de tarjeta**. Sin embargo, Coinbase aplica comisiones de conversión ligeramente más altas que sus competidores (aproximadamente 1–2,5 % según divisa e importe). Los retiros en cajero pueden incurrir en comisiones. Sin comisiones de inactividad.`,
      securite: `Coinbase es **la tarjeta crypto más regulada del mercado** desde el punto de vista legal. El exchange está sujeto a las regulaciones estadounidenses más estrictas, cotiza en Nasdaq, publica cuentas trimestrales y está regulado en todos los países donde opera. El 98% de los fondos se guardan en cold storage. Programa de seguros sobre fondos en custodia.`,
      experience: `La app de Coinbase es la más fácil de usar del mercado, diseñada pensando en principiantes. La tarjeta es compatible con **Apple Pay** y **Google Pay**. Gestionar crypto, rastrear cashback y configurar la tarjeta son accesibles en pocos toques. Soporte por email y chat, aunque los tiempos de respuesta pueden ser lentos.`,
    },
    it: {
      presentation: `La **Coinbase Card** è una Visa emessa da Coinbase, l'unico exchange crypto quotato in borsa (Nasdaq: COIN). Disponibile in Europa e negli USA, è collegata direttamente all'account Coinbase dell'utente e converte qualsiasi crypto in valuta locale al punto vendita. Nessuno staking richiesto per guadagnare cashback.`,
      cashback: `Coinbase offre due opzioni di cashback a scelta: **4% in XLM** (Stellar Lumens) o **1% in BTC** (Bitcoin). Il cashback viene accreditato istantaneamente dopo ogni transazione. La possibilità di ottenere BTC come cashback è unica sul mercato, anche se il tasso dell'1% è limitato rispetto alla concorrenza.`,
      frais: `**0 € di commissioni annuali** e **0 € di spedizione carta**. Tuttavia, Coinbase applica commissioni di conversione leggermente più alte dei concorrenti (circa 1–2,5% a seconda della valuta e dell'importo). I prelievi ATM possono comportare commissioni. Nessuna commissione di inattività.`,
      securite: `Coinbase è **la carta crypto più regolamentata del mercato** dal punto di vista legale. L'exchange è soggetto alle normative americane più severe, è quotato al Nasdaq, pubblica i conti trimestrali ed è regolamentato in ogni paese dove opera. Il 98% dei fondi è tenuto in cold storage. Programma assicurativo sui fondi in custodia.`,
      experience: `L'app di Coinbase è la più user-friendly del mercato, progettata per i principianti. La carta supporta **Apple Pay** e **Google Pay**. Gestire le crypto, monitorare il cashback e le impostazioni della carta sono accessibili in pochi tocchi. Supporto via email e chat, anche se i tempi di risposta possono essere lenti.`,
    },
  },

  // ──────────────────────────────────────────── NEXO ──
  'nexo-card': {
    en: {
      presentation: `The **Nexo Card** works differently from other crypto cards: instead of selling your crypto to pay, Nexo grants you a **credit line** secured by your assets as collateral. You spend in euros, Nexo pays on your behalf, and you repay Nexo at your own pace (with interest if you choose not to repay immediately). Your crypto stays in your portfolio and keeps working for you.`,
      cashback: `Cashback is **2% in BTC or NEXO** on all transactions, with no minimum spend or staking required. If you hold at least 10% of your portfolio in NEXO, you unlock an enhanced NEXO cashback rate. The BTC cashback option is particularly attractive for long-term investors looking to passively accumulate Bitcoin through everyday purchases.`,
      frais: `**€0 annual fee**. No foreign currency conversion fees (depending on your loyalty tier). Interest on the credit line varies based on LTV (Loan-to-Value) ratio and loyalty tier. If you repay immediately after each transaction (debit mode), no interest is charged.`,
      securite: `Nexo is regulated in Europe and holds licences in multiple countries. The platform uses institutional custody solutions (BitGo, Ledger Vault) with insurance up to $775 million. Nexo faced US regulatory investigations (resolved in 2023) and operates in compliance with local regulations in Europe.`,
      experience: `The Nexo app is modern and intuitive, letting you manage the card, track cashback, adjust your credit line, and monitor collateral assets. The card supports **Apple Pay** and **Google Pay**. Customer support is responsive and available in multiple languages.`,
    },
    de: {
      presentation: `Die **Nexo Card** funktioniert anders als andere Krypto-Karten: Anstatt Ihre Kryptos zu verkaufen, gewährt Nexo Ihnen eine **Kreditlinie**, die durch Ihre Vermögenswerte als Sicherheit gedeckt ist. Sie geben in Euro aus, Nexo zahlt für Sie, und Sie bezahlen Nexo in Ihrem eigenen Tempo zurück (mit Zinsen, wenn Sie nicht sofort zurückzahlen möchten). Ihre Kryptos bleiben in Ihrem Portfolio und arbeiten weiter für Sie.`,
      cashback: `Der Cashback beträgt **2 % in BTC oder NEXO** auf alle Transaktionen, ohne Mindesteinkauf oder Staking erforderlich. Wenn Sie mindestens 10 % Ihres Portfolios in NEXO halten, schalten Sie einen verbesserten NEXO-Cashback-Satz frei. Die BTC-Cashback-Option ist besonders attraktiv für langfristige Investoren, die passiv Bitcoin durch tägliche Einkäufe ansammeln möchten.`,
      frais: `**0 € Jahresgebühr**. Keine Fremdwährungsgebühren (abhängig von Ihrer Treuestufe). Zinsen auf die Kreditlinie variieren je nach LTV-Ratio (Loan-to-Value) und Treuestufe. Wenn Sie sofort nach jeder Transaktion zurückzahlen (Debit-Modus), fallen keine Zinsen an.`,
      securite: `Nexo ist in Europa reguliert und hält Lizenzen in mehreren Ländern. Die Plattform verwendet institutionelle Custody-Lösungen (BitGo, Ledger Vault) mit einer Versicherung bis zu 775 Millionen Dollar. Nexo stand vor US-Regulierungsuntersuchungen (beigelegt 2023) und arbeitet in Europa in Übereinstimmung mit lokalen Vorschriften.`,
      experience: `Die Nexo-App ist modern und intuitiv und ermöglicht Kartenverwaltung, Cashback-Tracking, Kreditlinieneinstellung und Überwachung von Sicherheiten. Die Karte unterstützt **Apple Pay** und **Google Pay**. Der Kundensupport ist reaktiv und in mehreren Sprachen verfügbar.`,
    },
    es: {
      presentation: `La **Nexo Card** funciona de manera diferente a otras tarjetas crypto: en lugar de vender tu crypto para pagar, Nexo te concede una **línea de crédito** garantizada por tus activos como colateral. Gastas en euros, Nexo paga en tu nombre, y tú devuelves a Nexo a tu propio ritmo (con intereses si decides no devolver de inmediato). Tus cryptos permanecen en tu cartera y siguen trabajando para ti.`,
      cashback: `El cashback es del **2 % en BTC o NEXO** en todas las transacciones, sin gasto mínimo ni staking requerido. Si mantienes al menos el 10 % de tu cartera en NEXO, desbloqueas una tasa de cashback NEXO mejorada. La opción de cashback en BTC es especialmente atractiva para inversores a largo plazo que buscan acumular Bitcoin pasivamente.`,
      frais: `**0 € de comisión anual**. Sin comisiones de conversión de divisas extranjeras (según tu nivel de fidelidad). Los intereses en la línea de crédito varían según el ratio LTV (Loan-to-Value) y el nivel de fidelidad. Si devuelves inmediatamente tras cada transacción (modo débito), no se cobran intereses.`,
      securite: `Nexo está regulado en Europa y tiene licencias en varios países. La plataforma utiliza soluciones de custodia institucional (BitGo, Ledger Vault) con un seguro de hasta 775 millones de dólares. Nexo enfrentó investigaciones regulatorias en EE.UU. (resueltas en 2023) y opera en cumplimiento con las regulaciones locales en Europa.`,
      experience: `La app de Nexo es moderna e intuitiva, permitiendo gestionar la tarjeta, rastrear el cashback, ajustar la línea de crédito y monitorizar los activos de colateral. La tarjeta es compatible con **Apple Pay** y **Google Pay**. El soporte al cliente es reactivo y está disponible en varios idiomas.`,
    },
    it: {
      presentation: `La **Nexo Card** funziona diversamente dalle altre carte crypto: invece di vendere le tue crypto per pagare, Nexo ti concede una **linea di credito** garantita dai tuoi asset come collaterale. Spendi in euro, Nexo paga per conto tuo, e rimborsi Nexo al tuo ritmo (con interessi se scegli di non rimborsare immediatamente). Le tue crypto rimangono nel portafoglio e continuano a lavorare per te.`,
      cashback: `Il cashback è del **2% in BTC o NEXO** su tutte le transazioni, senza spesa minima o staking richiesto. Se detieni almeno il 10% del tuo portafoglio in NEXO, sblocchi un tasso di cashback NEXO migliorato. L'opzione di cashback in BTC è particolarmente attraente per gli investitori a lungo termine che vogliono accumulare Bitcoin passivamente.`,
      frais: `**0 € di commissioni annuali**. Nessuna commissione di conversione valuta estera (a seconda del livello fedeltà). Gli interessi sulla linea di credito variano in base al ratio LTV (Loan-to-Value) e al livello fedeltà. Se rimborsi immediatamente dopo ogni transazione (modalità debito), non vengono addebitati interessi.`,
      securite: `Nexo è regolamentata in Europa e detiene licenze in più paesi. La piattaforma utilizza soluzioni di custodia istituzionale (BitGo, Ledger Vault) con un'assicurazione fino a 775 milioni di dollari. Nexo ha affrontato indagini regolamentari negli USA (risolte nel 2023) e opera in conformità con le normative locali in Europa.`,
      experience: `L'app Nexo è moderna e intuitiva, permettendo di gestire la carta, monitorare il cashback, regolare la linea di credito e supervisionare gli asset collaterali. La carta supporta **Apple Pay** e **Google Pay**. Il supporto clienti è reattivo e disponibile in più lingue.`,
    },
  },

  // ──────────────────────────────────────────── BITPANDA ──
  'bitpanda-card': {
    en: {
      presentation: `**Bitpanda** is an Austrian fintech founded in 2014, one of the first crypto platforms in Europe. The **Bitpanda Card** is a prepaid Visa that lets you spend your crypto at any Visa-accepting merchant. Bitpanda holds a European banking licence, placing it among the most secure crypto platforms on the continent.`,
      cashback: `The Bitpanda Card offers **1% cashback in BEST** (Bitpanda Ecosystem Token) on all spending. By holding a certain BEST balance, you can unlock additional platform benefits (reduced fees, priority access). BEST can be converted to other cryptos or euros on the Bitpanda platform.`,
      frais: `**€0 annual fee** and **€0 card issuance fee**. Foreign currency transactions are converted at market rate with a competitive spread. ATM withdrawals are possible with variable fees depending on amount and frequency.`,
      securite: `Bitpanda is **one of the best-regulated crypto platforms in Europe**: it holds a payment service provider licence (PSD2), has obtained regulatory approval in several EU countries, and holds a banking licence in Austria. The platform has never suffered a major hack since its founding in 2014. Funds stored in cold storage with insurance.`,
      experience: `The Bitpanda app is intuitive and available in multiple languages. It lets you manage the card, view transaction history, and track your asset portfolio. The card is compatible with **Apple Pay** and **Google Pay**. Customer support is available via email and chat, with a multilingual team.`,
    },
    de: {
      presentation: `**Bitpanda** ist ein österreichisches Fintech, das 2014 gegründet wurde und zu den ersten Krypto-Plattformen in Europa gehört. Die **Bitpanda Card** ist eine Prepaid-Visa, mit der Sie Ihre Kryptos bei allen Visa-akzeptierenden Händlern ausgeben können. Bitpanda verfügt über eine europäische Banklizenz und gehört damit zu den sichersten Krypto-Plattformen des Kontinents.`,
      cashback: `Die Bitpanda Card bietet **1 % Cashback in BEST** (Bitpanda Ecosystem Token) auf alle Ausgaben. Durch das Halten eines bestimmten BEST-Guthabens können Sie zusätzliche Plattformvorteile freischalten (reduzierte Gebühren, Prioritätszugang). BEST kann auf der Bitpanda-Plattform in andere Kryptos oder Euro konvertiert werden.`,
      frais: `**0 € Jahresgebühr** und **0 € Kartenausstellungsgebühr**. Fremdwährungstransaktionen werden zum Marktpreis mit wettbewerbsfähigem Spread konvertiert. Geldautomaten-Abhebungen sind mit variablen Gebühren je nach Betrag und Häufigkeit möglich.`,
      securite: `Bitpanda ist **eine der am besten regulierten Krypto-Plattformen in Europa**: Sie hält eine Zahlungsdienstleisterlizenz (PSD2), hat in mehreren EU-Ländern Genehmigungen erhalten und besitzt eine Banklizenz in Österreich. Die Plattform hat seit ihrer Gründung 2014 keinen großen Hack erlitten. Gelder in Cold Storage mit Versicherung gesichert.`,
      experience: `Die Bitpanda-App ist intuitiv und in mehreren Sprachen verfügbar. Sie ermöglicht Kartenverwaltung, Transaktionshistorie und Portfolio-Tracking. Die Karte ist mit **Apple Pay** und **Google Pay** kompatibel. Kundensupport per E-Mail und Chat mit mehrsprachigem Team.`,
    },
    es: {
      presentation: `**Bitpanda** es una fintech austriaca fundada en 2014, una de las primeras plataformas crypto en Europa. La **Bitpanda Card** es una Visa prepago que permite gastar crypto en cualquier comercio que acepte Visa. Bitpanda tiene una licencia bancaria europea, posicionándola entre las plataformas crypto más seguras del continente.`,
      cashback: `La Bitpanda Card ofrece un **1 % de cashback en BEST** (Bitpanda Ecosystem Token) en todos los gastos. Manteniendo cierto saldo en BEST, puedes desbloquear ventajas adicionales en la plataforma (comisiones reducidas, acceso prioritario). BEST puede convertirse en otras cryptos o euros en la plataforma Bitpanda.`,
      frais: `**0 € de comisión anual** y **0 € de emisión de tarjeta**. Las transacciones en divisas extranjeras se convierten al precio de mercado con un diferencial competitivo. Los retiros en cajero son posibles con comisiones variables según importe y frecuencia.`,
      securite: `Bitpanda es **una de las plataformas crypto mejor reguladas de Europa**: tiene licencia de proveedor de servicios de pago (PSD2), ha obtenido aprobación regulatoria en varios países de la UE y tiene licencia bancaria en Austria. La plataforma nunca ha sufrido un hackeo importante desde su fundación en 2014. Fondos almacenados en cold storage con seguro.`,
      experience: `La app de Bitpanda es intuitiva y está disponible en varios idiomas. Permite gestionar la tarjeta, ver el historial de transacciones y rastrear la cartera de activos. La tarjeta es compatible con **Apple Pay** y **Google Pay**. Soporte al cliente disponible por email y chat con equipo multilingüe.`,
    },
    it: {
      presentation: `**Bitpanda** è una fintech austriaca fondata nel 2014, una delle prime piattaforme crypto in Europa. La **Bitpanda Card** è una Visa prepagata che permette di spendere le tue crypto presso qualsiasi esercente che accetta Visa. Bitpanda detiene una licenza bancaria europea, posizionandola tra le piattaforme crypto più sicure del continente.`,
      cashback: `La Bitpanda Card offre **1% di cashback in BEST** (Bitpanda Ecosystem Token) su tutte le spese. Detenendo un certo saldo in BEST, puoi sbloccare vantaggi aggiuntivi sulla piattaforma (commissioni ridotte, accesso prioritario). BEST può essere convertito in altre crypto o euro sulla piattaforma Bitpanda.`,
      frais: `**0 € di commissioni annuali** e **0 € di emissione carta**. Le transazioni in valuta estera vengono convertite al prezzo di mercato con uno spread competitivo. I prelievi ATM sono possibili con commissioni variabili in base all'importo e alla frequenza.`,
      securite: `Bitpanda è **una delle piattaforme crypto meglio regolamentate in Europa**: detiene una licenza di fornitore di servizi di pagamento (PSD2), ha ottenuto approvazioni regolamentari in diversi paesi UE e detiene una licenza bancaria in Austria. La piattaforma non ha mai subito un hack importante dalla sua fondazione nel 2014. Fondi conservati in cold storage con assicurazione.`,
      experience: `L'app Bitpanda è intuitiva e disponibile in più lingue. Permette di gestire la carta, visualizzare la cronologia delle transazioni e monitorare il portafoglio di asset. La carta è compatibile con **Apple Pay** e **Google Pay**. Supporto clienti disponibile via email e chat con team multilingue.`,
    },
  },

  // ──────────────────────────────────────────── WIREX ──
  'wirex-card': {
    en: {
      presentation: `**Wirex** is a British fintech founded in 2014, specialising in multi-currency accounts and crypto payments. The **Wirex Card** (Visa) is available in over 150 countries and supports more than 150 cryptocurrencies and fiat currencies. It targets international users seeking a comprehensive multi-currency solution.`,
      cashback: `Wirex cashback (called **Cryptoback™**) varies by plan: Standard plan (free): 0.5% in WXT · Premium plan (€4.99/month): 1.5% in WXT · Elite plan (€9.99/month): up to 8% in WXT on selected categories. WXT is Wirex's native token — you need to hold it to access the best rates.`,
      frais: `Fees depend on plan. The Standard plan is **free** but with limited benefits. Premium and Elite cost €4.99 and €9.99/month respectively. Free ATM withdrawals up to €200/month on Standard. Foreign currency transactions benefit from competitive exchange rates.`,
      securite: `Wirex is regulated by the FCA in the UK and operates with licences in the EU. The platform uses end-to-end encryption and 2FA. Funds are segregated (not used for platform activities). Wirex has experienced some minor operational incidents in the past but has not suffered a major hack.`,
      experience: `The Wirex app is functional but less modern than Crypto.com or Binance. It allows management of 150+ currency accounts, instant conversion, and cashback tracking. The card is compatible with **Apple Pay**. Customer support is primarily in English with variable response times.`,
    },
    de: {
      presentation: `**Wirex** ist ein britisches Fintech, das 2014 gegründet wurde und auf Multi-Währungs-Konten und Krypto-Zahlungen spezialisiert ist. Die **Wirex Card** (Visa) ist in über 150 Ländern verfügbar und unterstützt mehr als 150 Kryptowährungen und Fiat-Währungen. Sie richtet sich an internationale Nutzer, die eine umfassende Multi-Währungs-Lösung suchen.`,
      cashback: `Der Wirex-Cashback (genannt **Cryptoback™**) variiert je nach Plan: Standard-Plan (kostenlos): 0,5 % in WXT · Premium-Plan (4,99 €/Monat): 1,5 % in WXT · Elite-Plan (9,99 €/Monat): bis zu 8 % in WXT in ausgewählten Kategorien. WXT ist Wirex' nativer Token — Sie müssen ihn halten, um auf die besten Konditionen zuzugreifen.`,
      frais: `Die Gebühren hängen vom Plan ab. Der Standard-Plan ist **kostenlos**, aber mit begrenzten Vorteilen. Premium und Elite kosten jeweils 4,99 € und 9,99 €/Monat. Kostenlose Geldautomaten-Abhebungen bis 200 €/Monat beim Standard-Plan. Fremdwährungstransaktionen profitieren von wettbewerbsfähigen Wechselkursen.`,
      securite: `Wirex wird von der FCA in Großbritannien reguliert und betreibt Lizenzen in der EU. Die Plattform verwendet End-to-End-Verschlüsselung und 2FA. Gelder sind segregiert (werden nicht für Plattformaktivitäten verwendet). Wirex hatte in der Vergangenheit einige kleinere operative Zwischenfälle, hat aber keinen großen Hack erlitten.`,
      experience: `Die Wirex-App ist funktional, aber weniger modern als Crypto.com oder Binance. Sie ermöglicht die Verwaltung von 150+ Währungskonten, Sofortkonvertierung und Cashback-Tracking. Die Karte ist mit **Apple Pay** kompatibel. Kundensupport hauptsächlich auf Englisch mit variablen Reaktionszeiten.`,
    },
    es: {
      presentation: `**Wirex** es una fintech británica fundada en 2014, especializada en cuentas multidivisa y pagos crypto. La **Wirex Card** (Visa) está disponible en más de 150 países y soporta más de 150 criptomonedas y divisas fiat. Está dirigida a usuarios internacionales que buscan una solución multidivisa completa.`,
      cashback: `El cashback de Wirex (llamado **Cryptoback™**) varía según el plan: Plan Estándar (gratuito): 0,5 % en WXT · Plan Premium (4,99 €/mes): 1,5 % en WXT · Plan Elite (9,99 €/mes): hasta 8 % en WXT en categorías seleccionadas. WXT es el token nativo de Wirex — debes mantenerlo para acceder a las mejores tasas.`,
      frais: `Las comisiones dependen del plan. El plan Estándar es **gratuito** pero con ventajas limitadas. Los planes Premium y Elite cuestan 4,99 € y 9,99 €/mes respectivamente. Retiros gratuitos en cajero hasta 200 €/mes en el plan Estándar. Las transacciones en divisas extranjeras se benefician de tipos de cambio competitivos.`,
      securite: `Wirex está regulado por la FCA en el Reino Unido y opera con licencias en la UE. La plataforma utiliza cifrado de extremo a extremo y 2FA. Los fondos están segregados (no se utilizan para actividades de la plataforma). Wirex ha tenido algunos incidentes operativos menores en el pasado, pero no ha sufrido un hackeo importante.`,
      experience: `La app de Wirex es funcional pero menos moderna que la de Crypto.com o Binance. Permite gestionar más de 150 cuentas en divisas, conversión instantánea y seguimiento del cashback. La tarjeta es compatible con **Apple Pay**. El soporte al cliente está principalmente en inglés con tiempos de respuesta variables.`,
    },
    it: {
      presentation: `**Wirex** è una fintech britannica fondata nel 2014, specializzata in conti multi-valuta e pagamenti crypto. La **Wirex Card** (Visa) è disponibile in oltre 150 paesi e supporta più di 150 criptovalute e valute fiat. Si rivolge agli utenti internazionali che cercano una soluzione multi-valuta completa.`,
      cashback: `Il cashback Wirex (chiamato **Cryptoback™**) varia per piano: Piano Standard (gratuito): 0,5% in WXT · Piano Premium (4,99 €/mese): 1,5% in WXT · Piano Elite (9,99 €/mese): fino all'8% in WXT in categorie selezionate. WXT è il token nativo di Wirex — è necessario detenerlo per accedere alle migliori tariffe.`,
      frais: `Le commissioni dipendono dal piano. Il piano Standard è **gratuito** ma con vantaggi limitati. Premium ed Elite costano rispettivamente 4,99 € e 9,99 €/mese. Prelievi ATM gratuiti fino a 200 €/mese con il piano Standard. Le transazioni in valuta estera beneficiano di tassi di cambio competitivi.`,
      securite: `Wirex è regolamentata dalla FCA nel Regno Unito e opera con licenze nell'UE. La piattaforma utilizza crittografia end-to-end e 2FA. I fondi sono segregati (non utilizzati per le attività della piattaforma). Wirex ha avuto alcuni incidenti operativi minori in passato ma non ha subito un hack importante.`,
      experience: `L'app Wirex è funzionale ma meno moderna di Crypto.com o Binance. Permette la gestione di 150+ conti valutari, conversione istantanea e monitoraggio del cashback. La carta è compatibile con **Apple Pay**. Il supporto clienti è principalmente in inglese con tempi di risposta variabili.`,
    },
  },

  // ──────────────────────────────────────────── LEDGER ──
  'ledger-card': {
    en: {
      presentation: `The **Ledger Card** is a collaboration between Ledger (maker of the world's most popular hardware wallet) and Baanx (payment fintech). It lets you spend crypto while maintaining a higher level of asset control than any other crypto card on the market. The card is a Visa available in the EU.`,
      cashback: `Cashback is **1% in BTC** (default) or **2% in LDG** (Ledger token) if you hold a minimum LDG balance. The BTC cashback option is particularly interesting for long-term investors looking to passively accumulate Bitcoin through their everyday spending.`,
      frais: `**€0 annual fee**. Transactions are converted at market rate at time of payment. ATM withdrawal and foreign currency conversion fees are competitive. No inactivity fees.`,
      securite: `The Ledger Card stands out for its exceptional security: assets can be stored on your **Ledger hardware wallet** (physical cold storage), eliminating exchange hack risk. It is the only card on the market to offer this feature. Ledger is the global leader in hardware wallets with over 6 million devices sold.`,
      experience: `Initial setup is more complex than other cards (requires a Ledger hardware wallet and the Ledger Live app). Once configured, usage is smooth. The card is compatible with **Apple Pay** and **Google Pay**. Ledger support is available in multiple languages.`,
    },
    de: {
      presentation: `Die **Ledger Card** ist eine Zusammenarbeit zwischen Ledger (Hersteller des weltweit beliebtesten Hardware Wallets) und Baanx (Zahlungsfintech). Sie ermöglicht es, Kryptos auszugeben und dabei einen höheren Grad an Asset-Kontrolle als jede andere Krypto-Karte auf dem Markt zu behalten. Die Karte ist eine in der EU verfügbare Visa.`,
      cashback: `Der Cashback beträgt **1 % in BTC** (Standard) oder **2 % in LDG** (Ledger-Token), wenn Sie ein Mindest-LDG-Guthaben halten. Die BTC-Cashback-Option ist besonders interessant für langfristige Investoren, die passiv Bitcoin durch ihre täglichen Ausgaben ansammeln möchten.`,
      frais: `**0 € Jahresgebühr**. Transaktionen werden zum Marktpreis zum Zeitpunkt der Zahlung konvertiert. Geldautomaten-Abhebungen und Fremdwährungsgebühren sind wettbewerbsfähig. Keine Inaktivitätsgebühren.`,
      securite: `Die Ledger Card zeichnet sich durch außergewöhnliche Sicherheit aus: Vermögenswerte können auf Ihrem **Ledger Hardware Wallet** (physischer Cold Storage) gespeichert werden, wodurch das Exchange-Hack-Risiko eliminiert wird. Es ist die einzige Karte auf dem Markt mit dieser Funktion. Ledger ist der weltweite Marktführer bei Hardware Wallets mit über 6 Millionen verkauften Geräten.`,
      experience: `Die Ersteinrichtung ist komplexer als bei anderen Karten (erfordert ein Ledger Hardware Wallet und die Ledger Live App). Nach der Konfiguration ist die Nutzung reibungslos. Die Karte ist mit **Apple Pay** und **Google Pay** kompatibel. Ledger Support ist in mehreren Sprachen verfügbar.`,
    },
    es: {
      presentation: `La **Ledger Card** es una colaboración entre Ledger (fabricante del hardware wallet más popular del mundo) y Baanx (fintech de pagos). Permite gastar crypto manteniendo un mayor nivel de control sobre los activos que cualquier otra tarjeta crypto del mercado. La tarjeta es una Visa disponible en la UE.`,
      cashback: `El cashback es del **1 % en BTC** (por defecto) o del **2 % en LDG** (token Ledger) si mantienes un saldo mínimo de LDG. La opción de cashback en BTC es especialmente interesante para inversores a largo plazo que buscan acumular Bitcoin pasivamente a través de sus gastos cotidianos.`,
      frais: `**0 € de comisión anual**. Las transacciones se convierten al precio de mercado en el momento del pago. Las comisiones de retiro en cajero y conversión de divisas son competitivas. Sin comisiones de inactividad.`,
      securite: `La Ledger Card destaca por su seguridad excepcional: los activos pueden almacenarse en tu **hardware wallet Ledger** (cold storage físico), eliminando el riesgo de hackeo del exchange. Es la única tarjeta del mercado que ofrece esta función. Ledger es el líder mundial en hardware wallets con más de 6 millones de dispositivos vendidos.`,
      experience: `La configuración inicial es más compleja que otras tarjetas (requiere un hardware wallet Ledger y la app Ledger Live). Una vez configurada, el uso es fluido. La tarjeta es compatible con **Apple Pay** y **Google Pay**. El soporte de Ledger está disponible en varios idiomas.`,
    },
    it: {
      presentation: `La **Ledger Card** è una collaborazione tra Ledger (produttore del hardware wallet più popolare al mondo) e Baanx (fintech di pagamento). Permette di spendere crypto mantenendo un livello di controllo sugli asset superiore a qualsiasi altra carta crypto sul mercato. La carta è una Visa disponibile nell'UE.`,
      cashback: `Il cashback è dell'**1% in BTC** (predefinito) o del **2% in LDG** (token Ledger) se si detiene un saldo minimo di LDG. L'opzione di cashback in BTC è particolarmente interessante per gli investitori a lungo termine che vogliono accumulare Bitcoin passivamente attraverso le spese quotidiane.`,
      frais: `**0 € di commissioni annuali**. Le transazioni vengono convertite al prezzo di mercato al momento del pagamento. Le commissioni di prelievo ATM e conversione valuta estera sono competitive. Nessuna commissione di inattività.`,
      securite: `La Ledger Card si distingue per la sua sicurezza eccezionale: gli asset possono essere conservati sul tuo **hardware wallet Ledger** (cold storage fisico), eliminando il rischio di hack all'exchange. È l'unica carta sul mercato a offrire questa funzionalità. Ledger è il leader mondiale degli hardware wallet con oltre 6 milioni di dispositivi venduti.`,
      experience: `La configurazione iniziale è più complessa delle altre carte (richiede un hardware wallet Ledger e l'app Ledger Live). Una volta configurata, l'utilizzo è fluido. La carta è compatibile con **Apple Pay** e **Google Pay**. Il supporto Ledger è disponibile in più lingue.`,
    },
  },
};

// Returns translated sections, or null if not available (caller falls back to FR)
export function getReviewSections(slug: string, lang: string): CardReviewSections | null {
  return CARD_REVIEWS_SECTIONS[slug]?.[lang] || null;
}
