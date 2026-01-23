import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useAnalytics(toolSlug: string) {
    const [stats, setStats] = useLocalStorage<Record<string, number>>('tool_usage_stats', {});

    useEffect(() => {
        // Increment view count for this tool on mount
        setStats(prev => ({
            ...prev,
            [toolSlug]: (prev[toolSlug] || 0) + 1
        }));
    }, [toolSlug, setStats]);

    return {
        views: stats[toolSlug] || 0
    };
}
