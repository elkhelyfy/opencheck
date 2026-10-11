import type { FormEvent, PropsWithChildren } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { displayHost } from '@/lib/format';
import type { NewMonitor } from '@/types';

const intervalOptions = [
    { value: 30, label: 'Every 30 seconds' },
    { value: 60, label: 'Every minute' },
    { value: 300, label: 'Every 5 minutes' },
    { value: 600, label: 'Every 10 minutes' },
];

function normalizeUrl(value: string): string | null {
    const trimmed = value.trim();

    if (trimmed === '') {
        return null;
    }

    const withScheme = /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;

    try {
        const url = new URL(withScheme);

        return url.hostname.includes('.')
            ? url.toString().replace(/\/$/, '')
            : null;
    } catch {
        return null;
    }
}

export default function AddMonitorDialog({
    onAdd,
    children,
}: PropsWithChildren<{ onAdd: (monitor: NewMonitor) => void }>) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <AddMonitorForm
                    key={String(open)}
                    onAdd={(monitor) => {
                        onAdd(monitor);
                        setOpen(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}

function AddMonitorForm({ onAdd }: { onAdd: (monitor: NewMonitor) => void }) {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [checkInterval, setCheckInterval] = useState('60');
    const [urlError, setUrlError] = useState<string>();

    const normalizedUrl = normalizeUrl(url);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (normalizedUrl === null) {
            setUrlError('Enter a valid address, like example.com');

            return;
        }

        onAdd({
            url: normalizedUrl,
            name: name.trim() || displayHost(normalizedUrl),
            check_interval: Number(checkInterval),
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
            <DialogHeader>
                <DialogTitle>Add a monitor</DialogTitle>
                <DialogDescription>
                    We'll start checking this address right away and alert you
                    if it stops responding.
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                        id="url"
                        name="url"
                        inputMode="url"
                        autoComplete="url"
                        autoFocus
                        placeholder="https://example.com"
                        value={url}
                        onChange={(event) => {
                            setUrl(event.target.value);
                            setUrlError(undefined);
                        }}
                        aria-invalid={urlError !== undefined}
                    />
                    <InputError message={urlError} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="name">
                        Name{' '}
                        <span className="font-normal text-muted-foreground">
                            (optional)
                        </span>
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        autoComplete="off"
                        placeholder={
                            normalizedUrl
                                ? displayHost(normalizedUrl)
                                : 'My website'
                        }
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="check_interval">Check frequency</Label>
                    <Select
                        name="check_interval"
                        value={checkInterval}
                        onValueChange={setCheckInterval}
                    >
                        <SelectTrigger id="check_interval" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {intervalOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={String(option.value)}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DialogFooter className="gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <Button type="submit">Start monitoring</Button>
            </DialogFooter>
        </form>
    );
}
