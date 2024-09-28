import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')
  return {

    plugins: [
      react(),
      legacy()
    ],
    define: {
      'process.env': env
    },
  }
})
