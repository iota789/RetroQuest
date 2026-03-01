<template>

    <div class="flex flex-col gap-8 items-center py-24  retro-grid">
        <div class="grid grid-cols-1 lg:grid-cols-2 items-center w-full px-4 md:px-8 ">
            <div class="flex flex-col gap-6 order-2 lg:order-1">
                <div
                    class="bg-[#258CF4]/10 w-fit p-2 border-[0.063rem] border-[#258CF4]/10 rounded-full text-sm text-[#258CF4] font-bold">
                    🕹️ PLAYER 1 READY
                </div>
                <h1 class="font-bold text-5xl md:text-7xl">Relive the <span
                        class="bg-gradient-to-r from-[#258CF4] via-[#A855F7]  to-[#2DD4BF] bg-clip-text text-transparent">Golden
                        Age</span> of Gaming</h1>
                <p class=" text-md md:text-xl font-normal text-[#94A3B8]">Browser-based retro gaming with save states,
                    controller support, and a growing library of timeless titles.</p>
                <div class="flex flex-row gap-4">
                    <NuxtLink :to="`/games/${random_id}`">
                        <button class="bg-[#258CF4] px-8 py-3 rounded-md font-bold flex flex-row gap-2 items-center">
                            <PhPlayCircle :size="22" weight="bold" />
                            Start Playing Now
                        </button>
                    </NuxtLink>
                    <NuxtLink to="/games">
                        <button class="bg-[#258CF4]/10 px-8 py-3 rounded-md font-bold">
                            Browse Library
                        </button>
                    </NuxtLink>
                </div>
                <div class="flex flex-row gap-4 items-center">
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
                    delay: 700,
                }" :breakpoints="{
                    0: {
                        slidesPerView: 2
                    },
                    768: {
                        slidesPerView: 3
                    }
                }">
                    <SwiperSlide v-for="slide in games" :key="slide.id">
                        <div class="flex flex-col items-center gap-4 pb-10">
                            <img :src="slide.cover_url" :alt="slide.title"
                                class="w-full rounded-2xl object-cover h-72" />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 px-4 md:px-8 gap-y-10 lg:gap-x-10 py-24">
        <div class="flex flex-col gap-4 items-center justify-center">
            <div
                class="bg-[#258CF4]/10 w-16 h-16 flex items-center justify-center rounded-lg border-2 border-[#258CF4]/20">

                <PhLightning :size="26" color="#258CF4" />
            </div>
            <p class="font-bold text-xl">Growing Library</p>
            <p class="text-[#64748B] text-md font-normal text-center">A constantly expanding collection spanning decades
                of gaming history.</p>
        </div>
        <div class="flex flex-col gap-4 items-center justify-center">
            <div
                class="bg-[#A855F7]/10 w-16 h-16 flex items-center justify-center rounded-lg border-2 border-[#A855F7]/20">

                <PhCloudCheck :size="26" color="#A855F7" />
            </div>
            <p class="font-bold text-xl">Save State</p>
            <p class="text-[#64748B] text-md font-normal text-center">Save your game state locally and re-upload it
                anytime to continue your adventure.</p>
        </div>
        <div class="flex flex-col gap-4 items-center justify-center ">
            <div
                class="bg-[#2DD4BF]/10 w-16 h-16 flex items-center justify-center rounded-lg border-2 border-[#2DD4BF]/20">

                <PhGameController :size="26" color="#2DD4BF" />
            </div>
            <p class="font-bold text-xl">Controller Support</p>
            <p class="text-[#64748B] text-md font-normal text-center">Plug in your controller and play just like the
                original experience.</p>
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

const modules = [Autoplay]
const random_id = ref('')
const selectedPlatform = ref("nes");
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