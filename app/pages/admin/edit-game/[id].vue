<template>
    <div class="max-w-3xl mx-auto my-8 mx-3 lg:mx-auto px-3">
        <AdminAuthGate>
            <div v-if="!game" class="flex flex-col gap-4 mt-24 items-center text-center">
                <p class="text-2xl font-bold">Game not found</p>
                <NuxtLink to="/admin" class="text-[#258CF4] font-bold">&larr; Back to Games</NuxtLink>
            </div>
            <div v-else class="flex flex-col gap-6 py-8">
                <div>
                    <NuxtLink to="/admin" class="text-sm font-bold text-[#258CF4]">&larr; Back to Games</NuxtLink>
                    <p class="text-3xl font-bold mt-2">Edit Game</p>
                    <p class="text-sm text-[#94A3B8] mt-2">Update the game's details below. This writes directly to
                        games.json and public/roms — only works while running the dev server.</p>
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
                            <input v-model="form.genre_text" required class="input"
                                placeholder="Platformer, Action" />
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
                        <AdminFormField label="Replace ROM File (optional)">
                            <input type="file" class="input" @change="onRomChange" />
                        </AdminFormField>
                        <AdminFormField label="Replace Cover Image (optional)">
                            <input type="file" accept="image/*" class="input" @change="onCoverChange" />
                        </AdminFormField>
                    </div>
                    <AdminFormField label="Cover URL (used only if no new cover image is uploaded)">
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
                        Saved "{{ success.name }}" successfully.
                        <NuxtLink :to="`/games/${success._id}`" class="underline">View game</NuxtLink>
                    </p>

                    <button type="submit" :disabled="submitting"
                        class="bg-[#258CF4] px-8 py-3 rounded-md font-bold self-start disabled:opacity-50">
                        {{ submitting ? 'Saving...' : 'Save Changes' }}
                    </button>
                </form>
            </div>
        </AdminAuthGate>
    </div>
</template>

<script setup>
import { platforms } from "/assets/data/platforms.json";
import { games } from "/assets/data/games.json";
import { useAdminAuth } from '~/composables/useAdminAuth'

const { admin_key } = useAdminAuth()
const route = useRoute()

const game = ref(games.find(g => g._id === route.params.id) || null)

const form = ref(game.value ? {
    name: game.value.name,
    platform: game.value.platform,
    year: game.value.year,
    date_of_release: game.value.date_of_release,
    developer: game.value.developer,
    genre_text: game.value.genre.join(', '),
    summary: game.value.summary,
    additional_summary: game.value.additional_summary || '',
    trivia: game.value.trivia || '',
    cover_url: game.value.cover_url || '',
    movement: game.value.movement.map(m => ({ ...m })),
} : null)

const submitting = ref(false)
const error = ref('')
const success = ref(null)

const romFile = ref(null)
const coverFile = ref(null)

const addMovementRow = () => form.value.movement.push({ type: '', keys: '' })
const onRomChange = (ev) => { romFile.value = ev.target.files[0] || null }
const onCoverChange = (ev) => { coverFile.value = ev.target.files[0] || null }

const submit = async () => {
    error.value = ''
    success.value = null

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
    if (romFile.value) body.append('rom', romFile.value)
    if (coverFile.value) body.append('cover', coverFile.value)

    submitting.value = true
    try {
        const res = await $fetch(`/api/admin/edit-game/${game.value._id}`, {
            method: 'PUT',
            body,
            headers: { 'x-admin-key': admin_key.value },
        })
        success.value = res.game
        game.value = res.game
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
