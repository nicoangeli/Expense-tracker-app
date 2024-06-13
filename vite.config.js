// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'
// import manifest from './manifest.json'

// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       manifest,
//       workbox: {
//         runtimeCaching: [
//           {
//             // Cache Firebase SDK resources
//             urlPattern: ({ url }) => url.origin === 'https://www.gstatic.com' || url.origin === 'https://firebasestorage.googleapis.com',
//             handler: 'CacheFirst',
//             options: {
//               cacheName: 'firebase-sdk-cache',
//               expiration: {
//                 maxEntries: 20,
//                 maxAgeSeconds: 60 * 60 * 24 // 1 day
//               }
//             }
//           },
//           {
//             // Cache Firestore API calls
//             urlPattern: ({ url }) => url.origin === 'https://firestore.googleapis.com',
//             handler: 'NetworkFirst',
//             options: {
//               cacheName: 'firestore-api-cache',
//               expiration: {
//                 maxEntries: 50,
//                 maxAgeSeconds: 60 * 60 // 1 hour
//               }
//             }
//           }
//         ]
//       }
//     })
//   ]
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ registerType: 'autoUpdate' })
  ],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        // Aggiungi qui altri punti di ingresso, se necessario
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'dollar1.png' || assetInfo.name === 'dollar.png') {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    copyPublicDir: true
  }
})