import { supabase } from './supabase';

export async function completeTopic(subject: string, totalTopics: number) {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.rpc('increment_topic', {
        p_user_id: user!.id,
        p_subject: subject,
        p_total: totalTopics, 
    })

    if (error) console.error(error)
}

export async function fetchProgress() {
    const { data, error } = await supabase.from('subject_progress').select('subject, completed_topics, total_topics')

    // console.log('fetch progress data:', data)
    // console.log('fetch progress error:', error)
    if (error) return []

    return data.map(row => ({
        subject: row.subject,
        completed: row.completed_topics,
        total: row.total_topics,
        percent: Math.round((row.completed_topics / row.total_topics) * 100),
    }))

}
// This part is for solving and fetching data for the StatCard components which includes Steak, Overall Progress, and Topics Completed.
export async function fetchStats() {
    const { data: {user} } = await supabase.auth.getUser();
    
    if (!user) return null

    type ProgressRow = {
        completed_topics: number
        total_topics:number
    }
    const { data:progress } = await supabase
    .from('subject_progress')
    .select('completed_topics, total_topics')

    //topics reviewed + overall progress from subject_progress (StatCard)
    const totalCompleted = (progress ??[] as ProgressRow[]).reduce((sum: number, r: ProgressRow) => sum + r.completed_topics, 0) ?? 0
    const totalTopics = (progress ??[] as ProgressRow[]).reduce((sum: number, r: ProgressRow) => sum + r.total_topics, 0) ?? 0
    const overallPercent = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0


    //input today as active (+1 streak)

    await supabase.from('user_activity').upsert({ user_id: user.id, active_date: new Date().toISOString().split('T')[0] }, { onConflict: 'user_id, active_date'})

    //fetch streak

    const { data: streakData } = await supabase.rpc('get_streak', { p_user_id: user.id })

    return {
        topicsReviewed: totalCompleted,
        overallProgress: overallPercent,
        dayStreak: streakData ?? 0,
    }
}

export async function fetchLastSession() {
    const { data, error } = await supabase.from('last_session').select('subject, topic, questions_left').single()

    if (error || !data) return null

    const row = data as { subject: string, topic: string, questions_left: number }

    return {
        subject: row.subject,
        topic: row.topic,
        questionsLeft: row.questions_left,
    }
}

export async function fetchSubjectBySlug(slug: string) {
    const { data, error } = await supabase.from('subjects').select('id, name, slug, color').eq('slug', slug).single()

    if (error || !data ) return null
    return data as { id: string, name: string, slug: string, color: string }
}

export async function fetchTopicsBySubject(subjectId: string) {
    const { data, error } = await supabase.from('topics').select('id, name, description').eq('subject_id', subjectId)

    if (error || !data) return[]
    return data as {id: string, name: string, description: string}[]
}
export async function fetchQuestionsByTopic(topicId: string) {
    const { data, error } = await supabase.from('questions').select('id, text, option_a, option_b, option_c, option_d, correct_answer, explanation').eq('topic_id', topicId)
    
    if (error || !data) return[]
    return data as {id: string, text: string, option_a: string, option_b: string, option_c: string, option_d: string, correct_answer: number, explanation: string}[]
}
export async function fetchLastTopic(subjectId: string) {
    const { data, error } = await supabase.from('last_session').select('topic').eq('subject', subjectId).single()

    if (error || !data) return null
    return (data as { topic: string }).topic
}
export async function saveLastSession(subject: string, topic: string, questionsLeft: number) {
    const { data: {user} } = await supabase.auth.getUser();
    if (!user) return

    await supabase.from('last_session').upsert({user_id: user.id, subject, topic, questions_left: questionsLeft, updated_at: new Date().toISOString(),},{ onConflict: 'user_id'})
}