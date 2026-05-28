import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUserExams, addUserExam, deleteUserExam } from '../lib/ProgressBar'
import type {UserExam} from '../lib/ProgressBar'
import useUser from '../hooks/useUser'
import Avatar from '../components/Avatar'
import { ChevronLeft, ChevronRight, Plus, Trash2, MapPin, FileText } from 'lucide-react'

// UP IS THE ONLY ONE WITH ANNOUNCED CAT
const HARDCODED_EXAMS = [
  { id: 'upcat-2026', name: 'UPCAT 2027', exam_date: '2026-08-01', location: 'Various UP Campuses', notes: 'University of the Philippines College Admission Test' }
]

type AllExam = UserExam & { isCustom?: boolean }

export default function CalendarPage() {
  const navigate = useNavigate()
  const user = useUser()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [userExams, setUserExams] = useState<UserExam[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newExam, setNewExam] = useState({ name: '', exam_date: '', location: '', notes: '' })
  const [adding, setAdding] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  useEffect(() => {
    fetchUserExams().then(setUserExams)
  }, [])

  const allExams: AllExam[] = [
    ...HARDCODED_EXAMS,
    ...userExams.map(e => ({ ...e, isCustom: true })),
  ].sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())

  const upcomingExams = allExams.filter(e => new Date(e.exam_date) >= new Date())

  async function handleAddExam() {
    if (!newExam.name || !newExam.exam_date) return
    setAdding(true)
    await addUserExam(newExam)
    console.log(newExam)
    const updated = await fetchUserExams()
    console.log(updated)
    setUserExams(updated)
    setNewExam({ name: '', exam_date: '', location: '', notes: '' })
    setShowAddForm(false)
    setAdding(false)
  }

  async function handleDeleteExam(id: string) {
    await deleteUserExam(id)
    setUserExams(prev => prev.filter(e => e.id !== id))
  }

  // Calendar helpers
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  function getExamsOnDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return allExams.filter(e => e.exam_date === dateStr)
  }

  function getDayExams() {
    if (!selectedDay) return []
    return getExamsOnDay(selectedDay)
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
          <span onClick={() => navigate('/')} className="cursor-pointer hover:text-violet-500 transition-colors">Dashboard</span>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Calendar</span>
        </div>
        <div onClick={() => navigate('/settings')} className="cursor-pointer">
          {user && <Avatar avatar={user.avatar} initials={user.initials} name={user.name} />}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8 flex gap-6">

        {/* Left — Calendar */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Calendar Card */}
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={16} className="text-gray-500" />
              </button>
              <p className="font-semibold text-gray-900 dark:text-white">{monthName}</p>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {days.map(d => (
                <p key={d} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1">{d}</p>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before first day */}
              {[...Array(firstDay)].map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Day cells */}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1
                const examsOnDay = getExamsOnDay(day)
                const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year
                const isSelected = selectedDay === day

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                    className={`relative flex flex-col items-center py-2 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-violet-500 text-white'
                        : isToday
                        ? 'bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <p className="text-sm font-medium">{day}</p>
                    {examsOnDay.length > 0 && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-violet-400'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Selected Day Exams */}
            {selectedDay && getDayExams().length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
                  Exams on {monthName.split(' ')[0]} {selectedDay}
                </p>
                {getDayExams().map(exam => (
                  <div key={exam.id} className="flex items-start justify-between bg-violet-50 dark:bg-violet-950 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-violet-700 dark:text-violet-300">{exam.name}</p>
                      {exam.location && <p className="text-xs text-gray-400 mt-0.5">{exam.location}</p>}
                    </div>
                    {'isCustom' in exam && exam.isCustom && (
                      <button onClick={() => handleDeleteExam(exam.id)} className="text-red-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Exam Form */}
          {showAddForm && (
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Add Custom Exam</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Exam Name</label>
                  <input
                    type="text"
                    value={newExam.name}
                    onChange={e => setNewExam(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. USTET 2026"
                    className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Exam Date</label>
                  <input
                    type="date"
                    value={newExam.exam_date}
                    onChange={e => setNewExam(p => ({ ...p, exam_date: e.target.value }))}
                    className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Location (optional)</label>
                <input
                  type="text"
                  value={newExam.location}
                  onChange={e => setNewExam(p => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Ateneo de Manila"
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Notes (optional)</label>
                <input
                  type="text"
                  value={newExam.notes}
                  onChange={e => setNewExam(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Any additional info"
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddExam}
                  disabled={adding}
                  className="bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                >
                  {adding ? 'Adding...' : 'Add Exam'}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right — Upcoming Exams List */}
        <div className="w-80 shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">Upcoming Exams</p>
            <button
              onClick={() => setShowAddForm(v => !v)}
              className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={12} />
              Add Exam
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {upcomingExams.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">No upcoming exams</p>
            ) : (
              upcomingExams.map(exam => {
                const examDate = new Date(exam.exam_date)
                const daysLeft = Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

                return (
                  <div key={exam.id} className="bg-white dark:bg-gray-950 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{exam.name}</p>
                      {'isCustom' in exam && exam.isCustom && (
                        <button onClick={() => handleDeleteExam(exam.id)} className="text-red-400 hover:text-red-500 transition-colors shrink-0">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      {examDate.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    {exam.location && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <MapPin size={11} className="text-gray-400 shrink-0" />
                        <p className="text-xs text-gray-400">{exam.location}</p>
                      </div>
                    )}
                    {exam.notes && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <FileText size={11} className="text-gray-400 shrink-0" />
                        <p className="text-xs text-gray-400">{exam.notes}</p>
                      </div>
                    )}
                    <div className={`mt-2 text-xs font-medium px-2.5 py-1 rounded-lg inline-block ${
                      daysLeft <= 7
                        ? 'bg-red-50 dark:bg-red-950 text-red-500'
                        : daysLeft <= 30
                        ? 'bg-yellow-50 dark:bg-yellow-950 text-yellow-600'
                        : 'bg-green-50 dark:bg-green-950 text-green-600'
                    }`}>
                      {daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow!' : `${daysLeft} days left`}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}