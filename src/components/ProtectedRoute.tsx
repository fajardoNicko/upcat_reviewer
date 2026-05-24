import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<null | object>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()

    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
                <p className="text-gray-400 dark:text-gray-500 text-sm">Loading...
                </p>
            </div>
        )
    }
    if (!user) return <Navigate to="/login" replace />
    return <>{children}</>
}