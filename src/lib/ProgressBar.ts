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