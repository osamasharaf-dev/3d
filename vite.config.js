import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },

  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) return 'three-react'
          if (id.includes('/node_modules/three/')) return 'three-core'
          if (id.includes('framer-motion')) return 'framer'
          if (
            id.includes('react-dom') ||
            id.includes('react-router-dom') ||
            (id.includes('node_modules/react/') && !id.includes('react-three'))
          ) {
            return 'react-vendor'
          }
          if (id.includes('@supabase')) return 'supabase'
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },

  optimizeDeps: {
    include: [
      'framer-motion',
      'lodash.debounce',
    ],
    exclude: ['@splinetool/react-spline'],
  },
})
