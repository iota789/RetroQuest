<template>
    <div class="grid grid-cols-1 lg:grid-cols-[0.5fr_3fr] gap-x-4 my-8 mx-3 lg:mx-12">
        <div class="lg:flex hidden flex-col gap-4 ">
            <div class="flex flex-col gap-4">
                <div class="flex flex-row justify-between">

                    <p class="text-sm font-bold text-[#94A3B8] tracking-wider">PLATFORMS</p>
                    <button class="text-sm font-bold text-[#94A3B8]" v-if="filterState.selected_platform !== ''"
                        @click="filterState.selected_platform = ''">Reset</button>
                </div>
                <div class="flex flex-row gap-2 items-center cursor-pointer p-2 rounded-2xl"
                    @click="filterState.selected_platform = ''" :class="{
                        'bg-[#258CF4]/10 text-[#258CF4]': filterState.selected_platform === '',
                        'bg-transparent text-white': filterState.selected_platform !== '',
                    }">

                    <p>All Platforms</p>
                </div>
                <div class="flex flex-row gap-2 items-center cursor-pointer p-2 rounded-2xl"
                    v-for="platform in platforms" @click="filterState.selected_platform = platform.value" :class="{
                        'bg-[#258CF4]/10 text-[#258CF4]': filterState.selected_platform === platform.value,
                        'bg-transparent text-white': filterState.selected_platform !== platform.value,
                    }">

                    {{ platform.name }}
                </div>
                <div class="flex flex-col gap-4">
                    <div class="flex flex-row justify-between">
                        <p class="text-sm font-bold text-[#94A3B8] tracking-wider">GENRES</p>
                        <button class="text-sm font-bold text-[#94A3B8]" v-if="filterState.selected_genre !== ''"
                            @click="filterState.selected_genre = ''">Reset</button>
                    </div>

                    <div class="flex flex-row gap-2 items-center p-2 cursor-pointer rounded-2xl"
                        v-for="genre in computed_genres" :class="{
                            'bg-[#258CF4]/10 text-[#258CF4]': filterState.selected_genre === genre,
                            'bg-transparent text-white': filterState.selected_genre !== genre,
                        }" @click="filterState.selected_genre = genre">
                        <p>{{ genre }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-2">
           
            <div class="grid grid-cols-1 md:grid-cols-2 justify-between gap-y-6 items-center">
                <div>
                    <p class="text-3xl font-bold">Classic Library</p>
                    <p class="text-sm text-[#94A3B8] mt-2">Showing {{ game_count }} titles available to play
                        in
                        browser</p>
                </div>
                <div class="flex flex-row gap-4 justify-self-end">
                    <div class="relative w-full">
                        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <PhMagnifyingGlass :size="18" />
                        </span>

                        <input type="text" placeholder="Search..." :value="filterState.search_text"
                            @input="filterState.search_text = $event.target.value"
                            class="w-dwh lg:w-[30rem] rounded-lg  bg-[#1E293B] text-white  py-2 pl-9 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#258CF4] focus:ring-2 focus:ring-[#258CF4]/30 placeholder:text-gray-400" />
                    </div>

                    </input>
                    <button class="p-2 border-white/10 border-2 rounded-xl block lg:hidden"
                    @click="filter_visible=true"
                    >
                        <PhFunnelSimple :size="20" weight="bold" color="#FFFFFF" />
                    </button>
                </div>
               
            </div>
            <div class="flex flex-row justify-end">

            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 gap-x-4 gap-y-4">
                <div class="flex flex-col cursor-pointer" v-for="(game) in computed_games_list" @click="() => {
                    $router.push(`/games/${game._id}`)
                }">
                    <div class="relative">
                        <div :class="{
                            'bg-orange-500': game.platform_name === 'Game Boy',
                            'bg-red-500': game.platform_name == 'Nintendo Entertainment System',
                            'bg-green-500': game.platform_name == 'Game Boy Advance',
                            'bg-blue-500': game.platform_name == 'Sega Genesis'
                        }"
                            class="absolute top-3 left-3 backdrop-blur-sm text-white text-[10px] py-1 rounded font-bold px-2">
                            {{ game.platform_name }}
                        </div>
                        <img :src="usePublicUrl(game.cover_url)" alt="" class="rounded-xl h-auto md:h-[256px] aspect-square">
                    </div>
                    <div class="mt-2">

                        <p class=" text-sm md:text-lg font-bold">{{ game.name }}</p>
                        <p class="text-[#64748B] text-sm font-normal">{{ game?.genre[0] }} • {{ game?.genre[1] }} • {{
                            game.year }}
                        </p>
                    </div>
                </div>
            </div>
            <Paginator :first="skip" :rows="limit" :totalRecords="game_count"
            template=" PrevPageLink PageLinks NextPageLink"
            :pt="{
                root:{
                    class:'bg-transparent'
                },
                current:{
                    class:'!bg-[#258CF4]'
                }
            }"
            @page="(ev) => {
                skip=ev.first;
                limit=ev.rows;
                page = ev.page+1;
            }" ></Paginator>
        </div>
    </div>
    <Drawer v-model:visible="filter_visible" class="bg-[#0F172A]"  position="right">
        <div class="flex flex-col gap-4">
            <div class="flex flex-row justify-between">

                <p class="text-sm font-bold text-[#94A3B8] tracking-wider">PLATFORMS</p>
                <button class="text-sm font-bold text-[#94A3B8]" v-if="filterState.selected_platform !== ''"
                    @click="filterState.selected_platform = ''">Reset</button>
            </div>
            <div class="flex flex-row gap-2 items-center cursor-pointer p-2 rounded-2xl"
                @click="filterState.selected_platform = ''" :class="{
                    'bg-[#258CF4]/10 text-[#258CF4]': filterState.selected_platform === '',
                    'bg-transparent text-white': filterState.selected_platform !== '',
                }">

                <p>All Platforms</p>
            </div>
            <div class="flex flex-row gap-2 items-center cursor-pointer p-2 rounded-2xl" v-for="platform in platforms"
                @click="filterState.selected_platform = platform.value" :class="{
                    'bg-[#258CF4]/10 text-[#258CF4]': filterState.selected_platform === platform.value,
                    'bg-transparent text-white': filterState.selected_platform !== platform.value,
                }">

                {{ platform.name }}
            </div>
            <div class="flex flex-col gap-4">
                <div class="flex flex-row justify-between">
                    <p class="text-sm font-bold text-[#94A3B8] tracking-wider">GENRES</p>
                    <button class="text-sm font-bold text-[#94A3B8]" v-if="filterState.selected_genre !== ''"
                        @click="filterState.selected_genre = ''">Reset</button>
                </div>

                <div class="flex flex-row gap-2 items-center p-2 cursor-pointer rounded-2xl"
                    v-for="genre in computed_genres" :class="{
                        'bg-[#258CF4]/10 text-[#258CF4]': filterState.selected_genre === genre,
                        'bg-transparent text-white': filterState.selected_genre !== genre,
                    }" @click="filterState.selected_genre = genre">
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
import { PhGridFour, PhMagnifyingGlass,PhFunnelSimple } from '@phosphor-icons/vue';
import { usePublicUrl } from '~/composables/usePublicUrl';
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

const computed_games_list = computed(() => {
    let games_list = games;
    if (filterState.value.search_text != '') {
        games_list = games.filter(game => game.name.toLowerCase().includes(filterState.value.search_text.toLowerCase()))
    }
    if (filterState.value.selected_genre != '') {
        games_list = games_list.filter(game => game.genre.includes(filterState.value.selected_genre))
    }
    if (filterState.value.selected_platform != '') {
        games_list = games_list.filter(game => game.platform === filterState.value.selected_platform)
    }
    game_count.value = games_list.length
    return games_list.slice(skip.value, page.value*limit.value)
})

const computed_genres = computed(() => {
    let uniqueGenres = [...new Set(games.flatMap(game => game.genre).sort())]
    return uniqueGenres
})

</script>