import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    hasNextPage: boolean;
    fetchNextPage: () => void;
    threshold?: number;
}

export function useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    threshold = 100,
}: UseInfiniteScrollOptions) {
    const [isFetching, setIsFetching] = useState(false);

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - threshold &&
            hasNextPage &&
            !isFetching
        ) {
            setIsFetching(true);
            fetchNextPage();
        }
    }, [hasNextPage, isFetching, fetchNextPage, threshold]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (!isFetching) return;
        // Reset fetching state after a reasonable time
        const timer = setTimeout(() => setIsFetching(false), 2000);
        return () => clearTimeout(timer);
    }, [isFetching]);

    return { isFetching };
}
