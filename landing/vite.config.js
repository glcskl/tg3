import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE задаётся в CI: на GitHub Pages сайт живёт в /tg3/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: { port: 5173 },
})
