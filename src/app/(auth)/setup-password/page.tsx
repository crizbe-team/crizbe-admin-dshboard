'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLogo from '@/components/auth/AuthLogo';
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GoldenButton from '@/components/ui/GoldenButton';
import { useSetPassword } from '@/queries/use-auth';
import { passwordSchema, type PasswordFormData } from '@/validations/auth';
import { signupSessionUtils } from '@/utils/signup-session';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';

export default function SetupPasswordPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutate: setPasswordApi, isPending } = useSetPassword();

    const {
        register,
        handleSubmit,
        setError,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const passwordValue = watch('password');

    const getPasswordRequirements = (pwd: string) => {
        return [
            { id: 1, label: 'At least 8 characters', met: pwd.length >= 8 },
            { id: 2, label: 'One uppercase letter', met: /[A-Z]/.test(pwd) },
            { id: 3, label: 'One lowercase letter', met: /[a-z]/.test(pwd) },
            { id: 4, label: 'One number', met: /[0-9]/.test(pwd) },
            { id: 5, label: 'One special character', met: /[^A-Za-z0-9]/.test(pwd) },
        ];
    };

    const requirements = getPasswordRequirements(passwordValue || '');
    const strengthScore = requirements.filter((req) => req.met).length;

    const getStrengthColor = () => {
        if (!passwordValue) return 'bg-[#E7E4DD]';
        if (strengthScore <= 2) return 'bg-red-500';
        if (strengthScore <= 4) return 'bg-amber-500';
        return 'bg-green-500';
    };

    const onSubmit = (data: PasswordFormData) => {
        const signupData = signupSessionUtils.getSignupData();
        const token = Cookies.get('reset_token');

        const apiPayload: any = {
            password: data.password,
            password_confirm: data.confirmPassword,
        };

        if (token) {
            apiPayload.token = token;
        }

        if (signupData.username) {
            apiPayload.username = signupData.username;
        }

        setPasswordApi(apiPayload, {
            onSuccess: (response: any) => {
                if (response.status_code === 200 || response.status_code === 6000) {
                    signupSessionUtils.clearSignupData();
                    Cookies.remove('reset_token');
                    router.push('/login');
                } else {
                    setError('root.serverError', {
                        type: 'server',
                        message: 'Failed to set password. Please try again.',
                    });
                }
            },
            onError: (error: any) => {
                if (error?.errors && Object.keys(error.errors).length > 0) {
                    Object.keys(error.errors).forEach((field) => {
                        setError(field as keyof PasswordFormData, {
                            type: 'server',
                            message: error.errors[field][0],
                        });
                    });
                } else {
                    setError('root.serverError', {
                        type: 'server',
                        message: error?.message || 'Failed to set password. Please try again.',
                    });
                }
            },
        });
    };

    const globalError = errors.root?.serverError?.message || (errors as any).username?.message;

    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <AuthLogo />

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-[#4E3325] mb-3">
                    {signupSessionUtils.getSignupData().purpose === 'reset_password'
                        ? 'Reset Password'
                        : 'Just a step away'}
                </h1>
                <p className="text-sm text-[#7A7A7A] leading-relaxed">
                    {signupSessionUtils.getSignupData().purpose === 'reset_password'
                        ? 'Enter your new password below.'
                        : 'Enter the following details & complete the signup.'}
                </p>
            </div>

            {/* Password Setup Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {globalError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
                        {globalError}
                    </div>
                )}

                {/* Password Field */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[#404040]">
                        Password
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative mt-1">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password', {
                                onChange: () => {
                                    clearErrors('root.serverError');
                                    clearErrors('password');
                                },
                            })}
                            placeholder="Create your password"
                            className={`w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors ${errors.password ? 'border-red-500' : 'border-[#E7E4DD]'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-[#B7AFA5] hover:text-[#4E3325] transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Password Strength Indicator */}
                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex gap-2 h-1.5 w-full">
                        {[1, 2, 3, 4, 5].map((level) => (
                            <div
                                key={level}
                                className={`flex-1 rounded-full ${passwordValue && strengthScore >= level
                                    ? getStrengthColor()
                                    : 'bg-[#E7E4DD]'
                                    } transition-colors duration-300`}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {requirements.map((req) => (
                            <div key={req.id} className="flex items-center gap-1.5">
                                {req.met ? (
                                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                ) : (
                                    <X className="w-3.5 h-3.5 text-[#B7AFA5] shrink-0" />
                                )}
                                <span
                                    className={`text-[11px] ${req.met ? 'text-green-600' : 'text-[#7A7A7A]'
                                        }`}
                                >
                                    {req.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-1 pt-2">
                    <label className="text-xs font-medium text-[#404040]">
                        Confirm Password
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative mt-1">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...register('confirmPassword', {
                                onChange: () => {
                                    clearErrors('root.serverError');
                                    clearErrors('confirmPassword');
                                },
                            })}
                            placeholder="Confirm your password"
                            className={`w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-[#4E3325] outline-none placeholder:text-[#B7AFA5] hover:border-[#C4994A] focus-visible:border-[#C4994A] transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-[#E7E4DD]'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-[#B7AFA5] hover:text-[#4E3325] transition-colors"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
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
                        'Submit'
                    )}
                </Button>
            </form>

            {/* Back to Login Link */}
            <p className="mt-8 text-center text-sm text-[#7A7A7A]">
                Already have an account?{' '}
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
