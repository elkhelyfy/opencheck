import { cn } from '@/lib/utils';
import type { CheckStatus } from '@/types';

type Slot = CheckStatus | 'empty';

const slotColor: Record<Slot, string> = {
    up: 'bg-status-up/80',
    down: 'bg-status-down',
    empty: 'bg-muted',
};

const slotLabel: Record<Slot, string> = {
    up: 'Up',
    down: 'Down',
    empty: 'No data yet',
};

export function UptimeBars({
    checks,
    length,
    className,
}: {
    checks: CheckStatus[];
    length: number;
    className?: string;
}) {
    const recentChecks = checks.slice(-length);
    const slots: Slot[] = [
        ...Array.from(
            { length: length - recentChecks.length },
            (): Slot => 'empty',
        ),
        ...recentChecks,
    ];
    const downCount = recentChecks.filter((check) => check === 'down').length;

    return (
        <div
            role="img"
            aria-label={`Last ${recentChecks.length} checks: ${recentChecks.length - downCount} up, ${downCount} down`}
            className={cn('flex h-7 gap-[2px]', className)}
        >
            {slots.map((slot, index) => {
                const checksAgo = slots.length - 1 - index;

                return (
                    <span
                        key={index}
                        aria-hidden="true"
                        className="group/bar relative flex flex-1"
                    >
                        <span
                            className={cn(
                                'flex-1 rounded-[2px] group-hover/bar:opacity-70',
                                slotColor[slot],
                            )}
                        />
                        <span
                            className={cn(
                                'pointer-events-none absolute bottom-full z-10 mb-1.5 rounded-md bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background opacity-0 shadow-sm group-hover/bar:opacity-100',
                                index < 6
                                    ? 'left-0'
                                    : index >= slots.length - 6
                                      ? 'right-0'
                                      : 'left-1/2 -translate-x-1/2',
                            )}
                        >
                            {slotLabel[slot]}
                            {slot !== 'empty' && (
                                <span className="opacity-60">
                                    {' · '}
                                    {checksAgo === 0
                                        ? 'latest check'
                                        : `${checksAgo} checks ago`}
                                </span>
                            )}
                        </span>
                    </span>
                );
            })}
        </div>
    );
}
