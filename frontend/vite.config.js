import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Add an alias if needed, but generally, you shouldn't need it for recharts
      'recharts': 'recharts/dist/umd/Recharts.min.js',
    },
  },
  build: {
    rollupOptions: {
      external: ['recharts'], // If you want to externalize recharts
    },
  },
})
