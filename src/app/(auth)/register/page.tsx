'use client';

import Link from 'next/link';
import { useSignupInitiate } from '@/queries/use-auth';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import AuthLogo from '@/components/auth/AuthLogo';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/components/ui/FormInput';
import GoldenButton from '@/components/ui/GoldenButton';
import { signupSchema, type SignupFormData } from '@/validations/auth';
import { signupSessionUtils } from '@/utils/signup-session';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function RegisterPage() {
    const router = useRouter();
    const { mutate: signupInitiate, isPending } = useSignupInitiate();
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
            setError('root.serverError' as any, {
                type: 'server',
                message: 'Recaptcha not ready',
            });
            return;
        }

        const username = data.email || '';

        try {
            const token = await executeRecaptcha('signup');

            signupInitiate(
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
                        }
                    },
                    onSuccess: (response) => {
                        console.log('Signup successful:', response);

                        // Store the username in session for the OTP page
                        const sessionData: {
                            username: string;
                            purpose: 'signup';
                        } = {
                            username,
                            purpose: 'signup',
                        };
                        signupSessionUtils.setSignupData(sessionData);

                        router.push('/enter-otp');
                    },
                }
            );
        } catch (error) {
            console.error('Recaptcha error:', error);
            setError('root.serverError' as any, {
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
                <h1 className="text-2xl font-bricolage font-semibold text-[#191919] mb-3">
                    Welcome
                </h1>
                <p className="text-sm text-[#474747] leading-relaxed">
                    Welcome to Crizbe, Please enter your details and
                    <br />
                    signup to try out our crunchy bytes.
                </p>
            </div>

            {/* Signup Form */}
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

                {/* Continue Button */}
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
                    Continue
                </GoldenButton>

                <GoogleAuthButton label="Sign up with Google" />
            </form>

            {/* Login Link */}
            <p className=" text-center text-sm text-[#474747]">
                Have an account?{' '}
                <Link
                    href="/login"
                    className="text-[#C4994A] hover:text-[#B38840] font-medium transition-colors"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
