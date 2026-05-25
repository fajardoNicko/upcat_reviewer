import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Mail } from 'lucide-react'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleReset() {
        setError('')
        setLoading(true)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password',
        })
        setLoading(false)
        if (error) return setError(error.message)
        setSuccess(true)
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
                <div className="bg-white dark:bg-gray-950 rounded-2xl p-10 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4 w-full max-w-sm text-center">
                    <p className="text-2xl"><Mail size={14} /></p>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Check your email</h1>
                    <p className="text-sm text-gray-400">We sent a password reset link to <span className="text-gray-700 dark:text-gray-300 font-medium">{email}</span>.</p>
                    <Link to="/login" className="text-sm text-violet-500 hover:text-violet-600 font-medium transition-colors">
                        Back to login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-10 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-5 w-full max-w-sm">

                {/* Header */}
                <div className="flex flex-col gap-1 mb-2">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Reset password</h1>
                    <p className="text-sm text-gray-400">Enter your email and we'll send you a reset link</p>
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
                        placeholder="you@email.com"
                        onKeyDown={e => e.key === 'Enter' && handleReset()}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                </div>

                {/* Reset Button */}
                <button
                    onClick={handleReset}
                    disabled={loading}
                    className="bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                {/* Back to login */}
                <p className="text-center text-xs text-gray-400">
                    Remember your password?{' '}
                    <Link to="/login" className="text-violet-500 hover:text-violet-600 font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}