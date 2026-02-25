<!-- components/Emulator.vue -->
<template>
    <div class="emulator-wrapper">
        <div id="emulator-container" />
    </div>
</template>

<script setup>
const props = defineProps({
    romPath: {
        type: String,
        required: true
    },
    system: {
        type: String,
        required: true
    }
})

let scriptEl = null

onMounted(() => {
    // configure emulatorjs BEFORE loading the script
    window.EJS_player = '#emulator-container'
    window.EJS_gameUrl = props.romPath
    window.EJS_core = props.system
    window.EJS_startOnLoaded = true
    window.EJS_saveStateSupport = true
    window.EJS_rewindEnabled = true
    window.EJS_volume = 0.7

    // if self hosting, point this to your local files instead
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/'

    // load the script
    scriptEl = document.createElement('script')
    scriptEl.src = 'https://cdn.emulatorjs.org/stable/data/loader.js'
    document.body.appendChild(scriptEl)
})

onUnmounted(() => {
    // clean up when navigating away
    if (scriptEl) document.body.removeChild(scriptEl)

    // remove emulatorjs leftover elements
    delete window.EJS_player
    delete window.EJS_gameUrl
    delete window.EJS_core
})
</script>

<style scoped>
.emulator-wrapper {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
}

#emulator-container {
    width: 100%;
    aspect-ratio: 4/3;
}
</style>