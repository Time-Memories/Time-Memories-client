import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { fileURLToPath } from 'node:url'

const sentryPlugin =
  process.env.SENTRY_AUTH_TOKEN &&
  process.env.VITE_SENTRY_ORG &&
  process.env.VITE_SENTRY_PROJECT
    ? sentryVitePlugin({
        org: process.env.VITE_SENTRY_ORG,
        project: process.env.VITE_SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        silent: false,
      })
    : null

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sentryPlugin],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
