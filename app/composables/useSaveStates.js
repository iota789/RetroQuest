// Per-game save state storage.
// Preferred: a real folder on disk (File System Access API) with one sub-folder per game.
// Fallback (unsupported browser / no folder chosen): IndexedDB, grouped per game.

const DB_NAME = 'retroquest-saves'
const HANDLE_STORE = 'handles'
const STATE_STORE = 'states'

const openDb = () => new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
        const db = req.result
        db.createObjectStore(HANDLE_STORE)
        db.createObjectStore(STATE_STORE, { keyPath: 'id', autoIncrement: true })
            .createIndex('gameId', 'gameId')
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
})

const tx = async (store, mode, fn) => {
    const db = await openDb()
    return new Promise((resolve, reject) => {
        const t = db.transaction(store, mode)
        const result = fn(t.objectStore(store))
        t.oncomplete = () => resolve(result.result)
        t.onerror = () => reject(t.error)
    })
}

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'game'

export const useSaveStates = () => {
    const folderSupported = () => typeof window !== 'undefined' && 'showDirectoryPicker' in window

    const getRootHandle = async (requestAccess = false) => {
        if (!folderSupported()) return null
        const handle = await tx(HANDLE_STORE, 'readonly', s => s.get('root'))
        if (!handle) return null
        const opts = { mode: 'readwrite' }
        if ((await handle.queryPermission(opts)) === 'granted') return handle
        if (requestAccess && (await handle.requestPermission(opts)) === 'granted') return handle
        return null
    }

    // Must be called from a user gesture.
    const chooseFolder = async () => {
        const handle = await window.showDirectoryPicker({ id: 'retroquest-saves', mode: 'readwrite' })
        await tx(HANDLE_STORE, 'readwrite', s => s.put(handle, 'root'))
        return handle
    }

    const gameDir = async (root, game) => root.getDirectoryHandle(slugify(game.name), { create: true })

    const saveToFolder = async (root, game, state) => {
        const dir = await gameDir(root, game)
        const name = `${slugify(game.name)}-${new Date().toISOString().replace(/[:.]/g, '-')}.state`
        const writable = await (await dir.getFileHandle(name, { create: true })).createWritable()
        await writable.write(state)
        await writable.close()
        return `${dir.name}/${name}`
    }

    // Saves into <chosen folder>/<game>/ (created on first save, reused afterwards).
    // Falls back to browser storage when no folder can be used.
    const save = async (game, state) => {
        if (folderSupported()) {
            try {
                // No folder chosen yet: ask for one now (works while the save click is still fresh).
                const root = (await getRootHandle(true)) || (await chooseFolder())
                return { where: 'folder', name: await saveToFolder(root, game, state) }
            } catch (e) {
                console.warn('[saves] folder save failed, using browser storage', e)
            }
        }
        await tx(STATE_STORE, 'readwrite', s => s.add({ gameId: game.id, savedAt: Date.now(), data: state }))
        return { where: 'browser', name: game.name }
    }

    const latestFromFolder = async (game) => {
        const root = await getRootHandle(true).catch(() => null)
        if (!root) return null
        let dir
        try {
            dir = await root.getDirectoryHandle(slugify(game.name))
        } catch (e) {
            return null
        }
        let latest = null
        for await (const entry of dir.values()) {
            if (entry.kind !== 'file' || !entry.name.endsWith('.state')) continue
            const file = await entry.getFile()
            if (!latest || file.lastModified > latest.lastModified) latest = file
        }
        return latest && { savedAt: latest.lastModified, read: async () => new Uint8Array(await latest.arrayBuffer()) }
    }

    const latestFromBrowser = async (game) => {
        const rows = await tx(STATE_STORE, 'readonly', s => s.index('gameId').getAll(game.id))
        if (!rows.length) return null
        const row = rows.reduce((a, b) => (b.savedAt > a.savedAt ? b : a))
        return { savedAt: row.savedAt, read: async () => row.data }
    }

    // Newest saved state for this game across both storage locations, or null.
    const loadLatest = async (game) => {
        const candidates = (await Promise.all([
            latestFromFolder(game).catch(() => null),
            latestFromBrowser(game).catch(() => null)
        ])).filter(Boolean)
        if (!candidates.length) return null
        return candidates.reduce((a, b) => (b.savedAt > a.savedAt ? b : a)).read()
    }

    return { folderSupported, getRootHandle, chooseFolder, save, loadLatest }
}
