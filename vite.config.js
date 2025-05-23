import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {},
  },
  optimizeDeps: {
    exclude: ['vuetify'],
    // include: ['msw'],
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      // scss: {
      //   additionalData: `@use "@/assets/scss/main.scss";`,
      // },
    },
  },
  build: {
    sourcemap: false,
  },
  server: {
    host: '0.0.0.0',
    port: 5173, // Change this to the desired port
  },
})
