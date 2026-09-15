<template>
    <div v-if="!authed" class="flex flex-col gap-4 max-w-sm mx-auto mt-24">
        <p class="text-2xl font-bold">Admin Access</p>
        <input v-model="admin_key" type="password" placeholder="Admin key" @keyup.enter="checkKey"
            class="rounded-lg bg-[#1E293B] text-white py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-[#258CF4]/30" />
        <p v-if="auth_error" class="text-red-400 text-sm">{{ auth_error }}</p>
        <button class="bg-[#258CF4] px-6 py-2 rounded-md font-bold disabled:opacity-50" :disabled="checking_key"
            @click="checkKey">
            {{ checking_key ? 'Checking...' : 'Continue' }}
        </button>
    </div>
    <slot v-else />
</template>

<script setup>
import { useAdminAuth } from '~/composables/useAdminAuth'

const { admin_key, authed } = useAdminAuth()
const checking_key = ref(false)
const auth_error = ref('')

const checkKey = async () => {
    auth_error.value = ''
    if (!admin_key.value) {
        auth_error.value = 'Please enter an admin key.'
        return
    }
    checking_key.value = true
    try {
        await $fetch('/api/admin/verify-key', {
            method: 'POST',
            headers: { 'x-admin-key': admin_key.value },
        })
        authed.value = true
    } catch (e) {
        auth_error.value = e?.data?.statusMessage || 'Invalid admin key.'
    } finally {
        checking_key.value = false
    }
}
</script>
