'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        // Simulate API call
        setTimeout(() => {
            setIsPending(false);
            setIsSubmitted(true);
        }, 1000);
    };

    if (isSubmitted) {
        return (
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Image
                        src="/images/user/crizbe-logo.svg"
                        alt="Crizbe"
                        width={150}
                        height={60}
                        priority
                    />
                </div>

                <div className="text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold text-[#4E3325] mb-3">
                        Check Your Email
                    </h1>
                    <p className="text-sm text-[#7A7A7A] mb-2">
                        We&apos;ve sent a password reset link to
                    </p>
                    <p className="text-sm text-[#4E3325] font-medium mb-6">
                        {email}
                    </p>
                    <p className="text-xs text-[#7A7A7A] mb-8">
                        Please check your inbox and click on the link to reset your password. 
                        If you don&apos;t see the email, check your spam folder.
                    </p>
                    <div className="space-y-4">
                        <Button
                            onClick={() => setIsSubmitted(false)}
                            className="w-full bg-[#C4994A] hover:bg-[#B38840] text-white font-medium py-3 rounded-full"
                        >
                            Resend Email
                        </Button>
                        <Link
                            href="/login"
                            className="block text-center text-[#C4994A] hover:text-[#B38840] text-sm font-medium transition-colors"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-8">
                <Image
                    src="/images/user/crizbe-logo.svg"
                    alt="Crizbe"
                    width={150}
                    height={60}
                    priority
                />
            </div>

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-[#4E3325] mb-3">
                    Forgot Password?
                </h1>
                <p className="text-sm text-[#7A7A7A] leading-relaxed">
                    No worries, we&apos;ll send you reset instructions.
                </p>
            </div>

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <FormInput
                    label="Email Address"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[#C4994A] hover:bg-[#B38840] text-white font-medium py-3 rounded-full"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Please wait...</span>
                        </>
                    ) : (
                        'Reset Password'
                    )}
                </Button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-8 text-center">
                <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-[#7A7A7A] hover:text-[#C4994A] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
}