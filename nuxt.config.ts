// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss','@primevue/nuxt-module'],
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
  css: ["~/assets/css/main.css"],
 app: {
    head: {
      title: "RetroQuest",
      script: [
        { src: 'https://scripts.sirv.com/sirvjs/v3/sirv.js', defer: true },
      ]
    },
    baseURL: '/gameify',   
    buildAssetsDir: 'assets'
  },
  nitro: {
    preset: 'github_pages'
  },
})