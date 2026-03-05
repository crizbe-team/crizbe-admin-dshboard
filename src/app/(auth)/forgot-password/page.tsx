'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForgotPassword } from '@/queries/use-auth';
import { FormInput } from '@/components/ui/FormInput';
import PhoneInput from '@/components/ui/PhoneInput';
import GoldenButton from '@/components/ui/GoldenButton';
import { signupSessionUtils } from '@/utils/signup-session';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/validations/auth';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [phoneCountryCode, setPhoneCountryCode] = useState('+91');

    const { mutate: forgotPassword, isPending } = useForgotPassword();

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
                    const len = (phoneValue || '').length;
                    phoneInputRef.current.setSelectionRange(len, len);
                } else if (!isPhoneInput && emailInputRef.current) {
                    emailInputRef.current.focus();
                    const len = (emailValue || '').length;
                    emailInputRef.current.setSelectionRange(len, len);
                }
            });
        }
        prevIsPhoneInput.current = isPhoneInput;
    }, [isPhoneInput, emailValue, phoneValue]);

    const onSubmit = async (data: SignupFormData) => {
        const username = isPhoneInput ? `${phoneCountryCode}${data.phone}` : data.email || '';

        forgotPassword(
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
                    } else {
                        setError('email', {
                            type: 'server',
                            message: error?.message || 'Something went wrong. Please try again.',
                        });
                    }
                },
                onSuccess: (response) => {
                    console.log('Forgot password request successful:', response);

                    // Store the username and purpose in session for the OTP page
                    const sessionData: {
                        username: string;
                        countryCode?: string;
                        purpose: 'reset_password';
                    } = {
                        username,
                        purpose: 'reset_password',
                    };
                    if (isPhoneInput) {
                        sessionData.countryCode = phoneCountryCode;
                    }
                    signupSessionUtils.setSignupData(sessionData);

                    router.push('/enter-otp');
                },
            }
        );
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
                <h1 className="text-2xl font-semibold text-[#4E3325] mb-3">Forgot Password?</h1>
                <p className="text-sm text-[#7A7A7A] leading-relaxed">
                    No worries, enter your details and we&apos;ll
                    <br />
                    send you reset instructions.
                </p>
            </div>

            {/* Forgot Password Form */}
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

                {/* Submit Button */}
                <GoldenButton
                    type="submit"
                    isLoading={isPending}
                    loadingText="Please wait..."
                    fullWidth
                    className="mt-[32px] py-3"
                >
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
