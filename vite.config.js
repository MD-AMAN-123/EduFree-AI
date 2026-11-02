import { defineConfig } from 'vite';

export default defineConfig({
  // Point Vite to the frontend folder as the project root
  root: 'frontend',

  // Look for .env in the project root directory
  envDir: '../',

  build: {
    // Output to dist/ at the project root (outside frontend/)
    outDir: '../dist',
    emptyOutDir: true
  },

  server: {
    port: 5173
  },

  preview: {
    port: 4173
  }
});

