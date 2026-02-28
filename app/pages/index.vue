<template>

    <div class="flex flex-col gap-8 items-center py-24  retro-grid">
        <div class="grid grid-cols-1 lg:grid-cols-2 items-center w-full px-4 md:px-8 ">
            <div class="flex flex-col gap-6 order-2 lg:order-1">
                <div
                    class="bg-[#258CF4]/10 w-fit p-2 border-[0.063rem] border-[#258CF4]/10 rounded-full text-xs text-[#258CF4] font-bold">
                    Playing Now
                </div>
                <h1 class="font-bold text-5xl md:text-7xl">Relive the <span
                        class="bg-gradient-to-r from-[#258CF4] via-[#A855F7]  to-[#2DD4BF] bg-clip-text text-transparent">Golden
                        Age</span> of Gaming</h1>
                <p class=" text-md md:text-xl font-normal text-[#94A3B8]">Experience pixel-perfect classics directly in your
                    browser.
                    No downloads, no lag, just the pure nostalgia of 8-bit and 16-
                    bit legends.</p>
                <div class="flex flex-row gap-4">
                    <button class="bg-[#258CF4] px-8 py-3 rounded-md font-bold">
                        Play Now
                    </button>
                    <button class="bg-[#258CF4]/10 px-8 py-3 rounded-md font-bold">
                        Browse Library
                    </button>
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
                            <img :src="slide.cover_url" :alt="slide.title" class="w-full rounded-2xl object-cover h-72" />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    </div>
    <div class="py-16 px-4 md:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 justify-between gap-y-3 md:gap-y-0">
            <div>
                <p class="text-xl md:text-3xl font-bold">Platform & Titles</p>
                <p class="text-[#64748B]text-md md:text-lg">Explore the library by platform</p>
            </div>
            <div class="flex flex-row items-center bg-[#258CF4]/10 gap-4 py-2 px-3 rounded-3xl justify-self-end w-min">
                <button class="rounded-3xl  p-2 px-3 cursor-pointer " v-for="platform in platforms" :class="{
                    'bg-[#258CF4] text-white': selectedPlatform == platform.value,
                    'bg-transparent text-[#258CF4]': selectedPlatform != platform.value
                }" @click="selectedPlatform = platform.value">
                    {{ platform.name }}
                </button>
            </div>

        </div>
        <div class="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-6">
            <div class="flex flex-col cursor-pointer" v-for="(item) in [1, 2, 3, 4]">
                <div class="relative">
                    <div
                        class="absolute top-3 left-3 bg-red-500 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded font-bold">
                        NINTENDO
                    </div>
                    <img src="/images/bgImage.png" alt="" class="rounded-xl">
                </div>
                <div class="mt-2">

                    <p class="text-lg font-bold">Game Name Will Appear Here</p>
                    <p class="text-[#64748B] text-sm font-normal">Genre • Year</p>
                </div>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 px-4 md:px-8 gap-y-10 lg:gap-x-10 py-24">
        <div class="flex flex-col gap-4 items-center justify-center">
            <div
                class="bg-[#258CF4]/10 w-16 h-16 flex items-center justify-center rounded-lg border-2 border-[#258CF4]/20">

                <PhLightning :size="26" color="#258CF4" />
            </div>
            <p class="font-bold text-xl">High Performance</p>
            <p class="text-[#64748B] text-md font-normal text-center">Our WASM-powered engine ensures buttery
                smooth 60FPS gameplay even on older laptops
                and browsers.</p>
        </div>
        <div class="flex flex-col gap-4 items-center justify-center">
            <div
                class="bg-[#A855F7]/10 w-16 h-16 flex items-center justify-center rounded-lg border-2 border-[#A855F7]/20">

                <PhCloudCheck :size="26" color="#A855F7" />
            </div>
            <p class="font-bold text-xl">High Performance</p>
            <p class="text-[#64748B] text-md font-normal text-center">Our WASM-powered engine ensures buttery
                smooth 60FPS gameplay even on older laptops
                and browsers.</p>
        </div>
        <div class="flex flex-col gap-4 items-center justify-center ">
            <div
                class="bg-[#2DD4BF]/10 w-16 h-16 flex items-center justify-center rounded-lg border-2 border-[#2DD4BF]/20">

                <PhGameController :size="26" color="#2DD4BF" />
            </div>
            <p class="font-bold text-xl">High Performance</p>
            <p class="text-[#64748B] text-md font-normal text-center">Our WASM-powered engine ensures buttery
                smooth 60FPS gameplay even on older laptops
                and browsers.</p>
        </div>
    </div>
    <div class="mx-4 md:mx-8 p-12 my-24 bg-[#258CF4]  rounded-lg flex flex-row justify-between ">
        <div>
            <p class="font-bold text-4xl ">Looking for Something Specific</p>
            <p class="mt-4">Search our library of over 2,000+ classic titles across 15
                different systems.</p>
        </div>
        <input type="text">
    </div>
</template>
<script setup>
import { platforms } from "/assets/data/platforms.json";
import { games } from "/assets/data/games.json";

import { Swiper, SwiperSlide } from 'swiper/vue';
import { PhArrowRight, PhCloudCheck, PhLightning, PhGameController, PhCheckCircle } from "@phosphor-icons/vue";
import { Autoplay } from 'swiper/modules'

import 'swiper/css'

const modules = [Autoplay]

const slides = [
    { id: 1, title: 'Slide One', image: 'https://picsum.photos/800/400?random=1' },
    { id: 2, title: 'Slide Two', image: 'https://picsum.photos/800/400?random=2' },
    { id: 3, title: 'Slide Three', image: 'https://picsum.photos/800/400?random=3' },
    { id: 1, title: 'Slide One', image: 'https://picsum.photos/800/400?random=1' },
    { id: 2, title: 'Slide Two', image: 'https://picsum.photos/800/400?random=2' },
    { id: 3, title: 'Slide Three', image: 'https://picsum.photos/800/400?random=3' },
    { id: 1, title: 'Slide One', image: 'https://picsum.photos/800/400?random=1' },
    { id: 2, title: 'Slide Two', image: 'https://picsum.photos/800/400?random=2' },
    { id: 3, title: 'Slide Three', image: 'https://picsum.photos/800/400?random=3' },
    { id: 1, title: 'Slide One', image: 'https://picsum.photos/800/400?random=1' },
    { id: 2, title: 'Slide Two', image: 'https://picsum.photos/800/400?random=2' },
    { id: 3, title: 'Slide Three', image: 'https://picsum.photos/800/400?random=3' },
    { id: 1, title: 'Slide One', image: 'https://picsum.photos/800/400?random=1' },
    { id: 2, title: 'Slide Two', image: 'https://picsum.photos/800/400?random=2' },
    { id: 3, title: 'Slide Three', image: 'https://picsum.photos/800/400?random=3' },
    { id: 1, title: 'Slide One', image: 'https://picsum.photos/800/400?random=1' },
    { id: 2, title: 'Slide Two', image: 'https://picsum.photos/800/400?random=2' },
    { id: 3, title: 'Slide Three', image: 'https://picsum.photos/800/400?random=3' },
]
const selectedPlatform = ref("nes");
</script>
<style scoped>
.retro-grid {
    background-image: linear-gradient(to right, rgba(37, 140, 244, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(37, 140, 244, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
}
</style>