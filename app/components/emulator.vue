<!-- components/Emulator.vue -->
<template>
    <div v-if="props.visible" class="emulator-wrapper">
        <iframe ref="iframeEl" :srcdoc="iframeContent" frameborder="0" allowfullscreen />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    romPath: { type: String, required: true },
    system: { type: String, required: true },
    visible: { type: Boolean, default: false }
})

const iframeEl = ref(null)

const iframeContent = computed(() => `
<!DOCTYPE html>
<html>
<head>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; width: 100vw; height: 100vh; }
        #emulator-container { width: 100%; height: 100%; }
    </style>
</head>
<body>
    <div id="emulator-container"></div>
    <script>
        EJS_player     = '#emulator-container';
        EJS_gameUrl    = '${props.romPath}';
        EJS_core       = '${props.system}';
        EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
        EJS_startOnLoaded = true;
        EJS_volume     = 0.7;
    <\/script>
    <script src="https://cdn.emulatorjs.org/stable/data/loader.js"><\/script>
</body>
</html>
`)
</script>

<style scoped>
.emulator-wrapper {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
}

iframe {
    width: 100%;
    aspect-ratio: 4/3;
    display: block;
}
</style>