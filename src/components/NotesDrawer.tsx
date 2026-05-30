import { useEffect, useState, useRef, useCallback } from 'react'
import { X, NotebookPen, Save, CheckCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface NotesDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    lessonId: string;
    lessonTitle: string;
    userId: string;
}

type SaveStatus = 'idle' | 'saving' | 'saved';

export default function NotesDrawer({ isOpen, onClose, lessonId, lessonTitle, userId }: NotesDrawerProps ){
    const [ content, setContent ] = useState('');
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [loading, setLoading] = useState(true);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!isOpen || !lessonId) return;
        setLoading(true);
        setLoading(true);
        setSaveStatus('idle');

        supabase
            .from('user_lesson_notes')
            .select('content')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .maybeSingle()
            .then(({ data }) => {
                setContent(data?.content ?? "");
                setLoading(false);
                setTimeout(() => textareaRef.current?.focus(), 50);
            });
    }, [isOpen, lessonId, userId]);

    const save = useCallback(
        async (text: string) => {
            setSaveStatus('saving');
            await supabase.from('user_lesson_notes').upsert(
                {
                    user_id: userId,
                    lesson_id: lessonId,
                    content: text,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: "user_id, lesson_id" }
            );
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        },
        [userId, lessonId]
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setContent(text);
        setSaveStatus('idle');
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => save(text), 800);
    };

    useEffect(() => {
        return() => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    return (
        <>
        <div className={`fixed inset-0 z-30 transition-opacity duration-300 ${isOpen ? 'bg-black/20 dark:bg-black/40 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose} aria-hidden='true' />

        <aside className={`fixed top-0 right-0 h-full z-40 flex flex-col w-full max-w-sm bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl transition-transorm duration-300 ease-in-out ${isOpen ? 'translate-x-0': 'translate-x-full'}`} aria-label='Lesson Notes'>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <NotebookPen size={18} className='text-indigo-500 dark:text-indigo-400 shrink-0' />
                    <div className="min-w-0">
                        <p className='text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider'>Notes</p>
                        <p className='text-sm font-semibold text-gray-800 dark:text-gray-100 truncate'>{lessonTitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {saveStatus === 'saving' && (
                        <span className='flex items-center gap-1 text-xs text-gray-400'>
                            <Save size={13} className='animate-pulse' />
                            Saving...
                        </span>
                    )}
                    {saveStatus === 'saved' && (
                        <span className='flex items-center gap-1 text-xs text-emeral-500'>
                            <CheckCheck size={13} />
                            Saved
                        </span>
                    )}
                    <button onClick={onClose} className='p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors' aria-label='Close Notes'>
                        <X size={18} />
                    </button>
                </div>
            </div>
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
                {loading ? (
                    <div className='flex-1 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse' />
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleChange}
                        placeholder="Jot down key takeaways, formulas, or anything you want to remember from this lesson…"
                        className="flex-1 w-full resize-none rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/30 transition-colors leading-relaxed"
                    />
                )}
            </div>
            <p className='px-5 pb-4 text-xs text-gray-400 dark:text-gray-600 text-center shrink-0'>
                Notes are saved automatically as you type.
            </p>
        </aside>
        </>
    );

}