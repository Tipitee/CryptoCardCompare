#!/bin/bash
set -e
cd "$(dirname "$0")"

rm -f scripts/_find-orphans.mjs

git add -A
git commit -m "Q4: LegalPage × 7 langs + A2 contrast (slate-500→400) + fix-orphan-posts script"
git push

set -a && source .env && set +a

node scripts/fix-orphan-posts.mjs --dry-run

echo ""
echo "Les orphelins sont listés ci-dessus. Appuie sur Entrée pour générer les traductions, ou Ctrl+C pour annuler."
read

node scripts/fix-orphan-posts.mjs
node scripts/gen-blog-sitemap.mjs

git add -A
git commit -m "L7: fix orphan posts + regen sitemap-blog"
git push
