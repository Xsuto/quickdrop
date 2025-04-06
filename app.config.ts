import { defineConfig } from '@tanstack/start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    preset: 'vercel',
    routeRules: {
      '/js/script.js': {
        proxy: {
          to: 'https://plausible.xsuto.com/js/script.js',
        },
      },
      '/api/event': {
        proxy: {
          to: 'https://plausible.xsuto.com/api/event',
        },
      },
    },
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
})
