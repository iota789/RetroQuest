// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2025-07-15",

  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@primevue/nuxt-module"],

  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },

  devServer: {
    port: 5050,
  },
  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    adminKey: process.env.NUXT_ADMIN_KEY || "ayyappa-kaapaadu",
  },

  app: {
    baseURL: "/RetroQuest/",

    head: {
      title: "RetroQuest",
      link: [{ rel: "icon", type: "image/png", href: "/RetroQuest/logo.png" }],
      script: [
        { src: "https://scripts.sirv.com/sirvjs/v3/sirv.js", defer: true },
      ],
    },
  },

  nitro: {
    preset: "github_pages",
    prerender: {
      routes: ["/"],
    },
  },
});
