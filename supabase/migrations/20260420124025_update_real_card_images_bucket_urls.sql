/*
  # Update real_card_image URLs from Supabase Storage bucket

  ## Summary
  Links each card to its corresponding real photo stored in the Supabase Storage bucket "card-images".

  ## Changes
  - `binance-standard` → binance-card.jpg
  - `bitpanda-card` → bitpanda-card.jpg
  - `coinbase-card` → coinbase-card.jpg
  - `crypto-com-frosted-rose` → cryptocom-frosted-rose-gold.jpg
  - `crypto-com-jade-green` → cryptocom-jade-green.jpg
  - `crypto-com-midnight-blue` → cryptocom-midnight-blue.jpg
  - `crypto-com-royal-indigo` → cryptocom-royal-indigo.jpg
  - `crypto-com-ruby-steel` → cryptocom-ruby-steel.jpg
  - `nexo-card` → nexo-card.png
  - `plutus-card` → plutus-card.jpeg
  - `wirex-elite` → wirex-elite-card.jpg

  ## Notes
  - klarpay-card, monolith-card, wirex-standard have no matching image in the bucket
  - bivial card.png and cryptocom-frosted-icy-white.jpg and cryptocom-obsidian.jpg
    do not have matching card rows — left unset until cards are added
*/

UPDATE cards
SET real_card_image = 'https://zulquoqrtmafwxfbjele.supabase.co/storage/v1/object/public/card-images/binance-card.jpg'
WHERE id = 'binance-standard';

UPDATE cards
SET real_card_image = 'https://zulquoqrtmafwxfbjele.supabase.co/storage/v1/object/public/card-images/bitpanda-card.jpg'
WHERE id = 'bitpanda-card';

UPDATE cards
SET real_card_image = 'https://zulquoqrtmafwxfbjele.supabase.co/storage/v1/object/public/card-images/coinbase-card.jpg'
WHERE id = 'coinbase-card';

UPDATE cards
SET real_card_image = 'https://zulquoqrtmafwxfbjele.supabase.co/storage/v1/object/public/card-images/cryptocom-frosted-rose-gold.jpg'
WHERE id = 'crypto-com-frosted-rose';

UPDATE cards
SET real_card_image = 'https://zulquoqrtmafwxfbjele.supabase.co/storage/v1/object/public/card-images/cryptocom-jade-green.jpg'
WHERE id = 'crypto-com-jade-green';

UPDATE cards
SET real_card_image = 'https://zulquoqrtmafwxfbjele.supabase.co/storage/v1/object/public/card-images/cryptocom-midnight-blue.jpg'
WHERE id = 'crypto-com-midnight-blue';

UPDATE cards
SET real_card_image = 'https://zulquoqrtmafwxfbjele.supabase.co/storage/v1/object/public/card-images/cryptocom-royal-indigo.jpg'
WHERE id = 'crypto-com-royal-indigo';

UPDATE cards
SET real_card_image = 'https://zulquoqrtmafwxfbjele.supabase.co/storage/v1/object/public/card-images/cryptocom-ruby-steel.jpg'
WHERE id = 'crypto-com-ruby-steel';

UPDATE cards
SET real_card_image = 'https://zulquoqrtmafwxfbjele.supabase.co/storage/v1/object/public/card-images/nexo-card.png'
WHERE id = 'nexo-card';

UPDATE cards
SET real_card_image = 'https://zulquoqrtmafwxfbjele.supabase.co/storage/v1/object/public/card-images/plutus-card.jpeg'
WHERE id = 'plutus-card';

UPDATE cards
SET real_card_image = 'https://zulquoqrtmafwxfbjele.supabase.co/storage/v1/object/public/card-images/wirex-elite-card.jpg'
WHERE id = 'wirex-elite';
