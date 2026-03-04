'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GoldenButton from '@/components/ui/GoldenButton';
import { useSignupVerifyOtp, useSignupResendOtp } from '@/queries/use-auth';
import { otpSchema, type OtpFormData } from '@/validations/auth';
import { signupSessionUtils } from '@/utils/signup-session';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function EnterOtpPage() {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [resendTimer, setResendTimer] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { mutate: verifyOtp, isPending } = useSignupVerifyOtp();
    const { mutate: resendOtp, isPending: isResendPending } = useSignupResendOtp();

    const {
        handleSubmit,
        setError,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '',
        },
    });

    // Sync state to hook-form
    useEffect(() => {
        setValue('otp', otp.join(''), { shouldValidate: !!errors.otp });
    }, [otp]);

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleOtpChange = (index: number, value: string) => {
        // Clear errors
        clearErrors('otp');

        // Only allow single digit
        if (value.length > 1) {
            value = value.slice(-1);
        }

        // Only allow numbers
        if (value && !/^\d$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Move to next input on arrow right
        if (e.key === 'ArrowRight' && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        // Move to previous input on arrow left
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);

        if (!/^\d+$/.test(pastedData)) {
            return;
        }

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length && i < 4; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
        clearErrors('otp');

        // Focus the next empty input or the last one
        const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
        if (nextEmptyIndex !== -1) {
            inputRefs.current[nextEmptyIndex]?.focus();
        } else {
            inputRefs.current[3]?.focus();
        }
    };

    const onSubmit = (data: OtpFormData) => {
        const signupData = signupSessionUtils.getSignupData();

        const apiPayload = {
            otp: data.otp,
            username: signupData.username,
        };
        verifyOtp(apiPayload, {
            onSuccess: (response: any) => {
                console.log('verifyOtp', response);
                const signupToken = response.data?.signup_token || response.signup_token;
                if (signupToken) {
                    Cookies.set('signup_token', signupToken, {
                        expires: 1 / 24, // 1 hour
                        secure: process.env.NEXT_PUBLIC_SERVER === 'PRODUCTION',
                        sameSite: 'strict',
                        path: '/',
                    });
                }
                router.push('/setup-password');
            },
            onError: (error: any) => {
                setError('otp', {
                    type: 'server',
                    message: error?.message || 'OTP verification failed. Please try again.',
                });
            },
        });
    };

    const handleResendCode = () => {
        if (resendTimer > 0 || isResendPending) return;

        // Get stored signup data from cookies
        const signupData = signupSessionUtils.getSignupData();

        // Username is already formatted (phone with country code or email)
        const username = signupData.username;

        resendOtp(
            { username },
            {
                onSuccess: () => {
                    setResendTimer(30); // 30 second cooldown
                    setOtp(['', '', '', '']);
                    clearErrors('otp');
                    inputRefs.current[0]?.focus();
                },
                onError: (error: any) => {
                    setError('otp', {
                        type: 'server',
                        message: error?.message || 'Failed to resend OTP. Please try again.',
                    });
                },
            }
        );
    };

    // To handle global / root errors without breaking if field isn't explicitly otp
    const errorMessage = errors.otp?.message;

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
                <h1 className="text-2xl font-semibold text-[#4E3325] mb-3">Enter OTP</h1>
                <p className="text-sm text-[#7A7A7A] leading-relaxed">
                    Enter the otp received on your email or
                    <br />
                    mobile number & continue
                </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* OTP Input Boxes */}
                <div>
                    <div className="flex justify-center gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className={`w-16 h-16 text-center text-2xl font-semibold text-[#4E3325] border ${errors.otp ? 'border-red-500 hover:border-red-600 focus:border-red-600' : 'border-[#E7E4DD] hover:border-[#C4994A] focus:border-[#C4994A]'} rounded-lg bg-white outline-none transition-colors`}
                                autoComplete="one-time-code"
                            />
                        ))}
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 text-sm text-center mt-3">{errorMessage}</p>
                    )}
                </div>

                {/* Resend Code */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[#7A7A7A]">Don&apos;t get the code?</span>
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendTimer > 0 || isResendPending}
                        className={`font-medium transition-colors ${
                            resendTimer > 0 || isResendPending
                                ? 'text-[#B7AFA5] cursor-not-allowed'
                                : 'text-[#C4994A] hover:text-[#B38840] cursor-pointer'
                        }`}
                    >
                        {isResendPending
                            ? 'Resending...'
                            : resendTimer > 0
                              ? `Resend in ${resendTimer}s`
                              : 'Resend code'}
                    </button>
                </div>

                {/* Continue Button */}
                <GoldenButton
                    type="submit"
                    isLoading={isPending}
                    loadingText="Verifying..."
                    fullWidth
                    className="rounded-full py-3"
                >
                    Continue
                </GoldenButton>
            </form>

            {/* Change Email/Phone Link */}
            <p className="mt-8 text-center">
                <Link
                    href="/register"
                    className="text-sm text-[#C4994A] hover:text-[#B38840] font-medium transition-colors"
                >
                    Change email / phone number
                </Link>
            </p>
        </div>
    );
}
