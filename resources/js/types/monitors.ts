export type MonitorStatus = 'pending' | 'up' | 'down';

export type CheckStatus = 'up' | 'down';

export type Monitor = {
    id: number;
    name: string;
    url: string;
    check_interval: number;
    status: MonitorStatus;
    is_active: boolean;
    last_checked_at: string | null;
    response_time_ms: number | null;
    status_code: number | null;
    uptime_percentage: number | null;
    ssl_expires_at: string | null;
    recent_checks: CheckStatus[];
};

export type Incident = {
    id: number;
    monitor_id: number;
    monitor_name: string;
    cause: string;
    started_at: string;
    resolved_at: string | null;
};

export type NewMonitor = Pick<Monitor, 'name' | 'url' | 'check_interval'>;
