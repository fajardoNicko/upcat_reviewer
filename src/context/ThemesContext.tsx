import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

const ThemeContext = createContext<{
    theme: Theme
    setTheme: (t: Theme) => void
}>({ theme: 'system', setTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(
        () => (localStorage.getItem('theme') as Theme) ?? 'light'
    )

    function setTheme(t: Theme) {
        setThemeState(t)
        localStorage.setItem('theme', t)
    }

    useEffect(()=>{
        const root = document.documentElement
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (theme === 'dark' || (theme === 'system' && systemDark)) {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }

    }, [theme])
    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}