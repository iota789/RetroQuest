<template>
    <label class="flex flex-col gap-1">
        <span class="text-sm font-bold text-[#94A3B8] tracking-wider">{{ label }}</span>
        <slot />
    </label>
</template>

<script setup>
defineProps({
    label: { type: String, required: true },
})
</script>
