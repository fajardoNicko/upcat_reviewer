import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function useUser() {
  const [user, setUser] = useState<{
    name: string
    email: string
    avatar: string
    initials: string
  } | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session?.user) return
        const meta = session.user.user_metadata
        const name = meta.full_name ?? meta.name ?? 'User'
        const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        setUser({
            name,
            email: session.user.email ?? '',
            avatar: meta.avatar_url ?? '',
            initials,
        })
    })
  }, [])
  
  return user
}