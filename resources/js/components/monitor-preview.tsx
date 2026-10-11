import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type CheckStatus = 'up' | 'degraded' | 'down';

type PreviewMonitor = {
    name: string;
    url: string;
    uptime: string;
    responseTime: number;
    history: CheckStatus[];
};

const HISTORY_LENGTH = 40;

function history(incidents: Record<number, CheckStatus> = {}): CheckStatus[] {
    return Array.from(
        { length: HISTORY_LENGTH },
        (_, index) => incidents[index] ?? 'up',
    );
}

const monitors: PreviewMonitor[] = [
    {
        name: 'Marketing site',
        url: 'acme.com',
        uptime: '100%',
        responseTime: 182,
        history: history(),
    },
    {
        name: 'Public API',
        url: 'api.acme.com',
        uptime: '99.98%',
        responseTime: 94,
        history: history({ 11: 'degraded' }),
    },
    {
        name: 'Client store',
        url: 'bloombakery.co',
        uptime: '99.21%',
        responseTime: 318,
        history: history({
            27: 'degraded',
            28: 'down',
            29: 'down',
            30: 'degraded',
        }),
    },
];

const statusColor: Record<CheckStatus, string> = {
    up: 'bg-status-up/75',
    degraded: 'bg-status-degraded',
    down: 'bg-status-down',
};

const CHECK_INTERVAL_SECONDS = 60;

function useNextCheckCountdown(): number {
    const [secondsLeft, setSecondsLeft] = useState(42);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setSecondsLeft((seconds) =>
                seconds <= 1 ? CHECK_INTERVAL_SECONDS : seconds - 1,
            );
        }, 1000);

        return () => window.clearInterval(interval);
    }, []);

    return secondsLeft;
}

export default function MonitorPreview() {
    const secondsLeft = useNextCheckCountdown();

    return (
        <div className="flex w-full max-w-md flex-col gap-10">
            <div className="flex flex-col gap-3 motion-safe:animate-rise">
                <h2 className="text-3xl font-semibold tracking-tight text-balance">
                    Know before your users do.
                </h2>
                <p className="text-pretty text-muted-foreground">
                    We check your sites every minute, track response times and
                    SSL certificates, and alert you the moment something breaks.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <div
                    className="overflow-hidden rounded-xl border bg-background shadow-sm motion-safe:animate-rise"
                    style={{ animationDelay: '80ms' }}
                >
                    <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
                        <div className="flex items-center gap-2.5 text-sm font-medium">
                            <span className="relative flex size-2">
                                <span className="absolute inset-0 rounded-full bg-status-up motion-safe:animate-pulse-ring" />
                                <span className="relative size-2 rounded-full bg-status-up" />
                            </span>
                            All systems operational
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">
                            Next check in {secondsLeft}s
                        </span>
                    </div>

                    <ul className="divide-y">
                        {monitors.map((monitor) => (
                            <li
                                key={monitor.url}
                                className="flex flex-col gap-2.5 px-4 py-3.5"
                            >
                                <div className="flex items-baseline justify-between gap-4">
                                    <div className="flex min-w-0 items-baseline gap-2">
                                        <span className="truncate text-sm font-medium">
                                            {monitor.name}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {monitor.url}
                                        </span>
                                    </div>
                                    <div className="flex shrink-0 items-baseline gap-3 text-xs tabular-nums">
                                        <span className="text-muted-foreground">
                                            {monitor.responseTime} ms
                                        </span>
                                        <span className="font-medium">
                                            {monitor.uptime}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex h-6 gap-[3px]">
                                    {monitor.history.map((status, index) => (
                                        <span
                                            key={index}
                                            className={cn(
                                                'flex-1 rounded-[2px]',
                                                statusColor[status],
                                            )}
                                        />
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div
                    className="flex items-start gap-3 rounded-xl border bg-background px-4 py-3 text-sm shadow-sm motion-safe:animate-rise"
                    style={{ animationDelay: '160ms' }}
                >
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-status-up" />
                    <div className="flex flex-col gap-0.5">
                        <span className="font-medium">
                            bloombakery.co is back up
                        </span>
                        <span className="text-muted-foreground">
                            Down for 3 minutes (500 Internal Server Error).
                            Alert sent by email and Slack.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
