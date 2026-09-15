<template>
    <div class="max-w-6xl mx-auto my-8 mx-3 lg:mx-auto px-3">
        <AdminAuthGate>
            <div class="flex flex-col gap-6 py-8">
                <div class="flex flex-row justify-between items-start gap-4 flex-wrap">
                    <div>
                        <p class="text-3xl font-bold">Manage Games</p>
                        <p class="text-sm text-[#94A3B8] mt-2">{{ game_count }} games in the library. Tap a game to
                            edit its details.</p>
                    </div>
                    <NuxtLink to="/admin/add-game"
                        class="bg-[#258CF4] px-6 py-2 rounded-md font-bold flex flex-row items-center gap-2 shrink-0 self-start">
                        <PhPlus :size="18" weight="bold" />
                        Add Game
                    </NuxtLink>
                </div>

                <div class="relative w-full max-w-md">
                    <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <PhMagnifyingGlass :size="18" />
                    </span>
                    <input type="text" placeholder="Search games..." v-model="search_text" @input="skip = 0"
                        class="w-full rounded-lg bg-[#1E293B] text-white py-2 pl-9 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-[#258CF4]/30 placeholder:text-gray-400" />
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4"
                    v-if="computed_games_list.length > 0">
                    <div class="flex flex-col cursor-pointer" v-for="game in computed_games_list" :key="game._id"
                        @click="$router.push(`/admin/edit-game/${game._id}`)">
                        <div class="relative">
                            <div :class="{
                                'bg-orange-500': game.platform_name === 'Game Boy',
                                'bg-red-500': game.platform_name == 'Nintendo Entertainment System',
                                'bg-green-500': game.platform_name == 'Game Boy Advance',
                                'bg-blue-500': game.platform_name == 'Sega Genesis'
                            }"
                                class="absolute top-3 left-3 backdrop-blur-sm text-white text-[10px] py-1 rounded font-bold px-2">
                                {{ usePlatformShortName(game.platform) }}
                            </div>
                            <img :src="usePublicUrl(game.cover_url)" alt="" class="rounded-xl h-[256px] aspect-square">
                        </div>
                        <div class="mt-2">
                            <p class="text-sm md:text-lg font-bold">{{ game.name }}</p>
                            <p class="text-[#64748B] text-sm font-normal">{{ game?.genre[0] }} &bull; {{ game.year }}
                            </p>
                        </div>
                    </div>
                </div>
                <div v-else class="flex flex-row items-center justify-center py-16">
                    <p class="text-[#94A3B8]">No games match your search.</p>
                </div>

                <Paginator v-if="game_count > 0" :first="skip" :rows="limit" :totalRecords="game_count"
                    template=" PrevPageLink PageLinks NextPageLink" :pt="{
                        root: { class: 'bg-transparent' },
                        current: { class: '!bg-[#258CF4]' }
                    }" @page="(ev) => { skip = ev.first; limit = ev.rows; }" />
            </div>
        </AdminAuthGate>
    </div>
</template>

<script setup>
import Paginator from 'primevue/paginator';
import { PhMagnifyingGlass, PhPlus } from '@phosphor-icons/vue';
import { games } from "/assets/data/games.json";
import { usePublicUrl } from '~/composables/usePublicUrl';
import { usePlatformShortName } from '~/composables/usePlatformShortName';

const search_text = ref('')
const skip = ref(0)
const limit = ref(12)
const game_count = ref(0)

const computed_games_list = computed(() => {
    let games_list = [...games].sort((a, b) => a.name.localeCompare(b.name))
    if (search_text.value !== '') {
        games_list = games_list.filter(g => g.name.toLowerCase().includes(search_text.value.toLowerCase()))
    }
    game_count.value = games_list.length
    return games_list.slice(skip.value, skip.value + limit.value)
})
</script>
