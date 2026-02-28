<template>
    <div class="h-16 w-full bg-[#1E293B] text-white flex flex-row justify-between items-center px-8">
        <div class="flex flex-row gap-3 items-center">

            <img src="" alt="Not Available">
            <div class="flex flex-row gap-3 items-center">
                <NuxtLink to="/">Home</NuxtLink>
                <NuxtLink to="/games">Games</NuxtLink>
            </div>
        </div>
        <div class="flex flex-row gap-4 items-center">
            <button class="bg-[#258CF4] shadow-[0_0_10px_#258CF4] text-white px-4 py-2 rounded-md">Sign Up</button>
            <button class="bg-[#258CF4]/10 text-white px-4 py-2 rounded-md">Login</button>
        </div>

    </div>
</template>
<script setup></script>