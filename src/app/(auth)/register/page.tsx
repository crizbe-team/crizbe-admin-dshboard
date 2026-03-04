'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSignupInitiate } from '@/queries/use-auth';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/components/ui/FormInput';
import PhoneInput from '@/components/ui/PhoneInput';
import GoldenButton from '@/components/ui/GoldenButton';
import { signupSchema, type SignupFormData } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useRef, useEffect, useMemo } from 'react';

export default function RegisterPage() {
    const router = useRouter();
    const { mutate: signupInitiate, isPending } = useSignupInitiate();
    const [phoneCountryCode, setPhoneCountryCode] = useState('+91');

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

    console.log('Signup Form errors', errors);

    const emailValue = watch('email');
    const phoneValue = watch('phone');
    const emailOrPhone = emailValue || phoneValue;

    // Detect if input looks like a phone number (starts with digit)
    const isPhoneInput = emailOrPhone ? /^\d/.test(emailOrPhone.trim()) : false;

    // Handle input change for both email and phone
    const handleInputChange = (value: string) => {
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
        const username = isPhoneInput ? `${phoneCountryCode}${data.phone}` : data.email;

        signupInitiate(
            { username },
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
                    router.push('/enter-otp');
                },
            }
        );
    };

    const handleGoogleSignup = () => {
        // TODO: Implement Google OAuth
        console.log('Google signup clicked');
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
                <h1 className="text-2xl font-semibold text-[#4E3325] mb-3">Welcome</h1>
                <p className="text-sm text-[#7A7A7A] leading-relaxed">
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
                    className="rounded-full py-3"
                >
                    Continue
                </GoldenButton>

                {/* Google Signup Button */}
                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-[#E7E4DD] hover:border-[#C4994A] text-[#4E3325] font-medium py-3 rounded-full transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Sign up with Google
                </button>
            </form>

            {/* Login Link */}
            <p className="mt-8 text-center text-sm text-[#7A7A7A]">
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
