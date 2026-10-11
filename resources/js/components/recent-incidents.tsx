import { formatDuration, formatTimeAgo } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Incident } from '@/types';

export function RecentIncidents({
    incidents,
    now,
}: {
    incidents: Incident[];
    now: number;
}) {
    return (
        <section className="rounded-xl border bg-card">
            <h2 className="border-b px-4 py-3 text-sm font-medium">
                Recent incidents
            </h2>

            {incidents.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No incidents. Everything has been running smoothly.
                </p>
            ) : (
                <ol className="flex flex-col">
                    {incidents.map((incident) => {
                        const isOngoing = incident.resolved_at === null;
                        const endedAt =
                            incident.resolved_at === null
                                ? now
                                : new Date(incident.resolved_at).getTime();
                        const lastedSeconds =
                            (endedAt -
                                new Date(incident.started_at).getTime()) /
                            1000;

                        return (
                            <li
                                key={incident.id}
                                className="relative flex gap-3 px-4 py-3 not-last:after:absolute not-last:after:top-7 not-last:after:bottom-0 not-last:after:left-[19px] not-last:after:w-px not-last:after:bg-border"
                            >
                                <span
                                    className={cn(
                                        'mt-1.5 size-2 shrink-0 rounded-full',
                                        isOngoing
                                            ? 'bg-status-down'
                                            : 'bg-muted-foreground/40',
                                    )}
                                />
                                <div className="flex min-w-0 flex-col gap-0.5 text-sm">
                                    <span className="font-medium">
                                        {incident.monitor_name}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {incident.cause}
                                    </span>
                                    <span className="text-xs text-muted-foreground tabular-nums">
                                        {isOngoing ? (
                                            <span className="font-medium text-foreground">
                                                Ongoing for{' '}
                                                {formatDuration(lastedSeconds)}
                                            </span>
                                        ) : (
                                            <>
                                                Resolved after{' '}
                                                {formatDuration(lastedSeconds)}{' '}
                                                ·{' '}
                                                {formatTimeAgo(
                                                    incident.started_at,
                                                    now,
                                                )}
                                            </>
                                        )}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}
        </section>
    );
}
