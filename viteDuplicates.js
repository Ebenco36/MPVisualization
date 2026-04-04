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
          target:        'https://pdbtm.unitmp.org',
          changeOrigin:  true,
          secure:        false,
          rewrite:       path => path.replace(/^\/pdbtm/, ''),
          timeout:       4000,        // ← abort after 4s
          proxyTimeout:  4000,        // ← upstream read timeout
          configure: (proxy) => {
            proxy.on('error', (err, req, res) => {
              console.warn('[proxy:pdbtm] upstream error:', err.message)
              if (!res.headersSent) {
                res.writeHead(503, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'PDBTM upstream unavailable' }))
              }
            })
          }
        },
      '/opm': {
        target:       'https://opm.phar.umich.edu',
        changeOrigin: true,
        secure:       false,
        rewrite:      path => path.replace(/^\/opm/, ''),
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.warn('[proxy:opm] upstream error:', err.message)
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'OPM upstream unavailable', code: 503 }))
            }
          })
        }
      },
      '/pdbe': {
        target:       'https://www.ebi.ac.uk',
        changeOrigin: true,
        secure:       false,
        rewrite:      path => path.replace(/^\/pdbe/, ''),
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.warn('[proxy:pdbe] upstream error:', err.message)
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'PDBe upstream unavailable', code: 503 }))
            }
          })
        }
      },
      '/rcsb': {
        target:       'https://files.rcsb.org',
        changeOrigin: true,
        secure:       false,
        rewrite:      path => path.replace(/^\/rcsb/, ''),
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.warn('[proxy:rcsb] upstream error:', err.message)
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'RCSB upstream unavailable', code: 503 }))
            }
          })
        }
      },
    }
  },
})
