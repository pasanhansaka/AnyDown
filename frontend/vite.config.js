import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/AnyDown/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'AnyDown Downloader',
        short_name: 'AnyDown',
        description: 'Download videos and MP3 from social media',
        theme_color: '#0f172a',
        icons: [
          {
            src: 'anydown_logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'anydown_logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'anydown_logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
