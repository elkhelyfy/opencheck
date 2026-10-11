import type { CheckStatus, Incident, Monitor } from '@/types';

export const RECENT_CHECKS_LENGTH = 30;

const loadedAt = Date.now();

function secondsAgo(seconds: number): string {
    return new Date(loadedAt - seconds * 1000).toISOString();
}

function daysFromNow(days: number): string {
    return new Date(loadedAt + days * 86_400_000).toISOString();
}

function checks(downAt: number[] = []): CheckStatus[] {
    return Array.from({ length: RECENT_CHECKS_LENGTH }, (_, index) =>
        downAt.includes(index) ? 'down' : 'up',
    );
}

export const fakeMonitors: Monitor[] = [
    {
        id: 1,
        name: 'Client store',
        url: 'https://bloombakery.co',
        check_interval: 60,
        status: 'down',
        is_active: true,
        last_checked_at: secondsAgo(14),
        response_time_ms: null,
        status_code: 500,
        uptime_percentage: 97.42,
        ssl_expires_at: daysFromNow(61),
        recent_checks: checks([12, 24, 25, 26, 27, 28, 29]),
    },
    {
        id: 2,
        name: 'Marketing site',
        url: 'https://acme.com',
        check_interval: 60,
        status: 'up',
        is_active: true,
        last_checked_at: secondsAgo(9),
        response_time_ms: 182,
        status_code: 200,
        uptime_percentage: 100,
        ssl_expires_at: daysFromNow(74),
        recent_checks: checks(),
    },
    {
        id: 3,
        name: 'Public API',
        url: 'https://api.acme.com',
        check_interval: 30,
        status: 'up',
        is_active: true,
        last_checked_at: secondsAgo(4),
        response_time_ms: 94,
        status_code: 200,
        uptime_percentage: 99.98,
        ssl_expires_at: daysFromNow(52),
        recent_checks: checks([8]),
    },
    {
        id: 4,
        name: 'Documentation',
        url: 'https://docs.acme.com',
        check_interval: 300,
        status: 'up',
        is_active: true,
        last_checked_at: secondsAgo(131),
        response_time_ms: 236,
        status_code: 200,
        uptime_percentage: 99.91,
        ssl_expires_at: daysFromNow(9),
        recent_checks: checks(),
    },
    {
        id: 5,
        name: 'Staging',
        url: 'https://staging.acme.com',
        check_interval: 60,
        status: 'up',
        is_active: true,
        last_checked_at: secondsAgo(37),
        response_time_ms: 642,
        status_code: 200,
        uptime_percentage: 99.2,
        ssl_expires_at: daysFromNow(33),
        recent_checks: checks([3, 4]),
    },
    {
        id: 6,
        name: 'Portfolio',
        url: 'https://janedoe.dev',
        check_interval: 600,
        status: 'up',
        is_active: true,
        last_checked_at: secondsAgo(288),
        response_time_ms: 121,
        status_code: 200,
        uptime_percentage: 100,
        ssl_expires_at: daysFromNow(120),
        recent_checks: checks(),
    },
    {
        id: 7,
        name: 'Old blog',
        url: 'https://blog.acme.com',
        check_interval: 60,
        status: 'up',
        is_active: false,
        last_checked_at: secondsAgo(2 * 86_400),
        response_time_ms: 310,
        status_code: 200,
        uptime_percentage: 99.6,
        ssl_expires_at: daysFromNow(40),
        recent_checks: checks([17]),
    },
];

export const fakeIncidents: Incident[] = [
    {
        id: 3,
        monitor_id: 1,
        monitor_name: 'Client store',
        cause: '500 Internal Server Error',
        started_at: secondsAgo(6 * 60 + 14),
        resolved_at: null,
    },
    {
        id: 2,
        monitor_id: 3,
        monitor_name: 'Public API',
        cause: 'Timed out after 30 seconds',
        started_at: secondsAgo(26 * 3600),
        resolved_at: secondsAgo(26 * 3600 - 3 * 60),
    },
    {
        id: 1,
        monitor_id: 5,
        monitor_name: 'Staging',
        cause: '502 Bad Gateway',
        started_at: secondsAgo(2 * 86_400 + 4 * 3600),
        resolved_at: secondsAgo(2 * 86_400 + 4 * 3600 - 11 * 60),
    },
];
