// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  // Nuxt 4 Compatibility
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@primevue/nuxt-module'],

  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },

  devServer: {
    port: 5050
  },

  // In Nuxt 4, ~ points to the /app directory by default
  css: ["~/assets/css/main.css"],

  app: {
    // 1. Ensure leading and trailing slashes for the subpath
    baseURL: '/gameify/', 
    
    // 2. DO NOT include the repo name here. 
    // This is relative to the baseURL. Standard is '_nuxt'
    buildAssetsDir: '_nuxt', 

    head: {
      title: "RetroQuest",
      script: [
        { src: 'https://scripts.sirv.com/sirvjs/v3/sirv.js', defer: true },
      ]
    },
  },

  nitro: {
    preset: 'github_pages',
    // Ensures the static index.html is created during build
    prerender: {
      routes: ['/']
    }
  },
})