import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@renderer': '/src/renderer',
    },
  },
})
