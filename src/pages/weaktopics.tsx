import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchWeakTopics } from '../lib/ProgressBar'
import type { WeakTopic } from '../lib/ProgressBar'
import useUser from '../hooks/useUser'
import Avatar from '../components/Avatar'

export default function WeakTopicsPage() {
    const navigate = useNavigate()
    const user = useUser()
    const [topics, setTopics] = useState<WeakTopic[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'weak' | 'average' | 'strong'>('all')

    useEffect(() => {
        fetchWeakTopics().then(data => {
            setTopics(data)
            setLoading(false)
        })
    }, [])

    const filtered = topics.filter(t => {
        if (filter === 'weak' ) return t.avg_score < 50
        if (filter === 'average') return t.avg_score >= 50 && t.avg_score < 80
        if (filter === 'strong') return t.avg_score >= 80
        return true
    })

    const weakCount = topics.filter(t => t.avg_score < 50).length
    const avgCount = topics.filter(t => t.avg_score >= 50 && t.avg_score < 80).length
    const strongCount = topics.filter(t => t.avg_score >= 80).length

    return (
        <>
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                    <span onClick={() => navigate('/')} className='cursor-pointer hover:text-violet-500 transition-colors'>Daskboard</span>
                    <span>›</span>
                    <span className='text-gray-900 dark:text-white font-medium'>Weak Topics</span>
                </div>
                <div onClick={() => navigate('/settings')} className='cursor-pointer'>
                    {user && <Avatar avatar={user.avatar} initials={user.initials} name={user.name} />}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-5 py-8">
                <div className="grid grid-cols-3 gap-3 mb-7">
                <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 border border-red-100 dark:border-red-900 shadow-sm">
                    <p className="text-[11px] uppercase tracking-widest text-red-400 font-medium mb-1">Needs Work</p>
                    <p className="text-2xl font-semibold text-red-500">{weakCount}</p>
                    <p className="text-xs text-gray-400 mt-0.5">below 50%</p>
                </div>
                <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 border border-yellow-100 dark:border-yellow-900 shadow-sm">
                    <p className="text-[11px] uppercase tracking-widest text-yellow-500 font-medium mb-1">Average</p>
                    <p className="text-2xl font-semibold text-yellow-500">{avgCount}</p>
                    <p className="text-xs text-gray-400 mt-0.5">50% - 79%</p>
                </div>
                <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 border border-green-100 dark:border-green-900 shadow-sm">
                    <p className="text-[11px] uppercase tracking-widest text-green-500 font-medium mb-1">Strong</p>
                    <p className="text-2xl font-semibold text-green-500">{strongCount}</p>
                    <p className="text-xs text-gray-400 mt-0.5">80% and above</p>
                </div>
                </div>
                <div className="flex gap-2 mb-5">
                    {(['all', 'weak', 'average', 'strong'] as const).map(f => (
                        <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                            filter === f
                            ? 'bg-violet-500 text-white'
                            : 'bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:border-violet-200'
                        }`}
                        >
                        {f === 'all' ? 'All Topics' : f === 'weak' ? 'Needs Work' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                {loading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                    ) : filtered.length === 0 ? (
                    <div className="bg-white dark:bg-gray-950 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-gray-300 dark:text-gray-600 text-lg font-medium">
                        {topics.length === 0 ? 'No data yet — complete some lessons first' : 'No topics in this category'}
                        </p>
                    </div>
                    ) : (
                    <div className="flex flex-col gap-3">
                        {filtered.map(topic => (
                        <div
                            key={topic.topic_name}
                            className="bg-white dark:bg-gray-950 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white text-sm">{topic.topic_name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{topic.subject_name} · {topic.attempts} attempt{topic.attempts !== 1 ? 's' : ''}</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-xl font-bold ${
                                topic.avg_score >= 80 ? 'text-green-500' :
                                topic.avg_score >= 50 ? 'text-yellow-500' : 'text-red-500'
                                }`}>{topic.avg_score}%</p>
                                <p className="text-xs text-gray-400">avg score</p>
                            </div>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-700 ${
                                topic.avg_score >= 80 ? 'bg-green-400' :
                                topic.avg_score >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                                }`}
                                style={{ width: `${topic.avg_score}%` }}
                            />
                            </div>
                            <div className="mt-3">
                            <button
                                onClick={() => navigate(`/subject/${topic.subject_name.toLowerCase().replace(/ /g, '-')}`)}
                                className="text-xs text-violet-500 hover:text-violet-600 font-medium transition-colors"
                            >
                                Review this topic →
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        </>
    )
}