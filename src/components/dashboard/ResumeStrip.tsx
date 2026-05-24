import { useNavigate } from 'react-router-dom'

type Session = {
    subject: string
    topic: string
    questionsLeft: number
} | null

type Props = {
    session: Session
}

export default function ResumeStrip({ session }: Props) {
    const navigate = useNavigate()


    if (!session) {
        return (
            <>
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm"> No sessions yet </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start your first study session!</p>
                </div>
            <button onClick={() => navigate('/subject/science')} className="bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                Start Learning
            </button>
            </div>
            </>
        )
    }
    function getSlug(subject: string) {
        return subject.toLowerCase().replace(/ /g, '-')
    }
    return (
        <>
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
        <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-medium">{session.subject}</p>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{session.topic}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{session.questionsLeft} questions left</p>
        </div>

        <button onClick={() => navigate(`/subject/${getSlug(session.subject)}`)} className="bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
            Resume Learning
        </button>
        </div>
        </>
)
}
