import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path. If you publish as https://<user>.github.io/ use '/'.
  // If you publish as https://<user>.github.io/<repo>/ set base to '/<repo>/'.
  base: '/',
})
