import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      server: {
        host: '0.0.0.0'
      },
      registerType: 'autoUpdate',
      manifest,
      workbox: {
        runtimeCaching: [
          {
            // Caching delle chiamate API GET
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              cacheableResponse: {
                statuses: [200], // Solo risposte con stato HTTP 200
              }
            }
          }
        ]
      }
    
    })
  ]
})