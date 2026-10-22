import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ensures relative asset paths compatible with root domains, Vercel, Netlify, and GitHub Pages subpaths
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 800
  }
});
