import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const DEV_HOST = process.env.VITE_DEV_HOST ?? '127.0.0.1'
const DEV_PORT = Number(process.env.VITE_DEV_PORT ?? 5173)
const PREVIEW_PORT = Number(process.env.VITE_PREVIEW_PORT ?? DEV_PORT)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: DEV_HOST,
    port: DEV_PORT,
    strictPort: false,
    proxy: {
      '/api': 'http://127.0.0.1:3002',
    },
  },
  preview: {
    host: DEV_HOST,
    port: PREVIEW_PORT,
    strictPort: false,
  },
})
