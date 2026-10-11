import {
    ArrowUpRight,
    CirclePause,
    CirclePlay,
    Ellipsis,
    Search,
    ShieldAlert,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
    displayStatus,
    MonitorStatusBadge,
    MonitorStatusDot,
} from '@/components/monitor-status';
import type { DisplayStatus } from '@/components/monitor-status';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { UptimeBars } from '@/components/uptime-bars';
import { RECENT_CHECKS_LENGTH } from '@/lib/fake-data';
import {
    daysUntil,
    displayHost,
    formatInterval,
    formatTimeAgo,
} from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Monitor } from '@/types';

type Filter = 'all' | DisplayStatus;

const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'down', label: 'Down' },
    { value: 'up', label: 'Up' },
    { value: 'paused', label: 'Paused' },
];

const SSL_WARNING_DAYS = 14;

const rowGrid =
    'grid grid-cols-[minmax(0,1fr)_auto_2rem] items-center gap-x-4 sm:grid-cols-[minmax(0,1fr)_4.5rem_4.5rem_6rem_2rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,11rem)_4.5rem_4.5rem_6rem_2rem]';

type Props = {
    monitors: Monitor[];
    now: number;
    newMonitorIds: Set<number>;
    onTogglePause: (monitor: Monitor) => void;
    onDelete: (monitor: Monitor) => void;
};

export function MonitorList({
    monitors,
    now,
    newMonitorIds,
    onTogglePause,
    onDelete,
}: Props) {
    const [filter, setFilter] = useState<Filter>('all');
    const [search, setSearch] = useState('');

    const query = search.trim().toLowerCase();
    const visibleMonitors = monitors.filter(
        (monitor) =>
            (filter === 'all' || displayStatus(monitor) === filter) &&
            (query === '' ||
                monitor.name.toLowerCase().includes(query) ||
                monitor.url.toLowerCase().includes(query)),
    );

    function countFor(value: Filter): number {
        return value === 'all'
            ? monitors.length
            : monitors.filter((monitor) => displayStatus(monitor) === value)
                  .length;
    }

    return (
        <section className="rounded-xl border bg-card">
            <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
                <div
                    role="group"
                    aria-label="Filter monitors by status"
                    className="flex w-fit gap-1 rounded-lg bg-muted p-1"
                >
                    {filters.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={filter === value}
                            onClick={() => setFilter(value)}
                            className={cn(
                                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium text-muted-foreground transition-colors duration-150 outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50',
                                filter === value &&
                                    'bg-background text-foreground shadow-xs',
                            )}
                        >
                            {label}
                            <span className="text-xs text-muted-foreground tabular-nums">
                                {countFor(value)}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="relative sm:w-64">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search monitors"
                        aria-label="Search monitors"
                        className="pl-9"
                    />
                </div>
            </div>

            <div
                className={cn(
                    rowGrid,
                    'hidden border-b px-4 py-2 text-xs font-medium text-muted-foreground sm:grid',
                )}
            >
                <span>Monitor</span>
                <span className="hidden lg:block">
                    Last {RECENT_CHECKS_LENGTH} checks
                </span>
                <span className="text-right">Uptime</span>
                <span className="text-right">Response</span>
                <span>Status</span>
                <span />
            </div>

            {visibleMonitors.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
                    <p className="text-sm text-muted-foreground">
                        No monitors match your filters.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setFilter('all');
                            setSearch('');
                        }}
                    >
                        Clear filters
                    </Button>
                </div>
            ) : (
                <ul className="divide-y">
                    {visibleMonitors.map((monitor) => (
                        <MonitorRow
                            key={monitor.id}
                            monitor={monitor}
                            now={now}
                            isNew={newMonitorIds.has(monitor.id)}
                            onTogglePause={onTogglePause}
                            onDelete={onDelete}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
}

function MonitorRow({
    monitor,
    now,
    isNew,
    onTogglePause,
    onDelete,
}: {
    monitor: Monitor;
    now: number;
    isNew: boolean;
    onTogglePause: (monitor: Monitor) => void;
    onDelete: (monitor: Monitor) => void;
}) {
    const status = displayStatus(monitor);
    const sslDaysLeft =
        monitor.ssl_expires_at === null
            ? null
            : daysUntil(monitor.ssl_expires_at, now);
    const sslExpiresSoon =
        sslDaysLeft !== null && sslDaysLeft <= SSL_WARNING_DAYS;

    return (
        <li
            className={cn(
                rowGrid,
                'px-4 py-3',
                isNew && 'motion-safe:animate-rise',
                status === 'down' && 'bg-status-down/[0.04]',
            )}
        >
            <div className="flex min-w-0 items-start gap-3">
                <span className="mt-1.5">
                    <MonitorStatusDot status={status} />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex min-w-0 items-center gap-2">
                        <span
                            className={cn(
                                'truncate text-sm font-medium',
                                status === 'paused' && 'text-muted-foreground',
                            )}
                        >
                            {monitor.name}
                        </span>
                        {sslExpiresSoon && (
                            <span
                                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-status-degraded/40 bg-status-degraded/10 px-1.5 text-xs"
                                title={`SSL certificate expires in ${sslDaysLeft} days`}
                            >
                                <ShieldAlert className="size-3 text-status-degraded" />
                                SSL {sslDaysLeft}d
                            </span>
                        )}
                    </div>
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                        <a
                            href={monitor.url}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate rounded-sm outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                            {displayHost(monitor.url)}
                        </a>
                        <span aria-hidden="true">·</span>
                        <span
                            className="shrink-0 tabular-nums"
                            title={`Checked every ${formatInterval(monitor.check_interval)}`}
                        >
                            {status === 'pending'
                                ? 'First check running'
                                : formatTimeAgo(monitor.last_checked_at, now)}
                        </span>
                    </div>
                </div>
            </div>

            <UptimeBars
                checks={monitor.recent_checks}
                length={RECENT_CHECKS_LENGTH}
                className={cn(
                    'hidden lg:flex',
                    status === 'paused' && 'opacity-50',
                )}
            />

            <span className="hidden text-right text-sm tabular-nums sm:block">
                {monitor.uptime_percentage === null
                    ? '—'
                    : `${monitor.uptime_percentage}%`}
            </span>

            <span className="hidden text-right text-sm text-muted-foreground tabular-nums sm:block">
                {monitor.response_time_ms === null || status !== 'up'
                    ? '—'
                    : `${monitor.response_time_ms} ms`}
            </span>

            <span>
                <MonitorStatusBadge status={status} />
            </span>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground"
                        aria-label={`Actions for ${monitor.name}`}
                    >
                        <Ellipsis />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                        <a href={monitor.url} target="_blank" rel="noreferrer">
                            <ArrowUpRight />
                            Open site
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onTogglePause(monitor)}>
                        {monitor.is_active ? <CirclePause /> : <CirclePlay />}
                        {monitor.is_active
                            ? 'Pause monitoring'
                            : 'Resume monitoring'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => onDelete(monitor)}
                    >
                        <Trash2 />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </li>
    );
}
