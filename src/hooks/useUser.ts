import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function useUser() {
    const [user, setUser] = useState<{
        name: string
        email: string
        avatar: string
        initials: string
        provider: string
    } | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session?.user) return
            const u = session.user
            const meta = u.user_metadata
            const provider = u.app_metadata?.provider ?? 'email'

            // Google has full_name, email users don't
            const name = meta?.full_name ?? meta?.name ?? u.email?.split('@')[0] ?? 'User'
            const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

            setUser({
                name,
                email: u.email ?? '',
                avatar: meta?.avatar_url ?? '',
                initials,
                provider,
            })
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session?.user) { setUser(null); return }
            const u = session.user
            const meta = u.user_metadata
            const provider = u.app_metadata?.provider ?? 'email'
            const name = meta?.full_name ?? meta?.name ?? u.email?.split('@')[0] ?? 'User'
            const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

            setUser({
                name,
                email: u.email ?? '',
                avatar: meta?.avatar_url ?? '',
                initials,
                provider,
            })
        })

        return () => subscription.unsubscribe()
    }, [])

    return user
}