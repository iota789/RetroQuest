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
        

    </div>
</template>
<script setup></script>