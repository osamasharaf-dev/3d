import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) return 'three-react'
          if (id.includes('/node_modules/three/')) return 'three-core'
          if (id.includes('framer-motion')) return 'framer'
          if (id.includes('react-dom') || id.includes('react-router-dom')) return 'react-vendor'
          if (id.includes('@supabase')) return 'supabase'
          if (id.includes('@emailjs')) return 'emailjs'
          if (id.includes('react-icons')) return 'icons'
          if (id.includes('gsap')) return 'gsap'
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    esbuildOptions: {
      legalComments: 'none',
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
})
