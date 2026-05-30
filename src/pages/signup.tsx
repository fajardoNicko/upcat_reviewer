import { useState } from 'react'
import { Link }from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Mail } from 'lucide-react'

export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleSignUp() {
        setError('')
        if (password != confirmPassword) return setError('Password does not match.')
        if (password.length < 6 ) return setError('Password must be atleast 6 characters.')
        setLoading(true)
        const { data, error } = await supabase.auth.signUp( { email, password })
        console.log('signup data: ', data)
        console.log('error', error)
        setLoading(false)
        if (error) return setError('error.message')
        setSuccess(true)
    }

    if (success) {
        return (
            <>
            <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
                <div className="bg-white dark:bg-gray-950 rounded-2xl p-10 border border-gray 100 dark:border-gray-800 shadow-sm flex flex-col gap-4 w-full max-w-sm text-center">
                    <Mail size={14} />
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white"> Check your email.</h1>
                    <p className="text-sm text-gray-400">We sent a confirmation link to <span className="text-gray-700 dark:text-gray-300 font-medium">{email}</span>. Click it to activate your account.</p>
                    <Link to="/login" className='text-sm text-violet-500 hover:text-violet-600 font-medium transition-colors'> Back to Login</Link>
                </div>
            </div>
            </>

        )
    }
    return (
        <>
        <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-10 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4 w-full max-w-sm">
                <div className="flex flex-col gap-1 mb-2">
                    <h1 className='text-2xl font-semibold text-gray-900 dark:text-white tracking-tight'>Create Account</h1>
                    <p className='text-sm text-gray-400'>Start tracking your progress today</p>
                </div>
                {error && (
                    <div className = 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs px-4 py-3 rounded-xl'>
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className='text-xs font-medium text-gray-500 dark:text-gray-400'> Email </label>
                    <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='johndoe@example.com' className='bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600' />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Password</label>
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
                        onKeyDown={e => e.key === 'Enter' && handleSignUp()}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                </div>
                <button
                    onClick={handleSignUp}
                    disabled={loading}
                    className="bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
                <p className="text-center text-xs text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-violet-500 hover:text-violet-600 font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
        </>
    )
}