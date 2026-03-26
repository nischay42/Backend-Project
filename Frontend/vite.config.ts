import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      proxy: {
        "/api/v1": env.VITE_API_URL,
      },
    },
    plugins: [react(),
      tailwindcss(),
    ],
  }
})
