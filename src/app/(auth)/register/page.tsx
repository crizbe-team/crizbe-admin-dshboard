'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSignupInitiate } from '@/queries/use-auth';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/components/ui/FormInput';
import PhoneInput from '@/components/ui/PhoneInput';
import GoldenButton from '@/components/ui/GoldenButton';
import { signupSchema, type SignupFormData } from '@/validations/auth';
import { signupSessionUtils } from '@/utils/signup-session';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function RegisterPage() {
    const router = useRouter();
    const { mutate: signupInitiate, isPending } = useSignupInitiate();
    const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
    const { executeRecaptcha } = useGoogleReCaptcha();

    // Refs for maintaining focus during input switches
    const emailInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const prevIsPhoneInput = useRef<boolean | null>(null);

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
            phone: '',
        },
    });

    const emailValue = watch('email');
    const phoneValue = watch('phone');
    const emailOrPhone = emailValue || phoneValue;

    // Detect if input looks like a phone number (starts with digit)
    const isPhoneInput = emailOrPhone ? /^\d/.test(emailOrPhone.trim()) : false;

    // Handle input change for both email and phone
    const handleInputChange = (value: string) => {
        // Clear any API errors when the user starts typing
        clearErrors('username' as keyof SignupFormData);

        if (/^\d/.test(value.trim())) {
            // User is typing a phone number
            setValue('phone', value, { shouldValidate: true });
            setValue('email', '', { shouldValidate: false });
            clearErrors('email');
        } else {
            // User is typing an email
            setValue('email', value, { shouldValidate: true });
            setValue('phone', '', { shouldValidate: false });
            clearErrors('phone');
        }
    };

    // Maintain focus when switching between input types
    useEffect(() => {
        if (prevIsPhoneInput.current !== null && prevIsPhoneInput.current !== isPhoneInput) {
            // Input type changed, restore focus on next render
            requestAnimationFrame(() => {
                if (isPhoneInput && phoneInputRef.current) {
                    phoneInputRef.current.focus();
                    // Move cursor to end
                    const len = (phoneValue || '').length;
                    phoneInputRef.current.setSelectionRange(len, len);
                } else if (!isPhoneInput && emailInputRef.current) {
                    emailInputRef.current.focus();
                    // Move cursor to end
                    const len = (emailValue || '').length;
                    emailInputRef.current.setSelectionRange(len, len);
                }
            });
        }
        prevIsPhoneInput.current = isPhoneInput;
    }, [isPhoneInput, emailValue, phoneValue]);

    const onSubmit = async (data: SignupFormData) => {
        if (!executeRecaptcha) {
            setError('root.serverError' as any, {
                type: 'server',
                message: 'Recaptcha not ready',
            });
            return;
        }

        const username = isPhoneInput ? `${phoneCountryCode}${data.phone}` : data.email || '';

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
                            countryCode?: string;
                            purpose: 'signup';
                        } = {
                            username,
                            purpose: 'signup',
                        };
                        if (isPhoneInput) {
                            sessionData.countryCode = phoneCountryCode;
                        }
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
                {/* Email / Mobile Field */}
                {isPhoneInput ? (
                    <PhoneInput
                        ref={phoneInputRef}
                        label="Email / Mobile number"
                        required
                        value={phoneValue || ''}
                        onChange={(value) => handleInputChange(value)}
                        enableCodeSelect
                        selectedCode={phoneCountryCode}
                        onCodeChange={(code) => setPhoneCountryCode(code)}
                        enableCodeSearch
                        placeholder="Enter your mobile number"
                        error={errors.phone?.message || errors.username?.message}
                    />
                ) : (
                    <FormInput
                        ref={emailInputRef}
                        label="Email / Mobile number"
                        required
                        type="text"
                        value={emailValue || ''}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="Enter your email id / mobile number"
                        error={errors.email?.message || errors.username?.message || ''}
                    />
                )}

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
