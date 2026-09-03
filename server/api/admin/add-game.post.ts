import { promises as fs } from 'node:fs'
import path from 'node:path'

const PLATFORM_NAMES: Record<string, string> = {
    nes: 'Nintendo Entertainment System',
    gb: 'Game Boy',
    gba: 'Game Boy Advance',
    segaMD: 'Sega Genesis',
    snes: 'Super Nintendo Entertainment System',
}

const GAMES_JSON_PATH = path.resolve(process.cwd(), 'app/assets/data/games.json')

function sanitizeFilename(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function fieldValue(parts: any[], name: string): string | undefined {
    const part = parts.find((p) => p.name === name && !p.filename)
    return part ? part.data.toString('utf8').trim() : undefined
}

function fileValue(parts: any[], name: string) {
    return parts.find((p) => p.name === name && p.filename)
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const adminKey = getHeader(event, 'x-admin-key')
    if (!adminKey || adminKey !== config.adminKey) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid or missing admin key' })
    }

    const parts = await readMultipartFormData(event)
    if (!parts) {
        throw createError({ statusCode: 400, statusMessage: 'No form data received' })
    }

    const name = fieldValue(parts, 'name')
    const platform = fieldValue(parts, 'platform')
    const year = fieldValue(parts, 'year')
    const date_of_release = fieldValue(parts, 'date_of_release')
    const developer = fieldValue(parts, 'developer')
    const genreRaw = fieldValue(parts, 'genre')
    const summary = fieldValue(parts, 'summary')
    const additional_summary = fieldValue(parts, 'additional_summary') || ''
    const trivia = fieldValue(parts, 'trivia') || ''
    const movementRaw = fieldValue(parts, 'movement')
    const coverUrlField = fieldValue(parts, 'cover_url')

    const romFile = fileValue(parts, 'rom')
    const coverFile = fileValue(parts, 'cover')

    if (!name || !platform || !year || !date_of_release || !developer || !genreRaw || !summary || !movementRaw) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }
    if (!PLATFORM_NAMES[platform]) {
        throw createError({ statusCode: 400, statusMessage: `Unknown platform "${platform}"` })
    }
    if (!romFile) {
        throw createError({ statusCode: 400, statusMessage: 'ROM file is required' })
    }

    let genre: string[]
    let movement: { type: string; keys: string }[]
    try {
        genre = JSON.parse(genreRaw)
        movement = JSON.parse(movementRaw)
    } catch {
        throw createError({ statusCode: 400, statusMessage: 'genre/movement must be valid JSON' })
    }

    const romFilename = sanitizeFilename(romFile.filename!)
    const romDir = path.resolve(process.cwd(), 'public/roms', platform)
    await fs.mkdir(romDir, { recursive: true })
    const romDiskPath = path.join(romDir, romFilename)
    await fs.writeFile(romDiskPath, romFile.data)
    const romPublicPath = `/roms/${platform}/${romFilename}`

    let cover_url = coverUrlField || ''
    if (coverFile) {
        const coverFilename = sanitizeFilename(coverFile.filename!)
        const coverDir = path.resolve(process.cwd(), 'public/images/game_covers')
        await fs.mkdir(coverDir, { recursive: true })
        await fs.writeFile(path.join(coverDir, coverFilename), coverFile.data)
        cover_url = `/images/game_covers/${coverFilename}`
    }

    const raw = await fs.readFile(GAMES_JSON_PATH, 'utf8')
    const data = JSON.parse(raw)

    const newGame = {
        _id: crypto.randomUUID(),
        name,
        cover_url,
        platform,
        platform_name: PLATFORM_NAMES[platform],
        year: Number(year),
        date_of_release,
        developer,
        genre,
        summary,
        additional_summary,
        trivia,
        path: romPublicPath,
        movement,
    }

    data.games.push(newGame)
    await fs.writeFile(GAMES_JSON_PATH, JSON.stringify(data, null, 4) + '\n', 'utf8')

    return { success: true, game: newGame }
})
