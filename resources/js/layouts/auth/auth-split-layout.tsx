import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import MonitorPreview from '@/components/monitor-preview';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-10 p-6 md:p-10">
                <Link
                    href={home()}
                    className="flex w-fit items-center gap-2.5 rounded-md font-semibold tracking-tight outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                    <AppLogoIcon className="size-7 text-foreground" />
                    {name}
                </Link>

                <div className="flex flex-1 items-center justify-center">
                    <div className="flex w-full max-w-sm flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-sm text-pretty text-muted-foreground">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>

            <aside
                aria-hidden="true"
                className="relative hidden items-center justify-center overflow-hidden border-l bg-muted/50 p-10 lg:flex"
            >
                <div
                    className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
                    style={{
                        backgroundImage:
                            'radial-gradient(var(--border) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                />
                <div className="relative flex w-full justify-center">
                    <MonitorPreview />
                </div>
            </aside>
        </div>
    );
}
