import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { subject } from '../types/subject';

export function useSubjects() {
    const [subjects, setSubjects] = useState<subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSubjects() {
            const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .order('name')

            if (error) {
                setError(error.message)
            } else {
                setSubjects(data ?? [] )
            }
            setLoading(false)
        }
        fetchSubjects();
    }, [])
    return {subjects, loading, error};
}