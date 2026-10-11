import { Form, Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import StatusAlert from '@/components/status-alert';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

            {status && <StatusAlert message={status} />}

            <Form {...email.form()} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                autoFocus
                                placeholder="you@company.com"
                                aria-invalid={!!errors.email}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <Button
                            size="lg"
                            className="w-full"
                            disabled={processing}
                            data-test="email-password-reset-link-button"
                        >
                            {processing && <Spinner />}
                            {status ? 'Send the link again' : 'Send reset link'}
                        </Button>
                    </>
                )}
            </Form>

            <TextLink
                href={login()}
                className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground"
            >
                <ArrowLeft className="size-4" />
                Back to log in
            </TextLink>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Reset your password',
    description:
        "Enter the email you signed up with and we'll send you a link to choose a new password.",
};
