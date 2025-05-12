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
    // Ensure the build is optimized for production
    minify: 'terser',
    // Generate source maps for production
    sourcemap: true,
  },
})
