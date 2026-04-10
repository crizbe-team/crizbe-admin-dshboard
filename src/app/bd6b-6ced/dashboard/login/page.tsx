'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLogin } from '@/queries/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dashboardLoginSchema, type DashboardLoginFormData } from '@/validations/auth';

export default function AdminLoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const { mutate: login, isPending } = useLogin();

    // Ref for maintaining focus
    const usernameInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm<DashboardLoginFormData>({
        resolver: zodResolver(dashboardLoginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const usernameValue = watch('username');

    // Handle input change
    const handleInputChange = (value: string) => {
        clearErrors('username');
        clearErrors('root.serverError');
        setValue('username', value, { shouldValidate: true });
    };

    const onSubmit = (data: DashboardLoginFormData) => {
        const username = data.username;

        login(
            { username, password: data.password, role: 'admin' },
            {
                onSuccess: (response: any) => {
                    router.push('/bd6b-6ced/dashboard');
                },
                onError: (error: any) => {
                    if (error?.errors && Object.keys(error.errors).length > 0) {
                        Object.keys(error.errors).forEach((field) => {
                            setError(field as keyof DashboardLoginFormData, {
                                type: 'server',
                                message: error.errors[field][0],
                            });
                        });
                    } else {
                        setError('root.serverError', {
                            type: 'server',
                            message:
                                error?.message ||
                                'Login failed. Please check your admin credentials.',
                        });
                    }
                },
            }
        );
    };

    const globalError =
        errors.root?.serverError?.message || (errors as any).non_field_errors?.message;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
            <div className="w-full max-w-md bg-[#161616] p-8 rounded-2xl border border-[#262626] shadow-2xl">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Image
                        src="/images/user/crizbe-logo.svg"
                        alt="Crizbe Admin"
                        width={150}
                        height={60}
                        priority
                    />
                </div>

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-semibold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-sm text-gray-400">Sign in to manage your crunchy bytes</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {globalError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center font-medium">
                            {globalError}
                        </div>
                    )}

                    {/* Username Field */}
                    <div className="admin-input">
                        <FormInput
                            ref={usernameInputRef}
                            label="Admin Username"
                            labelClassName="text-gray-400"
                            required
                            type="text"
                            value={usernameValue || ''}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="Enter your admin username"
                            error={errors.username?.message}
                            className="bg-[#1f1f1f]! border-[#262626]! text-white! placeholder:text-gray-500!"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-400">
                            Password
                            <span className="text-red-500 ml-1">*</span>
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
                                placeholder="Enter admin password"
                                className={`w-full rounded-lg border bg-[#1f1f1f] px-4 py-2.5 pr-10 text-sm text-white outline-none placeholder:text-gray-500 hover:border-[#C4994A]/50 focus-visible:border-[#C4994A] transition-all ${
                                    errors.password ? 'border-red-500' : 'border-[#262626]'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[#C4994A] hover:bg-[#B38840] text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#C4994A]/10 mt-4 active:scale-[0.98]"
                    >
                        {isPending ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Authenticating...</span>
                            </div>
                        ) : (
                            'Login to Admin'
                        )}
                    </Button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center gap-1"
                    >
                        <span>← Back to main site</span>
                    </Link>
                </div>
            </div>

            <style jsx global>{`
                .admin-input .bg-white {
                    background-color: #1f1f1f !important;
                }
                .admin-input .border-[#E7E4DD] {
                    border-color: #262626 !important;
                }
                .admin-input input {
                    color: white !important;
                }
                .admin-input .text-[#4E3325] {
                    color: white !important;
                }
                .admin-input .placeholder\\:text-[#B7AFA5]::placeholder {
                    color: #6b7280 !important;
                }
            `}</style>
        </div>
    );
}
