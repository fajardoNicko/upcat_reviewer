import  ResumeStrip from "../components/dashboard/ResumeStrip";


import  StatCard  from "../components/dashboard/StatCard";
import  SubjectCard  from "../components/dashboard/SubjectCard";
import { useEffect, useState } from 'react'
import { fetchStats, fetchLastSession, fetchProgress } from '../lib/ProgressBar'

function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Morning'
    if (hour < 18) return 'Afternoon'
    return 'Evening'
}
export default function Dashboard() {
    const [stats, setStats] = useState({
        topicsReviewed: 0,
        overallProgress: 0,
        dayStreak: 0,
    })
    const [progress, setProgress] = useState<{
    subject: string
    completed: number
    total: number
    percent: number
    }[]>([])

    const [session, setSession] = useState<{
        subject: string
        topic: string
        questionsLeft: number
    } | null>(null)

    useEffect(() => {
        fetchStats().then(data => { if (data) setStats(data) })
        fetchProgress().then(data => { if (data) setProgress(data) })
        fetchLastSession().then(data => setSession(data))
    }, [])

// console.log('progress subjects:', progress.map(r => r.subject))
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-5 py-8">

                {/* Header */}
                <div className="relative flex items-center justify-center mb-7">
                    <div className="absolute left-0">
                        <p className="text-sm text-gray-400">Good {getGreeting()}!</p>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                        Entrance Exam Reviewer
                    </h1>
                    <div className="absolute right-0 w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-sm font-semibold text-violet-700 select-none">
                        NF
                    </div>
                </div>

                {/* StatCards */}
                <div className="grid grid-cols-3 gap-3 mb-7">
                    <StatCard label="Topics Reviewed" value={stats.topicsReviewed} />
                    <StatCard label="Overall Progress" value={stats.overallProgress} suffix="%" />
                    <StatCard label="Day Streak" value={stats.dayStreak} suffix=" 🔥" />
                </div>

                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-3">
                    Subjects
                </p>
                <div className="grid grid-cols-4 gap-3 mb-7">
                    <SubjectCard subject ="Science"
                    icon=""
                    topics={['Earth Science', 'Astronomy', 'Biology', 'Chemistry', 'Physics']}
                    completed={progress.find(r => r.subject === 'Science')?.completed ?? 0}
                    total={6}
                    />
                    <SubjectCard subject = "Mathematics"
                    icon=""
                    topics={['Arithmetic', 'Geometry', 'Algebra']}
                    completed={progress.find(r => r.subject === 'Mathematics')?.completed ?? 0}
                    total={5}
                    />
                    <SubjectCard subject = "Language Proficiency"
                    icon=""
                    topics={['Filipino', 'English']}
                    completed={progress.find(r => r.subject === 'Language Proficiency')?.completed ?? 0}
                    total={1}
                    />
                    <SubjectCard subject = "Reading Comprehension"
                    icon=""
                    topics={['Parts of Speech', 'Agreement', 'Bahagi ng Pananalita']}
                    completed={progress.find(r => r.subject === 'Reading Comprehension')?.completed ?? 0}
                    total={7}
                    />
                </div>

                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-3">
                    Continue Where You Left Off
                </p>
                <div className="w-full mb-7">
                    <ResumeStrip session={session} />
                </div>

            </div>
        </div>
    )
}