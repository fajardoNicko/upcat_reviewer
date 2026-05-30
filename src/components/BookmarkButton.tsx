import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface BookmarkButtonProps {
    lessonId: string;
    userId: string;
    initialBookmarked: boolean;
    onToggle?: (bookmarked: boolean) => void;
    size?: "sm" | "md";
}

export default function BookmarkButton({ lessonId, userId, initialBookmarked, onToggle, size = "md"}: BookmarkButtonProps) {
    const [bookmarked, setBookmarked] = useState(initialBookmarked);
    const [loading, setLoading] = useState(false);
    
    const toggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (loading) return;
        setLoading(true);
        const next = !bookmarked;

        if (next) {
            await supabase.from('user_bookmarks').upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: 'user_id, lesson_id'});
        } else {
            await supabase.from('user_bookmarks').delete().eq('user_id', userId).eq('lesson_id', lessonId);
        }
        setBookmarked(next)
        setLoading(false)
        onToggle?.(next)
    }

    const iconSize = size === 'sm' ? 14:16;
    const btnSize = size === 'sm' ? 'p-1' : 'p-1.5'

    return (
        <button onClick={toggle} disabled={loading} aria-label={bookmarked ? 'Remove bookmark': 'Bookmark this lesson'} className={`${btnSize} rounded-lg transition-all duration-150 ${loading ? 'opacity-50 cursor-not-allowed': 'cursor-pointer'} ${bookmarked ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-gray-400 hover:text-amber-500 hover: bg-amber-50 dark:hover:bg-amber-900/20'}`}>
            <Bookmark size={iconSize} fill={bookmarked ? 'currentColor' : 'none'} strokeWidth={2} className='transition-transform duration-150 hover:scale-110' />
        </button>
    )
}