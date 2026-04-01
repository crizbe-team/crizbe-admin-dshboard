'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useLogin } from '@/queries/use-auth';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import AuthLogo from '@/components/auth/AuthLogo';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';
import PhoneInput from '@/components/ui/PhoneInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/validations/auth';

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [phoneCountryCode, setPhoneCountryCode] = useState('+91');

    const { mutate: login, isPending } = useLogin();

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

    // Account for global non-field API errors
    const globalError =
        errors.root?.serverError?.message || (errors as any).non_field_errors?.message;

    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <AuthLogo />

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
                <GoogleAuthButton
                    label="Sign in with Google"
                    onError={(msg) =>
                        setError('root.serverError', { type: 'server', message: msg })
                    }
                />
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
