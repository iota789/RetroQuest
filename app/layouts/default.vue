<template>

    <div class="w-dvw h-dvh text-white overflow-auto">


        <div ref="scroller" class="h-full w-full overflow-auto bg-[#0F172A] z-10">
            <TopNavBar></TopNavBar>
            <NuxtPage></NuxtPage>
        </div>


    </div>
</template>
<script setup>
// The scrolling element is this div, not the window, so Nuxt's default scroll reset doesn't apply.
const route = useRoute()
const scroller = ref(null)

watch(() => route.path, () => {
    scroller.value?.scrollTo({ top: 0, left: 0, behavior: 'instant' })
})
</script>