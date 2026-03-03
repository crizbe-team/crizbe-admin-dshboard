import Image from 'next/image';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form Content */}
            <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
                {children}
            </div>

            {/* Right Side - Product Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <Image
                    src="/images/user/auth-banner.png"
                    alt="Crizbe Premium Crunch Sticks"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
}
