
export const usePublicUrl = (path) => {
    const { app } = useRuntimeConfig()
    const base =  `${app.baseURL}/`
    console.log(`${base}${path}`)
    return `${base}${path}`
}