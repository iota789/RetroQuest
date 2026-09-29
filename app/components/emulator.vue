<!-- components/Emulator.vue -->
<template>
    <div v-if="props.visible" class="emulator-wrapper">
        <div class="relative">
            <iframe ref="iframeEl" :srcdoc="iframeContent" frameborder="0" allowfullscreen />
            <button type="button" title="Full screen" aria-label="Full screen" class="fullscreen-btn"
                @click="toggleFullscreen">
                <PhCornersOut :size="20" weight="bold" />
            </button>
        </div>
        <div v-if="folderSupported || status" class="flex flex-row flex-wrap items-center gap-2 mt-3">
            <button v-if="folderSupported" type="button" class="toolbar-btn" @click="pickFolder">
                <PhFolderOpen :size="18" weight="bold" />Save Folder
            </button>
            <span v-if="status" class="text-sm text-[#94A3B8] ml-1">{{ status }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { PhCornersOut, PhFolderOpen } from '@phosphor-icons/vue'
import { useSaveStates } from '~/composables/useSaveStates'

const props = defineProps({
    romPath: { type: String, required: true },
    system: { type: String, required: true },
    visible: { type: Boolean, default: false },
    gameId: { type: String, default: '' },
    gameName: { type: String, default: 'game' }
})

const saves = useSaveStates()
const folderSupported = ref(false)
const status = ref('')
let statusTimer = null

const say = (text) => {
    status.value = text
    clearTimeout(statusTimer)
    statusTimer = setTimeout(() => { status.value = '' }, 4000)
}

const game = () => ({ id: props.gameId, name: props.gameName })

const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else iframeEl.value?.requestFullscreen?.()
}

const pickFolder = async () => {
    try {
        await saves.chooseFolder()
        say('Saves will go to per-game folders in the chosen folder')
    } catch (e) {
        if (e.name !== 'AbortError') say('Could not use that folder')
    }
}

const onMessage = async (ev) => {
    if (ev.source !== iframeEl.value?.contentWindow || ev.data?.type !== 'rq-save-state') return
    try {
        const result = await saves.save(game(), ev.data.state)
        say(result.where === 'folder' ? `Saved to ${result.name}` : 'Saved in this browser')
    } catch (e) {
        say('Failed to save state')
    }
}

onMounted(() => {
    folderSupported.value = saves.folderSupported()
    window.addEventListener('message', onMessage)
})
onBeforeUnmount(() => {
    window.removeEventListener('message', onMessage)
    clearTimeout(statusTimer)
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
        EJS_onSaveState = function (e) {
            window.parent.postMessage({ type: 'rq-save-state', state: e.state }, '*');
        };
        document.getElementById('emulator-container').addEventListener('dblclick', () => {
            if (window.EJS_emulator) window.EJS_emulator.toggleFullscreen(true);
        });
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

iframe:fullscreen {
    aspect-ratio: auto;
}

.fullscreen-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 10;
    padding: 0.5rem;
    border-radius: 9999px;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    opacity: 0.6;
    transition: all 0.2s;
}

.fullscreen-btn:hover {
    opacity: 1;
    background: #258CF4;
}

.toolbar-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s;
}

.toolbar-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(37, 140, 244, 0.4);
}
</style>