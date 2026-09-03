export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const adminKey = getHeader(event, 'x-admin-key')
    if (!adminKey || adminKey !== config.adminKey) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid admin key' })
    }
    return { valid: true }
})
