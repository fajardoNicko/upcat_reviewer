

type Props = {
  subject: string
  icon: string
  topics: string[]
  completed: number
  total: number
}

export default function SubjectCard({ subject, icon, topics, completed, total }: Props) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
//console.log(subject, '-> completed:', completed, 'total:', total,' percent:', percent)
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
      
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-xl">
        {icon}
      </div>

      {/* Name */}
      <p className="font-bold text-gray-900 text-lg">{subject}</p>

      {/* Sample Topics */}
      <div className="flex flex-col gap-1 flex-1">
        {topics.slice(0, 3).map((topic, i) => (
          <p key={i} className="text-xs text-gray-400 truincate">• {topic}</p>
        ))}
      </div>

      {/* Progress Bar + Percentage */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full h-1">
          <div
            className="bg-violet-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 shrink-0">{percent}%</p>
      </div>

    </div>
  )
}