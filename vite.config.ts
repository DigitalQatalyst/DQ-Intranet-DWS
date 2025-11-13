import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // BACKEND CONFIG COMMENTED OUT - USING FRONTEND MOCK DATA ONLY
  /*
  define: {
    // Expose REACT_APP_ environment variables to the client
    'import.meta.env.REACT_APP_SUPABASE_URL': JSON.stringify(process.env.REACT_APP_SUPABASE_URL),
    'import.meta.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(process.env.REACT_APP_SUPABASE_ANON_KEY),
  },
  */
  server: {
    port: 3004,
    strictPort: true,
    host: 'localhost',
    proxy: {
      '/api': 'http://localhost:5174',
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
})
