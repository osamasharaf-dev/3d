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
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three')) return 'three'
          if (id.includes('@react-three')) return 'fiber'
          if (id.includes('framer-motion')) return 'framer'
          if (id.includes('@splinetool')) return 'spline'
          if (id.includes('gsap')) return 'gsap'
          if (
            id.includes('react-dom') ||
            id.includes('react-router-dom') ||
            (id.includes('node_modules/react/') && !id.includes('react-three'))
          ) {
            return 'react-vendor'
          }
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },

  ssr: {
    noExternal: ['@splinetool/react-spline', '@react-three/drei', 'three-mesh-bvh'],
  },

  optimizeDeps: {
    include: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'framer-motion',
      // Ensure lodash.debounce (CJS) is pre-bundled so default import works
      'lodash.debounce',
    ],
    exclude: ['@splinetool/react-spline'],
  },
})
