export const useAdminAuth = () => {
    const admin_key = useState('admin_key', () => '')
    const authed = useState('admin_authed', () => false)
    return { admin_key, authed }
}
