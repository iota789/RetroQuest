<template>
    <div class="game-page">

        <div v-if="game">
            <h1>{{ game.title }}</h1>
            <p>{{ game.system.toUpperCase() }} • {{ game.year }}</p>

            <!-- ClientOnly is CRITICAL - prevents SSR crash -->
            <ClientOnly>
                <Emulator :romPath="game.rom" :system="game.system" />
                <template #fallback>
                    <div class="loading">Loading emulator...</div>
                </template>
            </ClientOnly>
        </div>

        <div v-else>
            <p>Game not found.</p>
        </div>

    </div>
</template>

<script setup>
const game = {
    id: 1,
    title: 'CivGB Demo',
    system: 'nes',
    rom: '/roms/tetris.nes',
    cover: '/covers/CivGB Demo.jpg',
    genre: 'Strategy',
    year: 2024,
    description: 'The classic Nintendo platformer'
}
</script>