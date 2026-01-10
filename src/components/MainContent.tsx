'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import Header from './Header';

export default function MainContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <div 
            className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${
                isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
            }`}
        >
            <Header />
            <main className="flex-1 p-6 pt-20 lg:pt-20 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

