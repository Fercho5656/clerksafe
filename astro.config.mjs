// @ts-check
import { defineConfig } from 'astro/config'
import clerk from '@clerk/astro'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  integrations: [clerk()],
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
})
