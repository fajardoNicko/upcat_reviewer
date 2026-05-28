import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchSubjectBySlug, fetchTopicsBySubject, fetchQuestionsByTopic, fetchQuestionsByLesson, saveLastSession, fetchLessonByTopic, saveLessonProgress, fetchLessonProgress, completeTopic } from '../lib/ProgressBar'
import useUser from '../hooks/useUser'
import Avatar from '../components/Avatar'


type Subject = { id: string; name: string; slug: string; color: string }
type Topic = { id: string; name: string; description: string }
type Question = { id: string; text: string; option_a: string; option_b: string; option_c: string; option_d: string; correct_answer: number; explanation: string }
type Lesson = { id: string; title: string; order_index: number }

export default function SubjectPage() {
    const user = useUser()
    const { subjectId } = useParams()
    const navigate = useNavigate()

    const [subject, setSubject] = useState<Subject | null>(null)
    const [topics, setTopics] = useState<Topic[]>([])
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selected, setSelected] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(true)
    const [lessonMap, setLessonMap] = useState<Record<string, Lesson[]>>({})
    const [score, setScore] = useState(0)
    const [isLessonActive, setIsLessonActive] = useState(false)
    const [lessonResult, setLessonResult] = useState<Record<string, 'pass' | 'fail' | 'incomplete' >>({})
    const currentQuestion = questions[currentIndex]
    const options = ['option_a', 'option_b', 'option_c', 'option_d'] as const
    

    useEffect(() => {
    if (!subjectId) return

    const load = async () => {
        const data = await fetchSubjectBySlug(subjectId)
        if (!data) return
        setSubject(data)

        const topicsData = await fetchTopicsBySubject(data.id)
        if (!topicsData) return
        setTopics(topicsData)

        const map: Record<string, Lesson[]> = {}
        await Promise.all(
            topicsData.map(async topic => {
                const lessons = await fetchLessonByTopic(topic.id)
                map[topic.id] = lessons
            })
        )
        setLessonMap(map)

        
        const result: Record<string, 'pass' | 'fail' | 'incomplete'> = {}
        await Promise.all(
            Object.values(map).flat().map(async lesson => {
                const progress = await fetchLessonProgress(lesson.id)
                if (!progress) return
                if (!progress.completed) {
                    result[lesson.id] = 'incomplete'
                } else if (progress.score / progress.total >= 0.5) {
                    result[lesson.id] = 'pass'
                } else {
                    result[lesson.id] = 'fail'
                }
            })
        )
        setLessonResult(result)
        setLoading(false)
    }

    load()
}, [subjectId])

    async function handleSelectTopic(topic: Topic) {
        setSelectedTopic(topic)
        setSelectedLesson(null)
        setCurrentIndex(0)
        setSelected(null)
        setShowResult(false)
        const qs = await fetchQuestionsByTopic(topic.id)
        setQuestions(qs)
        if (subject) {
            await saveLastSession(subject.name, topic.name, qs.length)
        }
    }

    async function handleSelectLesson(lesson: Lesson, topic: Topic) {
        setSelectedLesson(lesson)
        setSelectedTopic(topic)
        setCurrentIndex(0)
        setSelected(null)
        setShowResult(false)
        const qs = await fetchQuestionsByLesson(lesson.id)
        setQuestions(qs)
        setScore(0)
        setIsLessonActive(true)
        const savedProgress = await fetchLessonProgress(lesson.id)
        if (savedProgress && !savedProgress.completed) {
            setCurrentIndex(savedProgress.current_question)
        } else {
            setCurrentIndex(0)
        }
        if (subject) {
            await saveLastSession(subject.name, topic.name, qs.length)
        }
    }
    

    function handleAnswer(index: number) {
        if (showResult) return
        setSelected(index)
        setShowResult(true)
        if (index === currentQuestion.correct_answer) {
            setScore(s => s + 1)
        }
    }

    function handleNext() {
        setSelected(null)
        setShowResult(false)
        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex)

        if (selectedLesson) {
            const completed = nextIndex >= questions.length

            if (completed && subject) {
                saveLessonProgress(selectedLesson.id, nextIndex, completed, score, questions.length)
                completeTopic(subject.name, lessonMap[selectedTopic?.id ?? '']?.length ?? 1)
                setIsLessonActive(false)
                // update local results
                setLessonResult(prev => ({
                    ...prev,
                    [selectedLesson.id]: score / questions.length >= 0.5 ? 'pass' : 'fail'
                }))
            }
            if (subject && selectedTopic) {
                saveLastSession(subject.name, selectedTopic.name, questions.length - currentIndex - 1)
            }
        }
    }



    return (
        <div className="h-screen bg-gray-100 dark:bg-black flex flex-col">
            
            <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                    <span onClick={() => navigate('/')} className="cursor-pointer hover:text-violet-500 dark:hover:text-violet-400 transition-colors">Dashboard</span>
                    <span>›</span>
                    <span onClick={() => navigate(`/subject/${subjectId}`)} className="cursor-pointer hover:text-violet-500 dark:hover:text-violet-400 transition-colors">{subject?.name}</span>
                    {selectedTopic && (
                        <>
                            <span>›</span>
                            <span className="text-gray-900 dark:text-white font-medium">{selectedTopic.name}</span>
                        </>
                    )}
                    {selectedLesson && (
                        <>
                            <span>›</span>
                            <span className="text-gray-900 dark:text-white font-medium">{selectedLesson.title}</span>
                        </>
                    )}
                </div>
                <div onClick={() => navigate('/settings')} className="cursor-pointer">
                    {user && <Avatar avatar={user.avatar} initials={user.initials} name={user.name} />}
                </div>
            </div>

            <div className="flex flex-1 max-w-7xl mx-auto w-full px-5 py-8 gap-6 overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 shrink-0 overflow-y-auto scrollbar-thin">
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-3">
                        Topics
                    </p>
                    {loading ? (
                        <p className="text-xs text-gray-400 dark:text-gray-500">Loading topics...</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {topics.map(topic => (
                                <div key={topic.id}>
                                    {/* Topic Row */}
                                    <div
                                        onClick={() => !isLessonActive && handleSelectTopic(topic)}
                                        className={`px-4 py-3 rounded-xl border transition-all mb-1 ${
                                        isLessonActive
                                            ? 'cursor-not-allowed opacity-50'
                                            : 'cursor-pointer hover:border-violet-200 dark:hover:border-violet-700'
                                    } ${
                                        selectedTopic?.id === topic.id && !selectedLesson
                                            ? 'border-violet-400 dark:border-violet-600 bg-violet-50 dark:bg-violet-950'
                                            : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-950'
                                    }`}
                                    >
                                        <p className={`text-sm font-medium ${
                                            selectedTopic?.id === topic.id && !selectedLesson
                                                ? 'text-violet-600 dark:text-violet-400'
                                                : 'text-gray-900 dark:text-white'
                                        }`}>
                                            {topic.name}
                                        </p>
                                    </div>

                                    {/* Lessons — always visible */}
                                    <div className="ml-4 flex flex-col gap-1">
                                        {(lessonMap[topic.id] ?? []).map(l => (
                                            <div
                                                key={l.id}
                                                onClick={() => !isLessonActive && handleSelectLesson(l, topic)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                                    isLessonActive
                                                        ? 'cursor-not-allowed opacity-50'
                                                        : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900'
                                                } ${
                                                    selectedLesson?.id === l.id
                                                        ? 'bg-violet-50 dark:bg-violet-950'
                                                        : ''
                                                }`}
                                            >
                                                <div className={`w-1 h-1 rounded-full shrink-0 ${
                                                    selectedLesson?.id === l.id ? 'bg-violet-400' : 'bg-gray-300 dark:bg-gray-600'
                                                }`} />
                                                <p className={`text-xs ${
                                                    selectedLesson?.id === l.id
                                                        ? 'text-violet-600 dark:text-violet-400 font-medium'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                    {l.title}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto scrollbar-thin" >
                    {!selectedTopic && !selectedLesson ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-gray-300 dark:text-gray-600 text-lg font-medium">Select a topic to start learning.</p>
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-gray-300 dark:text-gray-600 text-lg font-medium">No questions yet for this topic</p>
                        </div>
                    ) : currentIndex >= questions.length ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                            
                            {/* Score */}
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${
                                score / questions.length >= 0.8
                                    ? 'border-green-400 text-green-500'
                                    : score / questions.length >= 0.5
                                    ? 'border-yellow-400 text-yellow-500'
                                    : 'border-red-400 text-red-500'
                            }`}>
                                {score}/{questions.length}
                            </div>

                            {/* Message */}
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {score / questions.length >= 0.8
                                    ? 'Lesson Complete! '
                                    : score / questions.length >= 0.5
                                    ? 'Not bad! Keep practicing'
                                    : 'Keep studying! You\'ll get it!'}
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm">
                                You got {score} out of {questions.length} correct in {selectedLesson?.title}
                            </p>

                            
                            <div className="flex gap-3 mt-2">
                                {/* Always show restart */}
                                <button
                                    onClick={() => { setCurrentIndex(0); setSelected(null); setShowResult(false); setScore(0); setIsLessonActive(false) }}
                                    className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                                >
                                    Restart Lesson
                                </button>

                               
                                {score / questions.length >= 0.5 ? (
                                    (() => {
                                        const currentTopicLessons = lessonMap[selectedTopic?.id ?? ''] ?? []
                                        const currentLessonIndex = currentTopicLessons.findIndex(l => l.id === selectedLesson?.id)
                                        const nextLesson = currentTopicLessons[currentLessonIndex + 1]
                                        return nextLesson ? (
                                            <button
                                                onClick={() => handleSelectLesson(nextLesson, selectedTopic!)}
                                                className="bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                                            >
                                                Next Lesson →
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => navigate('/')}
                                                className="bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                                            >
                                                Back to Dashboard
                                            </button>
                                        )
                                    })()
                                ) : (
                                    // Score below 50% — encourage retry, no next lesson
                                    <div className="bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-xl px-5 py-3 text-sm text-red-500 dark:text-red-400 text-center">
                                        Score at least 50% to unlock the next lesson
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-950 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-medium mb-6">
                                Question {currentIndex + 1} of {questions.length}
                            </p>
                            <p className="text-gray-900 dark:text-white font-semibold text-lg mb-8">
                                {currentQuestion.text}
                            </p>
                            <div className="flex flex-col gap-3 mb-6">
                                {options.map((key, i) => {
                                    const isCorrect = i === currentQuestion.correct_answer
                                    const isSelected = i === selected

                                    let style = 'border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-violet-200 dark:hover:border-violet-700'
                                    if (showResult) {
                                        if (isCorrect) style = 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400'
                                        else if (isSelected) style = 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400'
                                        else style = 'border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-600'
                                    }

                                    return (
                                        <div
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            className={`border rounded-xl px-5 py-3.5 text-sm transition-all ${style} ${!showResult ? 'cursor-pointer' : 'cursor-default'}`}
                                        >
                                            <span className="font-medium mr-3">{['A', 'B', 'C', 'D'][i]}.</span>
                                            {currentQuestion[key]}
                                        </div>
                                    )
                                })}
                            </div>
                            {showResult && (
                                <div className="flex flex-col gap-4">
                                    {currentQuestion.explanation && (
                                        <div className="bg-gray-50 dark:bg-black rounded-xl px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Explanation: </span>
                                            {currentQuestion.explanation}
                                        </div>
                                    )}
                                    <button
                                        onClick={handleNext}
                                        className="self-end bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                                    >
                                        {currentIndex + 1 >= questions.length ? 'Finish' : 'Next Question →'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
    }
