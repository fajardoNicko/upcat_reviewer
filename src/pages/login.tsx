import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleLogin() {
        setError('')
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        setLoading(false)
        if (error) return setError(error.message)
        navigate('/')
    }

    async function handleGoogleLogin() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin + '/' }
        })
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-10 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-5 w-full max-w-sm">
                
                {/* Header */}
                <div className="flex flex-col gap-1 mb-2">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Welcome back</h1>
                    <p className="text-sm text-gray-400">Sign in to continue reviewing</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="johndoe@example.com"
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Password</label>
                        <Link to="/forgot-password" className="text-xs text-violet-500 hover:text-violet-600 transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                </div>

                {/* Sign In Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                    <span className="text-xs text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                </div>

                {/* Google */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
                >
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
                    Continue with Google
                </button>

                {/* Sign Up */}
                <p className="text-center text-xs text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-violet-500 hover:text-violet-600 font-medium transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}