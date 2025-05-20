// @ts-check
import { defineConfig } from 'astro/config'
import clerk from '@clerk/astro'
import tailwindcss from '@tailwindcss/vite'
import vue from '@astrojs/vue'
import vercel from '@astrojs/vercel'

// https://astro.build/config
export default defineConfig({
  integrations: [clerk(), vue()],
  output: 'server',

  server: {
    allowedHosts: true
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
})