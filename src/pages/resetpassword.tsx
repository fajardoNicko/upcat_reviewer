import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleReset() {
        setError('')
        if (password !== confirmPassword) return setError('Passwords do not match')
        if (password.length < 6) return setError('Password must be at least 6 characters')
        setLoading(true)
        const { error } = await supabase.auth.updateUser({ password })
        setLoading(false)
        if (error) return setError(error.message)
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-10 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-5 w-full max-w-sm">

                <div className="flex flex-col gap-1 mb-2">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">New password</h1>
                    <p className="text-sm text-gray-400">Enter your new password below</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        onKeyDown={e => e.key === 'Enter' && handleReset()}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                </div>

                <button
                    onClick={handleReset}
                    disabled={loading}
                    className="bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                >
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </div>
        </div>
    )
}