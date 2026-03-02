<template>
    <div class="flex flex-col gap-8 mx-6 md:mx-12 my-8">
       <div class="bg-transparent lg:bg-[#0d0f14] h-max md:rounded-2xl flex items-center justify-center md:p-8 p-0"
            v-if="!show_game_window">

            <div
                class="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl px-6 py-10 md:px-12 md:py-14 flex flex-col items-center text-center backdrop-blur-sm">

                <!-- Genre Tags -->
                <div class="flex flex-wrap justify-center gap-2 mb-4 md:mb-6">
                    <span v-for="tag in game.genre" :key="tag"
                        class="text-[10px] md:text-xs font-semibold tracking-widest text-white/70 border border-white/20 rounded-full px-2 py-1 md:px-3 uppercase">
                        {{ tag }}
                    </span>
                </div>

                <!-- Title -->
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 md:mb-3 leading-tight">
                    {{ game.name }}
                </h1>

                <!-- Meta -->
                <p class="text-white/50 text-xs sm:text-sm font-medium mb-7 md:mb-10">
                    {{ game.year }} &bull; {{ game.developer }} &bull; {{ game.platform_name }}
                </p>

                <!-- Actions -->
                <div class="flex flex-row gap-3 md:gap-4">
                    <button
                        class="py-2 px-5 md:py-2 md:px-9 bg-[#258CF4] hover:bg-[#1a7de0] active:scale-95 transition-all rounded-xl text-base md:text-xl font-bold flex flex-row gap-2 items-center"
                        @click="show_game_window = true">
                        <PhPlayCircle :size="22" weight="bold" />
                        Play Now
                    </button>
                    <button
                        class="bg-[#FFFFFF]/5 hover:bg-white/10 active:scale-95 transition-all rounded-xl border-2 border-[#FFFFFF]/10 p-3 md:p-4">
                        <PhShareNetwork :size="22" weight="bold" />
                    </button>
                </div>

            </div>
        </div>
        <div v-else class="">
            <ClientOnly>
                <Emulator :romPath="game.path" :system="game.platform" :visible="show_game_window" />
                <template #fallback>
                    <div class="loading">Loading emulator...</div>
                </template>
            </ClientOnly>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-y-3 lg:gap-x-8">
            <div class="flex flex-col gap-4 lg:gap-10">
                <p class="flex flex-row gap-3 items-center text-lg md:text-2xl font-bold">
                    <PhFileText :size="24" color="#258CF4" />About Game
                </p>
                <p class="md:text-md lg:text-lg text-[#CBD5E1] text-justify">{{ game.summary }}</p>
                <div class="bg-[#1A2632] h-38 w-full p-6 flex flex-col gap-6 rounded-lg border-2 border-[#223649]">
                    <p class="flex flex-row gap-3 items-center  font-bold text-lg md:text-2xl">
                        <PhKeyboard :size="24" color="#258CF4" />How to Play
                    </p>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-y-3 w-full gap-x-6">
                        <div class="flex flex-col justify-center p-4 items-center bg-[#223649] rounded-xl "
                            v-for="(movement) in game.movement">
                            <p class="text-xs md:text-sm font-bold text-[#94A3B8]">{{ movement.type }}</p>
                            <p class="text-xs md:text-sm lg:text-xl font-bold">{{ movement.keys }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-6">
                <div
                    class="bg-gradient-to-r from-[#F59E0B]/10 to-[#F97316]/5 p-4 flex flex-col border-2 border-[#F59E0B]/20 rounded-lg flex flex-col gap-4">
                    <p class="flex flex-row gap-3 text-lg font-bold items-center">
                        <PhLightbulb :size="18" color="#F59E0B" />Did you know?
                    </p>
                    <p class="text-sm text-[#94A3B8] text-justify">"{{ game.trivia }}"</p>
                </div>
                <div class="bg-[#1A2632] flex flex-col  p-6 rounded-lg border-2 border-[#223649] gap-4 h-min">
                    <p class="text-sm font-bold text-[#64748B] tracking-widest">GAME INFO</p>
                    <div class="flex flex-row justify-between border-b-[0.063rem] border-[#223649] pb-2">
                        <p class="text-md text-[#94A3B8]">Developer</p>
                        <p class="font-medium text-md">{{ game.developer }}</p>
                    </div>
                    <div class="flex flex-row justify-between border-b-[0.063rem] border-[#223649] pb-2">
                        <p class="text-md text-[#94A3B8]">Release Date</p>
                        <p class="font-medium text-md">{{ game.year }}</p>
                    </div>
                    <div class="flex flex-row justify-between border-b-[0.063rem] border-[#223649] pb-2">
                        <p class="text-md text-[#94A3B8]">Genre</p>
                        <p class="font-medium text-md">{{ game.genre[0] }}</p>
                    </div>

                </div>

            </div>
        </div>
        <div class="flex flex-row justify-between w-full items-center">
            <p class="flex flex-row items-center gap-2 text-2xl font-bold">
                <PhSparkle :size="24" color="#258CF4" />Related Games
            </p>
            <div>
                <button class="p-2 border-white/30 border-[0.063rem] rounded-xl mr-4"
                    @click="swiperInstance?.slidePrev()">
                    <PhCaretLeft :size="16" weight="bold" />
                </button>
                <button class="p-2 border-white/30 border-[0.063rem] rounded-xl" @click="swiperInstance?.slideNext()">
                    <PhCaretRight :size="16" weight="bold" />
                </button>
            </div>

        </div>
        <div class="w-dvh  ">

            <Swiper :space-between="20" :loop="true" @swiper="onSwiper" :breakpoints="{
                0: {
                    slidesPerView: 2
                },
                768: {
                    slidesPerView: 5
                }
            }">
                <SwiperSlide v-for="slide in related_games" :key="slide.id">
                    <div @click="$router.push(`/games/${slide._id}`)"
                        class="flex cursor-pointer flex-col items-center gap-4 pb-10">

                        <img :src="usePublicUrl(slide.cover_url)" :alt="slide.title" class="w-full rounded-2xl object-cover h-72" />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
</template>
<script setup>
import { PhPlay, PhFileText, PhKeyboard, PhLightbulb, PhSparkle, PhPlayCircle, PhShareNetwork, PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue';
import { games } from "/assets/data/games.json";
const show_game_window = ref(false)
const route = useRoute()
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { usePublicUrl } from '~/composables/usePublicUrl';
const related_games = ref([])
const swiperInstance = ref(null)
const onSwiper = (swiper) => { swiperInstance.value = swiper }

const game = ref({
    id: 1,
    title: 'CivGB Demo',
    system: 'nes',
    rom: '/roms/',
    cover: '/covers/CivGB Demo.jpg',
    genre: 'Strategy',
    year: 2024,
    description: 'The classic Nintendo platformer'
})

onMounted(() => {
    game.value = games.find(el => el._id === route.params.id)
    related_games.value = games.filter(el => el.platform === game.value.platform && el._id !== game.value._id)
    // game.value.path = '/roms/nes/tetris.nes'
    // game.value.platform = 'gb'
})
</script>