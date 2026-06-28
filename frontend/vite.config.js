import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Built into the Django app's tree so Railway serves both from one deploy,
    // regardless of how its root-directory setting scopes the build context.
    outDir: '../backend/frontend_dist',
    emptyOutDir: true,
  },
  server: {
    // Lets the frontend call relative /api/... paths in dev too, matching production
    // (where Django serves both from the same origin) — no CORS needed either way.
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
