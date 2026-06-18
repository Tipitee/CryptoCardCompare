-- Maillage blog → thématiques : ajouter CTA en fin de contenu
-- pour les 10 articles travel + rewards

-- ── TRAVEL ────────────────────────────────────────────────────────────────

UPDATE blog_posts SET content = content || '
<div style="margin-top:2rem;padding:1rem 1.25rem;background:#0f172a;border:1px solid #1e3a5f;border-radius:0.75rem;">
  <p style="margin:0;font-size:0.95rem;color:#94a3b8;">👉 Comparer les meilleures cartes crypto pour voyager : <a href="/fr/carte-crypto-voyage" style="color:#22d3ee;text-decoration:underline;">voir le comparatif complet →</a></p>
</div>'
WHERE slug = 'carte-crypto-voyage-guide-complet' AND lang = 'fr';

UPDATE blog_posts SET content = content || '
<div style="margin-top:2rem;padding:1rem 1.25rem;background:#0f172a;border:1px solid #1e3a5f;border-radius:0.75rem;">
  <p style="margin:0;font-size:0.95rem;color:#94a3b8;">👉 Die besten Krypto-Reisekarten vergleichen: <a href="/de/krypto-karte-reise" style="color:#22d3ee;text-decoration:underline;">vollständigen Vergleich ansehen →</a></p>
</div>'
WHERE slug = 'krypto-karte-reise-kompletter-guide' AND lang = 'de';

UPDATE blog_posts SET content = content || '
<div style="margin-top:2rem;padding:1rem 1.25rem;background:#0f172a;border:1px solid #1e3a5f;border-radius:0.75rem;">
  <p style="margin:0;font-size:0.95rem;color:#94a3b8;">👉 Comparar las mejores tarjetas crypto para viaje: <a href="/es/tarjeta-cripto-viaje" style="color:#22d3ee;text-decoration:underline;">ver comparativa completa →</a></p>
</div>'
WHERE slug = 'tarjeta-crypto-viaje-guia-completa' AND lang = 'es';

UPDATE blog_posts SET content = content || '
<div style="margin-top:2rem;padding:1rem 1.25rem;background:#0f172a;border:1px solid #1e3a5f;border-radius:0.75rem;">
  <p style="margin:0;font-size:0.95rem;color:#94a3b8;">👉 Confrontare le migliori carte crypto per viaggiare: <a href="/it/carta-cripto-viaggio" style="color:#22d3ee;text-decoration:underline;">vedi il confronto completo →</a></p>
</div>'
WHERE slug = 'carta-crypto-viaggio-guida-completa' AND lang = 'it';

UPDATE blog_posts SET content = content || '
<div style="margin-top:2rem;padding:1rem 1.25rem;background:#0f172a;border:1px solid #1e3a5f;border-radius:0.75rem;">
  <p style="margin:0;font-size:0.95rem;color:#94a3b8;">👉 Compare the best crypto cards for travel: <a href="/en/crypto-card-travel" style="color:#22d3ee;text-decoration:underline;">see full comparison →</a></p>
</div>'
WHERE slug = 'crypto-card-travel-complete-guide' AND lang = 'en';

-- ── REWARDS ───────────────────────────────────────────────────────────────

UPDATE blog_posts SET content = content || '
<div style="margin-top:2rem;padding:1rem 1.25rem;background:#0f172a;border:1px solid #1e3a5f;border-radius:0.75rem;">
  <p style="margin:0;font-size:0.95rem;color:#94a3b8;">👉 Comparer les meilleures cartes crypto avec récompenses : <a href="/fr/carte-crypto-recompenses" style="color:#22d3ee;text-decoration:underline;">voir le comparatif complet →</a></p>
</div>'
WHERE slug = 'carte-crypto-recompenses-avantages-guide' AND lang = 'fr';

UPDATE blog_posts SET content = content || '
<div style="margin-top:2rem;padding:1rem 1.25rem;background:#0f172a;border:1px solid #1e3a5f;border-radius:0.75rem;">
  <p style="margin:0;font-size:0.95rem;color:#94a3b8;">👉 Die besten Krypto-Karten mit Prämien vergleichen: <a href="/de/krypto-karte-praemien" style="color:#22d3ee;text-decoration:underline;">vollständigen Vergleich ansehen →</a></p>
</div>'
WHERE slug = 'krypto-karte-praemien-vorteile-guide' AND lang = 'de';

UPDATE blog_posts SET content = content || '
<div style="margin-top:2rem;padding:1rem 1.25rem;background:#0f172a;border:1px solid #1e3a5f;border-radius:0.75rem;">
  <p style="margin:0;font-size:0.95rem;color:#94a3b8;">👉 Comparar las mejores tarjetas crypto con recompensas: <a href="/es/tarjeta-cripto-recompensas" style="color:#22d3ee;text-decoration:underline;">ver comparativa completa →</a></p>
</div>'
WHERE slug = 'tarjeta-crypto-recompensas-ventajas-guia' AND lang = 'es';

UPDATE blog_posts SET content = content || '
<div style="margin-top:2rem;padding:1rem 1.25rem;background:#0f172a;border:1px solid #1e3a5f;border-radius:0.75rem;">
  <p style="margin:0;font-size:0.95rem;color:#94a3b8;">👉 Confrontare le migliori carte crypto con premi: <a href="/it/carta-cripto-premi" style="color:#22d3ee;text-decoration:underline;">vedi il confronto completo →</a></p>
</div>'
WHERE slug = 'carta-crypto-premi-vantaggi-guida' AND lang = 'it';

UPDATE blog_posts SET content = content || '
<div style="margin-top:2rem;padding:1rem 1.25rem;background:#0f172a;border:1px solid #1e3a5f;border-radius:0.75rem;">
  <p style="margin:0;font-size:0.95rem;color:#94a3b8;">👉 Compare the best crypto cards for rewards: <a href="/en/crypto-card-rewards" style="color:#22d3ee;text-decoration:underline;">see full comparison →</a></p>
</div>'
WHERE slug = 'crypto-card-rewards-benefits-guide' AND lang = 'en';
