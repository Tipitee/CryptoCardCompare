import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendors
          if (id.includes('node_modules')) {
            if (/[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/.test(id)) return 'vendor-react';
            if (id.includes('node_modules/recharts')) return 'vendor-charts';
            if (/node_modules[\\/](i18next|react-i18next|i18next-browser-languagedetector)/.test(id)) return 'vendor-i18n';
            if (id.includes('node_modules/@supabase')) return 'vendor-supabase';
            return undefined;
          }
          // Heavy static data modules → their own async chunks (kept out of the entry,
          // cached independently, loaded only by the routes that import them).
          if (id.includes('/src/data/brandConfig')) return 'data-brands';
          if (id.includes('/src/data/alternativesContent')) return 'data-alternatives';
          if (id.includes('/src/data/cardReviewsI18n')) return 'data-reviews';
          if (id.includes('/src/data/cryptoContentTranslations')) return 'data-crypto';
          return undefined;
        },
      },
    },
  },
});
