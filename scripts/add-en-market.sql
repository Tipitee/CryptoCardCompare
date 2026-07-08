-- ============================================================
-- DÉPRÉCIÉ — Ne pas exécuter
-- ============================================================
-- Ce script a été remplacé par fix-markets-post-audit.sql
-- qui effectue un audit complet et précis de tous les marchés.
--
-- L'ancien script ajoutait 'en' à toutes les cartes ayant 'fr' ou 'de',
-- ce qui aurait inclus à tort des cartes sans licence MiCA (ex. Binance).
-- ============================================================

-- Consulter fix-markets-post-audit.sql pour les corrections correctes.

-- Vérification de l'état actuel (lecture seule, sans modification) :
SELECT id, name, issuer, status, markets
FROM cards
ORDER BY issuer, name;
