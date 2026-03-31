'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLogin, useGoogleLogin } from '@/queries/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';
import PhoneInput from '@/components/ui/PhoneInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/validations/auth';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [phoneCountryCode, setPhoneCountryCode] = useState('+91');

    const { mutate: login, isPending } = useLogin();
    const { mutate: googleLogin, isPending: isGooglePending } = useGoogleLogin();

    // Refs for maintaining focus during input switches
    const emailInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const prevIsPhoneInput = useRef<boolean | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            phone: '',
            password: '',
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
        clearErrors('username' as keyof LoginFormData);
        clearErrors('root.serverError');

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

    const onSubmit = (data: LoginFormData) => {
        const username = isPhoneInput ? `${phoneCountryCode}${data.phone}` : data.email || '';

        login(
            { username, password: data.password, role: 'user' },
            {
                onSuccess: (response: any) => {
                    router.push('/');
                },
                onError: (error: any) => {
                    if (error?.errors && Object.keys(error.errors).length > 0) {
                        // Map field-specific errors
                        Object.keys(error.errors).forEach((field) => {
                            setError(field as keyof LoginFormData, {
                                type: 'server',
                                message: error.errors[field][0],
                            });
                        });
                    } else {
                        // Fallback to global error
                        setError('root.serverError', {
                            type: 'server',
                            message: error?.message || 'Something went wrong. Please try again.',
                        });
                    }
                },
            }
        );
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth
        console.log('Google login clicked');
    };

    // Account for global non-field API errors
    const globalError =
        errors.root?.serverError?.message || (errors as any).non_field_errors?.message;

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
                    Welcome back
                </h1>
                <p className="text-sm text-[#474747] leading-relaxed">
                    Welcome back! Please enter your details.
                </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {globalError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
                        {globalError}
                    </div>
                )}
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
                {/* Password Field */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[#404040]">
                        Password
                        <span className="text-[#002D62] ml-1">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password', {
                                onChange: () => {
                                    clearErrors('root.serverError');
                                    clearErrors('password');
                                },
                            })}
                            placeholder="Enter your password"
                            className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-[#474747] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors ${
                                errors.password ? 'border-red-500' : 'border-[#E7E4DD]'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#474747] hover:text-[#4E3325] transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-500">{errors.password.message}</p>
                    )}
                </div>
                {/* Forgot Password */}
                <div className="flex justify-end">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-[#C4994A] font-bricolage hover:text-[#B38840] transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>
                {/* Continue Button */}
                <Button
                    type="submit"
                    disabled={isPending}
                    style={{
                        background:
                            'linear-gradient(88.77deg, #9A7236 -7.08%, #E8BF7A 31.99%, #C4994A 68.02%, #937854 122.31%)',
                    }}
                    className="group relative overflow-hidden w-full mb-[16px] shadow-sm hover:opacity-95 active:opacity-90 transition-all duration-300 py-3 rounded-[12px] h-[48px] cursor-pointer font-[var(--font-inter-tight)]"
                >
                    {/* Shine Effect */}
                    <span className="pointer-events-none absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transition-all duration-1000 group-hover:left-full ease-in-out" />
                    {isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </>
                    ) : (
                        'Login'
                    )}
                </Button>
                {/* Google Login Button */}
                {/* <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full  mb-[32px] flex font-[var(--font-inter-tight)] items-center justify-center gap-3  text-[#404040] cursor-pointer   rounded-full transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24">
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
                    Sign in with Google
                </button> */}
                <div className="flex justify-center w-full">
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            if (credentialResponse.credential) {
                                googleLogin(credentialResponse.credential, {
                                    onSuccess: () => {
                                        router.push('/');
                                    },
                                    onError: (error: any) => {
                                        setError('root.serverError', {
                                            type: 'server',
                                            message: error?.message || 'Google Login failed',
                                        });
                                    },
                                });
                            }
                        }}
                        onError={() => {
                            setError('root.serverError', {
                                type: 'server',
                                message: 'Google Login Failed',
                            });
                        }}
                        useOneTap
                        theme="outline"
                        shape="pill"
                        width="100%"
                    />
                </div>
            </form>

            {/* Register Link */}
            <p className=" text-center text-sm text-[#474747]">
                Don&apos;t have an account?{' '}
                <Link
                    href="/register"
                    className="text-[#C4994A] hover:text-[#B38840] font-medium transition-colors"
                >
                    Sign Up
                </Link>
            </p>
        </div>
    );
}
