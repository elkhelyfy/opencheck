import { useEffect, useState } from 'react';

export function useNow(refreshEveryMs: number = 10_000): number {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const interval = window.setInterval(
            () => setNow(Date.now()),
            refreshEveryMs,
        );

        return () => window.clearInterval(interval);
    }, [refreshEveryMs]);

    return now;
}
