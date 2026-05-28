import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchWeakTopics } from '../lib/ProgressBar'
import type { WeakTopic } from '../lib/ProgressBar'

export default function WeakTopicsSummary() {
    const navigate = useNavigate()
    const [topics, setTopic] = useState<WeakTopic[]>([])

    useEffect(() => {
        fetchWeakTopics().then(data => setTopic(data.slice(0, 3)))
    }, [])

    if (topics.length === 0) return null

    return (
        <>
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm mb-7">
            <div className="flex items-center justify-between mb-4">
                <p className='text-[11px] uppercase tracking-widest text-gray-400 font-medium'> Needs Improvement </p>
                <button onClick={() => navigate('/weak=topics')} className='text-xs text-violet-500 hover:text-violet-600 font-medium transition-colors'> View All </button>
            </div>
            <div className="flex flex-col gap-3">
                {topics.map(topic => (
                    <div key={topic.topic_name}> 
                        <div className="flex items-center justify-between mb-1">
                            <div> 
                                <p className='text-sm font-medium text-gray-900 dark:text-white'>{topic.topic_name}</p>
                                <p className='text-xs text-gray-400'>{topic.subject_name}</p>
                            </div>
                            <p className={`text-sm font-semibold ${topic.avg_score >= 80 ? 'text-green-500' : topic.avg_score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{topic.avg_score}%</p>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full transition-all duration-500 ${
                                topic.avg_score >= 80 ? 'bg-green-400' :
                                topic.avg_score >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                                }`} style={{ width: `${topic.avg_score}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}