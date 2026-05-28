import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchActivityHistory } from '../lib/ProgressBar'
import useUser from '../hooks/useUser'
import Avatar from '../components/Avatar'
import {Flame} from 'lucide-react'

export default function StreakPage() {
  const navigate = useNavigate()
  const user = useUser()
  const [activityDates, setActivityDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivityHistory().then(data => {
      setActivityDates(new Set(data.map(d => d.active_date)))
      setLoading(false)
    })
  }, [])

  // Build last 52 weeks of dates
  const today = new Date()
  const weeks: Date[][] = []
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - (52 * 7))
  // align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay())

  let current = new Date(startDate)
  while (current <= today) {
    const week: Date[] = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    weeks.push(week)
  }

  function formatDate(date: Date) {
    return date.toISOString().split('T')[0]
  }

  function isActive(date: Date) {
    return activityDates.has(formatDate(date))
  }

  function isFuture(date: Date) {
    return date > today
  }

  const totalDays = activityDates.size
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // calculate current streak
  let streak = 0
  const check = new Date(today)
  while (activityDates.has(formatDate(check))) {
    streak++
    check.setDate(check.getDate() - 1)
  }

  // get month labels for the graph
  const monthLabels: { month: string; weekIndex: number }[] = []
  weeks.forEach((week, i) => {
    const firstOfWeek = week[0]
    if (firstOfWeek.getDate() <= 7) {
      monthLabels.push({ month: months[firstOfWeek.getMonth()], weekIndex: i })
    }
  })

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
          <span onClick={() => navigate('/')} className="cursor-pointer hover:text-violet-500 transition-colors">Dashboard</span>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Study Streak</span>
        </div>
        <div onClick={() => navigate('/settings')} className="cursor-pointer">
          {user && <Avatar avatar={user.avatar} initials={user.initials} name={user.name} />}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-7">
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-1">Current Streak</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-1"><span>{streak}</span> <Flame size={20} className='text-orange-500'/></p>
          </div>
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-1">Total Active Days</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalDays}</p>
          </div>
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-1">This Year</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {[...activityDates].filter(d => d.startsWith(today.getFullYear().toString())).length} days
            </p>
          </div>
        </div>

        {/* Contribution Graph */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm overflow-auto scrollbar-thin">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Study Activity</p>

          {loading ? (
            <p className="text-xs text-gray-400">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-flex flex-col gap-1 min-w-max">

                {/* Month labels */}
                <div className="flex gap-1 ml-8">
                  {weeks.map((week, i) => {
                    const label = monthLabels.find(m => m.weekIndex === i)
                    return (
                      <div key={i} className="w-3 text-[10px] text-gray-400">
                        {label ? label.month : ''}
                      </div>
                    )
                  })}
                </div>

                {/* Grid */}
                <div className="flex gap-1">
                  {/* Day labels */}
                  <div className="flex flex-col gap-1 mr-1">
                    {days.map((d, i) => (
                      <div key={d} className={`h-3 text-[10px] text-gray-400 flex items-center ${i % 2 === 0 ? '' : 'invisible'}`}>
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Weeks */}
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1">
                      {week.map((date, di) => {
                        const active = isActive(date)
                        const future = isFuture(date)
                        return (
                          <div
                            key={di}
                            title={`${formatDate(date)}${active ? ' — studied' : ''}`}
                            className={`w-3 h-3 rounded-sm transition-colors ${
                              future
                                ? 'bg-transparent'
                                : active
                                ? 'bg-violet-500 dark:bg-violet-400'
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 mt-2 ml-8">
                  <p className="text-[10px] text-gray-400">Less</p>
                  <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
                  <div className="w-3 h-3 rounded-sm bg-violet-200 dark:bg-violet-900" />
                  <div className="w-3 h-3 rounded-sm bg-violet-400 dark:bg-violet-600" />
                  <div className="w-3 h-3 rounded-sm bg-violet-500 dark:bg-violet-400" />
                  <p className="text-[10px] text-gray-400">More</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}