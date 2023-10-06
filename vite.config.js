import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // workaround to make hot reload work (doesn't work due to chakra)
  server: {
    watch: {
      usePolling: true,
    },
  },
})
