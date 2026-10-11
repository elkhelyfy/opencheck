export function formatDuration(totalSeconds: number): string {
    const seconds = Math.max(0, Math.round(totalSeconds));

    if (seconds < 60) {
        return `${seconds}s`;
    }

    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m`;
    }

    if (seconds < 86_400) {
        return `${Math.floor(seconds / 3600)}h`;
    }

    return `${Math.floor(seconds / 86_400)}d`;
}

export function formatTimeAgo(date: string | null, now: number): string {
    if (date === null) {
        return 'Never';
    }

    const seconds = (now - new Date(date).getTime()) / 1000;

    return seconds < 5 ? 'Just now' : `${formatDuration(seconds)} ago`;
}

export function formatInterval(seconds: number): string {
    return seconds < 60 ? `${seconds} sec` : `${seconds / 60} min`;
}

export function displayHost(url: string): string {
    try {
        return new URL(url).host;
    } catch {
        return url;
    }
}

export function daysUntil(date: string, now: number): number {
    return Math.floor((new Date(date).getTime() - now) / 86_400_000);
}
