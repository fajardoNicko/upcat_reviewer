import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchSubjectBySlug, fetchTopicsBySubject, fetchQuestionsByTopic, saveLastSession } from '../lib/ProgressBar'

type Subject = { id: string; name: string; slug: string; color: string; }
type Topic = { id: string; name: string; description: string; }
type Question = { id: string; text: string; option_a: string; option_b: string; option_c: string; option_d: string; correct_answer: number; explanation: string }

export default function SubjectPage() {
    const { subjectId } = useParams()
    const navigate = useNavigate()

    const [subject, setSubject] = useState<Subject | null>(null)
    const [topics, setTopics] = useState<Topic[]>([])
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selected, setSelected] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)

    const options = ['option_a', 'option_b', 'option_c', 'option_d'] as const

    useEffect(() => {
        if (!subjectId) return
        fetchSubjectBySlug(subjectId).then(data => {
            if (!data) return
            setSubject(data)
            fetchTopicsBySubject(data.id).then(topics => {
                if (topics) setTopics(topics)
            })
      
        })
    }, [subjectId])

async function handleSelectTopic( topic: Topic ) {
    setSelectedTopic(topic)
    setCurrentIndex(0)
    setSelected(null)
    setShowResult(false)
    const qs = await fetchQuestionsByTopic(topic.id)
    setQuestions(qs)
    if (subject) {
        await saveLastSession(subject.name, topic.name, qs.length)
    }
}
function handleAnswer(index: number) {
    if (showResult) return
    setSelected(index)
    setShowResult(true)
}
function handleNext() {
    setSelected(null)
    setShowResult(false)
    setCurrentIndex(i => i + 1)
    if (subject && selectedTopic) {
        saveLastSession(subject.name, selectedTopic.name, questions.length - currentIndex - 1)
    }
}
const currentQuestion = questions[currentIndex]

return (
    <>
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <span onClick={() => navigate('/')} className="cursor-pointer hover:text-violet-500 transition-colors">Dashboard</span>
                <span>,</span>
                <span onClick={() => navigate(`/subject/${subjectId}`)} className="cursor-pointer hover:text-violet-500 transition-colors">{subject?.name}</span>
                {selectedTopic && (
                    <>
                    <span>,</span>
                    <span className="text-gray-900 font-medium">{selectedTopic.name}</span>
                    </>
                )}
            </div>
            <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-sm font-semibold text-violet-700 select-none">
                NF
            </div>
        </div>
        <div className="flex flex-1 max-w-7xl mx-auto w-full px-5 py-8 gap-6">
            <div className="w-64 shrink-0">
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-3">
                    Topics
                </p>
                <div className="flex flex-col gap-2">
                    {topics.map(topic => (
                        <div key={topic.id} onClick = {() => handleSelectTopic(topic)} className={`bg-white rounded-xl px-4 py-3 border cursor-pointer transition-all ${selectedTopic?.id === topic.id ? 'border-violet-400 shadow-sm' : 'border-gray-100 hover:border-violet-200'}`}>
                            <p className={`text-sm font-medium ${selectedTopic?.id === topic.id ? 'text-violet-600' : 'text-gray-900'}`}>{topic.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1">
                {!selectedTopic ? (
                    <div className="h-full flex items-center justify-center">
                        <p className ="text-gray-300 text-lg font-medium"> Select a topic to start learning. </p>
                    </div>
                ): questions.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className ="text-gray-300 text-lg font-medium"> No questions yet for this topic </p>
                    </div>
                ): currentIndex >= questions.length ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <p className="text-2xl font-semibold text-gray-900">Topic Complete! 🎉</p>
              <p className="text-gray-400 text-sm">You've finished all questions in {selectedTopic.name}</p>
              <button
                onClick={() => { setCurrentIndex(0); setSelected(null); setShowResult(false) }}
                className="bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
              >
                Restart Topic
              </button>
            </div>
            ): (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                    <p className = "text-xs text-gray-400 uppercase tracking-widest font-medium mb-6"> Question { currentIndex + 1} of {questions.length} </p>
                    <p className = "text-gray-900 font-semibold text-lg mb-8">
                        {currentQuestion.text}
                    </p>
                    <div className="flex flex-col gap-3 mb-6">
                        {options.map((key, i ) => {
                            const isCorrect = i === currentQuestion.correct_answer
                            const isSelected = i === selected

                            let style = 'border-gray-100 text-gray-700 hover:border-violet-200'
                            if (showResult) {
                                if (isCorrect) style = 'border-green-400 bg-green-50 text-green-700'
                                else if (isSelected) style = 'border-red-400 bg-red-50 text-red-700'
                                else style = 'border-gray-100 text-gray-400'
                            }

                            return (
                                <div key={i} onClick ={() => handleAnswer(i)} className = {`border rounded-xl px-5 py-3.5 text-sm cursor-pointer transition-all ${style} ${!showResult ? 'cursor-pointer': 'cursor:default'}`}>
                                    <span className="font-medium mr-3"> {['A', 'B', 'C', 'D'][i]}.</span>
                                    {currentQuestion[key]}
                                </div>
                            )
                        })}
                    </div>
                    {showResult && (
                        <div className="flex flex-col gap-4">
                            {currentQuestion.explanation && (
                                <div className="bg-gray-50 rounded-xl px-5 py-4 text-sm text-gray-500">
                                    <span className="font-medium text-gray-700">Explanation: </span> {currentQuestion.explanation}
                                </div>
                            )}
                            <button onClick = {handleNext} className = "self-end bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"> {currentIndex + 1 >= questions.length ? 'Finish' : 'NextQuestion -> '} </button>
                        </div>
                    )}
                </div>
            )}
            </div>
        </div>
    </div>
    </>
)
}