import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: { cacheName: 'html-cache' }
          },
          {
            urlPattern: ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'asset-cache' }
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            }
          },
          {
            // Cache GET /api/* responses briefly for resilience offline
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            method: 'GET',
            options: { cacheName: 'api-cache', networkTimeoutSeconds: 3 }
          }
        ]
      },
      manifest: {
        name: 'Tasker',
        short_name: 'Tasker',
        description: 'Task management and tracking',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#111418',
        theme_color: '#1173d4',
        icons: [
          { src: '/favicon.ico', sizes: '16x16 24x24 32x32 48x48 64x64', type: 'image/x-icon' },
          { src: '/assets/images/veye-icon-new.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/assets/images/veye-icon-new.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: 'index.html', // Explicitly point to index.html file
    },
  },
});
