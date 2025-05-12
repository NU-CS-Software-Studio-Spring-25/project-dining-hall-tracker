import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Use esbuild minifier instead of terser
    minify: 'esbuild',
    // Generate source maps for production
    sourcemap: true,
  },
})
