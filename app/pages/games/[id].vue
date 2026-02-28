<template>
    <div class="flex flex-col gap-8 mx-6 md:mx-12 my-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 bg-[#258CF4]/10 rounded-lg  " v-if="!show_game_window">
            <div
                class="p-8 lg:p-16 flex flex-col gap-4 justify-center lg:justify-end items-center lg:items-start bg-[#15263FF]/12 rounded-l-lg">

                <div class="flex flex-row gap-3 ">
                    <div
                        class="bg-[#258CF4]/10 rounded-3xl text-xs text-[#258CF4] font-bold py-2 px-3 border-2 border-[#258CF4]">
                        {{ game.genre[0] }}
                    </div>
                    <div
                        class="bg-[#258CF4]/10 rounded-3xl text-xs text-[#258CF4] font-bold py-2 px-3 border-2 border-[#258CF4]">
                       {{ game.genre[1] }}
                    </div>
                </div>
                <h1 class="text-3xl md:text-5xl font-bold">{{game?.name}}</h1>
                <p class="text-[#94A3B8] text-md md:text-xl">{{ game.year }} • {{ game.platform_name }} 
                </p>

                <p class="text-sm lg:text-lg text-[#94A3B8] text-center lg:text-justify">{{ game.additional_summary }}</p>
                <div class="flex flex-row gap-4">
                    <button
                        class=" py-1 lg:py-2 px-6 lg:px-9 bg-[#258CF4] rounded-xl text-lg lg:text-xl font-bold flex flex-row gap-2 items-center"
                        @click="show_game_window = true">
                        <PhPlayCircle :size="24" weight="bold" />
                        Play Now
                    </button>
                    <button class=" bg-[#FFFFFF]/5 rounded-xl border-2 border-[#FFFFFF]/10 p-3 lg:p-5">
                        <PhShareNetwork :size="24" weight="bold" />
                    </button>
                </div>
            </div>
            <div class="bg-[#0F172A]/40 rounded-r-lg flex justify-center items-center hidden lg:flex">

                <div class="relative inline-block ">
                    <img src="/images/nes_rom.png" alt="cartridge" class="w-[600px]" />
                    <img :src="game.cover_url" alt="label"
                        class="absolute top-[8%] right-[7%] w-[75%] h-[52%] object-contain" />
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
                    <div class="grid grid-cols-4 w-full gap-x-6">
                        <div class="flex flex-col justify-center p-4 items-center bg-[#223649] rounded-xl "
                            v-for="(movement) in [1, 2, 3, 4]">
                            <p class="text-xs md:text-sm font-bold text-[#94A3B8]">Movement</p>
                            <p class="text-xs md:text-sm lg:text-xl font-bold">Arrow Keys</p>
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
        <div class="flex flex-row justify-between">
            <p class="flex flex-row items-center gap-2 text-2xl font-bold">
                <PhSparkle :size="24" color="#258CF4" />Related Games
            </p>
            
        </div>
    </div>
</template>
<script setup>
import { PhPlay, PhFileText, PhKeyboard, PhLightbulb, PhSparkle, PhPlayCircle, PhShareNetwork } from '@phosphor-icons/vue';
import { games } from "/assets/data/games.json";
const show_game_window = ref(false)
const route = useRoute()
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
    // game.value.path = '/roms/nes/tetris.nes'
    // game.value.platform = 'gb'
})
</script>