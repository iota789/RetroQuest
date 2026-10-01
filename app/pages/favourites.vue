<template>
    <div class="grid grid-cols-1 my-8 mx-3 lg:mx-12">
        <div class="flex flex-col gap-2">
            <div>
                <p class="text-3xl font-bold">Favourites</p>
                <p class="text-sm text-[#94A3B8] mt-2">{{ favourite_games.length }} hand-picked classics</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 gap-x-4 gap-y-4">
                <div class="group flex flex-col cursor-pointer overflow-hidden rounded-2xl bg-[#0F172A] border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#258CF4]/40 hover:shadow-xl hover:shadow-[#258CF4]/10"
                    v-for="game in favourite_games" :key="game._id" @click="$router.push(`/games/${game._id}`)">
                    <div class="relative overflow-hidden">
                        <img :src="usePublicUrl(game.cover_url)" :alt="game.name"
                            class="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105">
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80">
                        </div>
                        <div :class="{
                            'bg-orange-500/80': game.platform_name === 'Game Boy',
                            'bg-red-500/80': game.platform_name == 'Nintendo Entertainment System',
                            'bg-green-500/80': game.platform_name == 'Game Boy Advance',
                            'bg-blue-500/80': game.platform_name == 'Sega Genesis'
                        }"
                            class="absolute top-3 left-3 backdrop-blur-md text-white text-[10px] tracking-wider py-1 rounded-full font-bold px-3 border border-white/20">
                            {{ usePlatformShortName(game.platform) }}
                        </div>
                    </div>
                    <div class="p-4 flex flex-col gap-1">
                        <p
                            class="text-sm md:text-base font-semibold text-white truncate transition-colors group-hover:text-[#258CF4]">
                            {{ game.name }}</p>
                        <p class="text-[#94A3B8] text-xs font-normal tracking-wide truncate">{{ game.genre[0] }} • {{
                            game.genre[1] }} • {{ game.year }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { games } from "/assets/data/games.json";
import { usePublicUrl } from '~/composables/usePublicUrl';
import { usePlatformShortName } from '~/composables/usePlatformShortName';

const favourite_ids = [
    "105", // The Legend of Zelda: Link's Awakening
    "204", // Contra
    "ff3a3b19-a329-486c-9ab4-91fec4326d4a", // Metroid Fusion
    "212", // Super Mario Bros. 3
    "f4b2e9c1-73d8-4a56-b0e3-8c1f9d2a7e45", // Super Mario Advance 2: Super Mario World
    "012678aa-a80d-4ac5-843b-20a8d0b56826", // Super Mario All-Stars + Super Mario World
]

const favourite_games = favourite_ids
    .map(id => games.find(game => game._id === id))
    .filter(Boolean)
</script>
