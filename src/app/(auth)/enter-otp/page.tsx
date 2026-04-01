'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GoldenButton from '@/components/ui/GoldenButton';
import { useVerifyOtp, useSignupResendOtp } from '@/queries/use-auth';
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

    const { mutate: verifyOtp, isPending } = useVerifyOtp();
    const { mutate: resendOtp, isPending: isResendPending } = useSignupResendOtp();
    const { executeRecaptcha } = useGoogleReCaptcha();

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
            purpose: signupData.purpose,
        };
        verifyOtp(apiPayload, {
            onSuccess: (response: any) => {
                const token = response.data?.token || response.token;
                if (token) {
                    Cookies.set('reset_token', token, {
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

    const handleResendCode = async () => {
        if (resendTimer > 0 || isResendPending || !executeRecaptcha) return;

        try {
            const token = await executeRecaptcha('resend_otp');

            // Get stored signup data from cookies
            const signupData = signupSessionUtils.getSignupData();

            // Username is already formatted (phone with country code or email)
            const username = signupData.username;

            resendOtp(
                { username, recaptcha_token: token },
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
        } catch (error) {
            console.error('Recaptcha error:', error);
            setError('otp', {
                type: 'server',
                message: 'Security check failed. Please try again.',
            });
        }
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
                <h1 className="text-2xl font-semibold font-bricolage text-[#191919] mb-3">
                    Login with OTP
                </h1>
                <p className="text-sm text-[#474747] leading-relaxed">
                    Enter the otp received on your email or
                    <br />
                    mobile number & continue
                </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 gap-2">
                {/* OTP Input Boxes */}
                <div>
                    <div className="flex justify-between ">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className={` w-[76px] h-[70px] xs:w-[91px] xs:h-[80px] sm:w-[91px] sm:h-[80px] md:w-[91px] md:h-[80px] text-center placeholder:text-[#D5D7DA] placeholder:text-[30px] text-2xl font-semibold text-[#4E3325] border ${errors.otp ? 'border-red-500 hover:border-red-600 focus:border-red-600' : 'border-[#E7E4DD] hover:border-[#C4994A] focus:border-[#C4994A]'} rounded-lg bg-white outline-none transition-colors`}
                                autoComplete="one-time-code"
                            />
                        ))}
                    </div>
                </div>

                {/* Resend Code */}
                <div className="flex justify-between items-start flex-col text-sm">
                    {errorMessage && (
                        <p className="text-red-500 text-sm text-center ">{errorMessage}</p>
                    )}
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendTimer > 0 || isResendPending}
                        className={`font-medium transition-colors ml-auto ${
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
                    style={{
                        background:
                            'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                    }}
                    className="transition-all duration-300 ease-out hover:scale-[1.02] whitespace-nowrap py-3 group relative overflow-hidden w-full mb-[16px] shadow-sm hover:opacity-95 active:opacity-90  rounded-[12px] h-[48px] cursor-pointer font-[var(--font-inter-tight)]"
                >
                    <span className="pointer-events-none absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-1000 group-hover:left-full ease-in-out" />
                    Continue
                </GoldenButton>
            </form>

            {/* Change Email/Phone Link */}
            <p className="mt-[16px] text-center">
                <Link
                    href={
                        signupSessionUtils.getSignupData().purpose === 'reset_password'
                            ? '/forgot-password'
                            : '/register'
                    }
                    className="text-sm text-[#C4994A] hover:text-[#B38840] font-medium transition-colors"
                >
                    Login with another account
                </Link>
            </p>
        </div>
    );
}
