<template>
    <div class="max-w-3xl mx-auto my-8 mx-3 lg:mx-auto px-3">
        <div v-if="!authed" class="flex flex-col gap-4 max-w-sm mx-auto mt-24">
            <p class="text-2xl font-bold">Admin Access</p>
            <input v-model="admin_key" type="password" placeholder="Admin key"
                @keyup.enter="authed = admin_key.length > 0"
                class="rounded-lg bg-[#1E293B] text-white py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-[#258CF4]/30" />
            <button class="bg-[#258CF4] px-6 py-2 rounded-md font-bold" @click="authed = admin_key.length > 0">
                Continue
            </button>
        </div>

        <div v-else class="flex flex-col gap-6 py-8">
            <div>
                <p class="text-3xl font-bold">Add a Game</p>
                <p class="text-sm text-[#94A3B8] mt-2">Upload a ROM and fill in the game's details. This writes
                    directly to games.json and public/roms — only works while running the dev server.</p>
            </div>

            <form class="flex flex-col gap-4" @submit.prevent="submit">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminFormField label="Name">
                        <input v-model="form.name" required class="input" placeholder="Adventure Island" />
                    </AdminFormField>
                    <AdminFormField label="Platform">
                        <select v-model="form.platform" required class="input">
                            <option value="" disabled>Select platform</option>
                            <option v-for="p in platforms" :key="p.value" :value="p.value">{{ p.name }}</option>
                        </select>
                    </AdminFormField>
                    <AdminFormField label="Year">
                        <input v-model="form.year" type="number" required class="input" placeholder="1986" />
                    </AdminFormField>
                    <AdminFormField label="Date of Release">
                        <input v-model="form.date_of_release" required class="input"
                            placeholder="September 12, 1986" />
                    </AdminFormField>
                    <AdminFormField label="Developer">
                        <input v-model="form.developer" required class="input" placeholder="Hudson Soft" />
                    </AdminFormField>
                    <AdminFormField label="Genre (comma separated)">
                        <input v-model="form.genre_text" required class="input" placeholder="Platformer, Action" />
                    </AdminFormField>
                </div>

                <AdminFormField label="Summary">
                    <textarea v-model="form.summary" required rows="3" class="input"></textarea>
                </AdminFormField>
                <AdminFormField label="Additional Summary">
                    <textarea v-model="form.additional_summary" rows="2" class="input"></textarea>
                </AdminFormField>
                <AdminFormField label="Trivia">
                    <textarea v-model="form.trivia" rows="2" class="input"></textarea>
                </AdminFormField>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminFormField label="ROM File">
                        <input type="file" required class="input" @change="onRomChange" />
                    </AdminFormField>
                    <AdminFormField label="Cover Image (optional)">
                        <input type="file" accept="image/*" class="input" @change="onCoverChange" />
                    </AdminFormField>
                </div>
                <AdminFormField label="Cover URL (used only if no cover image is uploaded)">
                    <input v-model="form.cover_url" class="input" placeholder="/images/game_covers/foo.jpeg" />
                </AdminFormField>

                <div class="flex flex-col gap-2">
                    <div class="flex flex-row justify-between items-center">
                        <p class="text-sm font-bold text-[#94A3B8] tracking-wider">CONTROLS</p>
                        <button type="button" class="text-sm font-bold text-[#258CF4]" @click="addMovementRow">
                            + Add Control
                        </button>
                    </div>
                    <div v-for="(row, i) in form.movement" :key="i" class="flex flex-row gap-2 items-center">
                        <input v-model="row.type" required class="input" placeholder="Jump" />
                        <input v-model="row.keys" required class="input" placeholder="Z" />
                        <button type="button" class="text-red-400 px-2" @click="form.movement.splice(i, 1)">
                            &times;
                        </button>
                    </div>
                </div>

                <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
                <p v-if="success" class="text-green-400 text-sm">
                    Added "{{ success.name }}" successfully.
                    <NuxtLink :to="`/games/${success._id}`" class="underline">View game</NuxtLink>
                </p>

                <button type="submit" :disabled="submitting"
                    class="bg-[#258CF4] px-8 py-3 rounded-md font-bold self-start disabled:opacity-50">
                    {{ submitting ? 'Adding...' : 'Add Game' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { platforms } from "/assets/data/platforms.json";

const admin_key = ref('')
const authed = ref(false)

const submitting = ref(false)
const error = ref('')
const success = ref(null)

const romFile = ref(null)
const coverFile = ref(null)

const emptyForm = () => ({
    name: '',
    platform: '',
    year: '',
    date_of_release: '',
    developer: '',
    genre_text: '',
    summary: '',
    additional_summary: '',
    trivia: '',
    cover_url: '',
    movement: [
        { type: 'Move Left / Right', keys: 'Arrow Left / Right' },
        { type: 'Jump', keys: 'Z' },
        { type: 'Start / Pause', keys: 'Enter' },
    ],
})

const form = ref(emptyForm())

const addMovementRow = () => form.value.movement.push({ type: '', keys: '' })
const onRomChange = (ev) => { romFile.value = ev.target.files[0] || null }
const onCoverChange = (ev) => { coverFile.value = ev.target.files[0] || null }

const submit = async () => {
    error.value = ''
    success.value = null

    if (!romFile.value) {
        error.value = 'Please choose a ROM file.'
        return
    }

    const genre = form.value.genre_text.split(',').map(g => g.trim()).filter(Boolean)
    if (genre.length === 0) {
        error.value = 'Please provide at least one genre.'
        return
    }
    if (form.value.movement.some(m => !m.type || !m.keys)) {
        error.value = 'Every control row needs a type and keys.'
        return
    }

    const body = new FormData()
    body.append('name', form.value.name)
    body.append('platform', form.value.platform)
    body.append('year', form.value.year)
    body.append('date_of_release', form.value.date_of_release)
    body.append('developer', form.value.developer)
    body.append('genre', JSON.stringify(genre))
    body.append('summary', form.value.summary)
    body.append('additional_summary', form.value.additional_summary)
    body.append('trivia', form.value.trivia)
    body.append('movement', JSON.stringify(form.value.movement))
    body.append('cover_url', form.value.cover_url)
    body.append('rom', romFile.value)
    if (coverFile.value) body.append('cover', coverFile.value)

    submitting.value = true
    try {
        const res = await $fetch('/api/admin/add-game', {
            method: 'POST',
            body,
            headers: { 'x-admin-key': admin_key.value },
        })
        success.value = res.game
        form.value = emptyForm()
        romFile.value = null
        coverFile.value = null
    } catch (e) {
        error.value = e?.data?.statusMessage || e?.message || 'Something went wrong.'
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped>
.input {
    border-radius: 0.5rem;
    background-color: #1E293B;
    color: white;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    outline: none;
    width: 100%;
}

.input:focus {
    box-shadow: 0 0 0 2px rgba(37, 140, 244, 0.3);
}
</style>
