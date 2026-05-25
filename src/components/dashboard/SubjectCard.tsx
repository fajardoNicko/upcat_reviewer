import { useNavigate } from 'react-router-dom'
import { type ReactNode } from 'react'

type Props = {
  subject: string
  icon: ReactNode
  topics: string[]
  completed: number
  total: number
}

export default function SubjectCard({ subject, icon, topics, completed, total }: Props) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const navigate = useNavigate()

  function handleClick() {
    const slug = subject.toLowerCase().replace(/ /g, '-')
    navigate(`/subject/${slug}`)
  }
//console.log(subject, '-> completed:', completed, 'total:', total,' percent:', percent)
  return (
    <div
    onClick = {handleClick}
    className="bg-white dark:bg-gray-950 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3 hover:shadow-md transition shadow cursor-pointer">


      <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-xl">
        {icon}
      </div>


      <p className="font-bold text-gray-900 dark:text-white text-lg">{subject}</p>


      <div className="flex flex-col gap-1 flex-1">
        {topics.slice(0, 3).map((topic, i) => (
          <p key={i} className="text-xs text-gray-400 dark:text-gray-500 truincate">• {topic}</p>
        ))}
      </div>


      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-100 dark:bg-black rounded-full h-1">
          <div
            className="bg-violet-500 dark:bg-violet-400 h-1 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{percent}%</p>
      </div>

    </div>
  )
}
