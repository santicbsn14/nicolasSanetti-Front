import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/',
  optimizeDeps: {
    include: ['nombre-de-libreria-problematica'],
    exclude: ['otra-libreria'] // si es necesario
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    }
  }
})
