import { CircleCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function StatusAlert({ message }: { message: string }) {
    return (
        <Alert
            role="status"
            className="border-status-up/30 bg-status-up/10 motion-safe:animate-rise [&>svg]:text-status-up"
        >
            <CircleCheck />
            <AlertDescription className="text-foreground">
                {message}
            </AlertDescription>
        </Alert>
    );
}
