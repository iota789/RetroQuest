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

    const save = async (game, state) => {
        const stamp = new Date().toISOString().replace(/[:.]/g, '-')
        const root = await getRootHandle(true).catch(() => null)
        if (root) {
            const dir = await gameDir(root, game)
            const name = `${slugify(game.name)}-${stamp}.state`
            const writable = await (await dir.getFileHandle(name, { create: true })).createWritable()
            await writable.write(state)
            await writable.close()
            return { where: 'folder', name: `${dir.name}/${name}` }
        }
        await tx(STATE_STORE, 'readwrite', s => s.add({ gameId: game.id, savedAt: Date.now(), data: state }))
        return { where: 'browser', name: game.name }
    }

    return { folderSupported, getRootHandle, chooseFolder, save }
}
