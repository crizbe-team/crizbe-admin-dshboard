'use client';

import { useRef } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import Link from 'next/link';
import AuthLogo from '@/components/auth/AuthLogo';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForgotPassword } from '@/queries/use-auth';
import { FormInput } from '@/components/ui/FormInput';
import GoldenButton from '@/components/ui/GoldenButton';
import { signupSessionUtils } from '@/utils/signup-session';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/validations/auth';

export default function ForgotPasswordPage() {
    const router = useRouter();

    const { mutate: forgotPassword, isPending } = useForgotPassword();
    const { executeRecaptcha } = useGoogleReCaptcha();

    // Ref for maintaining focus
    const emailInputRef = useRef<HTMLInputElement>(null);

    const {
        handleSubmit,
        setError,
        setValue,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
        },
    });

    const emailValue = watch('email');

    // Handle input change for email
    const handleInputChange = (value: string) => {
        // Clear any API errors when the user starts typing
        clearErrors('username' as keyof SignupFormData);
        setValue('email', value, { shouldValidate: true });
    };

    const onSubmit = async (data: SignupFormData) => {
        if (!executeRecaptcha) {
            setError('email', {
                type: 'server',
                message: 'Recaptcha not ready',
            });
            return;
        }

        const username = data.email || '';

        try {
            const token = await executeRecaptcha('forgot_password');

            forgotPassword(
                { username, recaptcha_token: token },
                {
                    onError: (error: any) => {
                        if (error.errors) {
                            const apiErrors = error.errors;
                            Object.keys(apiErrors).forEach((field) => {
                                setError(field as keyof SignupFormData, {
                                    type: 'server',
                                    message: apiErrors[field][0],
                                });
                            });
                        } else {
                            setError('email', {
                                type: 'server',
                                message:
                                    error?.message || 'Something went wrong. Please try again.',
                            });
                        }
                    },
                    onSuccess: (response) => {
                        console.log('Forgot password request successful:', response);

                        // Store the username and purpose in session for the OTP page
                        const sessionData: {
                            username: string;
                            purpose: 'reset_password';
                        } = {
                            username,
                            purpose: 'reset_password',
                        };
                        signupSessionUtils.setSignupData(sessionData);

                        router.push('/enter-otp');
                    },
                }
            );
        } catch (error) {
            console.error('Recaptcha error:', error);
            setError('email', {
                type: 'server',
                message: 'Security check failed. Please try again.',
            });
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <AuthLogo />

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-[#4E3325] mb-3">Forgot Password?</h1>
                <p className="text-sm text-[#7A7A7A] leading-relaxed">
                    No worries, enter your email address and we&apos;ll
                    <br />
                    send you reset instructions.
                </p>
            </div>

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <FormInput
                    ref={emailInputRef}
                    label="Email address"
                    required
                    type="email"
                    value={emailValue || ''}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Enter your email address"
                    error={errors.email?.message || errors.username?.message || ''}
                />

                {/* Submit Button */}
                <GoldenButton
                    type="submit"
                    isLoading={isPending}
                    loadingText="Please wait..."
                    fullWidth
                    style={{
                        background:
                            'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                    }}
                    className="transition-all duration-300 ease-out hover:scale-[1.02] whitespace-nowrap py-3 group relative overflow-hidden w-full mb-[16px] shadow-sm hover:opacity-95 active:opacity-90  rounded-[12px] h-[48px] cursor-pointer font-[var(--font-inter-tight)]"
                >
                    <span className="pointer-events-none absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-1000 group-hover:left-full ease-in-out" />
                    Reset Password
                </GoldenButton>
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
