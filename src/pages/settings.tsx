import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import  useUser  from '../hooks/useUser'
import  { useTheme }  from '../context/ThemesContext'
import Avatar from '../components/Avatar'
import { User, Settings, Bell, HelpCircle } from 'lucide-react'
import { Sun, Moon, Monitor } from 'lucide-react' 
import { fetchProfile, updateProfile } from '../lib/ProgressBar'
import SettingsSkeleton from '../components/skeletons/SettingsSkeleton'

type Section = 'account' | 'preferences' | 'notifications' | 'support' 


export default function SettingsPage() {
    const navItems: {id: Section; label: string; icon: React.ReactNode }[] = [
        { id: 'account', label: 'Account & Profile', icon: <User size={16} /> },
        { id: 'preferences', label: 'Perefences', icon: <Settings size={16} />},
        { id: 'notifications', label: 'Notifications', icon: <Bell size={16} />},
        { id: 'support', label: 'Support & Info', icon: <HelpCircle size={16} />},
    ]
    const navigate = useNavigate()
    const user = useUser()
    const { theme, setTheme } = useTheme()
    const [activeSection, setActiveSection] = useState<Section>('account')
    const [emailNotifs, setEmailNotifs] = useState(true)
    const [timezone, setTimeZone] = useState('Asia/Manila')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        recovery_email: '',
        contact_number: '',
    })
    const [profileSaving, setProfileSaving] = useState(false)
    const [profileSaved, setProfileSaved] = useState(false)

    useEffect(() => {
        fetchProfile().then(data => {
            if (data) setProfile(data)
        })
    }, [])

    async function handleSignOut() {
        await supabase.auth.signOut()
        navigate('/login')
    }

    async function handleDeleteAccount() {
    const { data: { session } } = await supabase.auth.getSession()

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    })

    if (res.ok) {
        await supabase.auth.signOut()
        navigate('/login')
    } else {
            console.error('Failed to delete account:', await res.text())
        }
    }

    async function handleSaveProfile() {
        setProfileSaving(true)
        await updateProfile(profile)
        setProfileSaving(false)
        setProfileSaved(true)
        setTimeout(() => setProfileSaved(false), 2000)
    }

    

    return (
        <>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                    <span onClick={() => navigate('/')} className="cursor-pointer hover:text-violet-500 dark:hover:text-violet-400 transition-colors"> Dashboard </span>
                    <span>› </span>
                    <span className="text-gray-900 dark:text-white font-medium"> Settings </span>
                </div>
                {user && <Avatar avatar={user.avatar} initials={user.initials} name={user.name} />}
            </div>
            
            <div className="flex flex-1 max-w-7xl mx-auto w-full px-5 py-8 gap-6">
                {/*Sidebar component*/}
                <div className="w-64 shrink-0 flex flex-col gap-1">
                    {navItems.map(item => (
                        <div key={item.id} onClick={() => setActiveSection(item.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-sm font-medium ${
                            activeSection === item.id ? 'bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400': 'text-gray-600 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                <span>{item.icon}</span>{item.label}
                        </div>
                    ))}
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    {activeSection === 'account' && (
                        <>
                        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5">Account & Profile</h2>

                        {/* Avatar */}
                        <div className="flex items-center gap-4 mb-6">
                          {user && <Avatar avatar={user.avatar} initials={user.initials} name={user.name} />}
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">{user?.name}</p>
                                <p className="text-xs text-gray-400">{user?.email}</p>
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">First Name</label>
                                <input
                                type="text"
                                value={profile.first_name}
                                onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))}
                                placeholder="Juan"
                                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Last Name</label>
                                <input
                                type="text"
                                value={profile.last_name}
                                onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))}
                                placeholder="dela Cruz"
                                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        {/* Sign-in method */}
                        <div className="flex flex-col gap-1 mb-4">
                            <p className="text-xs text-gray-400 font-medium">Sign-in method</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                            {user?.provider === 'google' ? 'Google OAuth' : 'Email & Password'}
                            </p>
                        </div>

                        {/* Password */}
                        {user?.provider !== 'google' ? (
                            <div className="flex flex-col gap-1 mb-4">
                                <p className="text-xs text-gray-400 font-medium">Password</p>
                                <button
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-sm text-violet-500 hover:text-violet-600 text-left transition-colors"
                                >
                                    Change password →
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1 mb-4">
                                <p className="text-xs text-gray-400 font-medium">Password</p>
                                <p className="text-sm text-gray-400 italic">Managed by Google — not applicable</p>
                            </div>
                        )}

                        {/* Recovery Email */}
                        <div className="flex flex-col gap-1.5 mb-4">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Recovery Email</label>
                            <input
                                type="email"
                                value={profile.recovery_email}
                                onChange={e => setProfile(p => ({ ...p, recovery_email: e.target.value }))}
                                placeholder="recovery@email.com"
                                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                            />
                        </div>

                        {/* Contact Number */}
                        <div className="flex flex-col gap-1.5 mb-6">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Contact Number</label>
                            <input
                                type="tel"
                                value={profile.contact_number}
                                onChange={e => setProfile(p => ({ ...p, contact_number: e.target.value }))}
                                placeholder="+63 912 345 6789"
                                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveProfile}
                            disabled={profileSaving}
                            className="bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                        >
                            {profileSaving ? 'Saving...' : profileSaved ? 'Saved ✓' : 'Save Changes'}
                        </button>
                    </div>
                        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Sign Out</h2>
                            <p className="text-xs text-gray-400 mb-4">You will be redirected to the login page.</p>
                            <button
                                onClick={handleSignOut}
                                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>

                        {/* Delete Account */}
                        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-red-100 dark:border-red-900 shadow-sm">
                            <h2 className="text-base font-semibold text-red-500 mb-1">Delete Account</h2>
                            <p className="text-xs text-gray-400 mb-4">This will permanently delete your account and all progress data. This cannot be undone.</p>
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 text-red-500 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                                >
                                    Delete Account
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure?</p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                                    >
                                        Yes, delete
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                            </div>
                        
                        </>
                    )}

                    {/*Preferences */}
                    {activeSection === 'preferences' && (
                        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5">Preferences</h2>


                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"> Display Theme </p>
                                <div className="flex gap-2">
                                    {(['light', 'dark', 'system'] as const).map(t => (
                                        <button key={t} onClick={() => setTheme(t)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize flex items-center gap-2 |
                                            ${theme === t ? 'bg-violet-500 dark:bg-violet-600 text-white': 'bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                                            {t === 'light' && <Sun size={14} /> }
                                            {t === 'dark' && <Moon size={14} /> }
                                            {t === 'system' && <Monitor size={14} />}
                                            {t === 'system' ? 'System': t.charAt(0).toUpperCase() + t.slice(1)}
                                            </button>
                                    ))}
                                </div>
                            </div>

                            {/* Timezone */}
                            <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"> Timezone </p>
                                    <select value={timezone} onChange={e => setTimeZone(e.target.value)} className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 dark:focus:border-violet-600 transition-colors">
                                        <option value="Asia/Manila"> Asia/Manila (PHT, UTC+8)</option>
                                        <option value="America/New_York"> America/New_York (EST, UTC-5)</option>
                                        <option value="America/Los_Angeles">America/Los_Angeles (PST, UTC-8)</option>
                                        <option value="Europe/London">Europe/London (GMT, UTC+0)</option>
                                        <option value="Asia/Tokyo">Asia/Tokyo (JST, UTC+9)</option>
                                    </select>
                            </div>
                        </div>
                    )}

                    {/* Notifications */}
                    {activeSection === 'notifications' && (
                        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-5"> Notifications </h2>
                            <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300"> Email Notifications </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5"> Receive study reminders and progress updates via email </p>
                                </div>
                                <button onClick={() => setEmailNotifs(v => !v)} className={`w-11 h-6 rounded-full transition-colors relative ${emailNotifs ? 'bg-green-400' : 'bg-red-300 dark:bg-red-900'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${emailNotifs ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                             <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 italic">Push notifications are not available on this platform.</p>
                        </div>
                    )}
                     {activeSection === 'support' && (
                        <div className="flex flex-col gap-4">
                            <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5">About</h2>
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 dark:text-gray-500">App</span>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">Entrance Exam Reviewer</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 dark:text-gray-500">Version</span>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">1.0.0</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 dark:text-gray-500">Built with</span>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">React, TypeScript,p   Supabase, Tailwind</span>
                                    </div>
                                    </div>
                            </div>

                            {/* Hero / Made by */}
                            <div className="bg-gradient-to-br from-violet-50 dark:from-violet-950 to-white dark:to-gray-900 rounded-2xl p-6 border border-violet-100 dark:border-violet-900 shadow-sm">
                                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Made by</h2>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">The person behind this app</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-lg font-semibold text-violet-700 dark:text-violet-300">
                                        NF
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">Nicko Fajardo</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">Developer & Designer</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Support</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-500">For issues or feedback, reach out at:</p>
                                <p className="text-sm text-violet-500 dark:text-violet-400 mt-1">nickofajardo97@gmail.com</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </div>
        
        </>
    )

    
}