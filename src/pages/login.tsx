import { supabase } from '../lib/supabase'

export default function Login() {
    async function handleGoogleLogin() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/'
            }
        })
    }
    return (
        <>
        <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-6 w-full max-w-sm">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight"> Entrance Exam Reviewer </h1>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Sign in to track your progress </p>
                </div>
                <button onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-sm text-gray-700 dark:text-gray-200 text-sm font-medium px-5 py-3 rounded-xl transition-all">
                    Continue with Google
                </button>
            </div>
        </div>
        </>
    )
}