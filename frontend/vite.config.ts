import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  // Use absolute paths in production for proper asset loading
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Use esbuild minifier instead of terser
    minify: 'esbuild',
    // Generate source maps for production
    sourcemap: true,
    // Ensure assets are properly referenced
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'assets/[name]-[hash][extname]';
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Ensure we're not including any development-only code
    target: 'es2015',
    // Ensure proper chunking
    chunkSizeWarningLimit: 1000,
  },
})
