<template>

    <div class="relative overflow-hidden flex flex-col gap-8 items-center py-12 md:py-28 retro-grid">
        <div class="pointer-events-none absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-[#258CF4]/20 blur-[120px]"></div>
        <div class="pointer-events-none absolute -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-[#A855F7]/20 blur-[120px]"></div>
        <div class="relative grid grid-cols-1 lg:grid-cols-2 items-center w-full px-3 md:px-8 ">
            <div class="flex flex-col gap-6 order-2 lg:order-1 items-center text-center lg:items-start lg:text-left">
                <div
                    class="bg-[#258CF4]/10 w-fit px-4 py-2 border border-[#258CF4]/30 backdrop-blur-sm rounded-full text-xs tracking-widest text-[#258CF4] font-bold">
                    🕹️ PLAYER ONE READY
                </div>
                <h1 class="font-bold text-5xl md:text-7xl">Relive the <span
                        class="bg-gradient-to-r from-[#258CF4] via-[#A855F7]  to-[#2DD4BF] bg-clip-text text-transparent">Golden
                        Age</span> of Gaming</h1>
                <p class=" text-md md:text-xl font-normal text-[#94A3B8]">Browser-based retro gaming with save states,
                    controller support, and a growing library of timeless titles.</p>
                <div class="flex flex-col md:flex-row gap-4 items-center">
                    <NuxtLink :to="`/games/${random_id}`">
                        <button
                            class="bg-gradient-to-r from-[#258CF4] to-[#A855F7] px-8 py-3 rounded-xl font-bold flex flex-row gap-2 items-center shadow-lg shadow-[#258CF4]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[#A855F7]/40">
                            <PhPlayCircle :size="22" weight="bold" />
                            Start Playing Now
                        </button>
                    </NuxtLink>
                    <NuxtLink to="/games">
                        <button
                            class="bg-white/5 border border-white/10 px-8 py-3 rounded-xl font-bold backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-[#258CF4]/40">
                            Browse Library
                        </button>
                    </NuxtLink>
                </div>
                <div class="flex flex-col md:flex-row gap-2 md:gap-6 items-center text-sm text-[#94A3B8]">
                    <p class="flex flex-row gap-2 items-center">
                        <PhCheckCircle :size="20" color="#2DD4BF"></PhCheckCircle>100% Free
                    </p>
                    <p class="flex flex-row gap-2 items-center">
                        <PhCheckCircle :size="20" color="#A855F7"></PhCheckCircle>Save States
                    </p>
                    <p class="flex flex-row gap-2 items-center">
                        <PhCheckCircle :size="20" color="#258CF4"></PhCheckCircle>Gamepad Support
                    </p>
                </div>

            </div>
            <div class="w-full max-w-3xl mx-auto order-1 lg:order-2">
                <Swiper :modules="modules" :space-between="30" :loop="true" :autoplay="{
                    delay: 2500,
                    disableOnInteraction: false,
                }" :speed="800" :breakpoints="{
                    0: {
                        slidesPerView: 2
                    },
                    768: {
                        slidesPerView: 3
                    }
                }">
                    <SwiperSlide v-for="slide in sorted_games" :key="slide.id">
                        <div class="flex flex-col items-center gap-4 pb-10">
                            <img :src="usePublicUrl(slide.cover_url)" :alt="slide.title"
                                class="w-full rounded-2xl object-cover h-72 border border-white/10 shadow-2xl shadow-black/50" />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    </div>
    <div class="px-3 md:px-8 py-12 md:py-24 flex flex-col gap-12">
        <div class="flex flex-col gap-3 items-center text-center">
            <p class="text-xs font-bold tracking-widest text-[#258CF4]">WHY PLAY HERE</p>
            <h2 class="text-3xl md:text-4xl font-bold">Everything you need to play</h2>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div v-for="f in features" :key="f.title"
                class="group flex flex-col gap-4 p-8 rounded-2xl bg-[#0F172A] border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                <div class="w-14 h-14 flex items-center justify-center rounded-xl border"
                    :style="{ backgroundColor: f.color + '1A', borderColor: f.color + '33' }">
                    <component :is="f.icon" :size="26" :color="f.color" />
                </div>
                <p class="font-bold text-xl">{{ f.title }}</p>
                <p class="text-[#94A3B8] text-md font-normal">{{ f.text }}</p>
            </div>
        </div>
    </div>
    <div class="px-3 md:px-8 pb-12 md:pb-24">
        <div
            class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#258CF4]/20 via-[#0F172A] to-[#A855F7]/20 p-10 md:p-16 flex flex-col items-center text-center gap-6">
            <h2 class="text-3xl md:text-5xl font-bold">Ready to press start?</h2>
            <p class="text-[#94A3B8] md:text-lg max-w-xl">Jump into {{ games.length }} classic titles right in your
                browser. No downloads, no sign-up.</p>
            <NuxtLink to="/games">
                <button
                    class="bg-gradient-to-r from-[#258CF4] to-[#A855F7] px-8 py-3 rounded-xl font-bold flex flex-row gap-2 items-center shadow-lg shadow-[#258CF4]/30 transition-all duration-300 hover:-translate-y-0.5">
                    Browse Library
                    <PhArrowRight :size="20" weight="bold" />
                </button>
            </NuxtLink>
        </div>
    </div>

</template>
<script setup>
import { platforms } from "/assets/data/platforms.json";
import { games } from "/assets/data/games.json";

import { Swiper, SwiperSlide } from 'swiper/vue';
import { PhArrowRight, PhCloudCheck, PhLightning, PhGameController, PhCheckCircle, PhPlayCircle } from "@phosphor-icons/vue";
import { Autoplay } from 'swiper/modules'

import 'swiper/css'
import { usePublicUrl } from '~/composables/usePublicUrl';
const modules = [Autoplay]
const features = [
    { title: 'Growing Library', text: 'A constantly expanding collection spanning decades of gaming history.', color: '#258CF4', icon: PhLightning },
    { title: 'Save State', text: 'Save your game state locally and re-upload it anytime to continue your adventure.', color: '#A855F7', icon: PhCloudCheck },
    { title: 'Controller Support', text: 'Plug in your controller and play just like the original experience.', color: '#2DD4BF', icon: PhGameController },
]
const random_id = ref('')
const selectedPlatform = ref("nes");
const sorted_games = computed(() => [...games].sort((a, b) => a.name.localeCompare(b.name)))
onMounted(() => {
    random_id.value = games[Math.floor(Math.random() * games.length)]._id
})
</script>
<style scoped>
.retro-grid {
    background-image: linear-gradient(to right, rgba(37, 140, 244, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(37, 140, 244, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
}
</style>