<template>
    <div class="flex flex-col gap-8 mx-3 md:mx-12 my-8">
        <div v-if="!show_game_window"
            class="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0F172A]">
            <img v-if="game.cover_url" :src="usePublicUrl(game.cover_url)" alt=""
                class="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-30" />
            <div class="absolute inset-0 bg-gradient-to-br from-[#258CF4]/10 via-transparent to-[#A855F7]/10"></div>
            <div
                class="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center p-6 md:p-12 text-center md:text-left">
                <img v-if="game.cover_url" :src="usePublicUrl(game.cover_url)" :alt="game.name"
                    class="w-56 md:w-72 aspect-square object-cover mx-auto rounded-2xl border border-white/10 shadow-2xl shadow-black/60" />
                <div class="flex flex-col gap-5 items-center md:items-start">
                    <div class="flex flex-wrap justify-center md:justify-start gap-2">
                        <span v-for="tag in game.genre" :key="tag"
                            class="text-[10px] md:text-xs font-semibold tracking-widest text-[#258CF4] bg-[#258CF4]/10 border border-[#258CF4]/30 rounded-full px-3 py-1 uppercase">
                            {{ tag }}
                        </span>
                    </div>
                    <h1 class="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight">
                        {{ game.name }}
                    </h1>
                    <p class="text-[#94A3B8] text-xs sm:text-sm font-medium tracking-wide">
                        {{ game.year }} &bull; {{ game.developer }} &bull; {{ game.platform_name }}
                    </p>
                    <button
                        class="mt-2 py-3 px-9 bg-gradient-to-r from-[#258CF4] to-[#A855F7] rounded-xl text-lg md:text-xl font-bold flex flex-row gap-2 items-center shadow-lg shadow-[#258CF4]/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                        @click="show_game_window = true">
                        <PhPlayCircle :size="24" weight="bold" />
                        Play Now
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="relative">
            <div class="rounded-2xl">
                <ClientOnly>
                    <Emulator :romPath="usePublicUrl(game.path)" :system="game.platform" :visible="show_game_window"
                        :gameId="game._id" :gameName="game.name" />
                    <template #fallback>
                        <div class="loading">Loading emulator...</div>
                    </template>
                </ClientOnly>
            </div>
        </div>
        <div class="flex flex-col gap-8">
            <div class="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-y-3 lg:gap-x-8">
                <div class="flex flex-col gap-4 lg:gap-10">
                    <p class="flex flex-row gap-3 items-center text-lg md:text-2xl font-bold">
                        <PhFileText :size="24" color="#258CF4" />About Game
                    </p>
                    <div class="flex flex-col gap-2 items-start">
                        <p class="md:text-md lg:text-lg text-[#CBD5E1] leading-relaxed"
                            :class="{ 'line-clamp-2': !summary_expanded }">{{ game.summary }}</p>
                        <button type="button" class="text-[#258CF4] font-semibold hover:underline cursor-pointer"
                            @click="summary_expanded = !summary_expanded">
                            {{ summary_expanded ? 'Show less' : 'Show more' }}
                        </button>
                    </div>
                    <div class="bg-[#0F172A] w-full p-4 md:p-6 flex flex-col gap-6 rounded-2xl border border-white/10">
                        <p class="flex flex-row gap-3 items-center  font-bold text-lg md:text-2xl">
                            <PhKeyboard :size="24" color="#258CF4" />How to Play
                        </p>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-y-3 w-full gap-x-2 md:gap-x-6">
                            <div class="flex flex-col justify-center p-3 md:p-4 items-center bg-white/5 border border-white/5 rounded-xl transition-colors hover:border-[#258CF4]/40"
                                v-for="(movement) in game.movement">
                                <p class="text-xs md:text-sm font-bold text-[#94A3B8]">{{ movement.type }}</p>
                                <p class="text-xs md:text-sm lg:text-xl font-bold">{{ movement.keys }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-6">
                    <div
                        class="bg-gradient-to-br from-[#F59E0B]/10 to-[#F97316]/5 p-6 border border-[#F59E0B]/20 rounded-2xl flex flex-col gap-4">
                        <p class="flex flex-row gap-3 text-lg font-bold items-center">
                            <PhLightbulb :size="18" color="#F59E0B" />Did you know?
                        </p>
                        <p class="text-sm text-[#94A3B8] text-justify">"{{ game.trivia }}"</p>
                    </div>
                    <div class="bg-[#0F172A] flex flex-col p-6 rounded-2xl border border-white/10 gap-4 h-min">
                        <p class="text-sm font-bold text-[#64748B] tracking-widest">GAME INFO</p>
                        <div class="flex flex-row justify-between border-b border-white/5 pb-2">
                            <p class="text-md text-[#94A3B8]">Developer</p>
                            <p class="font-medium text-md">{{ game.developer }}</p>
                        </div>
                        <div class="flex flex-row justify-between border-b border-white/5 pb-2">
                            <p class="text-md text-[#94A3B8]">Release Date</p>
                            <p class="font-medium text-md">{{ game.year }}</p>
                        </div>
                        <div class="flex flex-row justify-between border-b border-white/5 pb-2">
                            <p class="text-md text-[#94A3B8]">Genre</p>
                            <p class="font-medium text-md">{{ game.genre[0] }}</p>
                        </div>

                    </div>
                    <a v-if="game.map_url" :href="usePublicUrl(game.map_url)" target="_blank" rel="noopener"
                        class="group bg-[#0F172A] flex flex-col p-4 rounded-2xl border border-white/10 gap-3 h-min transition-colors hover:border-[#258CF4]/40">
                        <p class="flex flex-row gap-2 items-center text-sm font-bold text-[#64748B] tracking-widest">
                            <PhMapTrifold :size="16" color="#258CF4" />MAP
                        </p>
                        <img :src="usePublicUrl(game.map_url)" :alt="`${game.name} map`"
                            class="w-full max-h-48 object-cover object-top rounded-xl border border-white/10 transition-transform duration-300 group-hover:scale-[1.02]" />
                        <p class="text-xs text-[#94A3B8]">Click to view full size</p>
                    </a>

                </div>
            </div>
            <div class="flex flex-row justify-between w-full items-center">
                <p class="flex flex-row items-center gap-2 text-2xl font-bold">
                    <PhSparkle :size="24" color="#258CF4" />Related Games
                </p>
                <div>
                    <button class="p-2 bg-white/5 border border-white/10 rounded-full mr-3 transition-colors hover:border-[#258CF4]/40"
                        @click="swiperInstance?.slidePrev()">
                        <PhCaretLeft :size="16" weight="bold" />
                    </button>
                    <button class="p-2 bg-white/5 border border-white/10 rounded-full transition-colors hover:border-[#258CF4]/40" @click="swiperInstance?.slideNext()">
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
                            class="group flex cursor-pointer flex-col gap-2 pb-10">
                            <div class="overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 group-hover:border-[#258CF4]/40 group-hover:shadow-xl group-hover:shadow-[#258CF4]/10">
                                <img :src="usePublicUrl(slide.cover_url)" :alt="slide.name" class="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <p class="text-sm font-semibold truncate transition-colors group-hover:text-[#258CF4]">{{ slide.name }}</p>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    </div>
</template>
<script setup>
import { PhPlay, PhFileText, PhKeyboard, PhLightbulb, PhSparkle, PhPlayCircle, PhShareNetwork, PhCaretLeft, PhCaretRight, PhMapTrifold } from '@phosphor-icons/vue';
import { games } from "/assets/data/games.json";
const show_game_window = ref(false)
const summary_expanded = ref(false)
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
    related_games.value = games
        .filter(el => el.platform === game.value.platform && el._id !== game.value._id)
        .sort((a, b) => a.name.localeCompare(b.name))
    // game.value.path = '/roms/nes/tetris.nes'
    // game.value.platform = 'gb'
})
</script>