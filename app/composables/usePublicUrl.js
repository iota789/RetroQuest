
export const usePublicUrl = (path) => {
    const { app } = useRuntimeConfig()
    const base =  `${app.baseURL}`
    return `${base}${path}`
}