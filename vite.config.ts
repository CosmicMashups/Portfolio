import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const repoRoot = path.resolve(__dirname, '..')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'vendor-charts'
            if (id.includes('framer-motion')) return 'vendor-motion'
            if (id.includes('/gsap/')) return 'vendor-gsap'
            if (id.includes('@xyflow/react')) return 'vendor-flow'
            if (id.includes('react-syntax-highlighter')) return 'vendor-syntax'
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    fs: {
      allow: [repoRoot, path.resolve(repoRoot, '..')],
    },
  },
})
