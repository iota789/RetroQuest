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
  css: ["./app/assets/css/main.css"],
  app: {
    baseUrl:'/gameify/',
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
        }
      ]
    }
  }
})