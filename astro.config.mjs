// @ts-check
import { defineConfig } from 'astro/config'
import clerk from '@clerk/astro'
import tailwindcss from '@tailwindcss/vite'
import vue from '@astrojs/vue'
import vercel from '@astrojs/vercel'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [clerk(), vue(), react()],
  output: 'server',

  server: {
    allowedHosts: true
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel({ imageService: true }),
})