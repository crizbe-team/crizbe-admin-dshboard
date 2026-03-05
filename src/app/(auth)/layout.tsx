import Image from 'next/image';
import { ProtectedRoute } from '@/hooks/use-protected-route';
import AuthTransition from './auth-transition';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requireAuth={false}>
            <div className="min-h-screen flex p-[24px]">
                {/* Left Side - Form Content */}
                <div className="flex-1 flex bg-white relative overflow-hidden">
                    <AuthTransition>{children}</AuthTransition>
                </div>

                {/* Right Side - Product Image */}
                <div className="hidden lg:block w-[612px] relative ">
                    <Image
                        src="/images/user/auth-banner.png"
                        alt="Crizbe Premium Crunch Sticks"
                        fill
                        className=""
                        priority
                    />
                </div>
            </div>
        </ProtectedRoute>
    );
}
