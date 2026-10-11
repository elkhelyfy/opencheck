import type { LucideIcon } from 'lucide-react';
import { CircleCheck, CirclePause, CircleX, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Monitor, MonitorStatus } from '@/types';

export type DisplayStatus = MonitorStatus | 'paused';

export function displayStatus(monitor: Monitor): DisplayStatus {
    return monitor.is_active ? monitor.status : 'paused';
}

const statusConfig: Record<
    DisplayStatus,
    { label: string; icon: LucideIcon; iconClassName: string }
> = {
    up: {
        label: 'Up',
        icon: CircleCheck,
        iconClassName: 'text-status-up',
    },
    down: {
        label: 'Down',
        icon: CircleX,
        iconClassName: 'text-status-down',
    },
    pending: {
        label: 'Checking',
        icon: LoaderCircle,
        iconClassName: 'animate-spin text-muted-foreground',
    },
    paused: {
        label: 'Paused',
        icon: CirclePause,
        iconClassName: 'text-muted-foreground',
    },
};

export function MonitorStatusBadge({ status }: { status: DisplayStatus }) {
    const { label, icon: Icon, iconClassName } = statusConfig[status];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
                status === 'down' && 'border-status-down/30 bg-status-down/10',
            )}
        >
            <Icon className={cn('size-3.5', iconClassName)} />
            {label}
        </span>
    );
}

export function MonitorStatusDot({ status }: { status: DisplayStatus }) {
    return (
        <span className="relative flex size-2 shrink-0">
            {status === 'down' && (
                <span className="absolute inset-0 rounded-full bg-status-down motion-safe:animate-pulse-ring" />
            )}
            <span
                className={cn(
                    'relative size-2 rounded-full',
                    status === 'up' && 'bg-status-up',
                    status === 'down' && 'bg-status-down',
                    status === 'pending' && 'bg-muted-foreground/50',
                    status === 'paused' &&
                        'border border-muted-foreground/60 bg-transparent',
                )}
            />
        </span>
    );
}
