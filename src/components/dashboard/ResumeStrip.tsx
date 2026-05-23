type Session = {
    subject: string
    topic: string
    questionsLeft: number
} | null

type Props = {
    session: Session
}

export default function ResumeStrip({ session }: Props) {
    if (!session) {
        return (
            <>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                <p className="font-semibold text-gray-900 text-sm"> No sessions yet </p>
                <p className="text-xs text-gray-400 mt-1">Start your first study session!</p>
                </div>
            <button onClick={() => {}} className="bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                Start Learning
            </button>
            </div>
            </>
        )
    }
    return (
        <>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">{session.subject}</p>
            <p className="font-semibold text-gray-900 text-sm">{session.topic}</p>
            <p className="text-xs text-gray-400">{session.questionsLeft} questions left</p>
        </div>
         
        <button onClick={() => {}} className="bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
            Resume Learning
        </button>
        </div>
        </>
)
}
