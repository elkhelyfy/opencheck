import { Head } from '@inertiajs/react';
import { ArrowUpRight, CircleX, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import AddMonitorDialog from '@/components/add-monitor-dialog';
import AppLogoIcon from '@/components/app-logo-icon';
import { MonitorList } from '@/components/monitor-list';
import { RecentIncidents } from '@/components/recent-incidents';
import { Button } from '@/components/ui/button';
import { useNow } from '@/hooks/use-now';
import { fakeIncidents, fakeMonitors } from '@/lib/fake-data';
import { displayHost, formatDuration } from '@/lib/format';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { Incident, Monitor, NewMonitor } from '@/types';

const FIRST_CHECK_DELAY_MS = 2000;

function average(values: number[]): number | null {
    return values.length === 0
        ? null
        : values.reduce((sum, value) => sum + value, 0) / values.length;
}

export default function Dashboard() {
    const now = useNow();
    const [monitors, setMonitors] = useState<Monitor[]>(fakeMonitors);
    const [incidents] = useState<Incident[]>(fakeIncidents);
    const [newMonitorIds, setNewMonitorIds] = useState<Set<number>>(
        () => new Set(),
    );

    const activeMonitors = monitors.filter((monitor) => monitor.is_active);
    const downMonitors = activeMonitors.filter(
        (monitor) => monitor.status === 'down',
    );
    const upCount = activeMonitors.filter(
        (monitor) => monitor.status === 'up',
    ).length;

    function updateMonitor(id: number, changes: Partial<Monitor>) {
        setMonitors((current) =>
            current.map((monitor) =>
                monitor.id === id ? { ...monitor, ...changes } : monitor,
            ),
        );
    }

    function addMonitor(newMonitor: NewMonitor) {
        const id = Math.max(0, ...monitors.map((monitor) => monitor.id)) + 1;

        setMonitors((current) => [
            {
                ...newMonitor,
                id,
                status: 'pending',
                is_active: true,
                last_checked_at: null,
                response_time_ms: null,
                status_code: null,
                uptime_percentage: null,
                ssl_expires_at: null,
                recent_checks: [],
            },
            ...current,
        ]);
        setNewMonitorIds((current) => new Set(current).add(id));
        toast.success(`${newMonitor.name} added`, {
            description: 'Running the first check now.',
        });

        window.setTimeout(() => {
            updateMonitor(id, {
                status: 'up',
                last_checked_at: new Date().toISOString(),
                response_time_ms: 140 + Math.round(Math.random() * 120),
                status_code: 200,
                uptime_percentage: 100,
                ssl_expires_at: new Date(
                    Date.now() + 90 * 86_400_000,
                ).toISOString(),
                recent_checks: ['up'],
            });
        }, FIRST_CHECK_DELAY_MS);
    }

    function togglePause(monitor: Monitor) {
        updateMonitor(monitor.id, { is_active: !monitor.is_active });
        toast(
            monitor.is_active
                ? `Paused ${monitor.name}`
                : `Resumed ${monitor.name}`,
        );
    }

    function deleteMonitor(monitor: Monitor) {
        const index = monitors.findIndex(({ id }) => id === monitor.id);

        setMonitors((current) => current.filter(({ id }) => id !== monitor.id));
        toast(`Deleted ${monitor.name}`, {
            action: {
                label: 'Undo',
                onClick: () =>
                    setMonitors((current) => [
                        ...current.slice(0, index),
                        monitor,
                        ...current.slice(index),
                    ]),
            },
        });
    }

    const addButton = (
        <AddMonitorDialog onAdd={addMonitor}>
            <Button>
                <Plus />
                Add monitor
            </Button>
        </AddMonitorDialog>
    );

    return (
        <>
            <Head title="Monitors" />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Monitors
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {activeMonitors.length === 0
                                ? 'Add a site and we will check it around the clock.'
                                : downMonitors.length > 0
                                  ? `${downMonitors.length} of ${activeMonitors.length} active sites are down.`
                                  : `All ${activeMonitors.length} active sites are up.`}
                        </p>
                    </div>
                    {monitors.length > 0 && addButton}
                </header>

                {monitors.length === 0 ? (
                    <EmptyState addButton={addButton} />
                ) : (
                    <>
                        {downMonitors.map((monitor) => (
                            <DownAlert
                                key={monitor.id}
                                monitor={monitor}
                                incident={incidents.find(
                                    (incident) =>
                                        incident.monitor_id === monitor.id &&
                                        incident.resolved_at === null,
                                )}
                                now={now}
                            />
                        ))}

                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                            <StatTile
                                label="Up"
                                value={String(upCount)}
                                detail={`of ${activeMonitors.length} active`}
                            />
                            <StatTile
                                label="Down"
                                value={String(downMonitors.length)}
                                detail={
                                    downMonitors.length > 0
                                        ? 'Needs attention'
                                        : 'All good'
                                }
                                isAlert={downMonitors.length > 0}
                            />
                            <StatTile
                                label="Avg. response"
                                value={formatAverage(
                                    activeMonitors
                                        .filter(({ status }) => status === 'up')
                                        .map(
                                            ({ response_time_ms }) =>
                                                response_time_ms,
                                        ),
                                    (value) => `${Math.round(value)} ms`,
                                )}
                                detail="Latest checks"
                            />
                            <StatTile
                                label="Uptime"
                                value={formatAverage(
                                    activeMonitors.map(
                                        ({ uptime_percentage }) =>
                                            uptime_percentage,
                                    ),
                                    (value) => `${value.toFixed(2)}%`,
                                )}
                                detail="Last 30 days"
                            />
                        </div>

                        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                            <MonitorList
                                monitors={monitors}
                                now={now}
                                newMonitorIds={newMonitorIds}
                                onTogglePause={togglePause}
                                onDelete={deleteMonitor}
                            />
                            <RecentIncidents incidents={incidents} now={now} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

function formatAverage(
    values: (number | null)[],
    format: (value: number) => string,
): string {
    const result = average(
        values.filter((value): value is number => value !== null),
    );

    return result === null ? '—' : format(result);
}

function StatTile({
    label,
    value,
    detail,
    isAlert = false,
}: {
    label: string;
    value: string;
    detail: string;
    isAlert?: boolean;
}) {
    return (
        <div
            className={cn(
                'flex flex-col gap-1 rounded-xl border bg-card px-4 py-3',
                isAlert && 'border-status-down/30',
            )}
        >
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {isAlert && <CircleX className="size-3.5 text-status-down" />}
                {label}
            </span>
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
                {value}
            </span>
            <span className="text-xs text-muted-foreground">{detail}</span>
        </div>
    );
}

function DownAlert({
    monitor,
    incident,
    now,
}: {
    monitor: Monitor;
    incident: Incident | undefined;
    now: number;
}) {
    return (
        <div
            role="alert"
            className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-status-down/30 bg-status-down/[0.06] px-4 py-3"
        >
            <CircleX className="size-5 shrink-0 text-status-down" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm">
                <span className="font-medium">{monitor.name} is down</span>
                <span className="text-muted-foreground">
                    {displayHost(monitor.url)}
                    {monitor.status_code !== null &&
                        ` returned ${monitor.status_code}`}
                    {incident &&
                        ` · down for ${formatDuration((now - new Date(incident.started_at).getTime()) / 1000)}`}
                    {' · '}We've sent you an alert by email.
                </span>
            </div>
            <Button variant="outline" size="sm" asChild>
                <a href={monitor.url} target="_blank" rel="noreferrer">
                    Open site
                    <ArrowUpRight />
                </a>
            </Button>
        </div>
    );
}

function EmptyState({ addButton }: { addButton: ReactNode }) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 rounded-xl border border-dashed px-6 py-20 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl border bg-card shadow-xs">
                <AppLogoIcon className="size-6 text-foreground" />
            </div>
            <div className="flex max-w-sm flex-col gap-1.5">
                <h2 className="font-semibold">Add your first monitor</h2>
                <p className="text-sm text-pretty text-muted-foreground">
                    Paste the address of a site or API. We'll check it every
                    minute and tell you the moment it stops responding.
                </p>
            </div>
            {addButton}
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Monitors',
            href: dashboard(),
        },
    ],
};
