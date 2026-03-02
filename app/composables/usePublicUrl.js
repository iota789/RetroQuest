
export const usePublicUrl = (path) => {
    const { app } = useRuntimeConfig()
    const base = app.baseURL.endsWith('/') ? app.baseURL : `${app.baseURL}/`
    return `${base}${path}`
}