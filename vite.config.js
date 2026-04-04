import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    exclude: ['vuetify'], 
  },
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1200,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/pdbtm': {
        target:       'https://pdbtm.unitmp.org',
        changeOrigin: true,
        rewrite:      (path) => path.replace(/^\/pdbtm/, ''),
        // Needed so the browser trusts the CSS as same-origin → cssRules accessible
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
  },
})
