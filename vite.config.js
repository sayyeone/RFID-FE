import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tailwindcss(),
      react(),
    ],

    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'https://sistem-penghitungan-piring-menggunakan-rfid-production.up.railway.app',
          changeOrigin: true,
        }
      }
    }
  }
})
