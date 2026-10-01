<template>
    <div class="h-16 w-full bg-[#1E293B]/70 text-white flex flex-row justify-between items-center px-3 lg:px-8 gap-3 sticky top-0 z-50">
        <div class="flex-row gap-4 sm:gap-8 items-center" :class="mobile_search ? 'hidden sm:flex' : 'flex'">
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
                <NuxtLink to="/favourites" class="font-medium text-md md:text-lg"
                :class="{
                    'text-[#258CF4] underline': $route.path == '/favourites'
                }"
                >Favourites</NuxtLink>
            </div>
        </div>

        <button type="button" aria-label="Search" v-if="!mobile_search" @click="openMobileSearch"
            class="sm:hidden p-2 rounded-full bg-white/5 border border-white/10 text-white">
            <PhMagnifyingGlass :size="18" weight="bold" />
        </button>
        <div class="group relative transition-all duration-300 sm:w-52 md:w-72 sm:focus-within:w-64 md:focus-within:w-96"
            :class="mobile_search ? 'flex-1 sm:flex-none' : 'hidden sm:block'">
            <span
                class="absolute inset-y-0 left-3.5 flex items-center text-[#94A3B8] transition-colors group-focus-within:text-[#258CF4]">
                <PhMagnifyingGlass :size="16" weight="bold" />
            </span>
            <input ref="search_input" type="text" v-model="search_text" placeholder="Search games..."
                @keyup.enter="submitSearch" @keyup.esc="clearSearch" @blur="mobile_search = false"
                class="w-full rounded-full bg-[#0F172A]/80 border border-white/10 text-white py-2 pl-10 pr-9 text-sm outline-none transition-all duration-300 hover:border-white/20 focus:border-[#258CF4]/60 focus:bg-[#0F172A] focus:shadow-lg focus:shadow-[#258CF4]/20 placeholder:text-[#64748B]" />
            <button v-if="search_text" type="button" aria-label="Clear search" @mousedown.prevent @click="clearSearch"
                class="absolute inset-y-0 right-3 flex items-center text-[#94A3B8] hover:text-white transition-colors">
                <PhX :size="14" weight="bold" />
            </button>
        </div>
    </div>
</template>
<script setup>
import { PhMagnifyingGlass, PhX } from '@phosphor-icons/vue';

const router = useRouter()
const route = useRoute()

const search_text = ref(typeof route.query.search === 'string' ? route.query.search : '')

const mobile_search = ref(false)
const search_input = ref(null)

const openMobileSearch = () => {
    mobile_search.value = true
    nextTick(() => search_input.value?.focus())
}

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

const clearSearch = () => {
    search_text.value = ''
    submitSearch()
}

const submitSearch = () => {
    clearTimeout(debounceTimer)
    navigateSearch(search_text.value)
}

onBeforeUnmount(() => clearTimeout(debounceTimer))
</script>