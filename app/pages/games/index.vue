<template>
    <div class="grid grid-cols-1 my-8 mx-3 lg:mx-12">
        <div class="flex flex-col gap-2">

            <div class="grid grid-cols-1 md:grid-cols-2 justify-between gap-y-6 items-center">
                <div>
                    <p class="text-3xl font-bold">Classic Library</p>
                    <p class="text-sm text-[#94A3B8] mt-2">Showing {{ game_count }} titles available to play
                        in
                        browser</p>
                </div>
                <div class="flex flex-row gap-4 justify-self-end">
                    <button class="p-2 border-white/10 border-2 rounded-xl block"
                        @click="filter_visible = true">
                        <PhFunnelSimple :size="20" weight="bold" color="#FFFFFF" />
                    </button>
                </div>

            </div>
            <div class="flex flex-row justify-end">

            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 gap-x-4 gap-y-4"
                v-if="computed_games_list.length > 0">
                <div class="group flex flex-col cursor-pointer overflow-hidden rounded-2xl bg-[#0F172A] border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#258CF4]/40 hover:shadow-xl hover:shadow-[#258CF4]/10"
                    v-for="(game) in computed_games_list" @click="() => {
                        $router.push(`/games/${game._id}`)
                    }">
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
                        <p class="text-sm md:text-base font-semibold text-white truncate transition-colors group-hover:text-[#258CF4]">
                            {{ game.name }}</p>
                        <p class="text-[#94A3B8] text-xs font-normal tracking-wide truncate">{{ game?.genre[0] }} • {{
                            game?.genre[1] }} • {{ game.year }}
                        </p>
                    </div>
                </div>
            </div>
            <div v-if="computed_games_list.length == 0" class="flex flex-row items-center justify-center">
                <img src="/images/empty_state.png" alt="">
            </div>
            <Paginator v-if="computed_games_list.length > 0" :first="skip" :rows="limit" :totalRecords="game_count"
                template=" PrevPageLink PageLinks NextPageLink" :pt="{
                    root: {
                        class: 'bg-transparent'
                    },
                    current: {
                        class: '!bg-[#258CF4]'
                    }
                }" @page="(ev) => {
                    skip = ev.first;
                    limit = ev.rows;
                    page = ev.page + 1;
                }"></Paginator>
        </div>
    </div>
    <Drawer v-model:visible="filter_visible" class="bg-[#0F172A]" position="right">
        <div class="flex flex-col gap-4">
            <div class="flex flex-row justify-between">

                <p class="text-sm font-bold text-[#94A3B8] tracking-wider">PLATFORMS</p>
                <button class="text-sm font-bold text-[#94A3B8]" v-if="filterState.selected_platform !== ''"
                    @click="() => { skip = 0; filterState.selected_platform = '' }">Reset</button>
            </div>
            <div class="flex flex-row gap-2 items-center cursor-pointer p-2 rounded-2xl"
                @click="() => { skip = 0; filterState.selected_platform = ''; }" :class="{
                    'bg-[#258CF4]/10 text-[#258CF4]': filterState.selected_platform === '',
                    'bg-transparent text-white': filterState.selected_platform !== '',
                }">

                <p>All Platforms</p>
            </div>
            <div class="flex flex-row gap-2 items-center cursor-pointer p-2 rounded-2xl" v-for="platform in platforms"
                @click="() => { skip = 0; filterState.selected_platform = platform.value; }" :class="{
                    'bg-[#258CF4]/10 text-[#258CF4]': filterState.selected_platform === platform.value,
                    'bg-transparent text-white': filterState.selected_platform !== platform.value,
                }">

                {{ platform.name }}
            </div>
            <div class="flex flex-col gap-4">
                <div class="flex flex-row justify-between">
                    <p class="text-sm font-bold text-[#94A3B8] tracking-wider">GENRES</p>
                    <button class="text-sm font-bold text-[#94A3B8]" v-if="filterState.selected_genre !== ''"
                        @click="() => { skip = 0; filterState.selected_genre = ''; }">Reset</button>
                </div>

                <div class="flex flex-row gap-2 items-center p-2 cursor-pointer rounded-2xl"
                    v-for="genre in computed_genres" :class="{
                        'bg-[#258CF4]/10 text-[#258CF4]': filterState.selected_genre === genre,
                        'bg-transparent text-white': filterState.selected_genre !== genre,
                    }" @click="() => { skip = 0; filterState.selected_genre = genre; }">
                    <p>{{ genre }}</p>
                </div>
            </div>
        </div>
    </Drawer>
</template>
<script setup>
import Paginator from 'primevue/paginator';
import { platforms } from "/assets/data/platforms.json";
import { games } from "/assets/data/games.json";
import { PhGridFour, PhFunnelSimple } from '@phosphor-icons/vue';
import { usePublicUrl } from '~/composables/usePublicUrl';
import { usePlatformShortName } from '~/composables/usePlatformShortName';
import { filter } from '@primeuix/themes/aura/datatable';
const filter_visible = ref(false)
const page = ref(1)
const game_count = ref(0)
const skip = ref(0)
const limit = ref(12)
const filterState = ref({
    search_text: '',
    selected_genre: '',
    selected_platform: '',
    sort_by: ''
})

const route = useRoute()
watch(() => route.query.search, (value) => {
    filterState.value.search_text = typeof value === 'string' ? value : ''
    skip.value = 0
}, { immediate: true })

const computed_games_list = computed(() => {
    let games_list = [...games].sort((a, b) => a.name.localeCompare(b.name));
    if (filterState.value.search_text != '') {
        games_list = games_list.filter(game => game.name.toLowerCase().includes(filterState.value.search_text.toLowerCase()))
    }
    if (filterState.value.selected_genre != '') {
        games_list = games_list.filter(game => game.genre.includes(filterState.value.selected_genre))
    }
    if (filterState.value.selected_platform != '') {
        games_list = games_list.filter(game => game.platform === filterState.value.selected_platform)
    }
    game_count.value = games_list.length
    return games_list.slice(skip.value, page.value * limit.value)
})

const computed_genres = computed(() => {
    let uniqueGenres = [...new Set(games.flatMap(game => game.genre).sort())]
    return uniqueGenres
})

</script>