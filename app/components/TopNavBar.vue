<template>
    <div class="h-16 w-full bg-[#1E293B]/70 text-white flex flex-row justify-between items-center px-2 lg:px-8 sticky top-0 z-50">
        <div class="flex flex-row gap-8 items-center">
            <div class="flex flex-row gap-2 items-center cursor-pointer"
            @click="$router.push('/')"
            >

                <button class="bg-[#258CF4] px-2 py-3 rounded-md">
                    
                    <img src="/images/logo.svg" alt="Not Available">
                </button>
                <p class="text-lg md:text-xl font-bold">

                    RetroQuest
                </p>
            </div>
            <div class="flex flex-row gap-3 items-center">
                <NuxtLink to="/games" class="font-medium text-md md:text-lg"
                :class="{
                    'text-[#258CF4] underline': $route.path == '/games'
                }"
                >Library</NuxtLink>
            </div>
        </div>

        <div class="relative w-28 sm:w-48 md:w-72">
            <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <PhMagnifyingGlass :size="16" />
            </span>
            <input type="text" v-model="search_text" placeholder="Search games..." @keyup.enter="submitSearch"
                class="w-full rounded-lg bg-white/10 text-white py-2 pl-9 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-[#258CF4]/30 placeholder:text-gray-400" />
        </div>
    </div>
</template>
<script setup>
import { PhMagnifyingGlass } from '@phosphor-icons/vue';

const router = useRouter()
const route = useRoute()

const search_text = ref(typeof route.query.search === 'string' ? route.query.search : '')

let debounceTimer = null

const navigateSearch = (value) => {
    const query = value.trim()
    if ((route.query.search || '') === query) return
    router.replace({ path: '/games', query: query ? { search: query } : {} })
}

watch(search_text, (value) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => navigateSearch(value), 300)
})

const submitSearch = () => {
    clearTimeout(debounceTimer)
    navigateSearch(search_text.value)
}

onBeforeUnmount(() => clearTimeout(debounceTimer))
</script>